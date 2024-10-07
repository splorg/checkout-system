import { CartService } from "./application/service/CartService";
import { WalletService } from "./application/service/WalletService";
import { AddProductToCart } from "./application/use-case/AddProductToCart";
import { CompleteCheckout } from "./application/use-case/CompleteCheckout";
import { CreateCart } from "./application/use-case/CreateCart";
import { DepositFunds } from "./application/use-case/DepositFunds";
import { GetCurrentCart } from "./application/use-case/GetCurrentCart";
import { GetCurrentWallet } from "./application/use-case/GetCurrentWallet";
import { GetEventProductList } from "./application/use-case/GetEventProductList";
import { GetEvents } from "./application/use-case/GetEvents";
import { GetOrderHistory } from "./application/use-case/GetOrderHistory";
import { RemoveProductFromCart } from "./application/use-case/RemoveProductFromCart";
import { PrismaCartEventStore } from "./infra/event/PrismaCartEventStore";
import { PrismaWalletEventStore } from "./infra/event/PrismaWalletEventStore";
import { ExpressServer } from "./infra/http/app";
import { CartController } from "./infra/http/controllers/CartController";
import { EventsController } from "./infra/http/controllers/EventsController";
import { OrderController } from "./infra/http/controllers/OrderController";
import { WalletController } from "./infra/http/controllers/WalletController";
import { Router } from "./infra/http/routes";
import { CartRouter } from "./infra/http/routes/CartRouter";
import { EventsRouter } from "./infra/http/routes/EventsRouter";
import { OrderRouter } from "./infra/http/routes/OrderRouter";
import { WalletRouter } from "./infra/http/routes/WalletRouter";
import { prismaClient } from "./infra/persistence";
import { PrismaEventRepository } from "./infra/repositories/PrismaEventRepository";
import { PrismaOrderRepository } from "./infra/repositories/PrismaOrderRepository";
import { PrismaProductRepository } from "./infra/repositories/PrismaProductRepository";

const port = process.env.PORT || 3000;

const db = prismaClient;
const eventRepository = new PrismaEventRepository(db);
const productRepository = new PrismaProductRepository(db);
const orderRepository = new PrismaOrderRepository(db);
const walletEventStore = new PrismaWalletEventStore(db);
const cartEventStore = new PrismaCartEventStore(db);

const cartService = new CartService(cartEventStore);
const walletService = new WalletService(walletEventStore);

const getEventsUseCase = new GetEvents(eventRepository);
const getProductsUseCase = new GetEventProductList(
	productRepository,
	eventRepository,
);
const createCartUseCase = new CreateCart(cartService, productRepository);
const addToCartUseCase = new AddProductToCart(cartService, productRepository);
const removeProductUseCase = new RemoveProductFromCart(
	cartService,
	productRepository,
);
const getCurrentCartUseCase = new GetCurrentCart(
	cartService,
	productRepository,
);
const completeCheckoutUseCase = new CompleteCheckout(
	cartService,
	walletService,
	orderRepository,
);
const getOrderHistoryUseCase = new GetOrderHistory(orderRepository);
const getCurrentWalletUseCase = new GetCurrentWallet(walletService);
const depositFundsUseCase = new DepositFunds(walletService);

const eventsController = new EventsController(
	getProductsUseCase,
	getEventsUseCase,
);
const eventsRouter = new EventsRouter(eventsController);

const cartController = new CartController(
	createCartUseCase,
	addToCartUseCase,
	removeProductUseCase,
	getCurrentCartUseCase,
	completeCheckoutUseCase,
);
const cartRouter = new CartRouter(cartController);

const orderController = new OrderController(getOrderHistoryUseCase);
const orderRouter = new OrderRouter(orderController);

const walletController = new WalletController(
	getCurrentWalletUseCase,
	depositFundsUseCase,
);
const walletRouter = new WalletRouter(walletController);

const router = new Router(eventsRouter, cartRouter, orderRouter, walletRouter);
const app = new ExpressServer(router.routes());

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
