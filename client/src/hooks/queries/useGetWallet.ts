import { useQuery } from "@tanstack/react-query"
import { WalletService } from "../../services/wallet"

export const USE_WALLET_QUERY_KEY = "useWallet"

export const useGetWallet = (userId: string) => {
  return useQuery({
    queryKey: [USE_WALLET_QUERY_KEY],
    queryFn: () => WalletService.getWallet(userId),
  })
}