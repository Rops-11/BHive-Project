import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const SubmitButton = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) => {
  const { pending: formPending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={loading || formPending}
      aria-disabled={loading || formPending}>
      {loading || formPending ? "Processing..." : children}
    </Button>
  );
};

export default SubmitButton;
