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

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const walletParam = searchParams.get("wallet");

    // Si NO hay wallet, muestra landing de la fundación
    if (!walletParam) {
        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: "https://kubsycsxqsuoevqckjkm.supabase.co/storage/v1/object/public/PCP//paisa.jpeg",
            title: "Fundación Breaking Borders",
            baseUrl: "https://breaking-borders.vercel.app",
            description: "Ayudamos a migrantes a recibir donaciones y retirar fondos de forma segura.",
            actions: [
                {
                    type: "dynamic",
                    label: "Conectar Wallet",
                    description: "Conecta tu wallet para continuar",
                    chains: { source: "fuji" },
                    path: "/api/beneficiary",
                    params: [
                        {
                            name: "wallet",
                            label: "Wallet",
                            type: "address",
                            required: true,
                            description: "Conecta tu wallet"
                        }
                    ]
                }
            ]
        };
        return NextResponse.json(metadata, { headers: corsHeaders });
    }

    // Si hay wallet, valida y busca beneficiario
    if (!isAddress(walletParam)) {
        return NextResponse.json({ error: "Wallet inválida" }, { status: 400 });
    }
    const wallet = walletParam as `0x${string}`;

    try {
        const beneficiario = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getBeneficiarioPorWallet',
            args: [wallet],
        });

        if (!beneficiario) {
            return NextResponse.json({ error: "No eres beneficiario" }, { status: 403 });
        }

        // Desestructura y arma la metadata personalizada
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

        const metadata: Metadata = {
            url: "https://sherry.social",
            icon: avatar,
            title: "Panel del Beneficiario",
            baseUrl: "https://breaking-borders.vercel.app",
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

        return NextResponse.json(metadata, { headers: corsHeaders });

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
                headers: corsHeaders,
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno", details: String(error) },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}