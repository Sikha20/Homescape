
import { Suspense } from "react";
import NavBar from "./_components/NavBar";
import Loading from "../(dashboard)/loading";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
            >
                <NavBar />
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </body>
        </html>
    );
}
