import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";
import { initializeApp } from "@/lib/startup";

export const metadata: Metadata = {
  title: "DevHub - Advanced SaaS Developer Platform",
  description: "Connect GitHub repos, view commits, repo tree, AI-generated prompts, and deployment previews.",
};

initializeApp();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}