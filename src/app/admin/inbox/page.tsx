"use client";

import { useState } from "react";
import { fetchUserEmails } from "@/app/actions/gmailActions"; // Adjust path as needed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input component
import { Loader2, Inbox, Search } from "lucide-react"; // Added Search icon
import { EmailCard } from "@/components/Admin/EmailCard";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";

interface EmailDetail {
  id: string | null | undefined;
  snippet: string | null | undefined;
  subject?: string | null | undefined;
  from?: string | null | undefined;
  date?: string | null | undefined;
}

export default function InboxPage() {
  const [emails, setEmails] = useState<EmailDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [senderFilter, setSenderFilter] = useState<string>(""); // State for the sender email input

  const handleFetchEmails = async () => {
    setIsLoading(true);
    setEmails(null);
    const result = await fetchUserEmails(senderFilter);
    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      setEmails(result.data.messages as EmailDetail[]);
    }
    setIsLoading(false);
  };

  // Should do useEffect for fetching emails using reddoorz email as the sender

  return (
    <div className="flex flex-col h-screen w-full items-center space-y-6 pt-10 sm:pt-20 md:pt-30 p-6 sm:p-10">
      <Card className="flex flex-col w-full p-6 space-y-4 justify-center items-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
          My Gmail Inbox
        </h1>

        <div className="flex flex-col sm:flex-row w-full gap-3 items-center">
          <div className="relative w-full sm:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Filter by sender (optional)"
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              className="pl-10 w-full"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleFetchEmails}
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto shrink-0">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Fetch Emails"
            )}
          </Button>
        </div>
      </Card>

      {/* Initial state or after clearing emails before loading new ones */}
      {emails === null && !isLoading && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Enter a sender email (optional) and click &quot;Fetch Emails&quot;.
          </p>
        </div>
      )}

      {/* No emails found state */}
      {emails && emails.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No emails found{" "}
            {senderFilter ? `from ${senderFilter}` : "in your inbox"} matching
            your criteria.
          </p>
        </div>
      )}

      {/* Displaying emails */}
      {emails && emails.length > 0 && (
        // Adjusted height for the email list container
        <div className="w-full flex-grow space-y-4 overflow-y-auto pb-10">
          {emails.map((email) => (
            <EmailCard
              key={email.id || Math.random().toString()}
              email={email}
            />
          ))}
        </div>
      )}
    </div>
  );
}
