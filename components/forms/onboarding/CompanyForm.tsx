import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyType, companySchema } from "@/app/utils/zodSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/general/UploadThingReexported";
import { createCompany } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { CompanyFormConfig } from "@/types";
import CountrySelect from "@/components/general/CountrySelect";

const FORM_CONFIG: CompanyFormConfig = {
  name: {
    label: "Company Name",
    placeholder: "Enter Company Name",
    type: "text",
  },
  location: {
    label: "Company Location",
    placeholder: "Select Location",
    type: "select",
  },
  website: {
    label: "Website",
    placeholder: "https://yourcompany.com",
    type: "text",
  },
  xAccount: {
    label: "X (Twitter) Account",
    placeholder: "@yourcompany",
    type: "text",
  },
  about: {
    label: "About",
    placeholder: "Tell us about your company...",
    type: "textarea",
  },
  logo: {
    label: "Company Logo",
    placeholder: "Upload company logo",
    type: "image",
  },
};

const CompanyForm = () => {
  const [pending, setPending] = useState(false);

  const form = useForm<CompanyType>({
    resolver: zodResolver(companySchema),
    defaultValues: Object.keys(FORM_CONFIG).reduce(
      (acc, key) => ({
        ...acc,
        [key]: "",
      }),
      {} as CompanyType
    ),
  });

  const onSubmit = async (data: CompanyType) => {
    setPending(true);
    try {
      await createCompany(data);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.error(`Something went wrong : ${error}`);
      }
    } finally {
      setPending(false);
    }
  };

  const renderField = (name: keyof CompanyType) => {
    const config = FORM_CONFIG[name];

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{config.label}</FormLabel>
            {config.type === "select" ? (
              <CountrySelect
                onChange={field.onChange}
                value={field.value}
                label="Location"
                placeholder={config.placeholder}
              />
            ) : (
              <>
                <FormControl>
                  {config.type === "text" && (
                    <Input
                      placeholder={config.placeholder}
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                </FormControl>

                <FormControl>
                  {config.type === "textarea" && (
                    <Textarea placeholder={config.placeholder} {...field} />
                  )}
                </FormControl>

                <FormControl>
                  {config.type === "image" && (
                    <div className="">
                      {field.value ? (
                        <div className="relative w-fit">
                          <Image
                            src={field.value}
                            alt="Company Logo"
                            width={100}
                            height={100}
                            className="rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => field.onChange("")}
                            className="absolute -top-2 -right-2"
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].url);
                          }}
                          onUploadError={() => {
                            console.error("Image Upload failed");
                          }}
                          className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 cursor-pointer ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:outline-none ut-button:border-none"
                        />
                      )}
                    </div>
                  )}
                </FormControl>
              </>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("name")}
          {renderField("location")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("website")}
          {renderField("xAccount")}
        </div>

        {renderField("about")}
        {renderField("logo")}

        <Button type="submit" className="w-full text-white" disabled={pending}>
          {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;

// <Select onValueChange={field.onChange} defaultValue={field.value}>
//   <FormControl>
//     <SelectTrigger>
//       <SelectValue placeholder={config.placeholder} />
//     </SelectTrigger>
//   </FormControl>

//   <SelectContent>
//     <SelectGroup>
//       <SelectLabel>Worldwide</SelectLabel>
//       <SelectItem value="worldwide">
//         <span>🌍</span>
//         <span className="pl-2">Worldwide / Remote</span>
//       </SelectItem>
//     </SelectGroup>

//     <SelectGroup>
//       <SelectLabel>Location</SelectLabel>
//       {memoizedCountryList.map((country) => (
//         <SelectItem key={country.code} value={country.name}>
//           <span>{country.flagEmoji}</span>
//           <span className="pl-4">{country.name}</span>
//         </SelectItem>
//       ))}
//     </SelectGroup>
//   </SelectContent>
// </Select>
