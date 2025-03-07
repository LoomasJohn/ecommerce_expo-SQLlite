import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('ecommerce.db');

// Function to insert a new product (with seller_id and category)
export const insertProduct = async (
  sellerId: number,
  name: string,
  price: number,
  image: string,
  description: string,
  category: string
) => {
  // Check if the user is a seller
  const checkSeller = await db.prepareAsync(
    'SELECT role FROM users WHERE id = ?;'
  );
  const roleResult = await checkSeller.executeAsync([sellerId]);
  const sellerRow = (await roleResult.getFirstAsync()) as { role?: string } | null;
  await checkSeller.finalizeAsync();

  console.warn('Seller data fetched:', sellerRow);

  if (!sellerRow) {
    console.warn('Seller check failed: No user found with that ID.');
    return;
  }
  if (typeof sellerRow !== 'object') {
    console.warn('Seller check failed: Result is not an object:', sellerRow);
    return;
  }
  if (!('role' in sellerRow)) {
    console.warn('Seller check failed: "role" field missing:', sellerRow);
    return;
  }
  console.warn('Seller role extracted:', sellerRow.role);
  if (sellerRow.role !== 'seller') {
    console.warn('Only sellers can add products.');
    return;
  }

  // Insert product including seller_id and category
  const statement = await db.prepareAsync(
    `INSERT INTO products (seller_id, name, price, image, description, category) VALUES (?, ?, ?, ?, ?, ?);`
  );
  await statement.executeAsync([sellerId, name, price, image, description, category]);
  await statement.finalizeAsync();
  console.warn('Product inserted:', name);
};

// Function to insert a new user
export const insertUser = async (
  name: string,
  email: string,
  password: string,
  role: 'buyer' | 'seller'
) => {
  const statement = await db.prepareAsync(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);`
  );
  await statement.executeAsync([name, email, password, role]);
  await statement.finalizeAsync();
  console.warn(`User ${name} added with role: ${role}.`);
};

// Function to fetch all products with optional search and category filters
export const getProducts = async (searchQuery?: string, categoryFilter?: string) => {
  let query = 'SELECT * FROM products';
  const params: any[] = [];
  const conditions: string[] = [];
  if (searchQuery) {
    conditions.push('name LIKE ?');
    params.push(`%${searchQuery}%`);
  }
  if (categoryFilter) {
    conditions.push('category = ?');
    params.push(categoryFilter);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  const statement = await db.prepareAsync(query);
  const result = await statement.executeAsync(params);
  const products = await result.getAllAsync();
  await statement.finalizeAsync();
  return products;
};

// Function to delete a product
export const deleteProduct = async (id: number) => {
  const statement = await db.prepareAsync(`DELETE FROM products WHERE id = ?;`);
  await statement.executeAsync([id]);
  await statement.finalizeAsync();
  console.warn(`Product with id ${id} deleted`);
};

// Function to update a product
export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  image: string,
  description: string,
  category: string
) => {
  const statement = await db.prepareAsync(
    `UPDATE products SET name = ?, price = ?, image = ?, description = ?, category = ? WHERE id = ?;`
  );
  await statement.executeAsync([name, price, image, description, category, id]);
  await statement.finalizeAsync();
  console.warn(`Product with id ${id} updated`);
};

// Function to fetch a user by email and password
export const getUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  const statement = await db.prepareAsync(
    'SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1;'
  );
  const result = await statement.executeAsync([email, password]);
  const userRow = (await result.getFirstAsync()) as User | null;
  await statement.finalizeAsync();
  return userRow;
};

// Function to get cart items (joining cart and products)
export const getCartItems = async () => {
  const statement = await db.prepareAsync(
    `SELECT cart.id, cart.quantity, products.name, products.price
     FROM cart
     INNER JOIN products ON cart.product_id = products.id;`
  );
  const result = await statement.executeAsync();
  const items = await result.getAllAsync();
  await statement.finalizeAsync();
  return items;
};

// Function to delete a cart item
export const deleteCartItem = async (cartItemId: number) => {
  const statement = await db.prepareAsync(`DELETE FROM cart WHERE id = ?;`);
  await statement.executeAsync([cartItemId]);
  await statement.finalizeAsync();
  console.warn(`Cart item with id ${cartItemId} deleted`);
};

// New function to insert an item into the cart
export const insertCartItem = async (
  productId: number,
  quantity: number = 1
) => {
  const statement = await db.prepareAsync(
    `INSERT INTO cart (product_id, quantity) VALUES (?, ?);`
  );
  await statement.executeAsync([productId, quantity]);
  await statement.finalizeAsync();
  console.warn(`Product with id ${productId} added to cart.`);
};

// Function to fetch a product by ID
export const getProductById = async (productId: number) => {
  const statement = await db.prepareAsync(
    'SELECT * FROM products WHERE id = ? LIMIT 1;'
  );
  const result = await statement.executeAsync([productId]);
  const product = await result.getFirstAsync();
  await statement.finalizeAsync();
  return product;
};

export const updateUserProfile = async (id: number, name: string, email: string) => {
  const statement = await db.prepareAsync(
    `UPDATE users SET name = ?, email = ? WHERE id = ?;`
  );
  await statement.executeAsync([name, email, id]);
  await statement.finalizeAsync();
  console.warn(`User with id ${id} updated.`);
};

// User type definition
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string; // 'buyer' or 'seller'
}
