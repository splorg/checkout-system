import type { User } from "../entity/User";

export interface UserRepository {
	findById(userId: string): Promise<User | null>;
}
