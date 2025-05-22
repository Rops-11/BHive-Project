"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      {...props}
    />
  );
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      {...props}
    />
  );
}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  withDialog?: boolean;
}

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      withDialog = false,
      ...props
    },
    ref
  ) => {
    const contentClasses = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-none",
      className
    );

    const contentElement = (
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={contentClasses}
        {...props}
      />
    );

    if (withDialog) {
      return contentElement;
    }

    return <PopoverPrimitive.Portal>{contentElement}</PopoverPrimitive.Portal>;
  }
);

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return (
    <PopoverPrimitive.Anchor
      data-slot="popover-anchor"
      {...props}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
