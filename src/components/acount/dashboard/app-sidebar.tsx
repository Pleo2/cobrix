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
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: IconDashboard
        },
        {
            title: "Lifecycle",
            url: "#",
            icon: IconListDetails
        },
        {
            title: "Analytics",
            url: "#",
            icon: IconChartBar
        },
        {
            title: "Projects",
            url: "#",
            icon: IconFolder
        },
        {
            title: "Team",
            url: "#",
            icon: IconUsers
        }
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        }
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch
        }
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport
        },
        {
            name: "Word Assistant",
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
