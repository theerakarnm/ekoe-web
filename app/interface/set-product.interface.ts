import type { IProduct } from "./product.interface";

export interface ISetProduct extends Omit<IProduct, "sizes" | "ingredients" | "howToUse"> {
  includedProducts: {
    name: string;
    description: string;
    image: string;
    size: string;
  }[];
  about: string;
  setBenefits: string[];
}
