const db = require('./db');
const bcrypt = require('bcryptjs');

console.log('Seeding database with sample products and banners...');

// Clear existing tables
db.exec('DELETE FROM reviews');
db.exec('DELETE FROM order_items');
db.exec('DELETE FROM orders');
db.exec('DELETE FROM wishlist_items');
db.exec('DELETE FROM cart_items');
db.exec('DELETE FROM carts');
db.exec('DELETE FROM product_images');
db.exec('DELETE FROM product_variants');
db.exec('DELETE FROM products');
db.exec('DELETE FROM categories');
db.exec('DELETE FROM banners');
db.exec('DELETE FROM coupons');
db.exec('DELETE FROM addresses');
db.exec('DELETE FROM users');

// Users
const adminHash = bcrypt.hashSync('Admin@123456', 10);
const customerHash = bcrypt.hashSync('Customer@123', 10);

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role, phone)
  VALUES (?, ?, ?, ?, ?)
`);

insertUser.run('Grabb-It Admin', 'admin@grabb-it.com', adminHash, 'admin', '+18005550199');
const custRes = insertUser.run('Alex Morgan', 'customer@grabb-it.com', customerHash, 'customer', '+18005550123');

// Banners
const insertBanner = db.prepare(`
  INSERT INTO banners (title, subtitle, button_text, button_link, image_url, display_order, is_active)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`);

insertBanner.run('NEW ARRIVALS 2026', 'Fresh minimal styles engineered for effortless everyday confidence.', 'EXPLORE MEN', '/men', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80', 1);
insertBanner.run('WOMEN\'S ESSENTIALS', 'Clean silhouettes, premium organic fabrics, effortless elegance.', 'EXPLORE WOMEN', '/women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80', 2);
insertBanner.run('LIMITED TIME DISCOUNTS', 'Use code GRABB10 for an instant 10% OFF on all new drop orders.', 'SHOP SPECIAL OFFERS', '/offers', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80', 3);

// Coupons
const insertCoupon = db.prepare(`
  INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, usage_limit, times_used, is_active)
  VALUES (?, ?, ?, ?, ?, 0, 1)
`);

insertCoupon.run('GRABB10', 'percentage', 10, 0, 500);
insertCoupon.run('WELCOME20', 'fixed', 20, 60, 100);
insertCoupon.run('FASHION15', 'percentage', 15, 40, 250);

// Categories
const insertCategory = db.prepare(`
  INSERT INTO categories (name, slug, gender, image_url, display_order, is_active)
  VALUES (?, ?, ?, ?, ?, 1)
`);

const menTshirt = insertCategory.run('T-Shirts', 'men-t-shirts', 'men', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 1).lastInsertRowid;
const menShirt = insertCategory.run('Shirts', 'men-shirts', 'men', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', 2).lastInsertRowid;
const menJeans = insertCategory.run('Jeans', 'men-jeans', 'men', 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop&q=80', 3).lastInsertRowid;
const menPants = insertCategory.run('Pants', 'men-pants', 'men', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', 4).lastInsertRowid;
const menJoggers = insertCategory.run('Joggers', 'men-joggers', 'men', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', 5).lastInsertRowid;
const menLinen = insertCategory.run('Linen', 'men-linen', 'men', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', 6).lastInsertRowid;
const menOuterwear = insertCategory.run('Outerwear', 'men-outerwear', 'men', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80', 7).lastInsertRowid;

const womenTshirt = insertCategory.run('T-Shirts', 'women-t-shirts', 'women', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', 1).lastInsertRowid;
const womenShirt = insertCategory.run('Shirts', 'women-shirts', 'women', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80', 2).lastInsertRowid;
const womenJeans = insertCategory.run('Jeans', 'women-jeans', 'women', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', 3).lastInsertRowid;
const womenTops = insertCategory.run('Tops', 'women-tops', 'women', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80', 4).lastInsertRowid;
const womenShorts = insertCategory.run('Shorts', 'women-shorts', 'women', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', 5).lastInsertRowid;

console.log('Seeding completed successfully!');
