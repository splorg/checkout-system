import { Wallet } from "@/domain/aggregate/Wallet";
import { WalletNotFoundError } from "@/domain/errors";
import type { WalletResultDTO } from "../dto/WalletResult";
import type { WalletService } from "../service/WalletService";

export class DepositFunds {
	constructor(private readonly walletService: WalletService) {}

	async execute(userId: string, amount: number): Promise<WalletResultDTO> {
		const wallet = await this.walletService.getWallet(userId);

		if (!wallet) {
			throw new WalletNotFoundError(userId);
		}

		const resultingWallet = await this.walletService.deposit(wallet, amount);

		return {
			wallet: {
				id: resultingWallet.getId(),
				balance: resultingWallet.getBalance().getValue(),
			},
		};
	}
}
