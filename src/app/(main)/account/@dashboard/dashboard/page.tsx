import { ChartAreaInteractive } from "@/components/acount/dashboard/chart-area-interactive";
import { DataTable } from "@/components/acount/dashboard/data-table";
import { SectionCards } from "@/components/acount/dashboard/section-cards";

import data from "../data.json";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex flex-col gap-2 px-4 lg:px-6">
                <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
                <p className="text-muted-foreground">
                    Vista general de tus estadísticas y análisis
                </p>
            </div>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </div>
    );
}
