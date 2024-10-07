import "express-async-errors";
import cors from "cors";
import express, { type Express, type Router } from "express";
import { errorHandler } from "../middleware/errorHandler";

export interface HttpServer {
	listen(port: number | string, callback: () => void): void;
}

export class ExpressServer implements HttpServer {
	private readonly app: Express;

	constructor(private readonly routes: Router) {
		const frontendUrl = process.env.FRONTEND_URL;

		if (!frontendUrl) {
			throw new Error("No origin URL provided");
		}

		this.app = express();
		this.app.use(
			cors({
				origin: [frontendUrl],
				credentials: true,
			}),
		);
		this.app.use(express.json());
		this.setupRoutes();

		this.app.use(errorHandler);
	}

	setupRoutes(): void {
		this.app.use(this.routes);
	}

	listen(port: number | string, callback: () => void): void {
		this.app.listen(port, callback);
	}
}
