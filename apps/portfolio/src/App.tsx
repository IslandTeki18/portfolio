import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Select } from "@repo/ui/select";
import { Modal } from "@repo/ui/modal";
import { Spinner } from "@repo/ui/spinner";
import { ToastProvider, useToast } from "@repo/ui/toast";
import { EmptyState, EmptyStateIcon } from "@repo/ui/empty-state";
import { FormError, FormSuccess } from "@repo/ui/form-error";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Portfolio Site - Component Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Testing UI components with Tailwind CSS v4, JetBrains Mono font, and dark mode support
        </p>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => addToast({ type: "success", message: "Primary button clicked!" })}>
                Primary
              </Button>
              <Button variant="secondary" onClick={() => addToast({ type: "info", message: "Secondary button clicked!" })}>
                Secondary
              </Button>
              <Button variant="outline" onClick={() => addToast({ type: "warning", message: "Outline button clicked!" })}>
                Outline
              </Button>
              <Button variant="ghost" onClick={() => addToast({ type: "info", message: "Ghost button clicked!" })}>
                Ghost
              </Button>
              <Button variant="danger" onClick={() => addToast({ type: "error", message: "Danger button clicked!" })}>
                Danger
              </Button>
              <Button isLoading>Loading</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter your name"
                helperText="This is a helper text"
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error="Invalid email address"
                fullWidth
              />
              <Textarea
                label="Message"
                placeholder="Enter your message"
                rows={4}
                fullWidth
              />
              <Select label="Choose an option" fullWidth>
                <option value="">Select...</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="md"
            >
              <p className="text-gray-700 dark:text-gray-300">
                This is a modal dialog. Press Escape or click the backdrop to close.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </div>
            </Modal>
          </CardContent>
        </Card>

        {/* Spinner */}
        <Card>
          <CardHeader>
            <CardTitle>Spinner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<EmptyStateIcon.Inbox />}
              title="No items found"
              description="There are no items to display. Try adding some items to get started."
              action={
                <Button onClick={() => addToast({ type: "info", message: "Add item clicked!" })}>
                  Add Item
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* Form Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Form Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormSuccess message="Your form has been submitted successfully!" />
              <FormError message="There was an error submitting your form." />
              <FormError
                message="Multiple validation errors occurred:"
                errors={[
                  "Email is required",
                  "Password must be at least 8 characters",
                  "Terms must be accepted",
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
