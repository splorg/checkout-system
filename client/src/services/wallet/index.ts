import { api } from "../api"
import { IWallet } from "./types"

export class WalletService {
  static getWallet = async (userId: string) => {
    const { data } = await api.get<{ wallet: IWallet }>(`/wallet/${userId}`)

    return data
  }

  static deposit = async (userId: string, amount: number) => {
    const { data } = await api.post<{ wallet: IWallet }>(`/wallet/${userId}`, {
      amount,
    })

    return data
  }
}