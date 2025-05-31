import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { CreateProductDto } from '../dto/create-product.dto';
import { AuthRequest } from "../middleware/auth.middleware";
import { sendResponse } from '../common/response';
import prisma from "../config/db";
import redis from '../config/redis';

export const getAllProducts = async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.product.count();
  
  const cacheKey = `products:page=${page}:limit=${limit}`;

  try {

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedData = JSON.parse(cached);
      return sendResponse(res, 200, true, "Fetched products (from cache)", parsedData);
    }

    const products = await productService.getAllProducts(skip, limit);
    const dataResponse = {
      products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    }
    await redis.set(cacheKey, JSON.stringify(dataResponse), { EX: 60 });

    return sendResponse(res, 200, true, "Fetched products", dataResponse);
    
  } catch (error) {
    return sendResponse(res, 500, false, "Error retrieving product list");
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      subcategory,
      minPrice,
      maxPrice,
    } = req.query;

    const filters = {
      q: (q as string)?.trim(),
      category: (category as string)?.trim(),
      subcategory: (subcategory as string)?.trim(),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const products = await productService.searchProducts(filters);

    return sendResponse(res, 200, true, "Filtered products", { products });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Error searching products");
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dto: CreateProductDto = req.body;
    if (!req.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
    dto.createdById = req.userId;

    const product = await productService.createProduct(dto);

    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Server error");
  }
};

export const reactToProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const { type } = req.body; // "LIKE" or "DISLIKE"
    const userId = req.userId;

    if (!["LIKE", "DISLIKE"].includes(type)) {
      return sendResponse(res, 400, false, "Invalid type. Must be LIKE or DISLIKE.");
    }

    const result = await productService.toggleLikeDislike(productId, userId!, type);
    const counts = await productService.countProductReactions(productId);
    
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }

    return sendResponse(res, 200, true, `Reaction ${result.status}`, {
      currentType: result.type,
      ...counts,
    });
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};