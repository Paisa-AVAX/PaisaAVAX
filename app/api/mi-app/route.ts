import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import { createMetadata, Metadata, ValidatedMetadata } from "@sherrylinks/sdk";
import { serialize } from 'wagmi';
import { getBeneficiarioActual } from "@blockchain/getBeneficiarioActual";

// GET: Devuelve la metadata para el formulario de donación
export async function GET(req: NextRequest) {
    try {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const serverUrl = `${protocol}://${host}`;

        // 1. Obtén los datos del beneficiario actual desde el contrato
        const beneficiario = await getBeneficiarioActual();

        // 2. Usa esos datos en la metadata
        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: beneficiario.avatar,
            title: "Donaciones para Migrantes",
            baseUrl: serverUrl,
            description: `${beneficiario.historia}\n\nWallet del migrante: ${beneficiario.wallet}`,
            actions: [
                {
                    type: "dynamic",
                    label: "Donar",
                    description: "Realiza tu donación",
                    chains: { source: "fuji" },
                    path: "/api/mi-app",
                    params: [
                        {
                            name: "amount",
                            label: "Cantidad a Donar (AVAX)",
                            type: 'text',
                            required: true,
                            description: "Ingresa la cantidad a donar"
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



export async function POST(req: NextRequest) {
    let amount: string | null = null;
    let body: any = null;

    // 1. Intenta leer del body
    try {
        body = await req.json();
        if (body && body.amount) {
            amount = body.amount;
        }
    } catch (e) {
        // Si falla, ignora (puede que no haya body)
    }

    // 2. Si no hay amount, intenta leer de query params
    if (!amount) {
        const { searchParams } = new URL(req.url);
        amount = searchParams.get("amount");
    }

    // 3. Valida y sigue igual
    const parsedAmount = parseFloat(amount || "");
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
            { error: "Cantidad inválida" },
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

    try {
        // Obtén la wallet del beneficiario actual desde el contrato
        const beneficiario = await getBeneficiarioActual();
        const walletBeneficiario = beneficiario.wallet;

        // Lógica de la transacción
        const tx = {
            to: walletBeneficiario,
            value: BigInt(Math.floor(parsedAmount * 1e18)), // AVAX a wei
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