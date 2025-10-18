"use client";

import * as React from "react";
import Image from "next/image";
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/acount/dashboard/nav-documents";
import { NavMain } from "@/components/acount/dashboard/nav-main";
import { NavSecondary } from "@/components/acount/dashboard/nav-secondary";
import { NavUser } from "@/components/acount/dashboard/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Usuario",
        email: "usuario@ejemplo.com",
        avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
        {
            title: "Panel de Control",
            url: "#",
            icon: IconDashboard
        },
        {
            title: "Ciclo de Vida",
            url: "#",
            icon: IconListDetails
        },
        {
            title: "Análisis",
            url: "#",
            icon: IconChartBar
        },
        {
            title: "Proyectos",
            url: "#",
            icon: IconFolder
        },
        {
            title: "Equipo",
            url: "#",
            icon: IconUsers
        }
    ],
    navClouds: [
        {
            title: "Captura",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Propuestas Activas",
                    url: "#"
                },
                {
                    title: "Archivado",
                    url: "#"
                }
            ]
        },
        {
            title: "Propuesta",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Propuestas Activas",
                    url: "#"
                },
                {
                    title: "Archivado",
                    url: "#"
                }
            ]
        },
        {
            title: "Indicaciones",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Propuestas Activas",
                    url: "#"
                },
                {
                    title: "Archivado",
                    url: "#"
                }
            ]
        }
    ],
    navSecondary: [
        {
            title: "Configuración",
            url: "#",
            icon: IconSettings
        },
        {
            title: "Obtener Ayuda",
            url: "#",
            icon: IconHelp
        },
        {
            title: "Buscar",
            url: "#",
            icon: IconSearch
        }
    ],
    documents: [
        {
            name: "Biblioteca de Datos",
            url: "#",
            icon: IconDatabase
        },
        {
            name: "Reportes",
            url: "#",
            icon: IconReport
        },
        {
            name: "Asistente de Documentos",
            url: "#",
            icon: IconFileWord
        }
    ]
};

function CobrixLogo() {
    const [isDark, setIsDark] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        // Detectar tema inicial
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);

        // Observar cambios en el tema
        const observer = new MutationObserver(() => {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    if (!isMounted) {
        return <div className="h-8 w-8" />;
    }

    return (
        <Image
            src={
                isDark
                    ? "/Cobrix_black_background.svg"
                    : "/Cobrix_white_background.svg"
            }
            alt="Cobrix Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
        />
    );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <CobrixLogo />
                                {/* <span className="text-base font-semibold">
                                    Cobrix
                                </span> */}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
