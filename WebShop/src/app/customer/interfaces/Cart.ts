import CartItem from './CartItem';

export default interface Cart {
  cartItems: CartItem[];
  totalPrice: number;
}
