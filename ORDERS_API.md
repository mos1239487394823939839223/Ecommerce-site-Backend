# 📋 Orders API - Complete Documentation

## ✅ **Orders System Implemented with MVC Pattern!**

The complete order management system is now available with:
- ✅ Model (`models/orderModel.js`)
- ✅ Service/Controller (`services/orderService.js`)
- ✅ Routes (`routes/orderRoute.js`)
- ✅ Validators (`utils/validator/orderValidator.js`)

---

## 📦 Order Model Schema

```javascript
{
  user: ObjectId (ref: User),
  cartItems: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      color: String,
      price: Number
    }
  ],
  taxPrice: Number (default: 0),
  shippingPrice: Number (default: 0),
  totalOrderPrice: Number,
  paymentMethod: "cash" | "card" (default: "cash"),
  isPaid: Boolean (default: false),
  paidAt: Date,
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  deliveredAt: Date,
  shippingAddress: {
    details: String,
    phone: String,
    city: String,
    postalCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Available Endpoints

### **Base URLs:**
- `/api/v1/orders`
- `/backend/orders`
- `/api/admin/orders`

---

## 📋 **1. Create Order**

```
POST /api/v1/orders
POST /backend/orders
POST /api/admin/orders
```

**Request Body:**
```json
{
  "cartItems": [
    {
      "product": "690b48537ca14287c9ed2448",
      "quantity": 2,
      "color": "red"
    }
  ],
  "shippingAddress": {
    "details": "123 Main St, Apt 4B",
    "phone": "+1234567890",
    "city": "New York",
    "postalCode": "10001"
  },
  "paymentMethod": "cash"
}
```

**Required Fields:**
- `cartItems` - Array with at least one item
- `cartItems[].product` - Valid product ID
- `cartItems[].quantity` - Minimum 1
- `shippingAddress.details` - Address details
- `shippingAddress.phone` - Valid phone number
- `shippingAddress.city` - City name

**Optional Fields:**
- `shippingAddress.postalCode`
- `paymentMethod` - "cash" or "card" (default: "cash")
- `cartItems[].color` - Product color

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "user": "690b2c84330eee50ee271f58",
    "cartItems": [...],
    "taxPrice": 19.98,
    "shippingPrice": 0,
    "totalOrderPrice": 219.78,
    "paymentMethod": "cash",
    "isPaid": false,
    "orderStatus": "pending",
    "shippingAddress": {...},
    "createdAt": "2025-11-05T16:30:00.000Z"
  }
}
```

**What Happens:**
- ✅ Validates product IDs and stock availability
- ✅ Calculates item prices (uses discount price if available)
- ✅ Adds 10% tax
- ✅ Adds $10 shipping (free over $100)
- ✅ Creates order
- ✅ Updates product quantities and sold count
- ✅ Clears user's cart

---

## 📋 **2. Get All Orders (Admin)**

```
GET /api/v1/orders
GET /backend/orders
GET /api/admin/orders
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by order status
- `isPaid` - Filter by payment status (true/false)

**Examples:**
```
GET /backend/orders?page=1&limit=20
GET /backend/orders?status=pending
GET /backend/orders?isPaid=true
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "cartItems": [
        {
          "product": {
            "_id": "...",
            "title": "iPhone 15",
            "imageCover": "/uploads/products/1.jpg"
          },
          "quantity": 1,
          "price": 999.99
        }
      ],
      "totalOrderPrice": 1109.99,
      "orderStatus": "pending",
      "isPaid": false,
      "createdAt": "2025-11-05T16:30:00.000Z"
    }
  ]
}
```

---

## 📋 **3. Get Single Order**

```
GET /api/v1/orders/:id
GET /backend/orders/:id
GET /api/admin/orders/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "user": {...},
    "cartItems": [...],
    "totalOrderPrice": 1109.99,
    "orderStatus": "processing",
    "shippingAddress": {...}
  }
}
```

---

## 📋 **4. Get My Orders (User)**

```
GET /api/v1/orders/myOrders
GET /backend/orders/myOrders
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "total": 12,
  "page": 1,
  "pages": 2,
  "data": [...]
}
```

---

## 📋 **5. Update Order Status (Admin)**

```
PUT /api/v1/orders/:id/status
PUT /backend/orders/:id/status
PUT /api/admin/orders/:id/status
```

**Request Body:**
```json
{
  "orderStatus": "processing"
}
```

**Valid Status Values:**
- `pending` - Order placed
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered (auto-sets deliveredAt)
- `cancelled` - Order cancelled

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "orderStatus": "processing",
    ...
  }
}
```

---

## 📋 **6. Mark Order as Paid (Admin)**

```
PUT /api/v1/orders/:id/pay
PUT /backend/orders/:id/pay
PUT /api/admin/orders/:id/pay
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "isPaid": true,
    "paidAt": "2025-11-05T16:35:00.000Z",
    ...
  }
}
```

---

## 📋 **7. Update Order (Admin)**

```
PUT /api/v1/orders/:id
PUT /backend/orders/:id
PUT /api/admin/orders/:id
```

**Request Body:** (all fields optional)
```json
{
  "shippingAddress": {
    "details": "New address"
  },
  "paymentMethod": "card"
}
```

---

## 📋 **8. Delete Order (Admin)**

```
DELETE /api/v1/orders/:id
DELETE /backend/orders/:id
DELETE /api/admin/orders/:id
```

**Response:**
```
Status: 204 No Content
```

---

## 📊 **9. Get Order Statistics (Admin)**

```
GET /api/v1/orders/stats
GET /backend/orders/stats
GET /api/admin/orders/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalOrders": 45,
    "pendingOrders": 10,
    "processingOrders": 15,
    "shippedOrders": 8,
    "deliveredOrders": 10,
    "cancelledOrders": 2,
    "paidOrders": 30,
    "totalRevenue": 45000.00,
    "averageOrderValue": 1000.00
  }
}
```

---

## 💰 Pricing Calculation

### **Automatic Price Calculation:**

1. **Item Price:**
   - Uses `priceAfterDiscount` if available
   - Otherwise uses regular `price`

2. **Subtotal:**
   - Sum of (item price × quantity) for all items

3. **Tax:**
   - 10% of subtotal

4. **Shipping:**
   - FREE if subtotal > $100
   - $10 if subtotal ≤ $100

5. **Total:**
   - Subtotal + Tax + Shipping

### **Example:**
```
Item 1: $100 × 2 = $200
Item 2: $50 × 1 = $50
----------------------------
Subtotal: $250
Tax (10%): $25
Shipping: $0 (free over $100)
----------------------------
Total: $275
```

---

## 🔄 Order Lifecycle

```
1. pending      → Order created, waiting for confirmation
       ↓
2. processing   → Order confirmed, being prepared
       ↓
3. shipped      → Order shipped to customer
       ↓
4. delivered    → Order delivered (sets deliveredAt date)

Can be cancelled at any stage:
5. cancelled    → Order cancelled
```

---

## 🧪 Testing the API

### **Test 1: Create an Order**

```bash
curl -X POST http://localhost:8000/backend/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [
      {
        "product": "690b48537ca14287c9ed2448",
        "quantity": 2,
        "color": "blue"
      }
    ],
    "shippingAddress": {
      "details": "123 Main Street",
      "phone": "+1234567890",
      "city": "New York",
      "postalCode": "10001"
    },
    "paymentMethod": "cash"
  }'
```

### **Test 2: Get All Orders**

```bash
curl http://localhost:8000/backend/orders
```

### **Test 3: Update Order Status**

```bash
curl -X PUT http://localhost:8000/backend/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"orderStatus": "processing"}'
```

### **Test 4: Mark as Paid**

```bash
curl -X PUT http://localhost:8000/backend/orders/ORDER_ID/pay
```

### **Test 5: Get Statistics**

```bash
curl http://localhost:8000/backend/orders/stats
```

---

## 🎯 Frontend Integration

### **TypeScript Example:**

```typescript
// Create order
async function createOrder(orderData: OrderData) {
  const response = await fetch('http://localhost:8000/backend/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
}

// Get user's orders
async function getMyOrders(page = 1) {
  const response = await fetch(
    `http://localhost:8000/backend/orders/myOrders?page=${page}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
}

// Admin: Get all orders
async function getAllOrders(filters: any) {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `http://localhost:8000/backend/orders?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
}

// Admin: Update order status
async function updateOrderStatus(orderId: string, status: string) {
  const response = await fetch(
    `http://localhost:8000/backend/orders/${orderId}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderStatus: status })
    }
  );
  return response.json();
}
```

---

## 🔐 Security Notes

⚠️ **Important:** Currently, the order routes don't have authentication middleware!

### **TODO: Add Authentication**

Uncomment these lines in `routes/orderRoute.js`:

```javascript
// const { protect, allowTo } = require("../middlewares/authMiddleware");

// Then add to routes:
router.post("/", protect, createOrderValidator, createOrder);
router.get("/myOrders", protect, getMyOrders);
router.get("/", protect, allowTo('admin'), getAllOrders);
router.put("/:id/status", protect, allowTo('admin'), updateOrderStatus);
```

### **Create Auth Middleware:**

You'll need to create `middlewares/authMiddleware.js` with:
- `protect` - Verify JWT token and attach user to request
- `allowTo(roles)` - Check if user has required role

---

## 📋 Error Responses

### **400 - Bad Request**
```json
{
  "errors": [
    {
      "msg": "Cart items must be an array with at least one item",
      "path": "cartItems"
    }
  ]
}
```

### **404 - Not Found**
```json
{
  "status": "fail",
  "message": "No order found with id: 123"
}
```

### **403 - Forbidden**
```json
{
  "status": "fail",
  "message": "You are not authorized to access this order"
}
```

---

## ✅ Features Implemented

- ✅ Create order with cart items
- ✅ Automatic price calculation (tax + shipping)
- ✅ Stock validation before order
- ✅ Update product quantities after order
- ✅ Clear cart after order
- ✅ Get all orders with pagination
- ✅ Get single order
- ✅ Get user's orders
- ✅ Update order status
- ✅ Mark order as paid
- ✅ Delete order
- ✅ Order statistics
- ✅ Filter by status and payment
- ✅ Auto-populate user and product details
- ✅ Track delivery date

---

## 🎯 Next Steps

1. **Add Authentication Middleware** - Protect routes
2. **Add Payment Integration** - Stripe, PayPal, etc.
3. **Add Email Notifications** - Order confirmations
4. **Add Invoice Generation** - PDF invoices
5. **Add Order Tracking** - Tracking numbers
6. **Add Refund System** - Handle returns

---

## 📊 Summary

**Total Endpoints: 9**

| Endpoint | Method | Access |
|----------|--------|--------|
| Create Order | POST | User |
| Get All Orders | GET | Admin |
| Get Single Order | GET | User/Admin |
| Get My Orders | GET | User |
| Update Status | PUT | Admin |
| Mark as Paid | PUT | Admin |
| Update Order | PUT | Admin |
| Delete Order | DELETE | Admin |
| Get Statistics | GET | Admin |

**Your complete Order Management System is ready! 📋✨**

