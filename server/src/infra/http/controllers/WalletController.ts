import type { DepositFunds } from "@/application/use-case/DepositFunds";
import type { GetCurrentWallet } from "@/application/use-case/GetCurrentWallet";
import { UUID } from "@/domain/value-object/UUID";
import type { Request, Response } from "express";
import { DepositFundsSchema } from "../schemas/WalletSchemas";

export class WalletController {
	constructor(
		private readonly getCurrent: GetCurrentWallet,
		private readonly add: DepositFunds,
	) {}

	async getCurrentWallet(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;
		if (!userId || !UUID.isValid(userId)) {
			res.status(400).json({ error: "Invalid user ID" });
			return;
		}

		const result = await this.getCurrent.execute(userId);

		res.json(result);
	}

	async depositFunds(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;
		if (!userId || !UUID.isValid(userId)) {
			res.status(400).json({ error: "Invalid user ID" });
			return;
		}

		const parsedBody = DepositFundsSchema.parse(req.body);
		const { amount } = parsedBody;

		const result = await this.add.execute(userId, amount);

		res.json(result);
	}
}
