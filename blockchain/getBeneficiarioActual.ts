import { publicClient } from './client';
import { abi } from "./abi";
const CONTRACT_ADDRESS = '0x255005f5f9B7a41279Cf1c368664CF4E16dB9F1c'; // Cambia por tu dirección real

export async function getBeneficiarioActual() {
  const [wallet, historia, avatar] = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getBeneficiarioActual',
    args: [],
  });
  return { wallet, historia, avatar };
}
