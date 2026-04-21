import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/page";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Train SoftThai",
    description: "Train-SoftThai",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <Providers>
                        <Navbar />
                        {children}
                        <Footer />
                    </Providers>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
