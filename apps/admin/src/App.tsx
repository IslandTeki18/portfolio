import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { ToastProvider, useToast } from "@repo/ui/toast";

function AppContent() {
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Component test - Tailwind CSS v4 with JetBrains Mono
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Quick Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Username" placeholder="Enter username" fullWidth />
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    addToast({ type: "success", message: "Admin components working!" })
                  }
                >
                  Test Toast
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
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
