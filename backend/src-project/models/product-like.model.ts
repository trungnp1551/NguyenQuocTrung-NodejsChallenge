import { LikeType } from "../types/types";

export interface ProductLike {
  id: string;
  userId: string;
  productId: string;
  type: LikeType;
  createdAt: Date;
}
