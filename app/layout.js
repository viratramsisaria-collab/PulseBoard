import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: {
    default: "PulseBoard — Real-Time Collaboration",
    template: "%s | PulseBoard",
  },

  description:
    "PulseBoard is a real-time collaborative workspace for teams, tasks, conversations, and live activity.",

  keywords: [
    "PulseBoard",
    "real-time collaboration",
    "team collaboration",
    "project management",
    "kanban",
    "real-time workspace",
    "Socket.IO",
    "team productivity",
  ],

  authors: [
    {
      name: "PulseBoard",
    },
  ],

  creator: "PulseBoard",

  openGraph: {
    title: "PulseBoard — Real-Time Collaboration",
    description:
      "Your team. One pulse. Real-time.",
    type: "website",
    siteName: "PulseBoard",
  },

  twitter: {
    card: "summary_large_image",
    title: "PulseBoard — Real-Time Collaboration",
    description:
      "Your team. One pulse. Real-time.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SmoothScroll />

        <div className="relative min-h-screen overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
