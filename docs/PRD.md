# Product Requirements Document (PRD)

## StoreWise v1.0.0 - POS & Inventory Management System

---

## 📋 Document Information

| Item | Details |
|------|---------|
| **Product Name** | StoreWise |
| **Version** | 1.0.0 (Current Implementation) |
| **Document Version** | 2.0 (Updated for Actual Implementation) |
| **Last Updated** | October 2025 |
| **Status** | Implemented - Core Features Complete |
| **Owner** | Development Team |
| **Contributors** | Full-Stack Development, UI/UX Design |

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Personas](#3-user-personas)
4. [Feature Requirements](#4-feature-requirements)
5. [User Stories & Acceptance Criteria](#5-user-stories--acceptance-criteria)
6. [Technical Requirements](#6-technical-requirements)
7. [UI/UX Requirements](#7-uiux-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Development Phases](#10-development-phases)
11. [Dependencies & Risks](#11-dependencies--risks)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### 1.1 Problem Statement

Minimarket dan toko ritel kecil-menengah di Indonesia menghadapi tantangan:

1. **Manual Process** - Pencatatan transaksi masih manual atau menggunakan sistem legacy yang tidak efisien
2. **Stock Discrepancy** - Stok di sistem tidak match dengan stok fisik (rata-rata selisih 5-10%)
3. **No Real-Time Insights** - Owner tidak memiliki data real-time untuk ambil keputusan bisnis
4. **Offline Dependency** - Saat internet mati, transaksi terhenti
5. **Complex Systems** - Sistem POS existing terlalu kompleks dan mahal untuk UKM

### 1.2 Solution

StoreWise adalah sistem POS & Inventory Management yang:

- ✅ **Modern Web-Based** - Aplikasi web berbasis React dengan interface modern
- ✅ **Simple & Fast** - UX yang intuitif, performa tinggi dengan lazy loading
- ✅ **Real-Time Analytics** - Dashboard komprehensif dengan laporan real-time
- ✅ **Developer-Friendly** - Clean architecture, TypeScript, well-documented
- ✅ **Production-Ready** - Tech stack modern, tested, scalable

### 1.3 Business Goals

| Goal | Metric | Target |
|------|--------|--------|
| User Adoption | Active users | 100 toko dalam 6 bulan |
| Operational Efficiency | Checkout time | < 30 detik |
| Inventory Accuracy | Stock discrepancy | < 2% |
| System Reliability | Uptime | > 99.9% |
| User Satisfaction | NPS Score | > 50 |

### 1.4 Target Users

- **Primary**: Minimarket, toko kelontong modern (10-50 SKU)
- **Secondary**: Toko retail kecil (warung, toko sembako)
- **Future**: Supermarket chain, franchise network

---

## 2. Product Overview

### 2.1 Product Vision

> "Menjadi platform POS & Inventory Management pilihan #1 untuk UKM ritel di Indonesia, dengan fokus pada kemudahan, kecepatan, dan reliability."

### 2.2 Core Value Propositions

1. **Offline-First Architecture**
   - Transaksi POS jalan tanpa internet
   - Auto-sync saat online kembali
   - Zero data loss

2. **Lightning Fast**
   - Checkout < 30 detik
   - Barcode scanning instant
   - Keyboard shortcuts untuk power user

3. **Real-Time Business Intelligence**
   - Dashboard live update
   - Laporan comprehensive
   - Actionable insights

4. **Scalable & Extensible**
   - Support single → multi outlet
   - API untuk integrasi
   - Plugin architecture (future)

### 2.3 Key Features Summary

| Feature | Priority | Status |
|---------|----------|--------|
| POS Cashier | P0 (Critical) | ✅ Implemented |
| Product Management | P0 (Critical) | ✅ Implemented |
| Stock Management | P0 (Critical) | ✅ Implemented |
| Sales Reporting | P0 (Critical) | ✅ Implemented |
| Sales Management | P0 (Critical) | ✅ Implemented |
| Analytics & Reports | P0 (Critical) | ✅ Implemented |
| Customer Management | P1 (High) | ✅ Implemented |
| System Settings | P1 (High) | ✅ Implemented |
| Shift Management | P1 (High) | 🔄 Planned |
| Supplier & Purchasing | P1 (High) | 🔄 Planned |
| Promotion Engine | P2 (Medium) | 📋 Future |
| Multi-Outlet | P2 (Medium) | 📋 Future |
| User Authentication | P1 (High) | 🔄 In Development |

**Priority Levels:**
- **P0 (Critical)**: Must-have for MVP, blocker for launch
- **P1 (High)**: Important, should be in MVP if time permits
- **P2 (Medium)**: Nice-to-have, can be post-MVP
- **P3 (Low)**: Future enhancement

---

## 3. User Personas

### 3.1 Persona 1: Kasir (Cashier)

**Name**: Siti, 22 tahun  
**Role**: Kasir  
**Tech Savviness**: Medium  
**Daily Usage**: 8 jam/hari, 100+ transaksi

**Goals:**
- ✅ Proses transaksi cepat dan akurat
- ✅ Minimal error saat input
- ✅ Mudah handle customer komplain (refund/void)

**Pain Points:**
- ❌ Sistem lama lemot, banyak klik
- ❌ Tidak ada shortcut keyboard
- ❌ Bingung kalau sistem error

**User Journey:**
1. Login → Buka shift
2. Scan produk → Checkout (repeat 100x/hari)
3. Handle return/refund (2-3x/hari)
4. Tutup shift → Print laporan

**Needs from StoreWise:**
- Interface simpel dan jelas
- Keyboard shortcuts
- Error message yang helpful
- Offline mode yang reliable

---

### 3.2 Persona 2: Manager Toko (Store Manager)

**Name**: Budi, 35 tahun  
**Role**: Manager & Owner  
**Tech Savviness**: Medium-High  
**Daily Usage**: 2-3 jam/hari untuk monitoring & decision making

**Goals:**
- ✅ Monitor performa toko real-time
- ✅ Kontrol stok dan avoid stockout
- ✅ Analisa produk laris & slow-moving
- ✅ Manage supplier dan pembelian

**Pain Points:**
- ❌ Tidak tahu produk mana yang untung/rugi
- ❌ Sering stockout untuk produk laris
- ❌ Stok fisik tidak match dengan sistem
- ❌ Susah track hutang ke supplier

**User Journey:**
1. Login → Cek dashboard (sales today, low stock alerts)
2. Review top products & slow-moving items
3. Create PO untuk produk yang low stock
4. Approve void/refund dari kasir
5. Export laporan untuk owner

**Needs from StoreWise:**
- Dashboard yang informatif
- Alert untuk low stock & expired
- Laporan profit margin
- Easy PO creation

---

### 3.3 Persona 3: Owner (Business Owner)

**Name**: Pak Hendra, 45 tahun  
**Role**: Owner (punya 2-3 toko)  
**Tech Savviness**: Low-Medium  
**Daily Usage**: 30 menit/hari untuk review report

**Goals:**
- ✅ Lihat performa bisnis (omzet, profit)
- ✅ Compare performa antar outlet
- ✅ Ambil keputusan strategis (pricing, promo)
- ✅ Monitor karyawan (cashier performance)

**Pain Points:**
- ❌ Tidak punya visibility cross-outlet
- ❌ Laporan tidak real-time
- ❌ Susah tracking cashier yang curang
- ❌ Tidak tahu produk mana yang paling profitable

**User Journey:**
1. Login → Cek summary all outlets
2. Review sales report (daily, weekly, monthly)
3. Review profit margin per category
4. Review cashier performance
5. Export report untuk akuntan

**Needs from StoreWise:**
- Multi-outlet dashboard
- Consolidated reports
- Audit trail untuk transparency
- Export to accounting software

---

## 4. Feature Requirements

### 4.1 Feature: Point of Sale (POS)

**Priority**: P0 (Critical)  
**Epic**: POS-001  
**Dependencies**: Product Management, Shift Management

#### 4.1.1 Product Search & Selection

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-001-001 | Barcode scanner support | P0 | - Support USB barcode scanner<br>- Auto-add to cart after scan<br>- Sound feedback on success/error |
| POS-001-002 | Manual product search | P0 | - Search by name, SKU, barcode<br>- Fuzzy search support<br>- Show product image & price<br>- Response time < 100ms |
| POS-001-003 | Product quick view | P0 | - Show stock availability<br>- Show variants (if any)<br>- Show current promotions |
| POS-001-004 | Browse by category | P1 | - Category navigation sidebar<br>- Show product grid with images<br>- Filter by brand/tag |

#### 4.1.2 Cart Management

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-002-001 | Add to cart | P0 | - Add product with default qty 1<br>- Show cart badge count<br>- Update subtotal real-time |
| POS-002-002 | Edit quantity | P0 | - Increment/decrement buttons<br>- Manual input with validation<br>- Keyboard shortcuts (+/- keys)<br>- Update stock validation |
| POS-002-003 | Remove item | P0 | - Delete button per item<br>- Confirmation dialog<br>- Undo option (5 seconds) |
| POS-002-004 | Clear cart | P0 | - Clear all button<br>- Confirmation dialog<br>- Show count of items to be cleared |
| POS-002-005 | Apply discount | P1 | - Per-item discount (% or Rp)<br>- Transaction discount<br>- Auto-apply member discount<br>- Show discount breakdown |
| POS-002-006 | Add notes | P1 | - Per-item notes<br>- Transaction notes<br>- Max 500 characters |

#### 4.1.3 Customer Selection

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-003-001 | Search customer | P1 | - Search by phone, name, member code<br>- Auto-complete suggestions<br>- Create new customer quick form |
| POS-003-002 | Member benefits | P1 | - Auto-apply member discount<br>- Show points balance<br>- Show tier benefits |
| POS-003-003 | Guest checkout | P0 | - Allow checkout without customer<br>- Optional: capture phone for receipt |

#### 4.1.4 Payment Processing

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-004-001 | Calculate total | P0 | - Subtotal calculation<br>- Discount calculation<br>- Tax calculation<br>- Grand total display |
| POS-004-002 | Cash payment | P0 | - Manual amount input<br>- Quick amount buttons (10K, 20K, 50K, 100K)<br>- Auto-calculate change<br>- Show change prominently |
| POS-004-003 | Card payment | P1 | - Integration with EDC<br>- Card type selection<br>- Approval code entry<br>- Last 4 digits capture |
| POS-004-004 | QRIS payment | P1 | - Generate QR code (Midtrans)<br>- Show QR on screen<br>- Real-time payment status<br>- Auto-complete on success |
| POS-004-005 | E-wallet payment | P1 | - GoPay, OVO, Dana, ShopeePay<br>- Deeplink integration<br>- Payment status webhook |
| POS-004-006 | Split payment | P1 | - Combine 2+ payment methods<br>- Allocate amount per method<br>- Validate total coverage |
| POS-004-007 | Complete sale | P0 | - Generate invoice number<br>- Update stock real-time<br>- Update customer points (if member)<br>- Print receipt (auto or manual) |

#### 4.1.5 Transaction Actions

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-005-001 | Hold transaction | P0 | - Save cart to queue<br>- Add notes (optional)<br>- Show held count badge<br>- Max 10 held transactions |
| POS-005-002 | Recall held transaction | P0 | - List all held transactions<br>- Show details (items, total, time)<br>- Load to cart<br>- Delete from hold queue |
| POS-005-003 | Void transaction | P1 | - Require manager approval<br>- Require void reason<br>- Update stock back<br>- Log to audit trail<br>- Print void receipt |
| POS-005-004 | Refund transaction | P1 | - Search transaction by invoice<br>- Full or partial refund<br>- Require refund reason<br>- Update stock back<br>- Print refund receipt |
| POS-005-005 | Reprint receipt | P1 | - Search transaction by invoice/date<br>- Preview before print<br>- Mark as "COPY" on reprint |

#### 4.1.6 Receipt Management

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-006-001 | Print receipt | P0 | - Support 80mm thermal printer<br>- Include: store info, items, total, payment, QR<br>- Auto-print (configurable)<br>- Print on transaction complete |
| POS-006-002 | Email receipt | P1 | - Send to customer email<br>- HTML formatted<br>- PDF attachment |
| POS-006-003 | WhatsApp receipt | P1 | - Send via WhatsApp Business API<br>- Include receipt image<br>- Transaction summary text |

#### 4.1.7 Keyboard Shortcuts

| Shortcut | Action | Priority |
|----------|--------|----------|
| `F1` | Help | P1 |
| `F2` | Search product | P0 |
| `F3` | Select customer | P1 |
| `F4` | Apply discount | P1 |
| `F5` | Refresh | P0 |
| `F9` | Hold transaction | P0 |
| `F10` | Void transaction | P1 |
| `F11` | Open cash drawer | P1 |
| `F12` | Close shift | P0 |
| `Enter` | Process payment | P0 |
| `Esc` | Cancel/Clear | P0 |
| `+` / `-` | Adjust quantity | P0 |
| `Ctrl+K` | Quick search | P1 |

#### 4.1.8 Offline Mode

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| POS-007-001 | Detect offline | P0 | - Auto-detect internet loss<br>- Show offline indicator (banner)<br>- Switch to offline mode |
| POS-007-002 | Offline transactions | P0 | - Store transactions in IndexedDB<br>- Generate temp invoice numbers<br>- Update local stock cache<br>- Queue for sync |
| POS-007-003 | Auto-sync | P0 | - Detect online status<br>- Sync queued transactions<br>- Priority: sales > inventory > logs<br>- Show sync progress |
| POS-007-004 | Conflict resolution | P1 | - Timestamp-based resolution<br>- Server always wins for stock<br>- Manual resolution UI for critical conflicts |
| POS-007-005 | Manual sync trigger | P1 | - Button to trigger sync<br>- Show sync status per item<br>- Retry failed syncs |

---

### 4.2 Feature: Shift Management

**Priority**: P0 (Critical)  
**Epic**: SHIFT-001  
**Dependencies**: User Management, POS

#### 4.2.1 Open Shift

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SHIFT-001-001 | Open shift form | P0 | - Select outlet (if multi-outlet)<br>- Input opening cash amount<br>- Validate: no open shift for same cashier<br>- Generate shift number |
| SHIFT-001-002 | Cash denomination entry | P1 | - Input: 100K, 50K, 20K, 10K, 5K, 2K, 1K, 500, 200, 100<br>- Auto-calculate total<br>- Optional: take photo of cash |

#### 4.2.2 During Shift

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SHIFT-002-001 | Cash in | P1 | - Add cash to drawer<br>- Require reason (e.g., "Pinjam dari outlet lain")<br>- Log to cash movements |
| SHIFT-002-002 | Cash out | P1 | - Remove cash from drawer<br>- Require reason (e.g., "Bayar supplier")<br>- Require manager approval<br>- Log to cash movements |
| SHIFT-002-003 | Mid-shift count | P1 | - Count current cash<br>- Compare with expected<br>- Show variance<br>- Continue shift |

#### 4.2.3 Close Shift

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SHIFT-003-001 | Close shift form | P0 | - Input closing cash amount<br>- Auto-calculate expected cash<br>- Show variance (over/short)<br>- Require explanation if variance > 5% |
| SHIFT-003-002 | Shift summary | P0 | - Total sales (by payment method)<br>- Total transactions<br>- Total discount given<br>- Cash in/out movements<br>- Expected vs actual cash |
| SHIFT-003-003 | Print shift report | P0 | - Print summary for cashier<br>- Include: transactions list, summary, variance |
| SHIFT-003-004 | Manager approval | P1 | - Require approval if variance > 10%<br>- Manager can add notes<br>- Notify cashier on rejection |

---

### 4.3 Feature: Product Management

**Priority**: P0 (Critical)  
**Epic**: PRODUCT-001  
**Dependencies**: Category Management

#### 4.3.1 Product CRUD

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROD-001-001 | Create product | P0 | - Form: SKU (auto), name*, category*, barcode, cost price*, sell price*, stock*, min qty, UoM<br>- Auto-generate SKU (format: PRD-YYYYMMDD-XXX)<br>- Validate: unique SKU, unique barcode<br>- Upload images (max 5, WebP optimized) |
| PROD-001-002 | Edit product | P0 | - Same form as create<br>- Log changes to audit trail<br>- Alert if price decreased > 20% |
| PROD-001-003 | Delete product | P0 | - Soft delete (set deleted_at)<br>- Validate: no pending transactions<br>- Confirmation dialog<br>- Can be restored within 30 days |
| PROD-001-004 | View product detail | P0 | - Show all info + images<br>- Show stock per outlet (if multi-outlet)<br>- Show stock movements history<br>- Show sales history |
| PROD-001-005 | Product list | P0 | - Table with: image, SKU, name, category, stock, price, status<br>- Sorting, filtering, search<br>- Pagination (50 items/page)<br>- Export to CSV/Excel |

#### 4.3.2 Product Variants

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROD-002-001 | Create variant | P1 | - Parent product + variant attributes (size, color)<br>- Generate variant SKU (parent-SKU + suffix)<br>- Individual pricing & stock per variant |
| PROD-002-002 | Manage variants | P1 | - List all variants under parent<br>- Bulk edit (price, stock)<br>- Activate/deactivate variant |

#### 4.3.3 Barcode Management

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROD-003-001 | Multiple barcodes | P1 | - Add multiple barcodes per product<br>- Mark one as primary<br>- All barcodes work in POS search |
| PROD-003-002 | Generate barcode | P0 | - Generate EAN13 or Code128<br>- Print barcode labels (PDF)<br>- Print options: 1x1, 2x2, 3x3 labels per page |

#### 4.3.4 Bulk Operations

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROD-004-001 | Bulk import | P1 | - Upload CSV/Excel<br>- Validation before import<br>- Show errors with row numbers<br>- Preview before commit<br>- Download import template |
| PROD-004-002 | Bulk export | P0 | - Export filtered list<br>- Format: CSV or Excel<br>- Include images URLs |
| PROD-004-003 | Bulk edit | P1 | - Select multiple products<br>- Edit: category, price, status<br>- Batch update price (increase/decrease by %)<br>- Confirmation with preview |

---

### 4.4 Feature: Stock Management

**Priority**: P0 (Critical)  
**Epic**: STOCK-001  
**Dependencies**: Product Management

#### 4.4.1 Stock Movement Tracking

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| STOCK-001-001 | Auto-update on sale | P0 | - Decrease stock when sale completed<br>- Use batch FIFO/FEFO if batch tracking enabled<br>- Real-time update<br>- Log to stock_movements table |
| STOCK-001-002 | Auto-update on purchase | P0 | - Increase stock when GRN approved<br>- Create batch if batch tracking enabled<br>- Log to stock_movements table |
| STOCK-001-003 | Stock movement log | P0 | - List all movements (in/out/adjustment)<br>- Filter: date, product, type<br>- Export to CSV |

#### 4.4.2 Stock Adjustment

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| STOCK-002-001 | Create adjustment | P0 | - Form: type (IN/OUT/DAMAGED/EXPIRED/LOST/FOUND), product, qty, reason*<br>- Support bulk adjustment (multiple products)<br>- Status: DRAFT → PENDING → APPROVED |
| STOCK-002-002 | Approval workflow | P1 | - Adjustment > 10 items require manager approval<br>- Email notification to manager<br>- Manager can approve/reject with notes<br>- Notification to creator on approval/rejection |
| STOCK-002-003 | Apply adjustment | P0 | - Update stock on approval<br>- Log to stock_movements<br>- Log to audit_logs |

#### 4.4.3 Stock Opname (Stocktaking)

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| STOCK-003-001 | Schedule opname | P1 | - Create opname: outlet, scheduled date, notes<br>- Status: SCHEDULED → IN_PROGRESS → COMPLETED |
| STOCK-003-002 | Counting interface | P1 | - List all active products<br>- Barcode scanning for count<br>- Manual input for non-barcode items<br>- Show system qty vs physical qty<br>- Calculate variance |
| STOCK-003-003 | Variance report | P1 | - Show products with variance<br>- Highlight large variance (> 10%)<br>- Export to Excel |
| STOCK-003-004 | Apply opname results | P1 | - Create stock adjustment from opname<br>- Require manager approval if total variance > Rp 1jt<br>- Update stock on approval |

#### 4.4.4 Batch & Expiry Tracking

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| STOCK-004-001 | Batch entry | P1 | - Capture batch info on GRN: batch no, mfg date, exp date<br>- Link batch to product<br>- Track qty per batch |
| STOCK-004-002 | FIFO/FEFO sales | P1 | - Auto-select oldest batch on sale (FIFO)<br>- Auto-select earliest expiry batch (FEFO)<br>- Configurable in settings |
| STOCK-004-003 | Expiry alerts | P1 | - Alert 60 days before expiry<br>- Critical alert 30 days before expiry<br>- Show in dashboard widget<br>- Email notification to manager |

#### 4.4.5 Low Stock Alerts

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| STOCK-005-001 | Low stock detection | P0 | - Check stock < min_qty<br>- Real-time detection<br>- Show in dashboard widget |
| STOCK-005-002 | Notification | P1 | - In-app notification<br>- Email notification (daily digest)<br>- WhatsApp notification (optional) |
| STOCK-005-003 | Auto-reorder suggestion | P1 | - Calculate reorder qty based on lead time & avg sales<br>- Generate draft PO<br>- Manager can edit and approve |

---

### 4.5 Feature: Supplier & Purchasing

**Priority**: P1 (High)  
**Epic**: PURCHASE-001  
**Dependencies**: Product Management, Stock Management

#### 4.5.1 Supplier Management

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SUPP-001-001 | Create supplier | P1 | - Form: code (auto), name*, contact person, phone*, email, address, payment terms, credit limit<br>- Auto-generate supplier code (format: SUPP-XXXXX) |
| SUPP-001-002 | Supplier list | P1 | - Table with sorting, filtering, search<br>- Show: code, name, contact, total PO, outstanding payables |
| SUPP-001-003 | Supplier detail | P1 | - View all info<br>- Purchase history<br>- Payment history<br>- Performance metrics (on-time delivery, quality) |

#### 4.5.2 Purchase Order (PO)

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PURCH-001-001 | Create PO | P1 | - Form: supplier*, outlet*, expected date, notes<br>- Add products: product, qty, cost price<br>- Calculate subtotal, tax, grand total<br>- Status: DRAFT |
| PURCH-001-002 | PO approval | P1 | - Submit for approval (DRAFT → PENDING)<br>- Manager approves/rejects (PENDING → APPROVED/REJECTED)<br>- Email notification on approval/rejection |
| PURCH-001-003 | Send PO to supplier | P1 | - Status: APPROVED → SENT<br>- Email PO PDF to supplier<br>- Print PO document |
| PURCH-001-004 | PO list | P1 | - Table with: PO number, supplier, date, total, status<br>- Filter by status, date, supplier |

#### 4.5.3 Goods Receipt Note (GRN)

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PURCH-002-001 | Create GRN | P1 | - Select PO (status SENT or CONFIRMED)<br>- For each item: input qty received, batch info (if applicable)<br>- Calculate variance (ordered vs received)<br>- Notes for damaged items |
| PURCH-002-002 | Partial receiving | P1 | - Allow receiving partial qty<br>- PO status: SENT → PARTIALLY_RECEIVED<br>- Can create multiple GRNs for same PO<br>- PO status: FULLY_RECEIVED when all items received |
| PURCH-002-003 | Apply GRN | P1 | - Update product stock<br>- Create batches (if batch tracking enabled)<br>- Update PO status<br>- Log to stock_movements |
| PURCH-002-004 | GRN report | P1 | - PO vs GRN variance report<br>- Show discrepancies<br>- Export to Excel |

---

### 4.6 Feature: Customer Management

**Priority**: P1 (High)  
**Epic**: CUSTOMER-001

#### 4.6.1 Customer CRUD

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| CUST-001-001 | Create customer | P1 | - Form: name*, phone* (unique), email, address, birthday, gender, tier<br>- Auto-generate customer code (CUST-XXXXX)<br>- Auto-assign tier based on lifetime purchase |
| CUST-001-002 | Customer list | P1 | - Table with: code, name, phone, tier, points, lifetime purchase<br>- Search, filter, sort |
| CUST-001-003 | Customer detail | P1 | - View all info<br>- Purchase history<br>- Points history<br>- Edit info |

#### 4.6.2 Member Tiers

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| CUST-002-001 | Define tiers | P1 | - Admin can create tiers (name, min purchase, discount %, point multiplier)<br>- Default tiers: Regular, Silver, Gold, Platinum |
| CUST-002-002 | Auto-upgrade tier | P1 | - Check lifetime purchase after each sale<br>- Auto-upgrade if threshold reached<br>- Notification to customer |

#### 4.6.3 Loyalty Points

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| CUST-003-001 | Earn points | P1 | - Rule: 1 point per Rp 10.000<br>- Apply tier multiplier<br>- Add points on sale completion<br>- Log to points history |
| CUST-003-002 | Redeem points | P1 | - Redeem at POS checkout<br>- Conversion: 100 points = Rp 10.000<br>- Max redeem: 50% of transaction<br>- Deduct points, log history |
| CUST-003-003 | Points expiry | P1 | - Points expire after 180 days<br>- Expire oldest points first (FIFO)<br>- Notification 30 days before expiry |

---

### 4.7 Feature: Promotion Engine

**Priority**: P1 (High)  
**Epic**: PROMO-001  
**Dependencies**: Product Management, Customer Management

#### 4.7.1 Promotion Management

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROMO-001-001 | Create promotion | P1 | - Form: name*, code*, type*, discount value, scope, start/end date, time restrictions<br>- Types: PERCENTAGE, FIXED_AMOUNT, BUY_X_GET_Y, BUNDLE<br>- Scope: ALL, CATEGORY, PRODUCT, BRAND<br>- Time restrictions: days of week, hours |
| PROMO-001-002 | Promotion rules | P1 | - Min purchase amount<br>- Min purchase qty<br>- Max discount amount<br>- Member only<br>- Tier restrictions<br>- Usage limit (total & per customer)<br>- Stackable/non-stackable<br>- Priority (if multiple promos apply) |
| PROMO-001-003 | Promotion list | P1 | - Table with: code, name, type, discount, dates, status<br>- Filter: active, upcoming, expired |
| PROMO-001-004 | Activate/deactivate | P1 | - Toggle status<br>- Auto-activate on start date<br>- Auto-deactivate on end date |

#### 4.7.2 Promotion Application at POS

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROMO-002-001 | Auto-apply promotions | P1 | - Check eligible promotions for cart<br>- Apply best promotion (highest discount)<br>- Respect priority if stackable<br>- Show promotion name in cart |
| PROMO-002-002 | Manual promotion override | P1 | - Cashier can select different promo<br>- Show available promos for current cart<br>- Show discount comparison |
| PROMO-002-003 | Promotion validation | P1 | - Check: date/time valid, min purchase met, usage limit not exceeded<br>- Show error message if invalid |

#### 4.7.3 Voucher/Coupon System

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| PROMO-003-001 | Generate vouchers | P1 | - Bulk generate unique codes<br>- Assign to promotion<br>- Optional: assign to specific customers |
| PROMO-003-002 | Apply voucher at POS | P1 | - Input voucher code<br>- Validate: exists, not used, valid date, min purchase<br>- Apply discount, mark as used |

---

### 4.8 Feature: Reports & Analytics

**Priority**: P0 (Critical)  
**Epic**: REPORT-001

#### 4.8.1 Dashboard

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| DASH-001-001 | KPI cards | P0 | - Today's sales (vs yesterday)<br>- Total transactions (vs yesterday)<br>- Average ticket (vs yesterday)<br>- Gross margin %<br>- Products sold (items count)<br>- Active customers (transacted today) |
| DASH-001-002 | Sales trend chart | P0 | - Line chart: 7 days or 30 days<br>- X-axis: date, Y-axis: sales<br>- Toggle: revenue vs transactions |
| DASH-001-003 | Top products | P0 | - Top 10 by revenue or quantity<br>- Bar chart + table<br>- Date range filter |
| DASH-001-004 | Alert widgets | P0 | - Low stock alerts (count + top 5)<br>- Expired products (count + top 5)<br>- Near-expiry products (count + top 5)<br>- Pending approvals (PO, adjustments, voids) |
| DASH-001-005 | Real-time updates | P1 | - Auto-refresh every 60 seconds<br>- Or use WebSocket for real-time |

#### 4.8.2 Sales Reports

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| REP-001-001 | Daily sales summary | P0 | - Date picker<br>- Metrics: total revenue, transactions, avg ticket, discount, tax, net revenue<br>- Breakdown by: hour, payment method, cashier |
| REP-001-002 | Sales by period | P0 | - Period: daily, weekly, monthly, yearly<br>- Date range picker<br>- Table + chart<br>- Export to Excel/PDF |
| REP-001-003 | Sales comparison | P1 | - Compare: day-over-day, week-over-week, month-over-month, year-over-year<br>- Show growth % |
| REP-001-004 | Sales by product | P0 | - List all products with: qty sold, revenue, profit, margin %<br>- Sort by revenue/qty/profit<br>- Filter by category, date |
| REP-001-005 | Sales by category | P0 | - Pie chart + table<br>- Show revenue & profit per category |
| REP-001-006 | Cashier performance | P1 | - Table: cashier, transactions, sales, avg ticket, void rate<br>- Date range filter |

#### 4.8.3 Profit & Margin Reports

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| REP-002-001 | Gross profit report | P0 | - Calculate: revenue - COGS<br>- Show per product, per category<br>- Show margin %<br>- Date range filter |
| REP-002-002 | Profit trend | P1 | - Line chart: daily/weekly/monthly profit<br>- Show gross profit & margin % |
| REP-002-003 | Product profitability | P0 | - Rank products by profit<br>- Show: revenue, COGS, profit, margin %<br>- Identify top/bottom performers |

#### 4.8.4 Inventory Reports

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| REP-003-001 | Stock level report | P0 | - Current stock for all products<br>- Show: product, stock qty, stock value (qty × cost)<br>- Total inventory value<br>- Filter by category |
| REP-003-002 | Low stock report | P0 | - Products with stock < min_qty<br>- Show shortage qty<br>- Sort by shortage (desc) |
| REP-003-003 | Stock movement report | P0 | - Date range, product filter<br>- Show all movements: in/out/adjustment<br>- Export to Excel |
| REP-003-004 | ABC analysis | P1 | - Categorize products:<br>  - A: Fast-moving (80% of sales, 20% of SKU)<br>  - B: Medium-moving (15% of sales, 30% of SKU)<br>  - C: Slow-moving (5% of sales, 50% of SKU)<br>- Show in chart + table |
| REP-003-005 | Dead stock report | P1 | - Products with no sales in last 90 days<br>- Show: product, last sale date, current stock, stock value<br>- Suggest action: discount or return to supplier |
| REP-003-006 | Expiry report | P1 | - All batches with expiry date<br>- Group by: expired, near-expiry (60 days), ok<br>- Show: product, batch, exp date, qty |

#### 4.8.5 Financial Reports

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| REP-004-001 | Cash flow report | P1 | - Show all cash in/out<br>- Sources: sales, purchases, expenses, cash movements<br>- Net cash flow<br>- Date range filter |
| REP-004-002 | Accounts payable | P1 | - Outstanding payables to suppliers<br>- Aging: 0-30, 31-60, 61-90, 90+ days<br>- Total payables |
| REP-004-003 | Expense report | P1 | - Group by category<br>- Show trend over time<br>- Budget vs actual (if budget set) |

#### 4.8.6 Report Features

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| REP-005-001 | Export to Excel | P0 | - Export current report data<br>- Include charts as images<br>- Formatted table |
| REP-005-002 | Export to PDF | P1 | - Print-friendly format<br>- Include: store logo, report title, date range, data table, charts |
| REP-005-003 | Email report | P1 | - Send current report via email<br>- Attach PDF/Excel<br>- Include summary in email body |
| REP-005-004 | Schedule reports | P1 | - Admin can schedule: daily, weekly, monthly<br>- Select report type & recipients<br>- Auto-send at specified time |

---

### 4.9 Feature: Settings & Configuration

**Priority**: P1 (High)  
**Epic**: SETTINGS-001

#### 4.9.1 Store Settings

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SET-001-001 | Store information | P0 | - Edit: name, logo, address, phone, email, tax ID<br>- Upload logo (max 2MB, PNG/JPG)<br>- Logo preview |
| SET-001-002 | Tax configuration | P0 | - Enable/disable tax<br>- Tax rate (%)<br>- Tax type: inclusive or exclusive<br>- Multiple tax rates (if needed) |
| SET-001-003 | Currency & format | P0 | - Currency (IDR, USD, etc.)<br>- Number format: 1.234,56 vs 1,234.56<br>- Date format: DD/MM/YYYY vs MM/DD/YYYY<br>- Timezone |

#### 4.9.2 POS Settings

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SET-002-001 | Receipt configuration | P0 | - Header text (customizable)<br>- Footer text (customizable)<br>- Show/hide logo<br>- Show/hide customer info<br>- Thank you message |
| SET-002-002 | Printer settings | P0 | - Select receipt printer (list available printers)<br>- Auto-print receipt (yes/no)<br>- Number of copies<br>- Test print button |
| SET-002-003 | POS behavior | P1 | - Default payment method<br>- Ask for customer on every sale (yes/no)<br>- Allow negative stock sales (yes/no)<br>- Quick pay buttons (amounts)<br>- Auto-logout timeout (minutes) |

#### 4.9.3 Inventory Settings

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SET-003-001 | SKU configuration | P0 | - SKU format template<br>- Auto-generate SKU (yes/no)<br>- Starting number |
| SET-003-002 | Stock settings | P0 | - Inventory method: FIFO, LIFO, Average<br>- Low stock threshold (global default)<br>- Enable batch tracking (yes/no)<br>- Enable expiry tracking (yes/no)<br>- Expiry alert days |
| SET-003-003 | Auto-reorder | P1 | - Enable auto-reorder (yes/no)<br>- Lead time (days)<br>- Safety stock (days)<br>- Notification: email/in-app |

#### 4.9.4 Notification Settings

| Requirement ID | Description | Priority | Acceptance Criteria |
|----------------|-------------|----------|---------------------|
| SET-004-001 | Email configuration | P1 | - SMTP server, port, username, password<br>- Sender email & name<br>- Test email button<br>- Enable/disable specific notifications |
| SET-004-002 | WhatsApp configuration | P1 | - WhatsApp Business API key<br>- Phone number format<br>- Test message button<br>- Enable/disable specific notifications |

---

## 5. User Stories & Acceptance Criteria

### 5.1 POS User Stories

#### Story 1: Fast Checkout as Cashier

**As a** cashier,  
**I want to** quickly process customer transactions,  
**So that** I can serve more customers and reduce queue time.

**Acceptance Criteria:**
- [ ] I can scan product barcode and it's added to cart instantly (< 1 second)
- [ ] I can see cart total updating in real-time
- [ ] I can process cash payment with quick amount buttons
- [ ] System auto-calculates change
- [ ] Receipt prints automatically after payment
- [ ] Total checkout time < 30 seconds for average 5-item transaction

**Priority**: P0  
**Story Points**: 8  
**Dependencies**: Product Management, Printer Setup

---

#### Story 2: Handle Refund as Cashier

**As a** cashier,  
**I want to** process product returns and refunds,  
**So that** I can handle customer complaints professionally.

**Acceptance Criteria:**
- [ ] I can search transaction by invoice number or date
- [ ] I can select items to refund (partial or full)
- [ ] I must enter refund reason (dropdown or text)
- [ ] Manager must approve refund > Rp 100.000
- [ ] Stock is returned to inventory automatically
- [ ] Refund receipt is printed
- [ ] Customer points are deducted if applicable

**Priority**: P1  
**Story Points**: 5  
**Dependencies**: Transaction History, Manager Approval System

---

### 5.2 Inventory User Stories

#### Story 3: Restock Products as Manager

**As a** store manager,  
**I want to** create purchase orders for low stock products,  
**So that** I never run out of popular items.

**Acceptance Criteria:**
- [ ] I can see low stock alerts on dashboard
- [ ] I can create PO directly from low stock list
- [ ] System suggests reorder quantity based on avg sales
- [ ] I can edit PO before submitting
- [ ] PO requires my approval before sending to supplier
- [ ] I can email PO to supplier from system
- [ ] I receive notification when goods are received

**Priority**: P1  
**Story Points**: 8  
**Dependencies**: Supplier Management, Stock Tracking

---

#### Story 4: Track Product Expiry as Stock Keeper

**As a** stock keeper,  
**I want to** track products with expiry dates,  
**So that** I can remove expired items before selling them.

**Acceptance Criteria:**
- [ ] I can see expiry date alerts on dashboard (60 days before)
- [ ] I can filter products by expiry date
- [ ] System alerts critical expiry (30 days before)
- [ ] I can create stock adjustment for expired items
- [ ] Expired items are marked and excluded from POS
- [ ] I can export expiry report to Excel

**Priority**: P1  
**Story Points**: 5  
**Dependencies**: Batch Tracking, Stock Adjustment

---

### 5.3 Reporting User Stories

#### Story 5: Analyze Sales Performance as Owner

**As a** business owner,  
**I want to** see daily sales reports and trends,  
**So that** I can make informed business decisions.

**Acceptance Criteria:**
- [ ] I can see today's sales summary on dashboard (revenue, transactions, profit)
- [ ] I can compare today vs yesterday/last week/last month
- [ ] I can see top 10 selling products
- [ ] I can see sales by category (pie chart)
- [ ] I can see hourly sales trend to identify peak hours
- [ ] I can export report to Excel/PDF
- [ ] I can schedule daily report to be emailed every morning

**Priority**: P0  
**Story Points**: 8  
**Dependencies**: Dashboard, Sales Data

---

### 5.4 Multi-User User Stories

#### Story 6: Control Access as Admin

**As a** system administrator,  
**I want to** assign roles and permissions to users,  
**So that** each user can only access features relevant to their job.

**Acceptance Criteria:**
- [ ] I can create custom roles with specific permissions
- [ ] I can assign roles to users
- [ ] Cashiers can only access POS
- [ ] Managers can access POS, Inventory, Reports
- [ ] Only admins can access Settings and User Management
- [ ] I can see audit log of all user actions
- [ ] I can lock/unlock user accounts

**Priority**: P0  
**Story Points**: 13  
**Dependencies**: User Management, RBAC System

---

## 6. Technical Requirements

### 6.1 System Architecture

#### 6.1.1 Overall Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  React Frontend │◄───────►│  Express API    │
│  (TypeScript)   │         │  (Node.js)      │
│                 │         │                 │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
         │                  ┌────────▼────────┐
         │                  │                 │
         │                  │   PostgreSQL    │
         │                  │   Database      │
         │                  │                 │
         │                  └─────────────────┘
         │
         │                  ┌─────────────────┐
         │                  │                 │
         └─────────────────►│   IndexedDB     │
                            │   (Offline)     │
                            │                 │
                            └─────────────────┘
```

#### 6.1.2 Technology Stack (Actual Implementation)

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend** |
| Framework | React | 18.3+ | Industry standard, hooks, lazy loading |
| Language | TypeScript | 5.5+ | Type safety, better DX |
| Build Tool | Vite | 5.4+ | Fast builds, HMR |
| Router | TanStack Router | Latest | Modern routing with lazy loading |
| State Management | Zustand | 4.5+ | Simple, lightweight state management |
| Server State | TanStack Query | 5.50+ | API calls, caching, devtools |
| Forms | React Hook Form | 7.52+ | Performance, validation |
| Validation | Zod | 3.23+ | Type-safe validation |
| UI Components | shadcn/ui | Latest | Built on Radix UI, accessible |
| Styling | Tailwind CSS | 4.0+ | Utility-first, custom theming |
| Icons | Lucide React | Latest | Modern icon library |
| Date Utils | date-fns | Latest | Date manipulation |
| Notifications | Sonner | Latest | Toast notifications |
| **Backend** |
| Runtime | Node.js | 18+ LTS | Stable, long-term support |
| Framework | Express.js | 4.19+ | Mature, flexible |
| ORM | Prisma | 5.18+ | Type-safe, migrations |
| Database | SQLite | 3+ | Simple, reliable for development |
| Validation | Zod | 3.23+ | Shared with frontend |
| Language | TypeScript | 5.5+ | Type-safe development |
| **DevOps** |
| Monorepo | Turbo | Latest | Fast builds, caching |
| Package Manager | npm | Latest | Standard package manager |
| Linting | ESLint | Latest | Code quality |
| Formatting | Prettier | Latest | Code consistency |

#### 6.1.3 Database Schema

**Key Tables (Simplified):**

```sql
users (id, email, password_hash, name, role_id, outlet_id, is_active, created_at, updated_at, deleted_at)
roles (id, name, permissions)
products (id, sku, name, category_id, cost_price, sell_price, stock_qty, min_qty, is_active, created_at, updated_at, deleted_at)
categories (id, parent_id, name, slug)
customers (id, code, name, phone, email, tier_id, points, lifetime_purchase, created_at, updated_at, deleted_at)
suppliers (id, code, name, contact, phone, email, payment_terms, is_active, created_at, updated_at, deleted_at)
sales (id, invoice_number, outlet_id, cashier_id, customer_id, shift_id, subtotal, discount, tax, grand_total, payment_method, status, created_at)
sale_items (id, sale_id, product_id, qty, price, discount, subtotal)
purchase_orders (id, po_number, supplier_id, total, status, created_at)
purchase_order_items (id, po_id, product_id, qty, cost_price)
stock_movements (id, product_id, type, qty, ref_type, ref_id, created_at)
shifts (id, cashier_id, opened_at, closed_at, opening_cash, closing_cash, expected_cash, variance, status)
```

**See full schema in MVP document for complete DDL.**

#### 6.1.4 API Design (Current Implementation)

**RESTful API Endpoints:**

```
Products:
GET    /api/products              - Get all products with filtering
GET    /api/products/:id          - Get single product
POST   /api/products              - Create new product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product

Categories:
GET    /api/categories            - Get all categories
POST   /api/categories            - Create category
PUT    /api/categories/:id        - Update category
DELETE /api/categories/:id        - Delete category

Sales:
GET    /api/sales                 - Get sales history
POST   /api/sales                 - Create new sale
GET    /api/sales/:id             - Get sale details

Customers:
GET    /api/customers             - Get all customers
POST   /api/customers             - Create customer
PUT    /api/customers/:id         - Update customer
DELETE /api/customers/:id         - Delete customer

Reports:
GET    /api/reports/sales         - Sales analytics
GET    /api/reports/products      - Product performance
GET    /api/reports/inventory     - Inventory reports
```

**API Characteristics:**
- RESTful design with proper HTTP methods
- JSON responses with consistent structure
- Express.js with TypeScript
- Prisma ORM for database operations
- CORS enabled for frontend integration
- Error handling with proper HTTP status codes

**API Standards:**
- RESTful conventions
- JSON request/response
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Pagination: `?page=1&limit=50`
- Sorting: `?sort=created_at&order=desc`
- Filtering: `?filter[category]=1&filter[status]=active`

### 6.2 Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Frontend** |
| Page Load Time | < 2 seconds | Lighthouse |
| Time to Interactive | < 3 seconds | Lighthouse |
| First Contentful Paint | < 1.5 seconds | Lighthouse |
| Bundle Size | < 300 KB (gzipped) | Webpack Bundle Analyzer |
| Lighthouse Score | > 90 | Lighthouse CI |
| **Backend** |
| API Response Time (p50) | < 100ms | Monitoring |
| API Response Time (p95) | < 200ms | Monitoring |
| API Response Time (p99) | < 500ms | Monitoring |
| Database Query Time | < 50ms | Prisma Metrics |
| **System** |
| Concurrent Users | 100+ | Load Testing (k6) |
| Transactions per Day | 1000+ | Monitoring |
| Uptime | > 99.9% | Uptime Monitoring |

### 6.3 Security Requirements

#### 6.3.1 Authentication & Authorization

| Requirement | Implementation |
|-------------|----------------|
| Password Policy | - Min 8 characters<br>- Must contain: uppercase, lowercase, number, symbol<br>- Cannot reuse last 5 passwords |
| Password Storage | - Argon2 hashing<br>- Individual salt per user |
| Session Management | - JWT access token (15 min expiry)<br>- Refresh token (7 days expiry)<br>- Max 3 concurrent sessions |
| 2FA | - TOTP (Google Authenticator)<br>- Mandatory for admin users<br>- Backup codes (10 codes) |
| Login Security | - Rate limiting: 5 attempts per 15 minutes<br>- Account lock after 5 failed attempts<br>- Login history tracking<br>- Suspicious activity alerts |

#### 6.3.2 Data Security

| Requirement | Implementation |
|-------------|----------------|
| Data at Rest | - Database encryption (optional, PostgreSQL TDE)<br>- Encrypted backups |
| Data in Transit | - HTTPS only (TLS 1.3)<br>- Secure WebSocket (WSS) |
| Sensitive Data | - PII encryption (customer email, address)<br>- Masked card numbers (show last 4 digits only)<br>- No logging of passwords/tokens |
| SQL Injection Prevention | - Parameterized queries (Prisma)<br>- Input validation (Zod)<br>- ORM escaping |
| XSS Prevention | - React auto-escaping<br>- Content Security Policy headers<br>- DOMPurify for user HTML |
| CSRF Prevention | - CSRF tokens<br>- SameSite cookies<br>- Origin validation |

#### 6.3.3 Compliance

| Standard | Requirement |
|----------|-------------|
| GDPR | - User data export<br>- Right to be forgotten (soft delete)<br>- Consent management |
| PCI DSS | - No card data storage (use payment gateway tokens)<br>- Secure transmission<br>- Access logging |
| Audit Trail | - Log all critical actions (CREATE, UPDATE, DELETE, VOID)<br>- Immutable logs (append-only)<br>- 2-year retention |

### 6.4 Scalability Requirements

| Aspect | Requirement | Implementation |
|--------|-------------|----------------|
| Horizontal Scaling | Support multiple API instances | - Stateless API<br>- Redis session store<br>- Load balancer (Nginx) |
| Database Scaling | Handle growing data | - Connection pooling<br>- Read replicas (future)<br>- Partitioning (future) |
| Caching | Reduce database load | - Redis for frequently accessed data<br>- TTL-based invalidation<br>- Cache warming |
| File Storage | Scalable media storage | - Cloud storage (AWS S3 / GCS)<br>- CDN for static assets |

### 6.5 Monitoring & Observability

| Tool | Purpose | Metrics |
|------|---------|---------|
| Sentry | Error tracking | - Error rate<br>- Error details & stack traces<br>- User impact |
| Prometheus | Metrics collection | - Request rate<br>- Response time<br>- Error rate<br>- Resource usage (CPU, memory) |
| Grafana | Metrics visualization | - Dashboards<br>- Alerts<br>- Trend analysis |
| Winston | Application logging | - Structured logs (JSON)<br>- Log levels (error, warn, info, debug)<br>- Log aggregation |

---

## 7. UI/UX Requirements

### 7.1 Design Principles

1. **Clean & Minimal** - Fokus pada konten, hindari clutter
2. **Fast & Responsive** - Interaksi instant, no lag
3. **Consistent** - Pattern yang sama di seluruh aplikasi
4. **Accessible** - WCAG 2.1 AA compliant
5. **Professional** - Suitable untuk business environment

### 7.2 Visual Design

#### 7.2.1 Color Palette

```
Primary: #3b82f6 (Blue 500)
Secondary: #64748b (Gray 600)
Success: #10b981 (Green 500)
Warning: #f59e0b (Amber 500)
Error: #ef4444 (Red 500)
Background: #ffffff (Light) / #0f172a (Dark)
```

#### 7.2.2 Typography

```
Font Family: Inter, system-ui, sans-serif
Font Sizes: 12px, 14px, 16px (base), 18px, 20px, 24px, 30px, 36px
Font Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
Line Height: 1.5 (body), 1.2 (headings)
```

#### 7.2.3 Spacing

```
Base Unit: 4px
Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### 7.3 Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

