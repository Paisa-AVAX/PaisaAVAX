import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from 'viem';
import { serialize } from 'wagmi';
import { avalancheFuji } from "viem/chains";
import { abi } from "@blockchain/abi";
import { publicClient } from "@blockchain/client";

const CONTRACT_ADDRESS = '0x0c19e55972D233B16C090f8b4DB91c28b74A62d3';

export async function POST(req: NextRequest) {
    try {
        // 1. Leer cantidad total de beneficiarios y el índice actual
        const total: bigint = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'totalBeneficiarios',
        });

        const actual: bigint = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'beneficiarioActual',
        });

        if (total <= BigInt(1)) {
            return NextResponse.json(
                { error: "Debe haber al menos 2 beneficiarios para refrescar." },
                {
                    status: 400,
                    headers: corsHeaders(),
                }
            );
        }

        // 2. Seleccionar un índice diferente al actual
        let nuevoIndex: number;
        do {
            nuevoIndex = Math.floor(Math.random() * Number(total));
        } while (nuevoIndex === Number(actual));

        // 3. Preparar la transacción para cambiar beneficiario
        const data = encodeFunctionData({
            abi,
            functionName: 'cambiarBeneficiarioActual',
            args: [BigInt(nuevoIndex)],
        });

        const tx = {
            to: CONTRACT_ADDRESS,
            data,
            value: BigInt(0),
            chainId: avalancheFuji.id,
        };

        const serialized = serialize(tx);

        // 4. Obtener datos del nuevo beneficiario
        const nuevoBeneficiario = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'beneficiarios',
            args: [BigInt(nuevoIndex)],
        });

        const response = {
            refresh: true,
            nuevoIndex,
            serializedTransaction: serialized,
            chainId: avalancheFuji.name,
            nuevoBeneficiario: {
                wallet: nuevoBeneficiario[0],
                historia: nuevoBeneficiario[1],
                avatar: nuevoBeneficiario[2],
            }
        };

        return NextResponse.json(response, {
            status: 200,
            headers: corsHeaders(),
        });

    } catch (error) {
        console.error("Error en refresh:", error);
        return NextResponse.json(
            { error: "Error interno", details: String(error) },
            {
                status: 500,
                headers: corsHeaders(),
            }
        );
    }
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
}

// OPTIONS handler
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(),
    });
}
