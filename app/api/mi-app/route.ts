import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import { createMetadata, Metadata, ValidatedMetadata } from "@sherrylinks/sdk";
import { serialize } from 'wagmi';

// GET: Devuelve la metadata para el formulario de donación
export async function GET(req: NextRequest) {
    try {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const serverUrl = `${protocol}://${host}`;

        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: "https://avatars.githubusercontent.com/u/117962315",
            title: "Donaciones para Migrantes",
            baseUrl: serverUrl,
            description: "Realiza una donación en AVAX a un migrante.",
            actions: [
                {
                    type: "dynamic",
                    label: "Donar",
                    description: "Realiza tu donación",
                    chains: { source: "fuji" },
                    path: "/api/mi-app",
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

        const validated: ValidatedMetadata = createMetadata(metadata);

        return NextResponse.json(validated, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (e) {
        console.error("Error creating metadata:", e);
        return NextResponse.json(
            { error: "Failed to create metadata" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );
    }
}

// POST: Procesa la donación y responde con la transacción serializada
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const cantidad = body.cantidad;
        const walletBeneficiario = body.walletBeneficiario;

        if (!cantidad || !walletBeneficiario) {
            return NextResponse.json(
                { error: "Missing required parameters", cantidad, walletBeneficiario },
                {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            );
        }

        const tx = {
            to: walletBeneficiario,
            value: BigInt(parseFloat(cantidad) * 1e18), // AVAX a wei
            chainId: avalancheFuji.id,
        };

        const serialized = serialize(tx);

        return NextResponse.json(
            {
                serializedTransaction: serialized,
                chainId: avalancheFuji.name,
            },
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: (error instanceof Error ? error.message : String(error)) },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );
    }
}

// OPTIONS: CORS preflight
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