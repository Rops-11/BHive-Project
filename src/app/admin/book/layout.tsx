"use client";

export default function AdminBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex w-full min-h-screen">{children}</div>
  );
}
