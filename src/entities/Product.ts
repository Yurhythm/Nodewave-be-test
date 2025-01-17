import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  // Create a new product
  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    return prisma.product.create({ data });
  }

  // Get a product by ID
  async getProductById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  // Update a product
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete a product
  async deleteProduct(id: number): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }
}