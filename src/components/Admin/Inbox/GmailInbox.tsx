"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  body?: string;
}

const REFRESH_INTERVAL = 30000;
const DEBOUNCE_DELAY = 500;

const GmailInbox = () => {
  const [emails, setEmails] = useState<EmailDetail[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [senderFilter, setSenderFilter] = useState<string>("");
  const [debouncedSenderFilter, setDebouncedSenderFilter] =
    useState<string>("");
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFetchEmails = useCallback(
    async (filter: string, isAutoRefresh = false) => {
      if (!isAutoRefresh) {
        setLoading(true);

        setEmails(null);
      } else {
        console.log("Auto-refreshing emails with filter:", filter);
      }

      const result = await fetchUserEmails(filter);

      if (result.error) {
        if (!isAutoRefresh) {
          toast.error(`Error fetching emails: ${result.error}`);
        } else {
          console.error("Auto-refresh error:", result.error);
        }
      } else if (result.data) {
        const fetchedEmails = result.data.messages as EmailDetail[];
        setEmails(fetchedEmails);
      }

      if (!isAutoRefresh) {
        setLoading(false);
      }
      if (isInitialLoad && !isAutoRefresh) {
        setIsInitialLoad(false);
      }
    },
    [isInitialLoad]
  );

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSenderFilter(senderFilter);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [senderFilter]);

  useEffect(() => {
    setIsInitialLoad(true);
    handleFetchEmails(debouncedSenderFilter, false);

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    const id = setInterval(() => {
      handleFetchEmails(debouncedSenderFilter, true);
    }, REFRESH_INTERVAL);
    intervalIdRef.current = id;

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [debouncedSenderFilter]);

  const onManualFetchClick = () => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    setDebouncedSenderFilter(senderFilter);
    handleFetchEmails(senderFilter, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderFilter(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full space-y-4 flex-grow">
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-4">
            Email Inbox
          </CardTitle>

          <div className="flex flex-col sm:flex-row w-full gap-3 items-center mx-auto">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Filter by sender (optional)"
                value={senderFilter}
                onChange={handleInputChange}
                className="pl-10 w-full"
                disabled={loading && !isInitialLoad}
              />
            </div>
            <Button
              onClick={onManualFetchClick}
              disabled={loading && !isInitialLoad}
              size="lg"
              className="w-full sm:w-auto shrink-0">
              {loading && !isInitialLoad ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Refresh Emails"
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isInitialLoad && loading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">
            Loading initial emails...
          </p>
        </div>
      )}

      {isInitialLoad && emails === null && !loading && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Enter filter and click Refresh, or wait for initial load.
          </p>
        </div>
      )}

      {!isInitialLoad && emails && emails.length === 0 && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No emails found{" "}
            {debouncedSenderFilter
              ? `from ${debouncedSenderFilter}`
              : "in your inbox"}{" "}
            matching your criteria.
          </p>
        </div>
      )}

      {emails && emails.length > 0 && (
        <div className="w-full flex-grow space-y-4 overflow-y-scroll pb-10">
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
