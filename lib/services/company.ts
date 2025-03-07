import { prisma } from "@/app/utils/db";
import { companySchema, CompanyType } from "@/app/utils/zodSchema";

export const getCompany = async (
  userId: string
): Promise<CompanyType | null> => {
  try {
    const data = await prisma.company.findUnique({
      where: { userId },
      select: {
        name: true,
        location: true,
        about: true,
        logo: true,
        xAccount: true,
        website: true,
      },
    });

    if (!data) {
      return null;
    }

    const validatedData = companySchema.safeParse(data);
    if (!validatedData.success) {
      return null;
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
};
