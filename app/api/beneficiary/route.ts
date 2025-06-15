import { NextRequest, NextResponse } from "next/server";
import { createMetadata, Metadata, ValidatedMetadata } from "@sherrylinks/sdk";
import { encodeFunctionData } from "viem";
import { avalancheFuji } from "viem/chains";
import { abi } from "@blockchain/abi";
import { publicClient } from "@blockchain/client";
import { getBeneficiarioActual } from "@blockchain/getBeneficiarioActual";
import { serialize } from 'wagmi';
import { isAddress } from 'viem';

const CONTRACT_ADDRESS = '0x27399834921981B70b60c06F3c9f467C7B7872aC'; // Cambia por tu dirección real


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const walletParam = searchParams.get("wallet");

    // 1. Valida que el parámetro existe
    if (!walletParam) {
        return NextResponse.json({ error: "Wallet requerida" }, { status: 400 });
    }

    // 2. Valida que sea una dirección Ethereum válida
    if (!isAddress(walletParam)) {
        return NextResponse.json({ error: "Wallet inválida" }, { status: 400 });
    }

    // 3. Haz el type assertion
    const wallet = walletParam as `0x${string}`;

    try {
        // 4. Llama a la función del contrato
        const beneficiario = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getBeneficiarioPorWallet',
            args: [wallet],
        });

        if (!beneficiario) {
            return NextResponse.json({ error: "No eres beneficiario" }, { status: 403 });
        }

        // Desestructura los datos
        const [
            walletAddr,
            nombre,
            edad,
            nacionalidad,
            historia,
            avatar,
            folio,
            saldo
        ] = beneficiario;

        // Arma la metadata
        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: avatar,
            title: "Panel del Beneficiario",
            baseUrl: "https://TU_DOMINIO", // o usa host/protocol como antes
            description: `Folio: ${folio}\nSaldo: ${Number(saldo) / 1e18} AVAX\n\n${historia}`,
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
        return NextResponse.json({ error: "Error interno", details: String(e) }, { status: 500 });
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