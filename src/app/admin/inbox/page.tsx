"use client";

import BookingInbox from "@/components/Admin/Inbox/BookingInbox";
import GmailInbox from "@/components/Admin/Inbox/GmailInbox"; // Assuming you have this
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed useState and Button as Tabs handles state

export default function InboxPage() {
  return (
    <div className="flex flex-col h-screen w-full items-center p-4 pt-24  bg-muted/40"> 
      <Tabs
        defaultValue="booking"
        className="w-full max-w-5xl h-full flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-2 h-[10%] shrink-0">
          <TabsTrigger value="booking">Booking Inbox</TabsTrigger>
          <TabsTrigger value="gmail">Gmail Inbox</TabsTrigger>
        </TabsList>

        <Card className="flex-grow h-[90%] flex flex-col">
          <CardContent className="p-4 h-full sm:p-6 flex-grow flex flex-col">
            <TabsContent
              value="booking"
              className="mt-0 flex-grow h-full flex flex-col">
              <BookingInbox />
            </TabsContent>
            <TabsContent
              value="gmail"
              className="mt-0 flex-grow flex h-full flex-col">
              <GmailInbox />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
