const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
const nodemailer = require('nodemailer'); 

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Create a database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'symond',           
  password: 'admin123', 
  database: 'galaxy_candiesdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// ==========================================
// GLOBAL CONFIGURATIONS
// ==========================================

const PAYMONGO_SECRET_KEY = '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'galaxycandies123@gmail.com',         
    pass: 'bwfmhgohepksptxd', 
  },
});

async function logAudit(userName, moduleName, actionType, recordRef, details) {
  try {
    const now = new Date();
    const localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    await pool.execute(
      'INSERT INTO audit_logs (timestamp, user_name, module_name, action_type, record_ref, details) VALUES (?, ?, ?, ?, ?, ?)',
      [localTime, userName, moduleName, actionType, recordRef, details]
    );
  } catch (error) {
    console.error('Failed to write to audit log:', error);
  }
}

// ==========================================
// SYSTEM & DB SETUP ROUTES
// ==========================================

app.get('/api/db-check', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
    res.json({ success: true, message: 'Successfully connected to the MySQL database!', testResult: rows[0].solution });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to connect to the database.', error: error.message });
  }
});

app.get('/api/seed-bom', async (req, res) => {
  try {
    await pool.execute('DELETE FROM bill_of_materials');
    
    const boms = [
      ['BOM-001', 'FG-UBE-001', 'Ube Extract / Halaya', '50 g'],
      ['BOM-002', 'FG-UBE-001', 'Refined Sugar', '150 g'],
      ['BOM-003', 'FG-UBE-001', 'Powdered Milk', '200 g'],
      ['BOM-004', 'FG-UBE-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-005', 'FG-JWH-001', 'Refined Sugar', '250 g'],
      ['BOM-006', 'FG-JWH-001', 'Powdered Milk', '100 g'],
      ['BOM-007', 'FG-JWH-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-008', 'FG-TAM-001', 'Tamarind Pulp', '250 g'],
      ['BOM-009', 'FG-TAM-001', 'Refined Sugar', '100 g'],
      ['BOM-010', 'FG-TAM-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-011', 'FG-MPA-002', 'Powdered Milk', '500 g'],
      ['BOM-012', 'FG-MPA-002', 'Refined Sugar', '200 g'],
      ['BOM-013', 'FG-MPA-002', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-014', 'FG-BPP-001', 'Powdered Milk', '250 g'],
      ['BOM-015', 'FG-BPP-001', 'Pandan Extract', '50 ml'],
      ['BOM-016', 'FG-BPP-001', 'Refined Sugar', '150 g'],
      ['BOM-017', 'FG-BPP-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-018', 'FG-SPA-001', 'Powdered Milk', '250 g'],
      ['BOM-019', 'FG-SPA-001', 'Strawberry Extract', '50 ml'],
      ['BOM-020', 'FG-SPA-001', 'Refined Sugar', '150 g'],
      ['BOM-021', 'FG-SPA-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-022', 'FG-DDU-001', 'Cocoa Powder', '100 g'],
      ['BOM-023', 'FG-DDU-001', 'Peanuts', '0.05 kg'],
      ['BOM-024', 'FG-DDU-001', 'Powdered Milk', '150 g'],
      ['BOM-025', 'FG-DDU-001', 'Refined Sugar', '100 g'],
      ['BOM-026', 'FG-DDU-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-027', 'FG-PCH-001', 'Cheese Powder', '100 g'],
      ['BOM-028', 'FG-PCH-001', 'Pandan Extract', '50 ml'],
      ['BOM-029', 'FG-PCH-001', 'Refined Sugar', '150 g'],
      ['BOM-030', 'FG-PCH-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-031', 'FG-PBA-001', 'Powdered Milk', '200 g'],
      ['BOM-032', 'FG-PBA-001', 'Refined Sugar', '150 g'],
      ['BOM-033', 'FG-PBA-001', 'Butter', '0.05 kg'],
      ['BOM-034', 'FG-PBA-001', 'Individual Wrapper Film (Roll)', '0.05 rolls'],
      ['BOM-035', 'FG-MAC-001', 'Macapuno Strings', '150 g'],
      ['BOM-036', 'FG-MAC-001', 'Refined Sugar', '100 g'],
      ['BOM-037', 'FG-MAC-001', 'Powdered Milk', '100 g'],
      ['BOM-038', 'FG-MAC-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-039', 'FG-LAN-001', 'Langka Extract', '100 ml'],
      ['BOM-040', 'FG-LAN-001', 'Refined Sugar', '100 g'],
      ['BOM-041', 'FG-LAN-001', 'Powdered Milk', '100 g'],
      ['BOM-042', 'FG-LAN-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-043', 'FG-UTU-001', 'Ube Extract / Halaya', '150 g'],
      ['BOM-044', 'FG-UTU-001', 'Powdered Milk', '300 g'],
      ['BOM-045', 'FG-UTU-001', 'Plastic Candy Jar (500ml)', '1 pcs'],
      ['BOM-046', 'FG-WTU-001', 'Powdered Milk', '300 g'],
      ['BOM-047', 'FG-WTU-001', 'Refined Sugar', '150 g'],
      ['BOM-048', 'FG-WTU-001', 'Plastic Candy Jar (500ml)', '1 pcs'],
      ['BOM-049', 'FG-JRO-001', 'Powdered Milk', '300 g'],
      ['BOM-050', 'FG-JRO-001', 'Refined Sugar', '200 g'],
      ['BOM-051', 'FG-JRO-001', 'Individual Wrapper Film (Roll)', '0.1 rolls'],
      ['BOM-052', 'FG-MWH-001', 'Powdered Milk', '300 g'],
      ['BOM-053', 'FG-MWH-001', 'Refined Sugar', '150 g'],
      ['BOM-054', 'FG-MWH-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-055', 'FG-MPW-001', 'Powdered Milk', '300 g'],
      ['BOM-056', 'FG-MPW-001', 'Refined Sugar', '150 g'],
      ['BOM-057', 'FG-MPW-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-058', 'FG-ASB-001', 'Powdered Milk', '200 g'],
      ['BOM-059', 'FG-ASB-001', 'Refined Sugar', '100 g'],
      ['BOM-060', 'FG-ASB-001', 'Cocoa Powder', '20 g'],
      ['BOM-061', 'FG-ASB-001', 'Ube Extract / Halaya', '20 g'],
      ['BOM-062', 'FG-ASB-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-063', 'FG-JPA-001', 'Powdered Milk', '250 g'],
      ['BOM-064', 'FG-JPA-001', 'Refined Sugar', '150 g'],
      ['BOM-065', 'FG-JPA-001', 'Pandan Extract', '50 ml'],
      ['BOM-066', 'FG-JPA-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-067', 'FG-MYF-001', 'Powdered Milk', '250 g'],
      ['BOM-068', 'FG-MYF-001', 'Refined Sugar', '100 g'],
      ['BOM-069', 'FG-MYF-001', 'Butter', '0.02 kg'],
      ['BOM-070', 'FG-MYF-001', 'Plastic Candy Jar (500ml)', '1 pcs'],
      ['BOM-071', 'FG-NPA-001', 'Powdered Milk', '200 g'],
      ['BOM-072', 'FG-NPA-001', 'Refined Sugar', '150 g'],
      ['BOM-073', 'FG-NPA-001', 'Butter', '0.02 kg'],
      ['BOM-074', 'FG-NPA-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-075', 'FG-PUB-001', 'Powdered Milk', '200 g'],
      ['BOM-076', 'FG-PUB-001', 'Ube Extract / Halaya', '100 g'],
      ['BOM-077', 'FG-PUB-001', 'Refined Sugar', '100 g'],
      ['BOM-078', 'FG-PUB-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-079', 'FG-SUS-001', 'Powdered Milk', '150 g'],
      ['BOM-080', 'FG-SUS-001', 'Ube Extract / Halaya', '50 g'],
      ['BOM-081', 'FG-SUS-001', 'Refined Sugar', '100 g'],
      ['BOM-082', 'FG-SUS-001', 'Individual Wrapper Film (Roll)', '0.05 rolls'],
      ['BOM-083', 'FG-SWS-001', 'Powdered Milk', '200 g'],
      ['BOM-084', 'FG-SWS-001', 'Refined Sugar', '100 g'],
      ['BOM-085', 'FG-SWS-001', 'Individual Wrapper Film (Roll)', '0.05 rolls'],
      ['BOM-086', 'FG-TRO-001', 'Powdered Milk', '200 g'],
      ['BOM-087', 'FG-TRO-001', 'Cocoa Powder', '100 g'],
      ['BOM-088', 'FG-TRO-001', 'Refined Sugar', '100 g'],
      ['BOM-089', 'FG-TRO-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-090', 'FG-UBA-001', 'Powdered Milk', '200 g'],
      ['BOM-091', 'FG-UBA-001', 'Ube Extract / Halaya', '100 g'],
      ['BOM-092', 'FG-UBA-001', 'Refined Sugar', '100 g'],
      ['BOM-093', 'FG-UBA-001', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-094', 'FG-URO-001', 'Powdered Milk', '200 g'],
      ['BOM-095', 'FG-URO-001', 'Ube Extract / Halaya', '100 g'],
      ['BOM-096', 'FG-URO-001', 'Refined Sugar', '100 g'],
      ['BOM-097', 'FG-URO-001', 'Individual Wrapper Film (Roll)', '0.1 rolls'],
      ['BOM-098', 'FG-WBA-001', 'Powdered Milk', '250 g'],
      ['BOM-099', 'FG-WBA-001', 'Refined Sugar', '150 g'],
      ['BOM-100', 'FG-WBA-001', 'Clear Plastic Pouch (50g)', '1 pcs'],
      ['BOM-101', 'FG-UNK-008', 'Powdered Milk', '100 g'],
      ['BOM-102', 'FG-UNK-008', 'Refined Sugar', '50 g'],
      ['BOM-103', 'FG-UNK-008', 'Cocoa Powder', '20 g'],
      ['BOM-104', 'FG-UNK-008', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-105', 'FG-UNK-012', 'Powdered Milk', '150 g'],
      ['BOM-106', 'FG-UNK-012', 'Refined Sugar', '75 g'],
      ['BOM-107', 'FG-UNK-012', 'Cocoa Powder', '30 g'],
      ['BOM-108', 'FG-UNK-012', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-109', 'FG-UNK-013', 'Powdered Milk', '160 g'],
      ['BOM-110', 'FG-UNK-013', 'Refined Sugar', '80 g'],
      ['BOM-111', 'FG-UNK-013', 'Cocoa Powder', '30 g'],
      ['BOM-112', 'FG-UNK-013', 'Printed Plastic Pouch (100g)', '1 pcs'],
      ['BOM-113', 'FG-UNK-019', 'Powdered Milk', '250 g'],
      ['BOM-114', 'FG-UNK-019', 'Refined Sugar', '120 g'],
      ['BOM-115', 'FG-UNK-019', 'Cocoa Powder', '50 g'],
      ['BOM-116', 'FG-UNK-019', 'Printed Plastic Pouch (100g)', '1 pcs']
    ];

    for (let b of boms) {
      await pool.execute('INSERT INTO bill_of_materials (bom_id, product_sku, component_name, qty_required) VALUES (?, ?, ?, ?)', b);
    }
    res.json({ success: true, message: 'Comprehensive BOM seeded successfully for all Pastillas and Candies.' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/seed-products', async (req, res) => {
  const items = [
    { name: 'Galaxy Assorted (8)', sku: 'FG-UNK-008', price: 45.00, stock: 100, image: 'assets/products/8.jpg' },
    { name: 'Galaxy Assorted (12)', sku: 'FG-UNK-012', price: 45.00, stock: 100, image: 'assets/products/12.jpg' },
    { name: 'Galaxy Assorted (13)', sku: 'FG-UNK-013', price: 45.00, stock: 100, image: 'assets/products/13.jpg' },
    { name: 'Galaxy Assorted (19)', sku: 'FG-UNK-019', price: 45.00, stock: 100, image: 'assets/products/19.jpg' },
    { name: 'Assorted Bar', sku: 'FG-ASB-001', price: 50.00, stock: 120, image: 'assets/products/Assorted Bar.jpg' },
    { name: 'Buko Pandan Pastillas', sku: 'FG-BPP-001', price: 45.00, stock: 130, image: 'assets/products/Buko Pandan Pastillas.jpg' },
    { name: 'Double Dutch', sku: 'FG-DDU-001', price: 60.00, stock: 75, image: 'assets/products/Double Dutch.jpg' },
    { name: 'Jumbo Pandan', sku: 'FG-JPA-001', price: 40.00, stock: 150, image: 'assets/products/Jumbo Pandan.jpg' },
    { name: 'Jumbo Roll', sku: 'FG-JRO-001', price: 40.00, stock: 200, image: 'assets/products/Jumbo Roll.jpg' },
    { name: 'Jumbo White', sku: 'FG-JWH-001', price: 40.00, stock: 200, image: 'assets/products/Jumbo White.jpg' },
    { name: 'Langka', sku: 'FG-LAN-001', price: 45.00, stock: 140, image: 'assets/products/Langka.jpg' },
    { name: 'Macapuno', sku: 'FG-MAC-001', price: 45.00, stock: 110, image: 'assets/products/Macapuno.jpg' },
    { name: 'Mega Past', sku: 'FG-MPW-001', price: 45.00, stock: 85, image: 'assets/products/Mega Past.jpg' },
    { name: 'Mega Pastillas', sku: 'FG-MPA-002', price: 45.00, stock: 90, image: 'assets/products/Mega Pastillas.jpg' },
    { name: 'Mega White', sku: 'FG-MWH-001', price: 45.00, stock: 100, image: 'assets/products/Mega White.jpg' },
    { name: 'MilkyLicious Yema Filled', sku: 'FG-MYF-001', price: 150.00, stock: 40, image: 'assets/products/MilkyLicious Yema Filled.jpg' },
    { name: 'Nidora Pastillas', sku: 'FG-NPA-001', price: 55.00, stock: 60, image: 'assets/products/Nidora Pastillas.jpg' },
    { name: 'Pandan Cheese', sku: 'FG-PCH-001', price: 45.00, stock: 85, image: 'assets/products/Pandan Cheese.jpg' },
    { name: 'Pande Ube', sku: 'FG-PUB-001', price: 45.00, stock: 80, image: 'assets/products/Pande Ube.jpg' },
    { name: 'Pastillas Bar', sku: 'FG-PBA-001', price: 35.00, stock: 150, image: 'assets/products/Pastillas Bar.jpg' },
    { name: 'Strawberry Pastillas', sku: 'FG-SPA-001', price: 40.00, stock: 140, image: 'assets/products/Strawberry Pastillas.jpg' },
    { name: 'Sumo Ube Stick', sku: 'FG-SUS-001', price: 45.00, stock: 120, image: 'assets/products/Sumo Ube Stick.jpg' },
    { name: 'Sumo White Stick', sku: 'FG-SWS-001', price: 45.00, stock: 120, image: 'assets/products/Sumo White Stick.jpg' },
    { name: 'Twix Roll', sku: 'FG-TRO-001', price: 50.00, stock: 0, image: 'assets/products/Twix Roll.jpg' },
    { name: 'Ube Bar', sku: 'FG-UBA-001', price: 35.00, stock: 150, image: 'assets/products/Ube Bar.jpg' },
    { name: 'Ube Roll', sku: 'FG-URO-001', price: 40.00, stock: 100, image: 'assets/products/Ube Roll.jpg' },
    { name: 'Ube TUBbies', sku: 'FG-UTU-001', price: 120.00, stock: 50, image: 'assets/products/Ube TUBbies.jpg' },
    { name: 'White Balls', sku: 'FG-WBA-001', price: 35.00, stock: 180, image: 'assets/products/White Balls.jpg' },
    { name: 'White TUBbies', sku: 'FG-WTU-001', price: 120.00, stock: 45, image: 'assets/products/White TUBbies.jpg' },
    { name: 'Tamarind Candy', sku: 'FG-TAM-001', price: 15.00, stock: 12, image: 'assets/products/tamarind.jpg' }
  ];

  try {
    await pool.execute("DELETE FROM pos_catalog WHERE sku LIKE '%MAN%' OR name LIKE '%Mango%'");
    await pool.execute("DELETE FROM warehouse_stock WHERE sku LIKE '%MAN%' OR name LIKE '%Mango%'");
    
    await pool.execute('ALTER TABLE pos_catalog MODIFY image_url LONGTEXT');

    for (let item of items) {
      await pool.execute(
        `INSERT INTO warehouse_stock (sku, name, category, qty, uom, min_reorder_level, max_capacity) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE name = VALUES(name), qty = VALUES(qty)`,
        [item.sku, item.name, 'FINISHED_GOOD', item.stock, 'packs', 50, 500]
      );
      
      await pool.execute(
        `INSERT INTO pos_catalog (sku, name, price, image_url, is_out_of_stock) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), image_url = VALUES(image_url)`,
        [item.sku, item.name, item.price, item.image, item.stock <= 0 ? 1 : 0]
      );
    }
    res.json({ success: true, message: 'All POS products fully synchronized!' });
  } catch (e) { 
    res.status(500).json({ success: false, error: e.message }); 
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [stockRes] = await pool.execute("SELECT SUM(qty) as totalStock FROM warehouse_stock WHERE category = 'FINISHED_GOOD'");
    const [qaRes] = await pool.execute("SELECT COUNT(*) as pendingQA FROM qa_inspections WHERE status != 'CLEARED'");
    const [deliveryRes] = await pool.execute("SELECT COUNT(*) as activeRoutes FROM delivery_routes WHERE route_status != 'DELIVERED'");
    
    const [yieldRes] = await pool.execute("SELECT qty FROM warehouse_stock WHERE name LIKE '%Pouch%' LIMIT 1");
    const [salesRes] = await pool.execute("SELECT SUM(amount) as totalSales FROM sales_invoices");
    
    const [bestSeller] = await pool.execute(`
      SELECT p.name, p.image_url, w.qty as inStock 
      FROM pos_catalog p 
      JOIN warehouse_stock w ON p.sku = w.sku 
      ORDER BY w.qty DESC LIMIT 1
    `);

    const [events] = await pool.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 6");
    const [employees] = await pool.execute("SELECT full_name as name FROM users LIMIT 3");

    res.json({
      sellableStock: parseInt(stockRes[0]?.totalStock) || 0,
      pendingQA: qaRes[0]?.pendingQA || 0,
      activeDeliveries: deliveryRes[0]?.activeRoutes || 0,
      currentYield: yieldRes.length > 0 ? parseInt(yieldRes[0].qty) : 0,
      totalSales: parseFloat(salesRes[0]?.totalSales) || 0,
      bestSeller: bestSeller.length > 0 ? bestSeller[0] : { name: 'Unknown', inStock: 0 },
      recentEvents: events,
      employees: employees
    });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ==========================================
// GET ROUTES
// ==========================================

app.get('/api/warehouse-stock', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM warehouse_stock'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/sales-orders', async (req, res) => {
  try { 
    const [rows] = await pool.execute('SELECT * FROM sales_orders ORDER BY order_id DESC'); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/stock-movements', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM stock_movements ORDER BY timestamp DESC'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

// DELIVERIES & E-POD - UPDATED WITH JOIN
app.get('/api/delivery-routes', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT d.*, e.photo_url, e.signature_url, e.received_by as epod_received_by, e.delivery_time 
      FROM delivery_routes d
      LEFT JOIN epod_records e ON d.route_id = e.dr_number
      ORDER BY d.created_at DESC
    `); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/fleet-vehicles', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM fleet_vehicles'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/epod-records', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM epod_records'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/suppliers', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM suppliers'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/purchase-orders', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT 
        p.*,
        REPLACE(p.po_number, 'PO', 'BAT') as batch_code,
        (SELECT DATE_FORMAT(timestamp, '%M %d, %Y %h:%i %p') FROM audit_logs WHERE record_ref = p.po_number AND action_type = 'CREATE' LIMIT 1) as exact_date
      FROM purchase_orders p
      ORDER BY p.po_number DESC
    `);
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/goods-receipts', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        g.grn_number, 
        g.po_number, 
        g.received_by, 
        CASE 
          WHEN g.status = 'Quarantined' THEN
            COALESCE(
              (SELECT CASE 
                        WHEN disposition_status = 'RETURN' THEN 'Returned to Vendor'
                        WHEN disposition_status = 'SCRAP' THEN 'Scrapped'
                        WHEN disposition_status = 'REWORK' THEN 'Reworked'
                        ELSE 'Quarantined (Hold)'
                      END 
               FROM qa_defects_quarantine 
               WHERE batch_id = REPLACE(g.po_number, 'PO', 'BAT') 
               ORDER BY report_id DESC LIMIT 1),
              g.status
            )
          ELSE g.status
        END as routing_status,
        DATE_FORMAT(g.created_at, '%b %d, %Y %h:%i %p') as timestamp,
        s.name as supplier_name, 
        p.material_desc, 
        p.qty,
        REPLACE(g.po_number, 'PO', 'BAT') AS batch_code,
        (SELECT DATE_FORMAT(timestamp, '%M %d, %Y %h:%i %p') FROM audit_logs WHERE record_ref = g.po_number AND action_type = 'CREATE' LIMIT 1) as exact_date
      FROM goods_receipt_notes g
      JOIN purchase_orders p ON g.po_number = p.po_number
      JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY g.created_at DESC
    `);
    res.json(rows);
  } catch (error) { res.status(500).json({ success: false }); }
});

// QA Data Endpoints
app.get('/api/qa-inspections', async (req, res) => {
  try { 
    const [rows] = await pool.execute('SELECT * FROM qa_inspections ORDER BY batch_id DESC'); 
    res.json(rows); 
  } catch (e) { 
    res.status(500).json({ success: false, error: e.message }); 
  }
});

app.get('/api/qa-defects', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT d.*, q.source_ref, q.item_name 
      FROM qa_defects_quarantine d
      LEFT JOIN qa_inspections q ON d.batch_id = q.batch_id
      ORDER BY d.report_id DESC
    `); 
    res.json(rows); 
  } catch (e) { 
    res.status(500).json({ success: false, error: e.message }); 
  }
});

app.get('/api/production-runs', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT 
        p.*,
        COALESCE(
          (SELECT c.name 
           FROM audit_logs a
           JOIN pending_orders po ON a.details LIKE CONCAT('%', po.token, '%')
           JOIN crm_clients c ON po.email = c.email
           WHERE a.record_ref = p.run_id LIMIT 1),
          (SELECT c.name 
           FROM pending_orders po 
           JOIN crm_clients c ON po.email = c.email 
           ORDER BY po.created_at DESC LIMIT 1),
          'Walk-in / Internal Stock'
        ) as customer_name
      FROM production_runs p 
      ORDER BY started_at DESC
    `); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ROUTE: UPDATE PRODUCTION RUNS
app.put('/api/production-runs/:id', async (req, res) => {
  const runId = req.params.id;
  const { status, actual, actual_units, userName } = req.body;
  const finalActual = actual || actual_units || null;

  try {
    if (status === 'COMPLETED') {
      await pool.execute('UPDATE production_runs SET status = ?, actual_units = ? WHERE run_id = ?', [status, finalActual, runId]);

      // Route the completed production run to QA
      const [runRows] = await pool.execute('SELECT bom_id FROM production_runs WHERE run_id = ?', [runId]);
      const bomId = runRows.length > 0 ? runRows[0].bom_id : 'Unknown Product';
      const batchId = runId.replace('PRN', 'BAT');

      await pool.execute(
        'INSERT INTO qa_inspections (batch_id, source_ref, item_name, received_qty, inspection_type, status) VALUES (?, ?, ?, ?, ?, ?)',
        [batchId, runId, bomId, finalActual + ' units', 'FINISHED_GOODS', 'PENDING CLEARANCE']
      );

      await logAudit(userName || 'Production Team', 'Production', 'UPDATE', runId, `Completed run ${runId} with yield ${finalActual}. Sent to QA.`);
      await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Production Completed', `Run ${runId} for ${bomId} is finished. Waiting for QA clearance.`, 'success']);

    } else {
      // Just update status to IN PROGRESS
      await pool.execute('UPDATE production_runs SET status = ? WHERE run_id = ?', [status, runId]);
      await logAudit(userName || 'Production Team', 'Production', 'UPDATE', runId, `Updated run status to ${status}`);
      
      const [runRows] = await pool.execute('SELECT bom_id FROM production_runs WHERE run_id = ?', [runId]);
      const bomId = runRows.length > 0 ? runRows[0].bom_id : 'Unknown Product';
      await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Production Started', `Run ${runId} for ${bomId} is now cooking on the floor.`, 'info']);
    }

    res.json({ success: true, message: 'Production run updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/pos-catalog', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM pos_catalog'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/sales-invoices', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT i.*, o.customer_name 
      FROM sales_invoices i 
      LEFT JOIN sales_orders o ON i.order_id = o.order_id 
      ORDER BY i.generated_at DESC
    `); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/audit-logs', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM audit_logs ORDER BY timestamp DESC'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/notifications', async (req, res) => {
  try { const [rows] = await pool.execute('SELECT * FROM notifications ORDER BY created_at DESC'); res.json(rows); } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/crm-clients', async (req, res) => {
  try { 
    const [rows] = await pool.execute('SELECT * FROM crm_clients ORDER BY created_at DESC'); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/crm-clients', async (req, res) => {
  const { email, name, phone, address } = req.body;
  try {
    await pool.execute('INSERT INTO crm_clients (email, name, phone, address) VALUES (?, ?, ?, ?)', [email, name, phone, address]);
    await logAudit('System', 'Sales/Customers', 'CREATE', email, `Added customer: ${name}`);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.put('/api/crm-clients/:email', async (req, res) => {
  const { email: newEmail, name, phone, address } = req.body;
  const oldEmail = req.params.email;
  try {
    await pool.execute('UPDATE crm_clients SET email = ?, name = ?, phone = ?, address = ? WHERE email = ?', [newEmail || oldEmail, name, phone, address, oldEmail]);
    await logAudit('System', 'Sales/Customers', 'UPDATE', oldEmail, `Updated customer: ${name}`);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.delete('/api/crm-clients/:email', async (req, res) => {
  const email = req.params.email;
  try {
    await pool.execute('DELETE FROM crm_clients WHERE email = ?', [email]);
    await logAudit('System', 'Sales/Customers', 'DELETE', email, `Archived customer.`);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/sales-payments', async (req, res) => {
  try { 
    const [rows] = await pool.execute(`
      SELECT p.*, COALESCE(o.customer_name, 'Online Client') as customer_name
      FROM sales_payments p
      LEFT JOIN sales_orders o ON p.order_id = o.order_id
      ORDER BY p.created_at DESC
    `); 
    res.json(rows); 
  } catch (e) { res.status(500).json({ success: false }); }
});

app.put('/api/sales-payments/:id/verify', async (req, res) => {
  try {
    await pool.execute('UPDATE sales_payments SET verification_status = "Verified" WHERE transaction_id = ?', [req.params.id]);
    await logAudit('System', 'Sales/POS', 'UPDATE', req.params.id, 'Verified online payment.');
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false }); }
});

// ==========================================
// AUTH & SYSTEM ROUTES
// ==========================================

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

  try {
    const [users] = await pool.execute('SELECT user_id, full_name, role FROM users WHERE email = ? AND password_hash = ?', [email, password]);
    if (users.length > 0) {
      const user = users[0];
      await pool.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);
      await logAudit(user.full_name, 'System', 'LOGIN', 'Session', 'Signed in successfully.');
      res.json({ success: true, message: 'Login successful', user: { id: user.user_id, name: user.full_name, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ success: false, message: 'Database error occurred' }); }
});

app.post('/api/logout', async (req, res) => {
  try {
    await logAudit(req.body.userName || 'Unknown User', 'System', 'LOGOUT', 'Session', 'Signed out of the system.');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try { await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false }); }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try { await pool.execute('UPDATE notifications SET is_read = TRUE'); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false }); }
});

app.delete('/api/notifications/clear', async (req, res) => {
  try { await pool.execute('DELETE FROM notifications'); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false }); }
});

// ==========================================
// MRP & PROCUREMENT ROUTES
// ==========================================

app.post('/api/auto-restock', async (req, res) => {
  try {
    const [lowStock] = await pool.execute('SELECT * FROM warehouse_stock WHERE category="RAW_MATERIAL" AND qty <= min_reorder_level');
    const [suppliers] = await pool.execute('SELECT * FROM suppliers');

    let restocked = 0;

    for (let item of lowStock) {
       let supplierId = '';
       let catalogName = item.name;

       let searchKey = item.name.toLowerCase();
       if (searchKey.includes('clear plastic pouch')) searchKey = 'clear plastic pouch';
       else if (searchKey.includes('printed plastic pouch')) searchKey = 'printed plastic pouch';
       else if (searchKey.includes('pouch') || searchKey.includes('film') || searchKey.includes('wrapper')) searchKey = 'pouch';
       else if (searchKey.includes('sugar')) searchKey = 'sugar';
       else if (searchKey.includes('puree') || searchKey.includes('pulp')) searchKey = 'puree';
       else if (searchKey.includes('color')) searchKey = 'color';
       else if (searchKey.includes('milk')) searchKey = 'milk';
       else if (searchKey.includes('tamarind')) searchKey = 'tamarind';
       else if (searchKey.includes('butter')) searchKey = 'butter';

       for (let sup of suppliers) {
         if (!sup.category) continue;
         let catItems = sup.category.split(',');
         for (let cItem of catItems) {
            let parts = cItem.split('|');
            let cName = parts[0].trim().toLowerCase();
            if (cName.includes(searchKey) || searchKey.includes(cName)) {
               supplierId = sup.supplier_id;
               catalogName = parts[0].trim();
               break;
            }
         }
         if (supplierId) break;
       }

       if (!supplierId) {
          supplierId = suppliers[0].supplier_id;
          catalogName = item.name;
       }

       let orderQty = parseFloat(item.max_capacity) - parseFloat(item.qty);
       if (orderQty <= 0) orderQty = 100;

       let poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
       
       await pool.execute('INSERT INTO purchase_orders (po_number, supplier_id, material_desc, qty, status, approved_by) VALUES (?, ?, ?, ?, ?, ?)', 
          [poNumber, supplierId, catalogName, Math.ceil(orderQty) + ' units', 'In transit', 'System Auto-Engine']);
       
       await logAudit('System Auto-Engine', 'Procurement', 'CREATE', poNumber, `Auto-replenishment drafted order for ${Math.ceil(orderQty)} units of ${catalogName}.`);
       await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Auto-Restock PO Created', `${poNumber} is arriving from supplier.`, 'info']);
       
       restocked++;
    }

    res.json({ success: true, count: restocked });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/calculate-materials', async (req, res) => {
  const { productSku, qty } = req.body;
  try {
    const [bomRows] = await pool.execute('SELECT component_name, qty_required FROM bill_of_materials WHERE product_sku = ?', [productSku]);
    
    let analysis = [];
    let canFulfill = true;
    let maxProducible = Infinity; 

    if (bomRows.length === 0) {
       return res.json({ success: true, canFulfill: false, requirements: [], maxProducible: 0 });
    }

    for (let bom of bomRows) {
      const reqQtyStr = bom.qty_required || '';
      const reqQtyMatch = reqQtyStr.match(/[\d.]+/);
      const reqUnitMatch = reqQtyStr.match(/[a-zA-Z]+/); 
      
      const baseQty = reqQtyMatch ? parseFloat(reqQtyMatch[0]) : 0;
      const reqUnit = reqUnitMatch ? reqUnitMatch[0].toLowerCase() : 'units';
      const totalNeeded = baseQty * qty;

      const [stockRows] = await pool.execute('SELECT sku, qty, uom FROM warehouse_stock WHERE name = ?', [bom.component_name]);
      
      let availableQty = stockRows.length > 0 ? parseFloat(stockRows[0].qty) : 0;
      const stockSku = stockRows.length > 0 ? stockRows[0].sku : 'UNTRACKED';
      const stockUnit = stockRows.length > 0 ? (stockRows[0].uom || '').toLowerCase() : reqUnit;

      let convertedAvailableQty = availableQty;
      if (stockUnit === 'kg' && reqUnit === 'g') convertedAvailableQty = availableQty * 1000;
      if (stockUnit === 'l' && reqUnit === 'ml') convertedAvailableQty = availableQty * 1000;
      if (stockUnit === 'g' && reqUnit === 'kg') convertedAvailableQty = availableQty / 1000;
      if (stockUnit === 'ml' && reqUnit === 'l') convertedAvailableQty = availableQty / 1000;

      const shortfall = convertedAvailableQty >= totalNeeded ? 0 : totalNeeded - convertedAvailableQty;
      if (shortfall > 0) canFulfill = false;

      let maxFromThis = baseQty > 0 ? Math.floor(convertedAvailableQty / baseQty) : Infinity;
      if (maxFromThis < maxProducible) maxProducible = maxFromThis;

      analysis.push({
        material: bom.component_name,
        sku: stockSku,
        required: totalNeeded,
        available: convertedAvailableQty, 
        shortfall: shortfall,
        unit: reqUnit 
      });
    }

    if (maxProducible === Infinity) maxProducible = 0;

    res.json({ success: true, canFulfill, requirements: analysis, maxProducible });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/pos-catalog', async (req, res) => {
  const { sku, name, price, stock, image_url } = req.body;
  if (!sku || !name || !price) return res.status(400).json({ success: false, error: "SKU, name, and price are required." });
  
  try {
    await pool.execute('ALTER TABLE pos_catalog MODIFY image_url LONGTEXT');
    
    await pool.execute(
      `INSERT INTO warehouse_stock (sku, name, category, qty, uom, min_reorder_level, max_capacity) 
       VALUES (?, ?, 'FINISHED_GOOD', ?, 'packs', 50, 500)
       ON DUPLICATE KEY UPDATE name = VALUES(name), qty = qty + VALUES(qty)`,
      [sku, name, stock || 0]
    );
    
    await pool.execute(
      `INSERT INTO pos_catalog (sku, name, price, image_url, is_out_of_stock) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), image_url = VALUES(image_url)`,
      [sku, name, price, image_url || 'assets/products/placeholder.png', (stock <= 0) ? 1 : 0]
    );
    
    await logAudit('System', 'Sales/POS', 'CREATE', sku, `Registered new product: ${name}`);
    res.json({ success: true, message: 'Product registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/pos-catalog/:sku', async (req, res) => {
  const { name, price, stock, image_url } = req.body;
  const sku = req.params.sku;
  if (!name || price == null) return res.status(400).json({ success: false, error: "Name and price are required." });

  try {
    await pool.execute('ALTER TABLE pos_catalog MODIFY image_url LONGTEXT');
    
    await pool.execute(`UPDATE warehouse_stock SET name = ?, qty = ? WHERE sku = ?`, [name, stock || 0, sku]);
    
    let query = `UPDATE pos_catalog SET name = ?, price = ?, is_out_of_stock = ?`;
    let params = [name, price, stock <= 0 ? 1 : 0];
    
    if (image_url) {
      query += `, image_url = ?`;
      params.push(image_url);
    }
    
    query += ` WHERE sku = ?`;
    params.push(sku);
    
    await pool.execute(query, params);
    
    await logAudit('System', 'Sales/POS', 'UPDATE', sku, `Updated product: ${name}`);
    res.json({ success: true, message: 'Product updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/pos-catalog/:sku', async (req, res) => {
  const sku = req.params.sku;
  try {
    await pool.execute('DELETE FROM pos_catalog WHERE sku = ?', [sku]);
    await pool.execute('DELETE FROM warehouse_stock WHERE sku = ?', [sku]);
    await logAudit('System', 'Sales/POS', 'DELETE', sku, `Deleted product from catalog.`);
    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/purchase-orders', async (req, res) => {
  const { supplierId, materialId, qty, cost, userName, status } = req.body;
  try {
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qtyString = `${qty} units`;
    const finalStatus = status || 'Pending Approval';
    await pool.execute('INSERT INTO purchase_orders (po_number, supplier_id, material_desc, qty, status) VALUES (?, ?, ?, ?, ?)', [poNumber, supplierId, materialId, qtyString, finalStatus]);
    await logAudit(userName || 'System Auto-MRP', 'Procurement', 'CREATE', poNumber, `Generated order for ${qtyString} of ${materialId}.`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', [finalStatus === 'In transit' ? 'New Purchase Order' : 'New Purchase Requisition', `${poNumber} was created.`, 'info']);
    res.json({ success: true, poNumber });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.post('/api/suppliers', async (req, res) => {
  const { name, category, contact, role, email, phone, userName } = req.body;
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM suppliers');
    const supplierId = `SUP-${String(rows[0].count + 1).padStart(3, '0')}`;
    await pool.execute('INSERT INTO suppliers (supplier_id, name, category, contact_name, contact_role, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)', [supplierId, name, category, contact || '', role || '', email || '', phone || '']);
    await logAudit(userName || 'System', 'Procurement', 'CREATE', supplierId, `Added new supplier: ${name}`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Supplier Registered', `${name} added.`, 'success']);
    res.json({ success: true, supplierId });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/suppliers/:id', async (req, res) => {
  const { name, category, contact, role, email, phone, userName } = req.body;
  const supplierId = req.params.id;
  try {
    await pool.execute(
      'UPDATE suppliers SET name = ?, category = ?, contact_name = ?, contact_role = ?, email = ?, phone = ? WHERE supplier_id = ?',
      [name, category, contact || '', role || '', email || '', phone || '', supplierId]
    );
    await logAudit(userName || 'System', 'Procurement', 'UPDATE', supplierId, `Updated profile for supplier: ${name}`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Supplier Updated', `Profile for ${name} was updated.`, 'info']);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.put('/api/purchase-orders/:poNumber/approve', async (req, res) => {
  try {
    await pool.execute('UPDATE purchase_orders SET status = ?, approved_by = ? WHERE po_number = ?', ['In transit', req.body.userName || 'System', req.params.poNumber]);
    await logAudit(req.body.userName || 'System', 'Procurement', 'APPROVE', req.params.poNumber, `Approved requisition ${req.params.poNumber}.`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['PR Approved', `Purchase Requisition ${req.params.poNumber} has been approved.`, 'success']);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false }); }
});

app.put('/api/purchase-orders/:poNumber/reject', async (req, res) => {
  try {
    await pool.execute('UPDATE purchase_orders SET status = ? WHERE po_number = ?', ['Rejected', req.params.poNumber]);
    await logAudit(req.body.userName || 'System', 'Procurement', 'REJECT', req.params.poNumber, `Rejected requisition ${req.params.poNumber}.`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['PR Rejected', `Purchase Requisition ${req.params.poNumber} has been rejected.`, 'error']);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false }); }
});

app.put('/api/purchase-orders/:poNumber/receive', async (req, res) => {
  const poNumber = req.params.poNumber;
  const userName = req.body.userName || 'System';

  try {
    const [poRows] = await pool.execute('SELECT material_desc, qty FROM purchase_orders WHERE po_number = ?', [poNumber]);
    if (poRows.length === 0) return res.status(404).json({ success: false, message: 'PO not found.' });
    
    await pool.execute('UPDATE purchase_orders SET status = ? WHERE po_number = ?', ['Received', poNumber]);
    
    const grnNumber = poNumber.replace('PO', 'GRN'); 
    await pool.execute('INSERT INTO goods_receipt_notes (grn_number, po_number, received_by, status) VALUES (?, ?, ?, ?)', [grnNumber, poNumber, userName, 'Routed to QA']);

    const batchId = poNumber.replace('PO', 'BAT');
    await pool.execute('INSERT INTO qa_inspections (batch_id, source_ref, item_name, received_qty, inspection_type, status) VALUES (?, ?, ?, ?, ?, ?)', [batchId, poNumber, poRows[0].material_desc, poRows[0].qty, 'INBOUND_RAW', 'PENDING CLEARANCE']);

    await logAudit(userName, 'Procurement', 'UPDATE', poNumber, `Scanned arrival. Generated ${grnNumber} and routed to QA as ${batchId}`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Goods Routed to QA', `${grnNumber} generated.`, 'info']);

    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

// ==========================================
// QA & WAREHOUSE INGESTION ROUTES
// ==========================================

app.put('/api/qa-inspections/:batchId/pass', async (req, res) => {
  const { userName } = req.body;
  const batchId = req.params.batchId;

  const actualBatchId = batchId.replace('PRN', 'BAT').replace('PO', 'BAT');
  const poRef = actualBatchId.replace('BAT', 'PO');
  const runRef = actualBatchId.replace('BAT', 'PRN');

  try {
    await pool.execute('UPDATE qa_inspections SET status = ? WHERE batch_id = ? OR batch_id = ?', ['CLEARED', actualBatchId, batchId]);
    await pool.execute('UPDATE goods_receipt_notes SET status = ? WHERE po_number = ?', ['Cleared to Warehouse', poRef]);
    await pool.execute('UPDATE production_runs SET status = ? WHERE run_id = ?', ['CLEARED', runRef]);

    const [inspRows] = await pool.execute('SELECT item_name, received_qty, inspection_type, source_ref FROM qa_inspections WHERE batch_id = ? OR batch_id = ?', [actualBatchId, batchId]);

    if (inspRows.length > 0) {
      const inspection = inspRows[0];
      const itemName = inspection.item_name;
      const rawQtyString = String(inspection.received_qty || '0');
      const qtyMatch = rawQtyString.match(/[\d.]+/);
      let numQty = qtyMatch ? parseFloat(qtyMatch[0]) : 0;

      if (inspection.inspection_type === 'FINISHED_GOODS') {
         // Correctly Add Finished Goods to Warehouse Inventory
         const [fgRows] = await pool.execute('SELECT sku, name FROM warehouse_stock WHERE name = ? AND category = "FINISHED_GOOD"', [itemName]);
         
         if (fgRows.length > 0) {
             const fgSku = fgRows[0].sku;
             await pool.execute('UPDATE warehouse_stock SET qty = qty + ? WHERE sku = ?', [numQty, fgSku]);
             await pool.execute('INSERT INTO stock_movements (movement_type, sku, qty_change, reference_source, trigger_actor) VALUES (?, ?, ?, ?, ?)', ['+ QA INGESTION', fgSku, numQty, actualBatchId, userName || 'QA Officer']);
         } else {
             // Fallback if not found perfectly by name
             const newSku = 'FG-' + Math.floor(1000 + Math.random() * 9000);
             await pool.execute(
               'INSERT INTO warehouse_stock (sku, name, category, qty, uom, allocated_qty, min_reorder_level, max_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
               [newSku, itemName, 'FINISHED_GOOD', numQty, 'packs', 0, 50, 5000]
             );
             await pool.execute('INSERT INTO stock_movements (movement_type, sku, qty_change, reference_source, trigger_actor) VALUES (?, ?, ?, ?, ?)', ['+ QA INGESTION', newSku, numQty, actualBatchId, userName || 'QA Officer']);
         }
      } else {
         // Handle Inbound Raw Materials
         const extractDetails = (str) => {
           const units = ['pcs', 'kg', 'g', 'l', 'ml', 'cans'];
           const multiMatch = str.match(/(\d+)\s*x\s*(\d+)\s*([a-zA-Z]+)/i);
           if (multiMatch && units.includes(multiMatch[3].toLowerCase())) {
             return { qty: parseFloat(multiMatch[1]) * parseFloat(multiMatch[2]), unit: multiMatch[3].toLowerCase() };
           }
           const parenMatches = [...str.matchAll(/\(\s*([\d,.]+)\s*([a-zA-Z]+)\s*\)/gi)];
           if (parenMatches.length > 0) {
             const last = parenMatches[parenMatches.length - 1];
             const extractedUnit = last[2].toLowerCase();
             if (units.includes(extractedUnit)) {
               return { qty: parseFloat(last[1].replace(/,/g, '')), unit: extractedUnit };
             }
           }
           return { qty: 1, unit: '' };
         };

         const extracted = extractDetails(itemName);
         let totalIngestedQty = numQty * extracted.qty;

         const catalogToSku = {
           'clear plastic pouch': 'PKG-CLR-050',
           'printed plastic pouch': 'PKG-PRT-100',
           'resealable foil pouch': 'PKG-FOL-250',
           'wrapper film': 'PKG-FLM-RLL',
           'plastic candy jar': 'PKG-JAR-500',
           'white sugar': 'RAW-SUG-01',
           'brown sugar': 'RAW-SUG-02',
           'peanuts': 'RAW-NUT-01',
           'puree': 'RAW-PUR-02',
           'cocoa': 'RAW-CCA-01',
           'butter': 'RAW-BUT-01',
           'tamarind': 'RAW-TAM-01',
           'milk powder': 'RAW-MIL-01',
           'cheese': 'RAW-CHE-01',
           'langka': 'RAW-LAN-01',
           'macapuno': 'RAW-MAC-01',
           'pandan': 'RAW-PAN-01',
           'strawberry': 'RAW-STR-01',
           'ube': 'RAW-UBE-01'
         };

         const [stockRows] = await pool.execute('SELECT sku, name, uom FROM warehouse_stock WHERE category = "RAW_MATERIAL"');
         let matchedStock = null;
         const iNameLower = itemName.toLowerCase();

         for (const [key, sku] of Object.entries(catalogToSku)) {
           if (iNameLower.includes(key)) {
             matchedStock = stockRows.find(s => s.sku === sku);
             break;
           }
         }

         if (!matchedStock) {
           const coreName = iNameLower.split('-')[0].split('(')[0].trim();
           for (const stock of stockRows) {
             const sNameLower = stock.name.toLowerCase();
             if (sNameLower.includes(coreName) || coreName.includes(sNameLower)) {
               matchedStock = stock;
               break;
             }
           }
         }

         if (matchedStock && totalIngestedQty > 0) {
           const whUnit = (matchedStock.uom || '').toLowerCase();
           const incUnit = extracted.unit;
           
           if (incUnit === 'kg' && whUnit === 'g') totalIngestedQty *= 1000;
           else if (incUnit === 'l' && whUnit === 'ml') totalIngestedQty *= 1000;
           else if (incUnit === 'g' && whUnit === 'kg') totalIngestedQty /= 1000;
           else if (incUnit === 'ml' && whUnit === 'l') totalIngestedQty /= 1000;

           await pool.execute('UPDATE warehouse_stock SET qty = qty + ? WHERE sku = ?', [totalIngestedQty, matchedStock.sku]);
           await pool.execute('INSERT INTO stock_movements (movement_type, sku, qty_change, reference_source, trigger_actor) VALUES (?, ?, ?, ?, ?)', ['+ QA INGESTION', matchedStock.sku, totalIngestedQty, actualBatchId, userName || 'QA Officer']);
         } else if (totalIngestedQty > 0) {
            const newSku = 'RAW-' + Math.floor(1000 + Math.random() * 9000);
            await pool.execute(
              'INSERT INTO warehouse_stock (sku, name, category, qty, uom, allocated_qty, min_reorder_level, max_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [newSku, itemName, 'RAW_MATERIAL', totalIngestedQty, extracted.unit || 'units', 0, 50, 5000]
            );
            await pool.execute('INSERT INTO stock_movements (movement_type, sku, qty_change, reference_source, trigger_actor) VALUES (?, ?, ?, ?, ?)', ['+ QA INGESTION', newSku, totalIngestedQty, actualBatchId, userName || 'QA Officer']);
         }
      }
    }

    await logAudit(userName || 'System', 'QA', 'APPROVE', actualBatchId, `Batch ${actualBatchId} cleared inspection and forwarded to inventory.`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['QA Cleared', `Batch ${actualBatchId} is marked as Sellable and sent to inventory.`, 'success']);
    
    res.json({ success: true, message: 'Batch cleared and sent to warehouse.' });
  } catch (error) { 
    console.error('QA Pass Error:', error); 
    res.status(500).json({ success: false, error: error.message }); 
  }
});

app.put('/api/qa-inspections/:batchId/fail', async (req, res) => {
  const { userName, defectCategory, rootCauseDetail } = req.body;
  const batchId = req.params.batchId;
  
  const actualBatchId = batchId.replace('PRN', 'BAT').replace('PO', 'BAT');
  const poRef = actualBatchId.replace('BAT', 'PO');
  const runRef = actualBatchId.replace('BAT', 'PRN');

  try {
    await pool.execute('UPDATE qa_inspections SET status = ? WHERE batch_id = ? OR batch_id = ?', ['QUARANTINED', actualBatchId, batchId]);
    await pool.execute('UPDATE goods_receipt_notes SET status = ? WHERE po_number = ?', ['Quarantined', poRef]);
    await pool.execute('UPDATE production_runs SET status = ? WHERE run_id = ?', ['QUARANTINED', runRef]);
    
    const reportId = actualBatchId.replace('BAT', 'DEF') + '-' + Math.floor(1000 + Math.random() * 9000);
    const category = defectCategory || 'FAILED INSPECTION';
    const details = rootCauseDetail || 'Failed initial inbound QA checks.';

    await pool.execute(
      'INSERT INTO qa_defects_quarantine (report_id, batch_id, defect_category, root_cause_detail, disposition_status, capa_action) VALUES (?, ?, ?, ?, ?, ?)',
      [reportId, actualBatchId, category, details, 'HOLD', 'Awaiting disposition review.']
    );

    await logAudit(userName || 'System', 'QA', 'REJECT', actualBatchId, `Batch ${actualBatchId} quarantined. Reason: ${category}`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['QA Quarantine', `Batch ${actualBatchId} quarantined. Reason: ${category}`, 'error']);
    res.json({ success: true, message: 'Batch quarantined and logged.' });
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ success: false }); 
  }
});

app.put('/api/qa-defects/:reportId/resolve', async (req, res) => {
  try {
    await pool.execute('UPDATE qa_defects_quarantine SET disposition_status = ?, capa_action = ? WHERE report_id = ?', [req.body.disposition, req.body.capa, req.params.reportId]);
    await logAudit(req.body.userName || 'System', 'QA', 'UPDATE_DEFECT', req.params.reportId, `Resolved defect ${req.params.reportId}.`);
    await pool.execute('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', ['Defect Resolved', `Report ${req.params.reportId} resolved with disposition: ${req.body.disposition}.`, 'success']);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
});

// ==========================================
// NEW: POS TERMINAL & INVOICE CHECKOUT
// ==========================================
app.post('/api/pos-checkout', async (req, res) => {
  const { orderId, invoiceNo, customerName, totalUnits, totalAmount, userName, status } = req.body;
  try {
    const finalStatus = status || 'PAID';
    
    if (orderId !== 'MANUAL') {
       await pool.execute(
         'INSERT INTO sales_orders (order_id, customer_name, address, total_qty, total_amount, order_status) VALUES (?, ?, ?, ?, ?, ?)',
         [orderId, customerName, 'POS Counter Pickup', `${totalUnits} units`, totalAmount, 'ALLOCATED']
       );
    }

    await pool.execute(
      'INSERT INTO sales_invoices (invoice_no, order_id, amount, status, generated_at) VALUES (?, ?, ?, ?, NOW())',
      [invoiceNo, orderId, totalAmount, finalStatus]
    );

    await logAudit(userName || 'Cashier', 'Sales/POS', 'CREATE', orderId === 'MANUAL' ? invoiceNo : orderId, `Processed sale for ₱${totalAmount}`);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ==========================================
// NEW SMART PAYMENT LINK GENERATOR & WEBHOOK
// ==========================================

app.post('/api/generate-payment-link', async (req, res) => {
  const { clientEmail, clientName, orderItems, totalAmount, totalUnits } = req.body;

  try {
    const [clientRows] = await pool.execute('SELECT * FROM crm_clients WHERE email = ?', [clientEmail]);

    if (clientRows.length === 0 && (!clientName || clientName.trim() === '')) {
      return res.status(400).json({ success: false, error: 'Client Name is required for new customers.' });
    }

    if (clientRows.length > 0) {
      const client = clientRows[0];
      const token = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      await pool.execute(
        'INSERT INTO pending_orders (token, email, order_items, total_units, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        [token, clientEmail, JSON.stringify(orderItems), totalUnits, totalAmount, 'PENDING_PAYMENT']
      );

      const lineItems = orderItems.map(item => ({ 
        currency: 'PHP', 
        amount: Math.round(item.subtotal * 100), 
        name: `${item.name} (x${item.qty})`, 
        quantity: 1 
      }));

      const payload = {
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: ['card', 'gcash', 'paymaya', 'qrph'],
            success_url: `http://localhost:4200/payment/success?token=${token}`,
            cancel_url: `http://localhost:4200/payment/cancel?token=${token}`,
            send_email_receipt: true,
            billing: { email: clientEmail, name: client.name, phone: client.phone }
          }
        }
      };

      const pmRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64') },
        body: JSON.stringify(payload)
      });
      const pmData = await pmRes.json();
      if (!pmRes.ok) return res.status(400).json({ success: false, error: 'Failed to generate PayMongo link.' });
      
      const checkoutUrl = pmData.data.attributes.checkout_url;

      await transporter.sendMail({
        from: '"Galaxy Candies Manufacturing" <galaxycandies123@gmail.com>',
        to: clientEmail,
        subject: `Invoice & Payment Link - Galaxy Candies`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fbfdf9;">
              <h2 style="color: #2a3f14; margin-top: 0;">Galaxy Candies Manufacturing</h2>
              <p style="color: #374151; font-size: 15px;">Welcome back, <strong>${client.name}</strong>!</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.5;">Your manufacturing order has been validated. We will ship to your saved address: <em>${client.address}</em>. To proceed, please complete your full payment of <strong>₱${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>.</p>
              <div style="text-align: center; margin: 35px 0;">
                  <a href="${checkoutUrl}" style="background-color: #9be15d; color: #1d2f0d; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px; display: inline-block;">Pay Securely</a>
              </div>
          </div>
        `
      });

      res.json({ success: true, message: 'Returning client detected. Direct PayMongo link emailed.', url: checkoutUrl, token: token });

    } else {
      const token = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      await pool.execute(
        'INSERT INTO pending_orders (token, email, order_items, total_units, total_amount) VALUES (?, ?, ?, ?, ?)',
        [token, clientEmail, JSON.stringify(orderItems), totalUnits, totalAmount]
      );
      const portalUrl = `http://localhost:4200/client-portal/${token}`;

      await transporter.sendMail({
        from: '"Galaxy Candies Manufacturing" <galaxycandies123@gmail.com>',
        to: clientEmail,
        subject: `Complete Your Order Profile - Galaxy Candies`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fbfdf9;">
              <h2 style="color: #2a3f14; margin-top: 0;">Galaxy Candies Manufacturing</h2>
              <p style="color: #374151; font-size: 15px;">Hello ${clientName || 'Valued Client'}!</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.5;">Your manufacturing order has been queued. Since this is your first order with us, please complete your logistics profile and process your payment via our secure portal.</p>
              <div style="text-align: center; margin: 35px 0;">
                  <a href="${portalUrl}" style="background-color: #EAC224; color: #1d2f0d; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px; display: inline-block;">Open Client Portal</a>
              </div>
          </div>
        `
      });

      res.json({ success: true, message: 'New client detected. Intake Portal link emailed.', url: portalUrl, token: token });
    }
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/pending-orders/:token', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pending_orders WHERE token = ?', [req.params.token]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Order not found or expired.' });
    res.json({ success: true, data: rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/submit-client-portal', async (req, res) => {
  const { token, name, phone, address } = req.body;
  try {
    const [orderRows] = await pool.execute('SELECT * FROM pending_orders WHERE token = ?', [token]);
    if (orderRows.length === 0) return res.status(404).json({ success: false, error: 'Order not found.' });
    
    const order = orderRows[0];
    await pool.execute('INSERT INTO crm_clients (email, name, phone, address) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, phone=?, address=?', [order.email, name, phone, address, name, phone, address]);

    const lineItems = order.order_items.map(item => ({ 
      currency: 'PHP', 
      amount: Math.round(item.subtotal * 100), 
      name: `${item.name} (x${item.qty})`, 
      quantity: 1 
    }));

    const payload = {
      data: {
        attributes: {
          line_items: lineItems,
          payment_method_types: ['card', 'gcash', 'paymaya', 'qrph'],
          success_url: `http://localhost:4200/payment/success?token=${token}`,
          cancel_url: `http://localhost:4200/payment/cancel?token=${token}`,
          send_email_receipt: true,
          billing: { email: order.email, name: name, phone: phone, address: { line1: address } }
        }
      }
    };

    const pmRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64') }, body: JSON.stringify(payload) });
    const pmData = await pmRes.json();
    
    if (pmRes.ok && pmData.data?.attributes?.checkout_url) {
      await pool.execute('UPDATE pending_orders SET status = ? WHERE token = ?', ['PENDING_PAYMENT', token]);
      res.json({ success: true, checkout_url: pmData.data.attributes.checkout_url });
    } else {
      res.status(400).json({ success: false, error: 'Failed to connect to payment gateway.' });
    }
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/payment-success', async (req, res) => {
  const { token, userName } = req.body;
  try {
    const [orderRows] = await pool.execute('SELECT * FROM pending_orders WHERE token = ?', [token]);
    if (orderRows.length === 0) return res.status(404).json({ success: false, error: 'Order not found' });
    
    const order = orderRows[0];
    if (order.status === 'PAID') return res.json({ success: true, message: 'Already processed' });

    const totalUnits = order.total_units;
    const totalAmount = order.total_amount;
    const runId = `PRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const drNumber = `DR-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    let productNames = 'Mixed Batch';
    try {
      const items = typeof order.order_items === 'string' ? JSON.parse(order.order_items) : order.order_items;
      if (items && Array.isArray(items) && items.length > 0) {
        productNames = items.map(item => `${item.name}`).join(', ');
      }
    } catch (e) {
      console.error("Could not parse order items for run name:", e);
    }

    await pool.execute('UPDATE pending_orders SET status = ? WHERE token = ?', ['PAID', token]);
    
    const [clientRows] = await pool.execute('SELECT * FROM crm_clients WHERE email = ?', [order.email]);
    const clientName = clientRows.length > 0 ? clientRows[0].name : order.email;
    const clientAddress = clientRows.length > 0 ? clientRows[0].address : 'Online Portal Client Address';

    await pool.execute(
      'INSERT INTO sales_orders (order_id, customer_name, address, total_qty, total_amount, order_status) VALUES (?, ?, ?, ?, ?, ?)',
      [token, clientName, clientAddress, `${totalUnits} units`, totalAmount, 'PAID']
    );

    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await pool.execute(
      'INSERT INTO sales_invoices (invoice_no, order_id, amount, status, generated_at) VALUES (?, ?, ?, ?, NOW())',
      [invoiceNo, token, totalAmount, 'PAID']
    );

    const payMongoTxnId = `PM-${Math.floor(10000000 + Math.random() * 90000000)}`;
    await pool.execute(
      'INSERT INTO sales_payments (transaction_id, order_id, payment_method, amount, verification_status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [payMongoTxnId, token, 'PayMongo', totalAmount, 'Verified', 'Automated Online Checkout']
    );

    await pool.execute(
      'INSERT INTO production_runs (run_id, bom_id, planned_units, status, started_at) VALUES (?, ?, ?, ?, NOW())',
      [runId, productNames, totalUnits, 'SCHEDULED']
    );

    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.execute(
      'INSERT INTO delivery_routes (route_id, sales_order_id, destination, total_weight, route_status, verification_pin) VALUES (?, ?, ?, ?, ?, ?)',
      [drNumber, token, `${clientName} — ${clientAddress}`, `${totalUnits} units`, 'DISPATCHED', verificationPin]
    );

    try {
        await transporter.sendMail({
          from: '"Galaxy Candies Logistics" <galaxycandies123@gmail.com>',
          to: order.email,
          subject: `Delivery Dispatched - Verification PIN Enclosed`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fbfdf9;">
                <h2 style="color: #9be15d; margin-top: 0;">Payment Received!</h2>
                <p style="color: #374151; font-size: 15px;">Hello ${clientName},</p>
                <p style="color: #374151; font-size: 15px; line-height: 1.5;">Your payment is verified and your delivery (Route: <strong>${drNumber}</strong>) has been queued.</p>
                <p style="color: #374151; font-size: 15px; line-height: 1.5;">Please provide the following 6-digit Delivery Verification PIN to the driver upon receiving your items:</p>
                <div style="background-color: #1d2f0d; color: #EAC224; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
                    ${verificationPin}
                </div>
                <p style="color: #374151; font-size: 13px; line-height: 1.5;">Keep this code secure. The driver requires it to finalize the delivery.</p>
            </div>
          `
        });
    } catch(mailErr) {
        console.error("Failed to send PIN email:", mailErr);
    }

    await logAudit(userName || 'Client Payment Gateway', 'Sales/Logistics', 'CREATE', drNumber, `Payment verified for order ${token}. Dispatched delivery route to ${clientAddress}.`);

    await pool.execute(
      'INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', 
      ['Order Paid & Dispatched', `Client payment for ${token} verified. Delivery route ${drNumber} queued for address: ${clientAddress}.`, 'success']
    );

    res.json({ success: true, runId, drNumber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/delivery-routes/:id/dispatch', async (req, res) => {
  const routeId = req.params.id;
  const { userName } = req.body;

  try {
    const [routeRows] = await pool.execute('SELECT sales_order_id, verification_pin, destination FROM delivery_routes WHERE route_id = ?', [routeId]);
    if (routeRows.length === 0) return res.status(404).json({ success: false, message: 'Route not found.' });

    const route = routeRows[0];
    const orderId = route.sales_order_id;
    let pinCode = route.verification_pin;

    if (!pinCode) {
      pinCode = Math.floor(100000 + Math.random() * 900000).toString();
      await pool.execute('UPDATE delivery_routes SET verification_pin = ? WHERE route_id = ?', [pinCode, routeId]);
    }

    await pool.execute('UPDATE delivery_routes SET route_status = "IN TRANSIT" WHERE route_id = ?', [routeId]);

    const [orderRows] = await pool.execute('SELECT email FROM pending_orders WHERE token = ?', [orderId]);
    let clientEmail = orderRows.length > 0 ? orderRows[0].email : null;

    if (!clientEmail) {
      const [clientMatch] = await pool.execute('SELECT email FROM crm_clients WHERE ? LIKE CONCAT("%", name, "%")', [route.destination]);
      if (clientMatch.length > 0) clientEmail = clientMatch[0].email;
    }

    if (clientEmail) {
      await transporter.sendMail({
        from: '"Galaxy Candies Logistics" <galaxycandies123@gmail.com>',
        to: clientEmail,
        subject: `Your Order is On the Way! 🚚 - Verification PIN`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fbfdf9;">
              <h2 style="color: #9be15d; margin-top: 0;">Driver is on the way!</h2>
              <p style="color: #374151; font-size: 15px;">Hello,</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.5;">Your delivery for route <strong>${routeId}</strong> has been dispatched and is heading to your location.</p>
              <p style="color: #374151; font-size: 15px; line-height: 1.5;">Please provide this 6-digit Delivery Verification PIN to the driver upon arrival:</p>
              <div style="background-color: #1d2f0d; color: #EAC224; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
                  ${pinCode}
              </div>
              <p style="color: #374151; font-size: 13px; line-height: 1.5;">Keep this PIN confidential. The driver needs it to complete your delivery.</p>
          </div>
        `
      });
    }

    await logAudit(userName || 'Driver', 'Logistics', 'UPDATE', routeId, 'Started trip and emailed verification PIN to client.');
    res.json({ success: true, message: 'Trip started and PIN emailed to client.' });
  } catch (error) {
    console.error('Error dispatching route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELIVER STATUS UPDATE AND NOTIFICATION ROUTE
app.put('/api/delivery-routes/:id/complete', async (req, res) => {
  const routeId = req.params.id;
  const { userName, pinCode, receivedBy, notes, signature, photo } = req.body;
  const driverName = userName || 'Driver';
  
  try {
    const [routeRows] = await pool.execute('SELECT sales_order_id, verification_pin FROM delivery_routes WHERE route_id = ?', [routeId]);
    
    if (routeRows.length > 0) {
      if (routeRows[0].verification_pin && routeRows[0].verification_pin !== pinCode) {
        return res.status(400).json({ success: false, message: 'Invalid Verification PIN.' });
      }

      const orderId = routeRows[0].sales_order_id;

      await pool.execute('ALTER TABLE epod_records MODIFY photo_url LONGTEXT');
      await pool.execute('ALTER TABLE epod_records MODIFY signature_url LONGTEXT');

      const now = new Date();
      const deliveryDate = now.toISOString().split('T')[0];
      const deliveryTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      await pool.execute(
        'INSERT INTO epod_records (dr_number, received_by, delivery_date, delivery_time, photo_url, signature_url, is_uploaded) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [routeId, receivedBy || 'Customer', deliveryDate, deliveryTime, photo || '', signature || '']
      );

      await pool.execute('UPDATE delivery_routes SET route_status = "DELIVERED" WHERE route_id = ?', [routeId]);
      await pool.execute('UPDATE sales_orders SET order_status = "Delivered" WHERE order_id = ?', [orderId]);
      
      await pool.execute(
        'INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', 
        ['Order Delivered', `Order ${orderId} (Route ${routeId}) has been successfully delivered by ${driverName}. Received by: ${receivedBy || 'Customer'}.`, 'success']
      );

      const [pendingRows] = await pool.execute('SELECT email FROM pending_orders WHERE token = ?', [orderId]);
      
      if (pendingRows.length > 0 && pendingRows[0].email) {
        const clientEmail = pendingRows[0].email;
        
        await transporter.sendMail({
          from: '"Galaxy Candies Logistics" <galaxycandies123@gmail.com>',
          to: clientEmail,
          subject: `Your Order Has Been Delivered! 🚚 - Galaxy Candies`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fbfdf9;">
                <h2 style="color: #9be15d; margin-top: 0;">Delivery Successful!</h2>
                <p style="color: #374151; font-size: 15px;">Hello,</p>
                <p style="color: #374151; font-size: 15px; line-height: 1.5;">Great news! Your order <strong>${orderId}</strong> has been successfully delivered to your shipping address.</p>
                <p style="color: #374151; font-size: 15px; line-height: 1.5;">Received by: <strong>${receivedBy || 'Customer'}</strong></p>
                <p style="color: #374151; font-size: 15px; line-height: 1.5;">Thank you for choosing Galaxy Candies. We hope you enjoy your sweets!</p>
            </div>
          `
        });
      }
    }

    await logAudit(driverName, 'Logistics', 'UPDATE', routeId, 'Marked delivery route as completed and saved e-POD.');
    
    res.json({ success: true, message: 'Delivery completed successfully and notifications sent.' });
  } catch (error) { 
    console.error('Error completing delivery:', error);
    res.status(500).json({ success: false, error: error.message }); 
  }
});

app.listen(port, () => { console.log(`Backend server is running on http://localhost:${port}`); });