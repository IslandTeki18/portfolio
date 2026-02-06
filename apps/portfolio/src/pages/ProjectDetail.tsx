import { useParams, Link } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Back</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Project: {slug}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-label-secondary">
              Detail page for <strong>{slug}</strong>. Replace this with real
              project data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Your Name" placeholder="Jane Doe" fullWidth />
              <Textarea
                label="Message"
                placeholder="Tell me about your project..."
                rows={4}
                fullWidth
              />
              <Button variant="primary">Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
