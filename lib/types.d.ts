type CollectionType = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  products: ProductType[];
};

type ProductType = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  size: [string];
  colors: [string];
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
  statut: string;
  // statut: "pending" | "processing" | "shipped" | "delivered";
};

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
};

type CustomerColumnType = {
  clerkId: string;
  name: string;
  email: string;
};
