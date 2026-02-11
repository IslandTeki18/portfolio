import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { FileUpload, ImagePreview } from "@repo/ui/file-upload";

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (business === null) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-destructive">Business not found</p>
          <Link to="/businesses">
            <Button variant="ghost" className="mt-4">
              &larr; Back to Businesses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/businesses">
          <Button variant="ghost">&larr; Back to Businesses</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-3 text-sm">
              <span className="text-label-secondary">Business ID: {id}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  business.active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {business.active ? "Active" : "Inactive"}
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                error={errors.slug?.message}
                helperText="Lowercase letters, numbers, and hyphens only"
              />
              <Textarea
                {...register("shortDescription", {
                  required: "Short description is required",
                })}
                label="Short Description"
                placeholder="Brief summary..."
                rows={2}
                required
                fullWidth
                error={errors.shortDescription?.message}
              />
              <Textarea
                {...register("longDescription")}
                label="Long Description"
                placeholder="Detailed description..."
                rows={6}
                fullWidth
              />

              <div>
                {business.logoImageId && logoUrl ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Logo
                    </label>
                    <ImagePreview
                      url={logoUrl}
                      alt="Logo"
                      size="md"
                      onRemove={handleRemoveLogo}
                    />
                  </div>
                ) : (
                  <FileUpload
                    label="Logo"
                    accept="image/*"
                    isUploading={isUploading}
                    error={uploadError ?? undefined}
                    onFileSelect={handleLogoUpload}
                    helperText="Square image recommended"
                    fullWidth
                  />
                )}
              </div>

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
                placeholder="saas, consulting (comma-separated)"
                fullWidth
                helperText="Tags for categorization"
              />
              <Input
                {...register("sortOrder", { valueAsNumber: true })}
                label="Sort Order"
                type="number"
                placeholder="0"
                fullWidth
                helperText="Lower numbers appear first"
              />
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  {...register("active")}
                  className="rounded border-border"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="rounded border-border"
                />
                Featured
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="danger" type="button" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
