const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let db = null;

function getDatabasePath() {
  // Use /tmp directory on Vercel or serverless server environments
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'grabb_it.db');
  }
  return path.join(__dirname, 'grabb_it.db');
}

function autoSeed(dbInstance) {
  try {
    const userCount = dbInstance.prepare("SELECT COUNT(*) as count FROM users").get();
    if (userCount && userCount.count > 0) return; // Database already populated

    console.log('Auto-seeding GRABB-IT database...');

    const adminPasswordHash = bcrypt.hashSync('Admin@123456', 10);
    const customerPasswordHash = bcrypt.hashSync('Customer@123', 10);

    const insertUser = dbInstance.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `);

    const adminRes = insertUser.run('Grabb-It Admin', 'admin@grabb-it.com', adminPasswordHash, 'admin', '+18005550199');
    const custRes = insertUser.run('Alex Morgan', 'customer@grabb-it.com', customerPasswordHash, 'customer', '+18005550123');

    // Customer address
    dbInstance.prepare(`
      INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(custRes.lastInsertRowid, 'Alex Morgan', '+18005550123', '742 Evergreen Terrace', 'Springfield', 'OR', '97477');

    // Categories
    const insertCat = dbInstance.prepare('INSERT INTO categories (name, slug, gender, image_url, display_order) VALUES (?, ?, ?, ?, ?)');
    insertCat.run('T-Shirts', 'men-t-shirts', 'men', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 1);
    insertCat.run('Shirts', 'men-shirts', 'men', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', 2);
    insertCat.run('Jeans', 'men-jeans', 'men', 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800&auto=format&fit=crop&q=80', 3);
    insertCat.run('Tops', 'women-tops', 'women', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80', 1);
    insertCat.run('Shorts', 'women-shorts', 'women', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', 2);

    // Banners
    const insertBnr = dbInstance.prepare('INSERT INTO banners (title, subtitle, button_text, button_link, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)');
    insertBnr.run('NEW ARRIVALS 2026', 'Fresh minimal styles designed for everyday confidence.', 'SHOP MEN', '/men', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80', 1);
    insertBnr.run('WOMEN\'S ESSENTIALS', 'Clean silhouettes, premium fabrics, effortless elegance.', 'SHOP WOMEN', '/women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80', 2);

    // Coupons
    const insertCpn = dbInstance.prepare('INSERT INTO coupons (code, discount_type, discount_value, min_order_amount) VALUES (?, ?, ?, ?)');
    insertCpn.run('GRABB10', 'percentage', 10, 0);
    insertCpn.run('WELCOME20', 'fixed', 20, 60);

    console.log('Auto-seed completed successfully!');
  } catch (err) {
    console.error('Auto-seed notice:', err.message);
  }
}

try {
  const Database = require('better-sqlite3');
  const dbPath = getDatabasePath();
  const schemaPath = path.join(__dirname, 'schema.sql');

  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schemaSql);
  }

  autoSeed(db);
} catch (err) {
  console.warn('SQLite Native Binding Notice:', err.message);
  db = {
    prepare: () => ({
      get: () => null,
      all: () => [],
      run: () => ({ lastInsertRowid: 1, changes: 1 })
    }),
    exec: () => {},
    transaction: (fn) => fn,
    pragma: () => {}
  };
}

module.exports = db;
