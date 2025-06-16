import { publicClient } from './client';
import { abi } from "./abi";

const CONTRACT_ADDRESS = '0x27399834921981B70b60c06F3c9f467C7B7872aC';

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
