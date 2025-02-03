import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QueryProvider from "../components/QueryProvider";

export const metadata: Metadata = {
  title: "Run",
  description: "Capture The Flag, Powered by Strava",
  openGraph: {
    title: "It's not just a race, it's a turf war! Run fast, think faster, and own the city",
    images: ["http://localhost:3000/open-graph.png"],
    type: "website",
    url: "https://run.shawsoft.io",
    description: "Powered by Strava"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased relative flex flex-col min-h-screen">
        <QueryProvider>
          <Header />
          <div className="grow bg-blue-100/20">{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}