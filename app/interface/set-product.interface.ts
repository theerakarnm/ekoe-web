import type { IProduct } from "./product.interface";

export interface ISetProduct extends Omit<IProduct, "sizes" | "ingredients" | "howToUse"> {
  includedProducts: {
    name: string;
    description: string;
    image: string;
    size: string;
  }[];
  whyItWorks: string;
  goodFor: string;
  about: string;
  setBenefits: string[]; // Renamed from benefits to avoid conflict if needed, or just use benefits
}
