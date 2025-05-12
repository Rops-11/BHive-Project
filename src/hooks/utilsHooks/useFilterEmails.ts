import { useCallback, useState } from "react";
import { fetchUserEmails } from "@/app/actions/gmailActions";
import { EmailDetail } from "@/types/types";
import { toast } from "react-toastify";

const useFilterEmails = () => {
  const [emails, setEmails] = useState<EmailDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [senderFilter, setSenderFilter] = useState<string>("");
  const [appliedFilter, setAppliedFilter] = useState<string>("");

  const handleFetchEmails = useCallback(async (filter: string) => {
    setLoading(true);
    setAppliedFilter(filter);
    const result = await fetchUserEmails(filter);
    if (result.error) {
      toast.error(result.error);
      setEmails([]);
    } else if (result.data) {
      setEmails(result.data.messages as EmailDetail[]);
    } else {
      setEmails([]);
    }
    setLoading(false);
  }, []);

  return {
    handleFetchEmails,
    senderFilter,
    setSenderFilter,
    emails,
    loading,
    setLoading,
    appliedFilter,
  };
};

export default useFilterEmails;
