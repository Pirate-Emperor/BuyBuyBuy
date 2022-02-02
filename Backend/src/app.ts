import dal from "./2-utils/dal";
dal.connect();

import express from "express";
import cors from "cors";
import expressRateLimit from "express-rate-limit";
import expressFileUpload from "express-fileupload";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import authController from "./6-controllers/auth-controller";
import cartItemsController from "./6-controllers/cart-items-controller";
import cartsController from "./6-controllers/carts-controller";
import ordersController from "./6-controllers/orders-controller";
import productsController from "./6-controllers/products-controller";
import imagesController from "./6-controllers/images-controller";
import config from "./2-utils/config";
import sanitize from "./3-middleware/sanitize";

const server = express();

server.use(cors({ origin: ['http://localhost:3001', 'http://localhost:4200', 'https://niv-shopping-online.netlify.app'] }));

server.use("/api/", expressRateLimit({
    windowMs: 1000,
    max: 10,
    message: "You have exceeded the allowed amount of times for browsing the site. Please try again soon."
}));

server.use(sanitize);
server.use(express.json());
server.use(expressFileUpload());

server.use("/api/auth", authController);
server.use("/api/", cartItemsController);
server.use("/api/", cartsController);
server.use("/api/", ordersController);
server.use("/api/", productsController);
server.use('/', imagesController)

server.use("*", routeNotFound);

server.use(catchAll);

server.listen(config.port, () => console.log("Listening on http://localhost:" + config.port));
