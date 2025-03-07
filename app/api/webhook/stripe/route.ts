import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("enter webhook");
  const body = await req.text();
  const headersList = await headers();

  // Retrive stripe signature from headers...
  const signature = headersList.get("Stripe-Signature") as string;
  if (!signature) {
    console.error("Missing Stripe-Signature header", { status: 400 });
    throw new Error("Missing Stripe-Signature header");
  }

  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Stripe webhook secret is not defined");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error("Error constructing Stripe event:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    const customerId = session.customer;
    const jobId = session.metadata?.jobId;

    if (!customerId || !jobId) {
      console.error("Missing customerId or jobId in session metadata");
      return new Response("Missing customerId or jobId", { status: 400 });
    }

    try {
      const company = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId as string },
        select: {
          Company: {
            select: { id: true },
          },
        },
      });

      if (!company?.Company?.id) {
        console.error("No company found for the customer:", customerId);
        return new Response("Company not found", { status: 404 });
      }

      await prisma.jobPost.update({
        where: {
          id: jobId,
          companyId: company?.Company?.id,
        },
        data: { status: "ACTIVE" },
      });

      // console.log(
      //   `Job ${jobId} updated to ACTIVE for company ${company.Company.id}`
      // );

      return new Response("Job status updated successfully", { status: 200 });
    } catch (error) {
      console.error("Error updating job status:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Return a response for unhandled event types
  return new Response(`Unhandled event type: ${event.type}`, { status: 200 });
}
