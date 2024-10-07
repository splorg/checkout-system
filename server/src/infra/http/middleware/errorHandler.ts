import { DomainError } from "@/domain/errors";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ZodError) {
		res.status(400).json({ error: err.issues[0].message });
	}

	if (err instanceof DomainError) {
		res.status(err.statusCode).json({ error: err.message });
	}

	console.error(err);
	res.status(500).json({ error: "Internal server error" });
};
