import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    try {
      await createBusiness({
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
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/businesses">
          <Button variant="ghost">&larr; Back to Businesses</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Business</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
                <Link to="/businesses">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
