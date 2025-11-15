export interface IProduct {
  productId: number;
  image: {
    description: string;
    url: string;
  };
  productName: string;
  priceTitle: string;
  quickCartPrice: number;
}