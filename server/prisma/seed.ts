import { randomUUID } from "node:crypto";
import { User } from "@/domain/entity/User";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const eventId = "01836bcf-6de8-4c1a-9200-6f16c6377b3c";

	await prisma.$transaction(async (tx) => {
		await tx.event.create({
			data: {
				id: eventId,
				name: "Festival de Música",
				startDate: new Date("2024-10-01"),
				endDate: new Date("2024-10-31"),
				location: "Rua ABC",
				imageUrl:
					"https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg",
			},
		});

		await tx.product.createMany({
			data: [
				{
					id: randomUUID(),
					name: "Gin Tanqueray",
					price: 4000,
					stock: 10,
					eventId: eventId,
					imageUrl:
						"https://images.tcdn.com.br/img/img_prod/584235/gin_tanqueray_london_dry_750_ml_438982457_1_20240118184129.jpg",
				},
				{
					id: randomUUID(),
					name: "Baer Mate",
					price: 1800,
					stock: 10,
					eventId: eventId,
					imageUrl:
						"https://baermate.com/cdn/shop/files/produto-baer-mate-2_c907b69e-3768-4642-8084-9bbd7a41fa2f.png",
				},
				{
					id: randomUUID(),
					name: "Caipirinha de Limão",
					price: 2800,
					stock: 10,
					eventId: eventId,
					imageUrl:
						"https://static.itdg.com.br/images/1200-675/82a28aad77a013831d5c0ca43544eedc/319875-original.jpg",
				},
				{
					id: randomUUID(),
					name: "Caipirinha de Morango",
					price: 2800,
					stock: 10,
					eventId: eventId,
					imageUrl: null,
				},
				{
					id: randomUUID(),
					name: "Fitzgerald da casa",
					price: 2800,
					stock: 10,
					eventId: eventId,
					imageUrl: null,
				},
				{
					id: randomUUID(),
					name: "Cosmopolitan",
					price: 4500,
					stock: 10,
					eventId: eventId,
					imageUrl:
						"https://doseextraoficial.com.br/wp-content/uploads/2023/03/Cosmopolitan-3.jpg",
				},
			],
		});

		const userId = "030dc9fc-9077-472b-b904-567234c33be2";

		await tx.user.create({
			data: {
				id: userId,
				name: "Usuario Teste",
				email: "teste@email.com",
				password: User.hashPassword("teste123"),
			},
		});

		const walletId = randomUUID();

		await prisma.domainEvent.create({
			data: {
				id: walletId,
				aggregateId: walletId,
				aggregateType: "WALLET",
				type: "WALLET_CREATED",
				data: {
					initialBalance: 10000,
					walletId: walletId,
					userId: userId,
				},
				version: 1,
			},
		});
	});
}

main()
	.then(async () => {
		console.log("Seeding completed successfully");
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
