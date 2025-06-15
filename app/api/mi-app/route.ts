import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import { createMetadata, Metadata, ValidatedMetadata, ExecutionResponse } from "@sherrylinks/sdk";
import { serialize } from 'wagmi';

export async function GET(req: NextRequest) {
    try {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const serverUrl = `${protocol}://${host}`;
        const { searchParams } = new URL(req.url);
        const step = searchParams.get("step") || "1";

        let metadata: Metadata;

        if (step === "1") {
            // Interfaz de inicio
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Donaciones para Migrantes",
                baseUrl: serverUrl,
                description: "Bienvenido a la plataforma de donaciones.",
                actions: [
                    {
                        type: "dynamic",
                        label: "Iniciar aplicación",
                        description: "Comienza a usar la app",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?step=2`,
                        params: []
                    }
                ]
            };
        } else if (step === "2") {
            // Interfaz de selección de rol
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Selecciona tu rol",
                baseUrl: serverUrl,
                description: "¿Qué deseas hacer?",
                actions: [
                    {
                        type: "dynamic",
                        label: "Donante",
                        description: "Quiero donar",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?step=3`,
                        params: []
                    },
                    {
                        type: "dynamic",
                        label: "Beneficiario",
                        description: "Soy beneficiario",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?step=4`,
                        params: []
                    },
                    {
                        type: "dynamic",
                        label: "Registrarse como beneficiario",
                        description: "Quiero registrarme",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?step=5`,
                        params: []
                    }
                ]
            };
        } else if (step === "3") {
            // Interfaz de donante
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Donar a un migrante",
                baseUrl: serverUrl,
                description: "Llena el formulario para donar.",
                actions: [
                    {
                        type: "dynamic",
                        label: "Donar",
                        description: "Realiza tu donación",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?action=donar`,
                        params: [
                            {
                                name: "cantidad",
                                label: "Cantidad a Donar (AVAX)",
                                type: "number",
                                required: true,
                                description: "Ingresa la cantidad a donar"
                            },
                            {
                                name: "walletBeneficiario",
                                label: "Wallet del Beneficiario",
                                type: "text",
                                required: true,
                                description: "Dirección de wallet del beneficiario"
                            }
                        ]
                    }
                ]
            };
        } else if (step === "4") {
            // Interfaz de beneficiario
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Panel de Beneficiario",
                baseUrl: serverUrl,
                description: "Consulta tu saldo, historial y retira fondos.",
                actions: [
                    {
                        type: "dynamic",
                        label: "Ver saldo",
                        description: "Consulta tu saldo",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?action=verificar`,
                        params: []
                    },
                    {
                        type: "dynamic",
                        label: "Retirar fondos",
                        description: "Retira tus fondos",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?action=retirar`,
                        params: [
                            {
                                name: "monto",
                                label: "Monto a Retirar",
                                type: "number",
                                required: true,
                                description: "Ingresa el monto a retirar"
                            }
                        ]
                    }
                ]
            };
        } else if (step === "5") {
            // Interfaz de registro de beneficiario
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Registro de Beneficiario",
                baseUrl: serverUrl,
                description: "Llena el formulario para registrarte como beneficiario.",
                actions: [
                    {
                        type: "dynamic",
                        label: "Registrarse",
                        description: "Completa tu registro",
                        chains: { source: "fuji" },
                        path: `/api/mi-app?action=registrar`,
                        params: [
                            {
                                name: "nombre",
                                label: "Nombre completo",
                                type: "text",
                                required: true,
                                description: "Tu nombre"
                            },
                            {
                                name: "wallet",
                                label: "Wallet",
                                type: "text",
                                required: true,
                                description: "Tu dirección de wallet"
                            },
                            {
                                name: "nacionalidad",
                                label: "Wallet",
                                type: "text",
                                required: true,
                                description: "Tu nacionalidad"
                            },
                            {
                                name: "edad",
                                label: "Edad",
                                type: "number",
                                required: true,
                                description: "Tu edad"
                            },
                            {
                                name: "descripción",
                                label: "Descripción",
                                type: "text",
                                required: true,
                                description: "Hablanos de ti"
                            }
                        ]
                    }
                ]
            };
        } else {
            // Fallback
            metadata = {
                url: "https://sherry.social",
                icon: "https://tu-icono.png",
                title: "Donaciones para Migrantes",
                baseUrl: serverUrl,
                description: "Bienvenido a la plataforma de donaciones.",
                actions: []
            };
        }

        const validated: ValidatedMetadata = createMetadata(metadata);

        return NextResponse.json(validated, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
            },
        });
    } catch (error) {
        console.error("Error creating metadata:", error);
        return NextResponse.json(
            { error: "Failed to create metadata" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
                },
            }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
        },
    });
}