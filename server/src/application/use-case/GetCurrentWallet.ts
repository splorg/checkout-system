import { WalletNotFoundError } from "@/domain/errors";
import type { WalletResultDTO } from "../dto/WalletResult";
import type { WalletService } from "../service/WalletService";

export class GetCurrentWallet {
	constructor(private readonly walletService: WalletService) {}

	async execute(userId: string): Promise<WalletResultDTO> {
		const wallet = await this.walletService.getWallet(userId);

		if (!wallet) {
			throw new WalletNotFoundError(userId);
		}

		return {
			wallet: {
				id: wallet.getId(),
				balance: wallet.getBalance().getValue(),
			},
		};
	}
}
