const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let db = null;

// Rich In-Memory Data Store for Vercel/Serverless & Local Environments
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
    {
      id: 1,
      title: 'NEW ARRIVALS 2026',
      subtitle: 'Fresh minimal styles engineered for effortless everyday confidence.',
      button_text: 'EXPLORE MEN',
      button_link: '/men',
      image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
      display_order: 1,
      is_active: 1
    },
    {
      id: 2,
      title: 'WOMEN\'S ESSENTIALS',
      subtitle: 'Clean silhouettes, premium organic fabrics, effortless elegance.',
      button_text: 'EXPLORE WOMEN',
      button_link: '/women',
      image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80',
      display_order: 2,
      is_active: 1
    },
    {
      id: 3,
      title: 'LIMITED TIME DISCOUNTS',
      subtitle: 'Use code GRABB10 for an instant 10% OFF on all new drop orders.',
      button_text: 'SHOP SPECIAL OFFERS',
      button_link: '/offers',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
      display_order: 3,
      is_active: 1
    }
  ],
  coupons: [
    { id: 1, code: 'GRABB10', discount_type: 'percentage', discount_value: 10, min_order_amount: 0, usage_limit: 500, times_used: 0, is_active: 1 },
    { id: 2, code: 'WELCOME20', discount_type: 'fixed', discount_value: 20, min_order_amount: 60, usage_limit: 100, times_used: 0, is_active: 1 },
    { id: 3, code: 'FASHION15', discount_type: 'percentage', discount_value: 15, min_order_amount: 40, usage_limit: 250, times_used: 0, is_active: 1 }
  ],
  products: [
    {
      id: 1,
      name: 'Essential Oversized Heavyweight Tee',
      slug: 'men-essential-oversized-heavyweight-tee',
      description: 'Crafted from 240 GSM organic combed cotton, this boxy oversized t-shirt offers structure and breathability for everyday wear.',
      gender: 'men',
      category_id: 1,
      price: 39.99,
      sale_price: 29.99,
      sku: 'GRB-M-TSH-001',
      rating: 4.9,
      review_count: 48,
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
      description: 'Airy cotton-blend woven shirt with a retro camp collar. Designed for warm breezes and elevated casual vibes.',
      gender: 'men',
      category_id: 2,
      price: 59.99,
      sale_price: 49.99,
      sku: 'GRB-M-SHR-002',
      rating: 4.7,
      review_count: 32,
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
      description: '13.5 oz raw indigo selvedge denim cut in a modern relaxed-taper silhouette with custom copper hardware.',
      gender: 'men',
      category_id: 3,
      price: 89.99,
      sale_price: 74.99,
      sku: 'GRB-M-JNS-003',
      rating: 4.9,
      review_count: 76,
      is_new: 0,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Structured Pleated Smart Trousers',
      slug: 'men-structured-pleated-smart-trousers',
      description: 'Tailored smart trousers featuring front pleats, hidden elastic waistband, and a crisp cropped hem.',
      gender: 'men',
      category_id: 4,
      price: 69.99,
      sale_price: 59.99,
      sku: 'GRB-M-PNT-004',
      rating: 4.6,
      review_count: 24,
      is_new: 1,
      is_trending: 0,
      is_featured: 1,
      is_active: 1,
      display_order: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Urban Tech Fleece Tapered Joggers',
      slug: 'men-urban-tech-fleece-tapered-joggers',
      description: 'Double-knit stretch fleece with zip utility pockets and cuffed ankles for street smart comfort.',
      gender: 'men',
      category_id: 5,
      price: 54.99,
      sale_price: 44.99,
      sku: 'GRB-M-JOG-005',
      rating: 4.8,
      review_count: 51,
      is_new: 0,
      is_trending: 1,
      is_featured: 0,
      is_active: 1,
      display_order: 5,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'French Linen Casual Button-Down Shirt',
      slug: 'men-french-linen-casual-button-down-shirt',
      description: '100% pure French flax linen garment-washed for ultra softness. Naturally cooling and breathable.',
      gender: 'men',
      category_id: 6,
      price: 64.99,
      sale_price: 54.99,
      sku: 'GRB-M-LIN-006',
      rating: 4.7,
      review_count: 19,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 6,
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      name: 'Heavyweight Canvas Utility Overshirt',
      slug: 'men-heavyweight-canvas-utility-overshirt',
      description: 'Durable cotton duck canvas jacket with chest cargo pockets and matte metal snap buttons.',
      gender: 'men',
      category_id: 7,
      price: 99.99,
      sale_price: 84.99,
      sku: 'GRB-M-OUT-007',
      rating: 4.9,
      review_count: 38,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 7,
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      name: 'Minimal Vintage Wash Graphic Tee',
      slug: 'men-minimal-vintage-wash-graphic-tee',
      description: 'Acid-washed 210 GSM cotton with minimal back typographic accent.',
      gender: 'men',
      category_id: 1,
      price: 34.99,
      sale_price: 26.99,
      sku: 'GRB-M-TSH-008',
      rating: 4.5,
      review_count: 15,
      is_new: 1,
      is_trending: 0,
      is_featured: 0,
      is_active: 1,
      display_order: 8,
      created_at: new Date().toISOString()
    },
    {
      id: 9,
      name: 'Organic Slub Cotton Crewneck Tee',
      slug: 'women-organic-slub-cotton-crewneck-tee',
      description: 'Super-soft lightweight organic cotton jersey featuring a subtle slub texture and relaxed drape.',
      gender: 'women',
      category_id: 8,
      price: 34.99,
      sale_price: 24.99,
      sku: 'GRB-W-TSH-009',
      rating: 4.8,
      review_count: 41,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 9,
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      name: 'Silky Satin Wrap Button Shirt',
      slug: 'women-silky-satin-wrap-button-shirt',
      description: 'Lustrous drape satin shirt with front shell buttons and pointed collar. Perfect for work or evenings out.',
      gender: 'women',
      category_id: 9,
      price: 59.99,
      sale_price: 49.99,
      sku: 'GRB-W-SHR-010',
      rating: 4.7,
      review_count: 29,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 10,
      created_at: new Date().toISOString()
    },
    {
      id: 11,
      name: 'High-Waisted Straight Leg Ankle Jeans',
      slug: 'women-high-waisted-straight-leg-ankle-jeans',
      description: 'Classic 90s vintage wash rigid denim featuring a flattering high rise and clean cropped hem.',
      gender: 'women',
      category_id: 10,
      price: 79.99,
      sale_price: 64.99,
      sku: 'GRB-W-JNS-011',
      rating: 4.9,
      review_count: 82,
      is_new: 0,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 11,
      created_at: new Date().toISOString()
    },
    {
      id: 12,
      name: 'Ribbed Knit Cropped Halter Top',
      slug: 'women-ribbed-knit-cropped-halter-top',
      description: 'Form-fitting ribbed stretch viscose top with clean halter neckline and subtle side vents.',
      gender: 'women',
      category_id: 11,
      price: 29.99,
      sale_price: 21.99,
      sku: 'GRB-W-TOP-012',
      rating: 4.6,
      review_count: 18,
      is_new: 1,
      is_trending: 1,
      is_featured: 0,
      is_active: 1,
      display_order: 12,
      created_at: new Date().toISOString()
    },
    {
      id: 13,
      name: 'High-Rise Tailored Linen Shorts',
      slug: 'women-high-rise-tailored-linen-shorts',
      description: 'Structured high-waist shorts crafted from breathable linen-blend with deep side slant pockets.',
      gender: 'women',
      category_id: 12,
      price: 44.99,
      sale_price: 34.99,
      sku: 'GRB-W-SHO-013',
      rating: 4.7,
      review_count: 22,
      is_new: 1,
      is_trending: 0,
      is_featured: 1,
      is_active: 1,
      display_order: 13,
      created_at: new Date().toISOString()
    },
    {
      id: 14,
      name: 'Oversized Vintage Denim Trucker Jacket',
      slug: 'women-oversized-vintage-denim-trucker-jacket',
      description: 'Classic medium wash denim trucker jacket with drop shoulders and metal shank button hardware.',
      gender: 'women',
      category_id: 11,
      price: 89.99,
      sale_price: 74.99,
      sku: 'GRB-W-JKT-014',
      rating: 4.8,
      review_count: 45,
      is_new: 0,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 14,
      created_at: new Date().toISOString()
    },
    {
      id: 15,
      name: 'Relaxed Fit Linen Blend Trousers',
      slug: 'women-relaxed-fit-linen-blend-trousers',
      description: 'Wide-leg casual linen-cotton trousers with elasticated drawstring waist for effortless summer lounging.',
      gender: 'women',
      category_id: 11,
      price: 64.99,
      sale_price: 49.99,
      sku: 'GRB-W-TRS-015',
      rating: 4.7,
      review_count: 36,
      is_new: 1,
      is_trending: 1,
      is_featured: 1,
      is_active: 1,
      display_order: 15,
      created_at: new Date().toISOString()
    }
  ],
  product_variants: [
    { id: 1, product_id: 1, size: 'S', color: 'Black', color_hex: '#111111', stock: 15 },
    { id: 2, product_id: 1, size: 'M', color: 'Black', color_hex: '#111111', stock: 20 },
    { id: 3, product_id: 1, size: 'L', color: 'Black', color_hex: '#111111', stock: 10 },
    { id: 4, product_id: 2, size: 'M', color: 'Beige', color_hex: '#F5F5DC', stock: 12 },
    { id: 5, product_id: 2, size: 'L', color: 'Olive', color_hex: '#556B2F', stock: 15 },
    { id: 6, product_id: 3, size: 'M', color: 'Dark Indigo', color_hex: '#1C2833', stock: 18 },
    { id: 7, product_id: 4, size: 'L', color: 'Charcoal', color_hex: '#36454F', stock: 14 },
    { id: 8, product_id: 5, size: 'M', color: 'Heather Grey', color_hex: '#808080', stock: 25 },
    { id: 9, product_id: 6, size: 'M', color: 'White', color_hex: '#FFFFFF', stock: 16 },
    { id: 10, product_id: 7, size: 'L', color: 'Khaki', color_hex: '#C3B091', stock: 10 },
    { id: 11, product_id: 8, size: 'M', color: 'Vintage Black', color_hex: '#222222', stock: 12 },
    { id: 12, product_id: 9, size: 'S', color: 'White', color_hex: '#FFFFFF', stock: 25 },
    { id: 13, product_id: 10, size: 'S', color: 'Champagne', color_hex: '#F7E7CE', stock: 14 },
    { id: 14, product_id: 11, size: 'M', color: 'Light Wash Denim', color_hex: '#87CEEB', stock: 20 },
    { id: 15, product_id: 12, size: 'S', color: 'Black', color_hex: '#111111', stock: 18 },
    { id: 16, product_id: 13, size: 'S', color: 'Sand', color_hex: '#C2B280', stock: 15 },
    { id: 17, product_id: 14, size: 'M', color: 'Classic Blue', color_hex: '#1E3F66', stock: 12 },
    { id: 18, product_id: 15, size: 'M', color: 'Off-White', color_hex: '#FAF0E6', stock: 19 }
  ],
  product_images: [
    { id: 1, product_id: 1, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 2, product_id: 2, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 3, product_id: 3, image_url: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 4, product_id: 4, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 5, product_id: 5, image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 6, product_id: 6, image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 7, product_id: 7, image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 8, product_id: 8, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 9, product_id: 9, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 10, product_id: 10, image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 11, product_id: 11, image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 12, product_id: 12, image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 13, product_id: 13, image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 14, product_id: 14, image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 },
    { id: 15, product_id: 15, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80', is_primary: 1, display_order: 1 }
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
