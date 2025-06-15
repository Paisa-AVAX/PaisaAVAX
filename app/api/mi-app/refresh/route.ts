import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from 'viem';
import { serialize } from 'wagmi';
import { avalancheFuji } from "viem/chains";
import { abi } from "@blockchain/abi";
import { publicClient } from "@blockchain/client";

const CONTRACT_ADDRESS = '0x255005f5f9B7a41279Cf1c368664CF4E16dB9F1c'; // tu contrato

export async function POST(req: NextRequest) {
    try {
        // 1. Obtener el total de beneficiarios y el actual
        const total: bigint = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'totalBeneficiarios',
            args: [],
        });
        const actual: bigint = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'beneficiarioActual',
            args: [],
        });

        if (total <= BigInt(1)){
            return NextResponse.json(
                { error: "Debe haber al menos 2 beneficiarios para refrescar." },
                {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            );
        }

        // 2. Elegir un índice aleatorio distinto al actual
        let nuevoIndex: number;
        do {
            nuevoIndex = Math.floor(Math.random() * Number(total));
        } while (nuevoIndex === Number(actual));

        // 3. Codificar la llamada al contrato
        const data = encodeFunctionData({
            abi,
            functionName: 'cambiarBeneficiarioActual',
            args: [BigInt(nuevoIndex)]
        });

        const tx = {
            to: CONTRACT_ADDRESS,
            data,
            value: BigInt(0),
            chainId: avalancheFuji.id,
        };

        const serialized = serialize(tx);

        return NextResponse.json(
            {
                serializedTransaction: serialized,
                chainId: avalancheFuji.name,
                nuevoIndex,
                refresh:true
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
        console.error("Error en refresh:", error);
        return NextResponse.json(
            { error: "Error interno", details: String(error) },
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

// Handler para preflight CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}