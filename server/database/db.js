const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let db = null;

// Initial In-Memory Fallback Store for Vercel/Serverless environments where native C++ SQLite binaries are prohibited
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Grabb-It Admin',
      email: 'admin@grabb-it.com',
      password_hash: bcrypt.hashSync('Admin@123456', 10),
      role: 'admin',
      phone: '+18005550199',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Alex Morgan',
      email: 'customer@grabb-it.com',
      password_hash: bcrypt.hashSync('Customer@123', 10),
      role: 'customer',
      phone: '+18005550123',
      created_at: new Date().toISOString()
    }
  ],
  addresses: [
    {
      id: 1,
      user_id: 2,
      full_name: 'Alex Morgan',
      phone: '+18005550123',
      address_line: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      pincode: '97477',
      is_default: 1
    }
  ],
  categories: [
    { id: 1, name: 'T-Shirts', slug: 'men-t-shirts', gender: 'men', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', display_order: 1, is_active: 1 },
    { id: 2, name: 'Shirts', slug: 'men-shirts', gender: 'men', image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', display_order: 2, is_active: 1 },
    { id: 3, name: 'Jeans', slug: 'men-jeans', gender: 'men', image_url: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop&q=80', display_order: 3, is_active: 1 },
    { id: 4, name: 'Pants', slug: 'men-pants', gender: 'men', image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', display_order: 4, is_active: 1 },
    { id: 5, name: 'Joggers', slug: 'men-joggers', gender: 'men', image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', display_order: 5, is_active: 1 },
    { id: 6, name: 'Linen', slug: 'men-linen', gender: 'men', image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', display_order: 6, is_active: 1 },
    { id: 7, name: 'Outerwear', slug: 'men-outerwear', gender: 'men', image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80', display_order: 7, is_active: 1 },
    { id: 8, name: 'T-Shirts', slug: 'women-t-shirts', gender: 'women', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', display_order: 1, is_active: 1 },
    { id: 9, name: 'Shirts', slug: 'women-shirts', gender: 'women', image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80', display_order: 2, is_active: 1 },
    { id: 10, name: 'Jeans', slug: 'women-jeans', gender: 'women', image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', display_order: 3, is_active: 1 },
    { id: 11, name: 'Tops', slug: 'women-tops', gender: 'women', image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80', display_order: 4, is_active: 1 },
    { id: 12, name: 'Shorts', slug: 'women-shorts', gender: 'women', image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', display_order: 5, is_active: 1 }
  ],
  banners: [
    { id: 1, title: 'NEW ARRIVALS 2026', subtitle: 'Fresh minimal styles designed for everyday confidence.', button_text: 'SHOP NOW', button_link: '/men', image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80', display_order: 1, is_active: 1 },
    { id: 2, title: 'WOMEN\'S ESSENTIALS', subtitle: 'Clean silhouettes, premium fabrics, effortless elegance.', button_text: 'SHOP WOMEN', button_link: '/women', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80', display_order: 2, is_active: 1 }
  ],
  coupons: [
    { id: 1, code: 'GRABB10', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, usage_limit: 500, times_used: 0, is_active: 1 },
    { id: 2, code: 'WELCOME20', discount_type: 'fixed', discount_value: 20, min_order_amount: 60, usage_limit: 100, times_used: 0, is_active: 1 }
  ],
  products: [
    {
      id: 1,
      name: 'Essential Oversized Heavyweight Tee',
      slug: 'men-essential-oversized-heavyweight-tee',
      description: 'Crafted from 240 GSM organic combed cotton, this boxy oversized t-shirt offers structure and breathability.',
      gender: 'men',
      category_id: 1,
      price: 39.99,
      sale_price: 29.99,
      sku: 'GRB-M-TSH-001',
      rating: 4.8,
      review_count: 42,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Minimalist Relaxed Cuban Collar Shirt',
      slug: 'men-minimalist-relaxed-cuban-collar-shirt',
      description: 'Airy cotton-blend woven shirt with a retro camp collar. Designed for warm weekend breezes.',
      gender: 'men',
      category_id: 2,
      price: 59.99,
      sale_price: 49.99,
      sku: 'GRB-M-SHR-002',
      rating: 4.6,
      review_count: 28,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Japanese Selvedge Tapered Fit Jeans',
      slug: 'men-japanese-selvedge-tapered-fit-jeans',
      description: '13.5 oz indigo raw denim cut in a modern relaxed-taper silhouette.',
      gender: 'men',
      category_id: 3,
      price: 89.99,
      sale_price: 74.99,
      sku: 'GRB-M-JNS-003',
      rating: 4.9,
      review_count: 64,
      is_new: 0,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Organic Slub Cotton Crewneck Tee',
      slug: 'women-organic-slub-cotton-crewneck-tee',
      description: 'Super-soft lightweight organic cotton jersey with subtle slub texture.',
      gender: 'women',
      category_id: 8,
      price: 34.99,
      sale_price: 24.99,
      sku: 'GRB-W-TSH-008',
      rating: 4.8,
      review_count: 31,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 4,
      created_at: new Date().toISOString()
    }
  ],
  product_variants: [
    { id: 1, product_id: 1, size: 'S', color: 'Black', color_hex: '#111111', stock: 15 },
    { id: 2, product_id: 1, size: 'M', color: 'Black', color_hex: '#111111', stock: 20 },
    { id: 3, product_id: 1, size: 'L', color: 'Black', color_hex: '#111111', stock: 10 },
    { id: 4, product_id: 2, size: 'M', color: 'Beige', color_hex: '#F5F5DC', stock: 12 },
    { id: 5, product_id: 3, size: 'L', color: 'Dark Indigo', color_hex: '#1C2833', stock: 18 },
    { id: 6, product_id: 4, size: 'S', color: 'White', color_hex: '#FFFFFF', stock: 25 }
  ],
  product_images: [
    { id: 1, product_id: 1, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 2, product_id: 2, image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 3, product_id: 3, image_url: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 4, product_id: 4, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 }
  ],
  carts: [],
  cart_items: [],
  wishlists: [],
  orders: [],
  order_items: [],
  reviews: []
};

// Try initializing Native SQLite (for local environment)
try {
  if (!process.env.VERCEL) {
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, 'grabb_it.db');
    const schemaPath = path.join(__dirname, 'schema.sql');

    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      db.exec(schemaSql);
    }
  }
} catch (err) {
  console.warn('Using Pure JavaScript Data Engine (Vercel Serverless Mode)');
}

// Fallback Memory Data Query Helper if db is null
if (!db) {
  db = {
    prepare: (sqlQuery) => {
      const sql = sqlQuery.trim();

      return {
        get: (...params) => {
          // Users
          if (sql.includes('FROM users WHERE email = ?')) {
            const email = params[0];
            return memoryStore.users.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
          }
          if (sql.includes('FROM users WHERE id = ?')) {
            return memoryStore.users.find(u => u.id === Number(params[0])) || null;
          }
          if (sql.includes('COUNT(*) as count FROM users')) {
            return { count: memoryStore.users.length };
          }

          // Products
          if (sql.includes('FROM products WHERE (slug = ? OR id = ?)')) {
            return memoryStore.products.find(p => p.slug === params[0] || p.id === Number(params[0])) || null;
          }
          if (sql.includes('COUNT(*) as count FROM products')) {
            return { count: memoryStore.products.length };
          }
          if (sql.includes('COUNT(*) as count FROM product_variants WHERE stock <= 5')) {
            return { count: memoryStore.product_variants.filter(v => v.stock <= 5).length };
          }
          if (sql.includes('COUNT(*) as count FROM banners')) {
            return { count: memoryStore.banners.filter(b => b.is_active === 1).length };
          }
          if (sql.includes('COUNT(*) as count FROM orders')) {
            return { count: memoryStore.orders.length };
          }
          if (sql.includes('SUM(total_amount) as total FROM orders')) {
            const sum = memoryStore.orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
            return { total: sum };
          }

          // Categories
          if (sql.includes('FROM categories WHERE id = ?')) {
            return memoryStore.categories.find(c => c.id === Number(params[0])) || null;
          }
          if (sql.includes('COUNT(*) as count FROM products WHERE category_id = ?')) {
            return { count: memoryStore.products.filter(p => p.category_id === Number(params[0])).length };
          }

          // Carts & Wishlists
          if (sql.includes('FROM carts WHERE user_id = ?')) {
            return memoryStore.carts.find(c => c.user_id === Number(params[0])) || null;
          }
          if (sql.includes('FROM carts WHERE session_id = ?')) {
            return memoryStore.carts.find(c => c.session_id === params[0]) || null;
          }
          if (sql.includes('FROM coupons WHERE UPPER(code) = ?')) {
            return memoryStore.coupons.find(c => c.code.toUpperCase() === String(params[0]).toUpperCase()) || null;
          }
          if (sql.includes('FROM product_variants WHERE id = ?')) {
            return memoryStore.product_variants.find(v => v.id === Number(params[0])) || null;
          }

          return null;
        },

        all: (...params) => {
          // Banners
          if (sql.includes('FROM banners')) {
            return memoryStore.banners.filter(b => b.is_active === 1);
          }

          // Categories
          if (sql.includes('FROM categories')) {
            let result = [...memoryStore.categories];
            if (params.length && (params[0] === 'men' || params[0] === 'women')) {
              result = result.filter(c => c.gender === params[0]);
            }
            return result;
          }

          // Products
          if (sql.includes('FROM products')) {
            let list = [...memoryStore.products];
            if (sql.includes('LOWER(p.gender) = ?') || sql.includes('gender = ?')) {
              const genderParam = params.find(p => p === 'men' || p === 'women');
              if (genderParam) list = list.filter(p => p.gender === genderParam);
            }
            if (sql.includes('is_new = 1')) list = list.filter(p => p.is_new === 1);
            if (sql.includes('is_trending = 1')) list = list.filter(p => p.is_trending === 1);
            if (sql.includes('is_featured = 1')) list = list.filter(p => p.is_featured === 1);
            return list;
          }

          // Product Images
          if (sql.includes('FROM product_images')) {
            const pId = Number(params[0]);
            return memoryStore.product_images.filter(img => img.product_id === pId);
          }

          // Product Variants
          if (sql.includes('FROM product_variants')) {
            const pId = Number(params[0]);
            return memoryStore.product_variants.filter(v => v.product_id === pId);
          }

          // Addresses
          if (sql.includes('FROM addresses')) {
            return memoryStore.addresses.filter(a => a.user_id === Number(params[0]));
          }

          // Orders & Customers
          if (sql.includes('FROM orders')) {
            return memoryStore.orders;
          }
          if (sql.includes('FROM users WHERE role = \'customer\'')) {
            return memoryStore.users.filter(u => u.role === 'customer');
          }
          if (sql.includes('FROM coupons')) {
            return memoryStore.coupons;
          }

          return [];
        },

        run: (...params) => {
          const newId = Date.now();
          if (sql.includes('INSERT INTO users')) {
            const [name, email, password_hash, role, phone] = params;
            memoryStore.users.push({ id: newId, name, email, password_hash, role: role || 'customer', phone });
          }
          if (sql.includes('INSERT INTO orders')) {
            memoryStore.orders.push({ id: newId, order_number: params[0], customer_name: params[2], email: params[3], total_amount: params[9], order_status: 'Confirmed', created_at: new Date().toISOString() });
          }
          return { lastInsertRowid: newId, changes: 1 };
        }
      };
    },
    exec: () => {},
    transaction: (fn) => fn,
    pragma: () => {}
  };
}

module.exports = db;
