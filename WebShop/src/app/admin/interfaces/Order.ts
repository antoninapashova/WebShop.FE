export default interface Order {
  id: string;
  orderDate: string;
  deliveryDate: string;
  clientName: string;
  isApproved: string;
  orderItems: [];
  totalAmount: number;
  description: string;
  address: string;
  status: string;
}
