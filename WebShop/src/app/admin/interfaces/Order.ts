export default interface Order {
  id: string;
  orderDate: string;
  deliveryDate: string;
  clientName: string;
  isApproved: boolean;
  orderItems: [];
  totalAmount: number;
  description: string;
  address: string;
  status: string;
}
