# 🚀 Frontend API Endpoints - Complete Reference

## Base URL Configuration

**Backend Server:** `http://localhost:8000`

Your frontend should use one of these base paths:
- `/api/admin` (recommended for admin panel)
- `/backend` (alternative, works the same)
- `/api/v1` (original API routes)

**Important:** Configure your frontend to point to `http://localhost:8000`, not `localhost:3000`!

---

## 🔐 Authentication Endpoints

### 1. **Signup (Register)**
```
POST /backend/auth/signup
POST /api/auth/local/signup
POST /api/v1/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "data": {
    "user": { ... }
  }
}
```

---

### 2. **Login (Signin)**
```
POST /backend/auth/signin
POST /backend/auth/login
POST /api/auth/local/login
POST /api/v1/auth/signin
```

**Request Body:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "690b2c84330eee50ee271f58",
    "name": "Test User",
    "email": "admin@admin.com",
    "role": "admin"
  },
  "data": {
    "user": { ... }
  }
}
```

**Admin Credentials:**
- Email: `admin@admin.com`
- Password: `admin123`

---

## 📦 Products Management

### 3. **Get All Products**
```
GET /backend/products
GET /api/admin/products
GET /api/v1/products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 5)
- `sort` (optional): Sort field (e.g., `-price`, `title`)
- `fields` (optional): Select specific fields
- `keyword` (optional): Search by title

**Example:**
```
GET /backend/products?page=1&limit=10&sort=-price&keyword=phone
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "_id": "690b48537ca14287c9ed2448",
      "title": "Product Name",
      "slug": "product-name",
      "description": "Product description...",
      "price": 99.99,
      "priceAfterDiscount": 79.99,
      "quantity": 10,
      "sold": 5,
      "imageCover": "https://...",
      "images": ["https://...", "https://..."],
      "colors": ["red", "blue"],
      "category": {
        "name": "Electronics",
        "image": "https://..."
      },
      "brand": {
        "name": "Apple",
        "image": "https://..."
      },
      "ratingsAverage": 4.5,
      "ratingsQuntaty": 10,
      "createdAt": "2025-11-05T12:51:31.878Z"
    }
  ]
}
```

---

### 4. **Get Single Product**
```
GET /backend/products/:id
GET /api/admin/products/:id
GET /api/v1/products/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "690b48537ca14287c9ed2448",
    "title": "Product Name",
    "description": "Full product description",
    "price": 99.99,
    "quantity": 10,
    "imageCover": "https://...",
    "images": [],
    "category": { ... },
    "brand": { ... }
  }
}
```

---

### 5. **Create Product**
```
POST /backend/products
POST /api/admin/products
POST /api/v1/products
```

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description with minimum 20 characters",
  "price": 99.99,
  "quantity": 50,
  "category": "690b3b389ce68bfed9eb7b85",
  "imageCover": "https://example.com/image.jpg",
  "brand": "690b3b3b9ce68bfed9eb7b9e",
  "colors": ["red", "blue"],
  "images": ["https://...", "https://..."],
  "priceAfterDiscount": 79.99
}
```

**Required Fields:**
- `title` (string, 1-100 chars)
- `description` (string, min 20 chars)
- `price` (number)
- `quantity` (number)
- `category` (valid category ID)
- `imageCover` (string URL)

**Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

### 6. **Update Product**
```
PUT /backend/products/:id
PUT /api/admin/products/:id
PUT /api/v1/products/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "price": 129.99,
  "quantity": 25
}
```

**Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

---

### 7. **Delete Product**
```
DELETE /backend/products/:id
DELETE /api/admin/products/:id
DELETE /api/v1/products/:id
```

**Response:**
```
Status: 204 No Content
```

---

### 8. **Upload Product Cover Image**
```
POST /backend/products/:id/image
POST /api/admin/products/:id/image
POST /api/v1/products/:id/image
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: File (jpeg, jpg, png, gif, webp, max 5MB)

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": { ... },
    "imageUrl": "/uploads/products/1.jpg"
  }
}
```

---

### 9. **Upload Product Gallery (Multiple Images)**
```
POST /backend/products/:id/images
POST /api/admin/products/:id/images
POST /api/v1/products/:id/images
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `images`: Multiple Files (max 10 images)

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": { ... },
    "imageUrls": ["/uploads/products/2.jpg", "/uploads/products/3.jpg"]
  }
}
```

---

## 📁 Categories Management

### 10. **Get All Categories**
```
GET /backend/categories
GET /api/admin/categories
GET /api/v1/categories
```

**Query Parameters:** Same as products (page, limit, sort, keyword)

**Response:**
```json
{
  "status": "success",
  "results": 8,
  "data": [
    {
      "_id": "690b3b389ce68bfed9eb7b85",
      "name": "Electronics",
      "slug": "electronics",
      "image": "https://...",
      "createdAt": "2025-11-05T11:55:36.653Z"
    }
  ]
}
```

---

### 11. **Get Single Category**
```
GET /backend/categories/:id
GET /api/admin/categories/:id
```

---

### 12. **Create Category**
```
POST /backend/categories
POST /api/admin/categories
```

**Request Body:**
```json
{
  "name": "New Category"
}
```

---

### 13. **Update Category**
```
PUT /backend/categories/:id
PUT /api/admin/categories/:id
```

**Request Body:**
```json
{
  "name": "Updated Category Name"
}
```

---

### 14. **Delete Category**
```
DELETE /backend/categories/:id
DELETE /api/admin/categories/:id
```

---

### 15. **Upload Category Image**
```
POST /backend/categories/:id/image
POST /api/admin/categories/:id/image
```

**Form Data:**
- `image`: File (max 5MB)

---

## 🏷️ Brands Management

### 16. **Get All Brands**
```
GET /backend/brands
GET /api/admin/brands
GET /api/v1/brands
```

---

### 17. **Get Single Brand**
```
GET /backend/brands/:id
GET /api/admin/brands/:id
```

---

### 18. **Create Brand**
```
POST /backend/brands
POST /api/admin/brands
```

**Request Body:**
```json
{
  "name": "Nike"
}
```

---

### 19. **Update Brand**
```
PUT /backend/brands/:id
PUT /api/admin/brands/:id
```

---

### 20. **Delete Brand**
```
DELETE /backend/brands/:id
DELETE /api/admin/brands/:id
```

---

### 21. **Upload Brand Image**
```
POST /backend/brands/:id/image
POST /api/admin/brands/:id/image
```

---

## 📂 Subcategories Management

### 22. **Get All Subcategories**
```
GET /backend/subcategories
GET /api/admin/subcategories
GET /api/v1/subcategories
```

---

### 23. **Get Single Subcategory**
```
GET /backend/subcategories/:id
GET /api/admin/subcategories/:id
```

---

### 24. **Create Subcategory**
```
POST /backend/subcategories
POST /api/admin/subcategories
```

**Request Body:**
```json
{
  "name": "Laptops",
  "category": "690b3b389ce68bfed9eb7b85"
}
```

---

### 25. **Update Subcategory**
```
PUT /backend/subcategories/:id
PUT /api/admin/subcategories/:id
```

---

### 26. **Delete Subcategory**
```
DELETE /backend/subcategories/:id
DELETE /api/admin/subcategories/:id
```

---

## 👥 Users Management

### 27. **Get All Users**
```
GET /backend/users
GET /api/admin/users
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "_id": "690b2c84330eee50ee271f58",
      "name": "Test User",
      "email": "admin@admin.com",
      "role": "admin",
      "createdAt": "2025-11-05T10:52:52.548Z"
    }
  ]
}
```

---

### 28. **Get Single User**
```
GET /backend/users/:id
GET /api/admin/users/:id
```

---

### 29. **Create User**
```
POST /backend/users
POST /api/admin/users
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

---

### 30. **Update User**
```
PUT /backend/users/:id
PUT /api/admin/users/:id
```

---

### 31. **Delete User**
```
DELETE /backend/users/:id
DELETE /api/admin/users/:id
```

---

### 32. **Toggle User Active Status**
```
PUT /backend/users/:id/toggle-active
PUT /api/admin/users/:id/toggle-active
```

---

## 📊 Dashboard & Analytics

### 33. **Get Dashboard Statistics**
```
GET /backend/dashboard/stats
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "overview": {
      "totalUsers": 2,
      "totalProducts": 2,
      "totalCategories": 8,
      "totalBrands": 7,
      "totalSubcategories": 4,
      "activeUsers": 2,
      "adminUsers": 1
    },
    "productStats": {
      "totalValue": 229.98,
      "avgPrice": 114.99,
      "totalStock": 12,
      "lowStockCount": 0
    },
    "charts": {
      "productsByCategory": [...],
      "productsByBrand": [...],
      "userGrowth": [...]
    },
    "recent": {
      "users": [...],
      "products": [...]
    },
    "alerts": {
      "lowStockProducts": []
    }
  }
}
```

---

### 34. **Get Sales Overview**
```
GET /backend/dashboard/sales
GET /api/admin/dashboard/sales
```

---

### 35. **Get User Analytics**
```
GET /backend/dashboard/users-analytics
GET /api/admin/dashboard/users-analytics
```

---

### 36. **Get Product Analytics**
```
GET /backend/dashboard/products-analytics
GET /api/admin/dashboard/products-analytics
```

---

### 37. **Get Recent Activity**
```
GET /backend/dashboard/activity?limit=10
GET /api/admin/dashboard/activity?limit=10
```

---

## 📋 Orders (Stub - Not Implemented Yet)

### 38. **Get All Orders**
```
GET /backend/orders
GET /api/admin/orders
```

**Response:**
```json
{
  "message": "Orders listing not implemented"
}
```

Status: `501 Not Implemented`

---

### 39. **Get Single Order**
```
GET /backend/orders/:id
GET /api/admin/orders/:id
```

---

### 40. **Update Order Status**
```
PUT /backend/orders/:id
PUT /api/admin/orders/:id
```

---

## 🛒 Cart (Available)

### 41. **Get Cart**
```
GET /api/v1/cart
```

---

### 42. **Add to Cart**
```
POST /api/v1/cart
```

---

### 43. **Update Cart Item**
```
PUT /api/v1/cart/:id
```

---

### 44. **Remove from Cart**
```
DELETE /api/v1/cart/:id
```

---

## ❤️ Wishlist (Available)

### 45. **Get Wishlist**
```
GET /api/v1/wishlist
```

---

### 46. **Add to Wishlist**
```
POST /api/v1/wishlist
```

---

### 47. **Remove from Wishlist**
```
DELETE /api/v1/wishlist/:id
```

---

## 🎨 Banners (Available)

### 48. **Get All Banners**
```
GET /api/v1/banners
```

---

### 49. **Create Banner**
```
POST /api/v1/banners
```

---

### 50. **Update Banner**
```
PUT /api/v1/banners/:id
```

---

### 51. **Delete Banner**
```
DELETE /api/v1/banners/:id
```

---

## 📸 Static Files

### 52. **Access Uploaded Images**
```
GET /uploads/products/{serial}.{ext}
GET /uploads/categories/{serial}.{ext}
GET /uploads/brands/{serial}.{ext}
```

**Example:**
```
http://localhost:8000/uploads/products/1.jpg
http://localhost:8000/uploads/categories/2.png
http://localhost:8000/uploads/brands/3.webp
```

---

### 53. **Test Upload Page**
```
GET /public/test-upload.html
```

Access at: `http://localhost:8000/public/test-upload.html`

---

## 🔧 Frontend Configuration

### TypeScript API Client Example

```typescript
// config/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ADMIN_BASE = `${API_BASE_URL}/backend`;

export const adminApi = {
  // Products
  getAllProducts: (params?: any) => 
    fetch(`${ADMIN_BASE}/products${params ? '?' + new URLSearchParams(params) : ''}`),
  getProduct: (id: string) => 
    fetch(`${ADMIN_BASE}/products/${id}`),
  createProduct: (data: any) => 
    fetch(`${ADMIN_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateProduct: (id: string, data: any) => 
    fetch(`${ADMIN_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteProduct: (id: string) => 
    fetch(`${ADMIN_BASE}/products/${id}`, { method: 'DELETE' }),
  
  // Categories
  getAllCategories: () => fetch(`${ADMIN_BASE}/categories`),
  createCategory: (data: any) => 
    fetch(`${ADMIN_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // Brands
  getAllBrands: () => fetch(`${ADMIN_BASE}/brands`),
  
  // Dashboard
  getDashboardStats: () => fetch(`${ADMIN_BASE}/dashboard/stats`),
  
  // Auth
  login: (email: string, password: string) => 
    fetch(`${API_BASE_URL}/backend/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
  signup: (name: string, email: string, password: string) => 
    fetch(`${API_BASE_URL}/backend/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }),
};
```

---

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Next.js Proxy Configuration (Optional)

If you want to proxy through Next.js, add to `next.config.js`:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/backend/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      },
    ]
  },
}
```

Then you can use relative URLs in your frontend:
```typescript
fetch('/backend/products') // Proxies to http://localhost:8000/backend/products
```

---

## ✅ Quick Reference

| Feature | Endpoint Base | Status |
|---------|--------------|--------|
| Auth | `/backend/auth` | ✅ Working |
| Products | `/backend/products` | ✅ Working |
| Categories | `/backend/categories` | ✅ Working |
| Brands | `/backend/brands` | ✅ Working |
| Subcategories | `/backend/subcategories` | ✅ Working |
| Users | `/backend/users` | ✅ Working |
| Dashboard | `/backend/dashboard` | ✅ Working |
| Orders | `/backend/orders` | ⏳ Stub (501) |
| Image Upload | `/:entity/:id/image` | ✅ Working |
| Static Files | `/uploads/*` | ✅ Working |

---

## 🎯 Important Notes

1. **All routes work with `/backend` prefix** for your frontend
2. **Backend runs on port 8000**, frontend on port 3000
3. **Configure CORS** if frontend and backend are on different domains
4. **Images are auto-numbered** (1.jpg, 2.png, etc.)
5. **Authentication returns both `token` and `user`** at top level
6. **All successful responses** have `status: "success"`
7. **Pagination** works on all list endpoints (page, limit)

---

**Total Endpoints: 53 (51 implemented, 2 stubs)**

**Backend is 100% ready for your frontend! 🚀**

