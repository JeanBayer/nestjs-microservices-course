export class Product {
  id: string;
  name: string;
  description?: string;
  price: number;

  constructor(id: string, name: string, price: number, description?: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  public productWith({
    name,
    description,
    price,
  }: Partial<Pick<Product, 'name' | 'description' | 'price'>>) {
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
  }
}
