import prisma from "../config/db";
import { Product } from "../models/product.model";
import { CreateProductDto } from '../dto/create-product.dto';

export const getAllProducts = async (skip: number, limit: number) => {
  const products = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      likes: true,
    },
  });

  return products.map((product) => {
    const likeCount = product.likes.filter((l) => l.type === "LIKE").length;
    const dislikeCount = product.likes.filter((l) => l.type === "DISLIKE").length;

    return {
      ...product,
      likeCount,
      dislikeCount,
    };
  });
};

type SearchFilter = {
  q?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const searchProducts = async (filters: SearchFilter) => {
  const { q, category, subcategory, minPrice, maxPrice } = filters;

  return await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              name: {
                contains: q,
                mode: "insensitive",
              },
            }
          : {},
        category ? { category } : {},
        subcategory ? { subcategory } : {},
        minPrice !== undefined
          ? {
              price: {
                gte: minPrice,
              },
            }
          : {},
        maxPrice !== undefined
          ? {
              price: {
                lte: maxPrice,
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createProduct = async (
  data: CreateProductDto
): Promise<Product> => {
  return await prisma.product.create({ data });
};

export const toggleLikeDislike = async (
  productId: string,
  userId: string,
  action: "LIKE" | "DISLIKE"
) => {
  const existing = await prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    if (existing.type === action) {
      await prisma.productLike.delete({ where: { id: existing.id } });
      return { status: "removed", type: action };
    } else {
      await prisma.productLike.update({
        where: { id: existing.id },
        data: { type: action },
      });
      return { status: "updated", type: action };
    }
  } else {
    await prisma.productLike.create({
      data: {
        userId,
        productId,
        type: action,
      },
    });
    return { status: "created", type: action };
  }
};

export const countProductReactions = async (productId: string) => {
  const [likes, dislikes] = await Promise.all([
    prisma.productLike.count({ where: { productId, type: "LIKE" } }),
    prisma.productLike.count({ where: { productId, type: "DISLIKE" } }),
  ]);
  return { likes, dislikes };
};
