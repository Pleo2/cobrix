"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencyToggle } from "@/components/currency-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
    IconArrowLeft,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const userData = {
    name: "Uptly",
    email: "info@uptly.com",
    avatar: "/public/",
};

export function SiteHeader() {
    const pathname = usePathname();

    // Mostrar flecha en todas las páginas excepto en /account (la raíz)
    const showBackButton = pathname !== "/account" && pathname !== "/account/";

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex h-12 items-center justify-between">
                    <div className="flex items-center gap-2">
                        {showBackButton && (
                            <Link href="/account">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <IconArrowLeft className="h-4 w-4 text-foreground" />
                                    <span className="hidden sm:inline">Volver</span>
                                </Button>
                            </Link>
                        )}
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 h-10 hover:bg-accent"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={userData.avatar} alt={userData.name} />
                                        <AvatarFallback className="rounded-lg">UP</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden sm:grid text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {userData.name}
                                        </span>
                                        <span className="text-muted-foreground truncate text-xs">
                                            {userData.email}
                                        </span>
                                    </div>
                                    <IconDotsVertical className="ml-auto size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg"
                                align="start"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={userData.avatar}
                                                alt={userData.name}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                JP
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {userData.name}
                                            </span>
                                            <span className="text-muted-foreground truncate text-xs">
                                                {userData.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <IconUserCircle className="mr-2 h-4 w-4" />
                                        Cuenta
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <IconCreditCard className="mr-2 h-4 w-4" />
                                        Facturación
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <IconNotification className="mr-2 h-4 w-4" />
                                        Notificaciones
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <IconLogout className="mr-2 h-4 w-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <CurrencyToggle />
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            asChild
                            size="sm"
                            className="hidden sm:flex"
                        ></Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
