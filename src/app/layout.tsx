import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import Header from "../components/Header";
import Footer from "../components/Footer";
import QueryProvider from "../components/QueryProvider";
import { TeamToggleContextProvider } from '../components/TeamToggleContext'

const prompt = Inter({
  subsets: ["latin"],
  weight: ["400", "900"],  
  style: ["normal", "italic"], 
});

export const metadata: Metadata = {
  title: "Run",
  description: "Capture The Flag, Powered by Strava",
  openGraph: {
    title: "It's not just a race, it's a turf war! Run fast, think faster, and own the city",
    images: ["https://run.shawsoft.io/open-graph.png"],
    type: "website",
    url: "https://run.shawsoft.io",
    description: "Powered by Strava"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased relative flex flex-col min-h-screen`}>
        <QueryProvider>
          <TeamToggleContextProvider>
            <Header />
            <div className="grow bg-blue-100/20">{children}</div>
            <Footer />
          </TeamToggleContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}