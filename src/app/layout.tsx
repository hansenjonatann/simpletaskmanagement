import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Task Management With T3 Stack",
  description: "Task Management create with T3 Stack . ",
  authors: [
    {
      name: "HJ Codin Tech",
      url: "https://tiktok.com/@hjcodintech",
    },
    { name: "Hansen Jonatan", url: "https://instagram.com/hansenjonatann" },
  ],
  category: "Web Application",
  keywords: [
    "web",
    "taskmanagement",
    "hjcodintech",
    "sourcecode",
    "webapplication",
    "taskmanagementsystem",
    "t3 stack",
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
          <SessionProvider>
        <TRPCReactProvider>
            <div className="">
              <Toaster position="top-right" />
              {children}
            </div>
        </TRPCReactProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
