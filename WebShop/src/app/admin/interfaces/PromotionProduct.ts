export default interface PromotionProduct {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  priceInPromotion: number;
  description: string;
  categoryName: string;
  isActive: boolean;
  images: string[];
  endDate: string;
}
