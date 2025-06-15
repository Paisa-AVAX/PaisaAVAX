import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
});
