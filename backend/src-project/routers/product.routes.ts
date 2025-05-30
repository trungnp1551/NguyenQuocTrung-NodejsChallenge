import express from "express";
import * as productController from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, productController.getAllProducts)
    .post(authMiddleware, productController.createProduct);

router
    .route("/search")
    .get(productController.searchProducts)

router
    .route("/:id/like")
    .post(authMiddleware, productController.reactToProduct)

export default router;
