export default interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  highlight: string;
  image: {
    img: string;
  };
}
