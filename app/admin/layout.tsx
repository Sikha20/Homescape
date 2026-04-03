
import { Suspense } from "react";
import NavBar from "./_components/NavBar";
import Loading from "../(dashboard)/loading";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="admin-layout-wrapper">
            <NavBar />
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </div>
    );
}
