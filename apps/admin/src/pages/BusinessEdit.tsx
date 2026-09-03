import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";
import {
  BackLink,
  CheckboxField,
  DangerLink,
  PageHeader,
  Section,
  StatusPill,
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

export default function BusinessEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const business = useQuery(
    api.businesses.getBusinessById,
    id ? { id: id as Id<"businesses"> } : "skip",
  );

  const updateBusiness = useMutation(api.businesses.updateBusiness);
  const softDeleteBusiness = useMutation(api.businesses.softDeleteBusiness);
  const removeBusinessLogo = useMutation(api.storage.removeBusinessLogo);
  const { upload, isUploading, error: uploadError } = useUpload(
    api.storage.generateUploadUrl,
  );

  const logoUrl = useStorageUrl(api.storage.getFileUrl, business?.logoImageId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>();

  useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        slug: business.slug,
        shortDescription: business.shortDescription,
        longDescription: business.longDescription || "",
        websiteUrl: business.websiteUrl || "",
        tags: business.tags?.join(", ") || "",
        sortOrder: business.sortOrder,
        active: business.active,
        featured: business.featured || false,
      });
    }
  }, [business, reset]);

  const handleLogoUpload = async (file: File) => {
    if (!id) return;
    try {
      const storageId = await upload(file);
      await updateBusiness({
        id: id as Id<"businesses">,
        logoImageId: storageId as Id<"_storage">,
      });
      addToast({ type: "success", message: "Logo uploaded" });
    } catch {
      addToast({ type: "error", message: "Failed to upload logo" });
    }
  };

  const handleRemoveLogo = async () => {
    if (!id) return;
    try {
      await removeBusinessLogo({ id: id as Id<"businesses"> });
      addToast({ type: "success", message: "Logo removed" });
    } catch {
      addToast({ type: "error", message: "Failed to remove logo" });
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    if (!id) return;

    try {
      await updateBusiness({
        id: id as Id<"businesses">,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription || undefined,
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
        message: "Business updated successfully",
      });
      navigate("/businesses");
    } catch (error) {
      console.error("Failed to update business:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update business",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      !confirm(
        "Are you sure you want to delete this business? This action can be undone by an admin.",
      )
    ) {
      return;
    }
    try {
      await softDeleteBusiness({ id: id as Id<"businesses"> });
      addToast({ type: "success", message: "Business deleted successfully" });
      navigate("/businesses");
    } catch (error) {
      console.error("Failed to delete business:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete business",
      });
    }
  };

  if (business === undefined) {
    return <Spinner variant="primary" size="lg" className="py-24" />;
  }

  if (business === null) {
    return (
      <>
        <BackLink to="/businesses">Businesses</BackLink>
        <p className="text-destructive">Business not found</p>
      </>
    );
  }

  return (
    <>
      <BackLink to={`/businesses/${id}`}>{business.name}</BackLink>
      <PageHeader
        title="Edit business"
        action={
          <StatusPill on={business.active}>
            {business.active ? "active" : "inactive"}
          </StatusPill>
        }
      />

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
          {business.logoImageId && logoUrl ? (
            <ImagePreview
              url={logoUrl}
              alt="Logo"
              size="md"
              onRemove={handleRemoveLogo}
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

        <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <Button type="submit" size="sm" disabled={isSubmitting} className="rounded-md">
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
          <DangerLink onClick={handleDelete}>Delete business</DangerLink>
        </div>
      </form>
    </>
  );
}
