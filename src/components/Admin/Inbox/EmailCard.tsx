import React, { useState } from "react"; // Import useState
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // Optional: for close button etc.
  DialogClose, // For easy closing
} from "@/components/ui/dialog"; // Import Dialog components
import { Button } from "@/components/ui/button"; // For close button
// Optional: Add icons if desired
import { User, CalendarDays } from "lucide-react";

interface EmailDetail {
  id: string | null | undefined;
  snippet: string | null | undefined;
  subject?: string | null | undefined;
  from?: string | null | undefined;
  date?: string | null | undefined;
}

interface EmailCardProps {
  email: EmailDetail;
  // Optional: Add an 'onSelect' or similar prop if you need to know which email was opened
  // onSelect?: (emailId: string | null | undefined) => void;
}

export function EmailCard({ email }: EmailCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = email.date
    ? new Date(email.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg truncate">
              {email.subject || "No Subject"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              <span className="block sm:inline">
                From: {email.from || "N/A"}
              </span>
              <span className="hidden sm:inline mx-2">|</span>
              <span className="block sm:inline mt-1 sm:mt-0">
                Date: {formattedDate}
              </span>
            </CardDescription>
            {/* Optionally show a very short snippet */}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {email.snippet || ""}
            </p>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[85vh] flex flex-col">
        {" "}
        <DialogHeader>
          <DialogTitle className="text-xl">
            {email.subject || "No Subject"}
          </DialogTitle>
          <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 pt-1">
            <span className="flex items-center text-xs">
              <User className="h-3 w-3 mr-1.5 text-muted-foreground" />
              From: {email.from || "N/A"}
            </span>
            <span className="flex items-center text-xs">
              <CalendarDays className="h-3 w-3 mr-1.5 text-muted-foreground" />
              Date: {formattedDate}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow border rounded-md p-3 my-4 overflow-y-auto text-sm bg-muted/30">
          <pre className="whitespace-pre-wrap break-words font-sans">
            {email.snippet || "No snippet available."}
          </pre>
        </div>
        <DialogFooter className="mt-auto">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
