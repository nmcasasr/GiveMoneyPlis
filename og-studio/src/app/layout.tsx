import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OG Studio - Create Beautiful OG Images",
  description: "Drag & drop editor for Open Graph images. Create stunning link previews for Twitter, Slack, Discord, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
