import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Run",
  description: "Capture The Flag, Powered by Strava",
};

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased relative flex flex-col min-h-screen`}
      >
          <Header/>
          <div className="grow bg-blue-100/20">
            {children}
          </div>
          <Footer/>

      </body>
    </html>
  );
}
