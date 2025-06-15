import { NextRequest, NextResponse } from "next/server";
import { createMetadata, Metadata, ValidatedMetadata } from "@sherrylinks/sdk";
import { encodeFunctionData } from "viem";
import { avalancheFuji } from "viem/chains";
import { abi } from "@blockchain/abi";
import { publicClient } from "@blockchain/client";
import { getBeneficiarioActual } from "@blockchain/getBeneficiarioActual";
import { serialize } from 'wagmi';

const CONTRACT_ADDRESS = '0x0c19e55972D233B16C090f8b4DB91c28b74A62d3'; // Cambia por tu dirección real

// GET: Metadata para Sherry
export async function GET(req: NextRequest) {
    try {
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const serverUrl = `${protocol}://${host}`;

        // 1. Obtén los datos del beneficiario actual
        const beneficiario = await getBeneficiarioActual();
        // 2. Obtén el historial de movimientos
        const movimientos = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'obtenerHistorial',
            args: [beneficiario.wallet],
        });

        // 3. Prepara la metadata para Sherry
        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: beneficiario.avatar,
            title: "Panel del Beneficiario",
            baseUrl: serverUrl,
            description: `Folio: ${beneficiario.folio}\nSaldo: ${beneficiario.saldo} AVAX\n\n${beneficiario.historia}`,
            actions: [
                {
                    type: "dynamic",
                    label: "Retirar fondos",
                    description: "Retira la cantidad que desees",
                    chains: { source: "fuji" },
                    path: "/api/beneficiary",
                    params: [
                        {
                            name: "amount",
                            label: "Cantidad a retirar (AVAX)",
                            type: 'text',
                            required: true,
                            description: "Ingresa la cantidad a retirar"
                        },
                        {
                            name: "nip",
                            label: "NIP",
                            type: 'text',
                            required: true,
                            description: "Ingresa tu NIP"
                        }
                    ]
                }
            ]
        };

        const validated: ValidatedMetadata = createMetadata(metadata);

        return NextResponse.json(validated, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (e) {
        return NextResponse.json(
            { error: "Failed to create metadata" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );
    }
}

// POST: Prepara la transacción de retiro
export async function POST(req: NextRequest) {
    let amount: string | null = null;
    let nip: string | null = null;
    let body: any = null;

    try {
        body = await req.json();
        if (body) {
            amount = body.amount;
            nip = body.nip;
        }
    } catch (e) {}

    if (!amount || !nip) {
        return NextResponse.json(
            { error: "Faltan parámetros" },
            { status: 400 }
        );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
            { error: "Cantidad inválida" },
            { status: 400 }
        );
    }

    try {
        const beneficiario = await getBeneficiarioActual();

        // Codifica la llamada a retirar
        const data = encodeFunctionData({
            abi,
            functionName: 'retirar',
            args: [BigInt(Math.floor(parsedAmount * 1e18)), nip]
        });

        const tx = {
            to: CONTRACT_ADDRESS,
            data,
            value: BigInt(0),
            chainId: avalancheFuji.id,
        };

        return NextResponse.json(
            {
                serializedTransaction: serialize(tx),
                chainId: avalancheFuji.name,
                successMessage: `¡Retiro preparado! Firma la transacción para recibir tus fondos.`
            },
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno", details: String(error) },
            { status: 500 }
        );
    }
}