import { SiteHeader } from "@/components/acount/dashboard/site-header";

export default async function AccountPageLayout({
    children,
    dashboard,
}: {
    children?: React.ReactNode;
    dashboard: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col">
            <SiteHeader />
            <div className="flex flex-1 flex-col overflow-auto ">
                <div className="@container/main flex flex-1 flex-col">{dashboard || children}</div>
            </div>
        </div>
    );
}
