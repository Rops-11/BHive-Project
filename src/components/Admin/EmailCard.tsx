// components/EmailCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path if your ui components are elsewhere

interface EmailDetail {
  id: string | null | undefined;
  snippet: string | null | undefined;
  subject?: string | null | undefined;
  from?: string | null | undefined;
  date?: string | null | undefined;
}

interface EmailCardProps {
  email: EmailDetail;
}

export function EmailCard({ email }: EmailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{email.subject || "No Subject"}</CardTitle>
        <CardDescription>
          <span className="block sm:inline"><strong>From:</strong> {email.from || "N/A"}</span>
          <span className="hidden sm:inline mx-2">|</span>
          <span className="block sm:inline"><strong>Date:</strong> {email.date || "N/A"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {email.snippet || "No snippet available."}
        </p>
      </CardContent>
    </Card>
  );
}