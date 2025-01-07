import "./globals.css";
import type { Metadata } from "next";
import { auth } from "@/app/auth";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";

export const metadata: Metadata = {
  title: "Run",
  description: "Capture The Flag, Powered by Strava",
};

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`antialiased relative flex flex-col min-h-screen`}
      >
          <Header/>
          
          <div className={`flex flex-col ${session ? 'h-[190px]' : 'h-[80px]'}`} />
          <div className=" grow bg-blue-100/20 ">
            {children}
          </div>

          <Footer/>

      </body>
    </html>
  );
}
