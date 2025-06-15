import { publicClient } from './client';
import { abi } from "./abi";

const CONTRACT_ADDRESS = '0x0c19e55972D233B16C090f8b4DB91c28b74A62d3';

export async function getBeneficiarioActual() {
  const [
    wallet,
    nombre,
    edad,
    nacionalidad,
    historia,
    avatar,
    folio,
    saldo
  ] = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getBeneficiarioActual',
    args: [],
  });

  return {
    wallet,
    nombre,
    edad,
    nacionalidad,
    historia,
    avatar,
    folio,
    saldo
  };
}
