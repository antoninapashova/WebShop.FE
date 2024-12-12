export default interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryName: string;
  description: string;
  priceAfterDiscount: number;
  images: string[];
}
