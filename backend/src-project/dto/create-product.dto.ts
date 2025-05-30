
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  subcategory!: string;
  createdById: any;
}