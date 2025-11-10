# 📐 Order System - MVC Architecture

## 🏗️ Complete MVC Pattern Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
│                  (Frontend / Postman / cURL)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVER.JS                              │
│  • Registers routes                                             │
│  • app.use("/api/v1/orders", orderRoute)                       │
│  • app.use("/backend/orders", orderRoute)                      │
│  • app.use("/api/admin/orders", orderRoute)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTES (orderRoute.js)                       │
│  • Defines HTTP methods (GET, POST, PUT, DELETE)               │
│  • Maps URLs to validators and controllers                     │
│  • router.post("/", createOrderValidator, createOrder)         │
│  • router.get("/", getAllOrders)                               │
│  • router.put("/:id/status", updateOrderStatus)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              VALIDATORS (orderValidator.js)                     │
│  • Validates request data                                       │
│  • Checks required fields                                       │
│  • Validates data types                                         │
│  • Returns validation errors if any                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           CONTROLLERS/SERVICES (orderService.js)                │
│  • Business logic layer                                         │
│  • Interacts with models                                        │
│  • Processes data                                               │
│  • Returns responses                                            │
│                                                                 │
│  Functions:                                                     │
│  • createOrder() - Create new order                            │
│  • getAllOrders() - List all orders                            │
│  • getOrder() - Get single order                               │
│  • getMyOrders() - Get user's orders                           │
│  • updateOrderStatus() - Update status                         │
│  • updateOrderToPaid() - Mark as paid                          │
│  • deleteOrder() - Delete order                                │
│  • getOrderStats() - Get statistics                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MODEL (orderModel.js)                         │
│  • Defines data structure (Schema)                             │
│  • Database operations                                          │
│  • Mongoose model                                               │
│  • Data validation rules                                        │
│  • Relationships (refs to User, Product)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                           │
│  • Stores order documents                                       │
│  • Collection: "orders"                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure

```
/Users/karim/Desktop/Backend/Ecommerce Backend Practice/
│
├── models/
│   └── orderModel.js                    ← MODEL (Schema)
│
├── services/
│   └── orderService.js                  ← CONTROLLER (Business Logic)
│
├── routes/
│   └── orderRoute.js                    ← ROUTES (URL Mapping)
│
├── utils/
│   └── validator/
│       └── orderValidator.js            ← VALIDATORS
│
└── server.js                            ← ENTRY POINT
```

---

## 🔄 Request Flow Example

### **Example: Create Order**

```
1. CLIENT sends POST request:
   POST http://localhost:8000/backend/orders
   Body: { cartItems: [...], shippingAddress: {...} }
   
   ↓
   
2. SERVER.JS receives request:
   app.use("/backend/orders", orderRoute)
   
   ↓
   
3. ROUTES (orderRoute.js):
   router.post("/", createOrderValidator, createOrder)
   
   ↓
   
4. VALIDATOR (orderValidator.js):
   • Checks cartItems exists
   • Validates product IDs
   • Validates shipping address
   • Returns errors if invalid
   
   ↓
   
5. CONTROLLER (orderService.js):
   exports.createOrder = asyncHandler(async (req, res, next) => {
     • Validates products exist in DB
     • Checks stock availability
     • Calculates prices
     • Creates order in DB
     • Updates product quantities
     • Clears cart
     • Returns response
   })
   
   ↓
   
6. MODEL (orderModel.js):
   • Order.create({ ... })
   • Saves to MongoDB
   • Returns created order document
   
   ↓
   
7. RESPONSE to CLIENT:
   {
     "status": "success",
     "data": { order details }
   }
```

---

## 🎯 MVC Components Breakdown

### **M - MODEL** (`models/orderModel.js`)

**Responsibility:** Define data structure and database schema

```javascript
const orderSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  cartItems: [...],
  totalOrderPrice: Number,
  orderStatus: String,
  // ... more fields
});

module.exports = mongoose.model("Order", orderSchema);
```

**What it does:**
- ✅ Defines order structure
- ✅ Sets validation rules
- ✅ Defines relationships
- ✅ Provides database methods

---

### **V - VIEW** (Frontend/API Response)

**Responsibility:** Present data to user

In REST API, the "View" is the JSON response:

```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "user": {...},
    "cartItems": [...],
    "totalOrderPrice": 1109.99,
    "orderStatus": "pending"
  }
}
```

---

### **C - CONTROLLER** (`services/orderService.js`)

**Responsibility:** Business logic and orchestration

```javascript
exports.createOrder = asyncHandler(async (req, res, next) => {
  // 1. Validate products
  // 2. Check stock
  // 3. Calculate prices
  // 4. Create order
  // 5. Update inventory
  // 6. Clear cart
  // 7. Send response
});
```

**What it does:**
- ✅ Processes requests
- ✅ Validates business rules
- ✅ Coordinates with models
- ✅ Prepares responses

---

## 🔗 Additional Layers

### **ROUTES** (`routes/orderRoute.js`)

**Responsibility:** URL mapping

```javascript
router.post("/", createOrderValidator, createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrder);
```

Maps HTTP methods + URLs to controllers

---

### **VALIDATORS** (`utils/validator/orderValidator.js`)

**Responsibility:** Input validation

```javascript
check("cartItems")
  .isArray({ min: 1 })
  .withMessage("Cart items required");
```

Validates request data before reaching controller

---

### **MIDDLEWARE** (`middlewares/`)

**Responsibility:** Request processing

- Error handling
- Validation
- Authentication (TODO)
- Authorization (TODO)

---

## 📊 Data Flow Diagram

```
┌─────────┐
│ Client  │
└────┬────┘
     │ HTTP Request
     ▼
┌─────────────┐
│   Routes    │ ← Maps URL to Controller
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Validators  │ ← Validates Input
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Controller  │ ← Business Logic
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Model     │ ← Database Operations
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  MongoDB    │ ← Data Storage
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Response   │ ← JSON to Client
└─────────────┘
```

---

## 🎯 Benefits of MVC Pattern

### **1. Separation of Concerns**
- Each layer has one responsibility
- Easy to understand and maintain

### **2. Reusability**
- Models can be used by multiple controllers
- Validators can be shared across routes

### **3. Testability**
- Each layer can be tested independently
- Mock dependencies easily

### **4. Scalability**
- Add new features without affecting others
- Easy to modify individual components

### **5. Maintainability**
- Clear structure
- Easy to locate bugs
- Simple to add new developers

---

## 📝 Complete Endpoint Mapping

```
POST /backend/orders
  → router.post("/", createOrderValidator, createOrder)
  → Validator: orderValidator.createOrderValidator
  → Controller: orderService.createOrder
  → Model: Order.create()
  
GET /backend/orders
  → router.get("/", getAllOrders)
  → Controller: orderService.getAllOrders
  → Model: Order.find()
  
GET /backend/orders/:id
  → router.get("/:id", getOrderValidator, getOrder)
  → Validator: orderValidator.getOrderValidator
  → Controller: orderService.getOrder
  → Model: Order.findById()
  
PUT /backend/orders/:id/status
  → router.put("/:id/status", updateOrderStatusValidator, updateOrderStatus)
  → Validator: orderValidator.updateOrderStatusValidator
  → Controller: orderService.updateOrderStatus
  → Model: order.save()
```

---

## ✅ Order System - Complete MVC Implementation

**All layers properly implemented:**
- ✅ Model (Schema & Database)
- ✅ View (JSON Responses)
- ✅ Controller (Business Logic)
- ✅ Routes (URL Mapping)
- ✅ Validators (Input Validation)
- ✅ Server Integration

**Your order system follows industry-standard MVC architecture! 🎉**

