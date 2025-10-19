"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Copy, Share2, Check } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

export function CheckoutLinkGenerator() {
    const subscriptionPlans = useDashboardStore((state) => state.subscriptionPlans);
    const clients = useDashboardStore((state) => state.clients);
    const activePlans = subscriptionPlans.filter((p) => p.isActive);

    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);

    const generateCheckoutUrl = () => {
        if (!selectedPlanId) return "";
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const params = new URLSearchParams();
        params.set("planId", selectedPlanId);
        if (selectedClientId) {
            params.set("clientId", selectedClientId);
        }
        return `${baseUrl}/checkout?${params.toString()}`;
    };

    const generateWhatsAppMessage = () => {
        const plan = activePlans.find((p) => p.id === selectedPlanId);
        if (!plan) return "";

        const greeting = customerName ? `Hola ${customerName}! 👋\n\n` : "Hola! 👋\n\n";
        const message = `${greeting}Te enviamos el link para renovar tu suscripción al *${
            plan.name
        }*.\n\n💰 Precio: $${plan.price}/${
            plan.billingCycle === "Mensual" ? "mes" : "año"
        }\n\nPuedes realizar el pago de forma segura en el siguiente enlace:\n${generateCheckoutUrl()}\n\nSi tienes alguna duda, estamos para ayudarte! 😊`;

        return encodeURIComponent(message);
    };

    const handleCopyLink = () => {
        const url = generateCheckoutUrl();
        if (url) {
            navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleShareWhatsApp = () => {
        const message = generateWhatsAppMessage();
        if (message) {
            window.open(`https://wa.me/?text=${message}`, "_blank");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generar Link de Pago</CardTitle>
                <CardDescription>
                    Crea un link de checkout personalizado para compartir con tus clientes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="client">Cliente (opcional)</Label>
                    <Select
                        value={selectedClientId}
                        onValueChange={(value) => {
                            setSelectedClientId(value);
                            const client = clients.find((c) => c.id.toString() === value);
                            if (client) {
                                setCustomerName(`${client.firstName} ${client.lastName}`);
                            }
                        }}
                    >
                        <SelectTrigger id="client">
                            <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.firstName} {client.lastName} - {client.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Si seleccionas un cliente, sus datos se pre-llenarán automáticamente
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="plan">Plan de Suscripción *</Label>
                    <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                        <SelectTrigger id="plan">
                            <SelectValue placeholder="Selecciona un plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {activePlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name} - ${plan.price}/
                                    {plan.billingCycle === "Mensual" ? "mes" : "año"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedPlanId && (
                    <div className="space-y-3 pt-2">
                        <div className="rounded-lg bg-muted p-3">
                            <Label className="text-xs text-muted-foreground">Link generado:</Label>
                            <p className="text-sm font-mono break-all mt-1">
                                {generateCheckoutUrl()}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleCopyLink}
                                variant="outline"
                                className="flex-1 gap-2"
                                disabled={!selectedPlanId}
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Copiar Link
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleShareWhatsApp}
                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                disabled={!selectedPlanId}
                            >
                                <Share2 className="h-4 w-4" />
                                Compartir por WhatsApp
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
