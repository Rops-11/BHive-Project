import { useEffect, useState } from "react";
import { fetchUserEmails } from "@/app/actions/gmailActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Inbox, Search } from "lucide-react";
import { EmailCard } from "@/components/Admin/Inbox/EmailCard";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailDetail {
  id: string | null | undefined;
  snippet: string | null | undefined;
  subject?: string | null | undefined;
  from?: string | null | undefined;
  date?: string | null | undefined;
}

const GmailInbox = () => {
  const [emails, setEmails] = useState<EmailDetail[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [senderFilter, setSenderFilter] = useState<string>("");

  const handleFetchEmails = async () => {
    setLoading(true);
    setEmails(null);
    const result = await fetchUserEmails(senderFilter);
    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      setEmails(result.data.messages as EmailDetail[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchEmails();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-y-scroll h-full space-y-4 flex-grow">
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-4">
            Email Inbox
          </CardTitle>

          <div className="flex flex-col sm:flex-row w-full gap-3 items-center  mx-auto">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Filter by sender (optional)"
                value={senderFilter}
                onChange={(e) => setSenderFilter(e.target.value)}
                className="pl-10 w-full"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleFetchEmails}
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto shrink-0">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Fetch Emails"
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading emails...</p>
        </div>
      )}

      {/* Initial state or after clearing emails before loading new ones */}
      {emails === null && !loading && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Enter a sender email (optional) and click &quot;Fetch Emails&quot;.
          </p>
        </div>
      )}

      {/* No emails found state */}
      {emails && emails.length === 0 && !loading && (
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
};

export default GmailInbox;
