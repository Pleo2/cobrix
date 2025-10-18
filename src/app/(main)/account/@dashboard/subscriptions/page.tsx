import  data  from "./data.json";
import { SubscriptionsTable } from "@/components/acount/suscriptions/subscriptions-table";

export default function SubscriptionsPage() {
    const suscripcionesActivas = suscripciones.filter(s => s.estado === "Activa").length;
    const suscripcionesPendientes = suscripciones.filter(s => s.estado === "Pendiente").length;

    return (
        <div className="flex max-h-max flex-col">
            <div className="flex flex-1 flex-col ">
                <div className="flex flex-col gap-6 py-6 md:py-8 px-4 lg:px-6"></div>
                <div className="mx-auto w-full flex flex-col gap-6 max-w-7xl">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Suscripciones</h2>
                <p className="text-muted-foreground">
                    Gestiona y visualiza a todos tus clientes y sus planes.
                </p>
            </div>
            <SubscriptionsTable data={data} />
                </div>
            </div>
        </div>
    );
}
