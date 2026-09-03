import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";
import {
  BackLink,
  CheckboxField,
  PageHeader,
  Section,
} from "../components/AdminLayout";

interface BusinessFormData {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  websiteUrl?: string;
  tags?: string;
  sortOrder?: number;
  active?: boolean;
  featured?: boolean;
}

export default function BusinessCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const createBusiness = useMutation(api.businesses.createBusiness);
  const { upload, isUploading, error: uploadError } = useUpload(
    api.storage.generateUploadUrl,
  );

  const [logoImageId, setLogoImageId] = useState<Id<"_storage"> | undefined>();
  const logoUrl = useStorageUrl(api.storage.getFileUrl, logoImageId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    defaultValues: {
      active: true,
    },
  });

  const handleLogoUpload = async (file: File) => {
    try {
      const storageId = await upload(file);
      setLogoImageId(storageId as Id<"_storage">);
    } catch {
      addToast({ type: "error", message: "Failed to upload logo" });
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    try {
      await createBusiness({
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription || undefined,
        logoImageId: logoImageId,
        websiteUrl: data.websiteUrl || undefined,
        tags: data.tags
          ? data.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        sortOrder: data.sortOrder,
        active: data.active,
        featured: data.featured,
      });
      addToast({
        type: "success",
        message: "Business created successfully",
      });
      navigate("/businesses");
    } catch (error) {
      console.error("Failed to create business:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create business",
      });
    }
  };

  return (
    <>
      <BackLink to="/businesses">Businesses</BackLink>
      <PageHeader title="New business" />

      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Section label="Basics">
          <Input
            {...register("name", { required: "Name is required" })}
            label="Name"
            placeholder="Business name"
            required
            fullWidth
            error={errors.name?.message}
          />
          <Input
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Slug must be lowercase with hyphens only",
              },
            })}
            label="Slug"
            placeholder="business-slug"
            required
            fullWidth
            className="font-mono text-sm"
            error={errors.slug?.message}
            helperText="Lowercase letters, numbers, and hyphens"
          />
          <Textarea
            {...register("shortDescription", {
              required: "Short description is required",
            })}
            label="Short description"
            placeholder="Brief summary..."
            rows={2}
            required
            fullWidth
            error={errors.shortDescription?.message}
          />
          <Textarea
            {...register("longDescription")}
            label="Long description"
            placeholder="Detailed description..."
            rows={6}
            fullWidth
          />
        </Section>

        <Section label="Logo">
          {logoImageId && logoUrl ? (
            <ImagePreview
              url={logoUrl}
              alt="Logo"
              size="md"
              onRemove={() => setLogoImageId(undefined)}
            />
          ) : (
            <FileUpload
              accept="image/*"
              isUploading={isUploading}
              error={uploadError ?? undefined}
              onFileSelect={handleLogoUpload}
              helperText="Square image. Drop a file or click to browse."
              fullWidth
              size="sm"
            />
          )}
        </Section>

        <Section label="Details">
          <Input
            {...register("websiteUrl")}
            label="Website URL"
            type="url"
            placeholder="https://..."
            fullWidth
          />
          <Input
            {...register("tags")}
            label="Tags"
            placeholder="saas, consulting"
            fullWidth
            helperText="Comma-separated"
          />
          <div className="grid grid-cols-3 items-end gap-3.5">
            <Input
              {...register("sortOrder", { valueAsNumber: true })}
              label="Sort order"
              type="number"
              placeholder="0"
              fullWidth
            />
            <CheckboxField label="Active" {...register("active")} />
            <CheckboxField label="Featured" {...register("featured")} />
          </div>
        </Section>

        <div className="flex gap-2.5 border-t border-border pt-6">
          <Button type="submit" size="sm" disabled={isSubmitting || isUploading} className="rounded-md">
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
          <Link to="/businesses">
            <Button variant="outline" size="sm" type="button" className="rounded-md border">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}
