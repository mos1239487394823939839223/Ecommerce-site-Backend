# Authentication Setup Guide

## ✅ Backend is Now Fully Compatible with Your Frontend!

Your backend now supports **all** the auth endpoints your frontend expects.

---

## 📍 Available Auth Endpoints

### 1. **Signup (Register)**
```bash
POST /api/v1/auth/signup
POST /api/auth/local/signup
POST /backend/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"  // Optional - only if you want to confirm password
}
```

**Minimum Required Fields:**
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
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

### 2. **Login (Signin)**
```bash
POST /api/v1/auth/signin
POST /api/v1/auth/login       # Alias
POST /api/auth/local/login    # For frontend
POST /backend/auth/signin     # For frontend
POST /backend/auth/login      # Alias
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

## 🔧 Quick Test Commands

### Create a Test User
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

### Login with Test User
```bash
curl -X POST http://localhost:8000/api/auth/local/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

### Test Backend Auth Endpoint
```bash
curl -X POST http://localhost:8000/backend/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

---

## 🐛 Fixing Your Login Error

The **401 Unauthorized** error you're seeing means:
1. ❌ The user doesn't exist in the database
2. ❌ The password is incorrect

### Solution:

**Step 1: Create a user account first**

Use Postman, curl, or your frontend signup page to create a user:

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Step 2: Try logging in with the same credentials**

```bash
curl -X POST http://localhost:8000/backend/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 📋 Admin API Routes

All admin routes are now live under `/api/admin`:

### Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get single user
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-active` - Toggle user active status

### Products
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `POST /api/admin/products/:id/image` - Upload cover image
- `POST /api/admin/products/:id/images` - Upload gallery

### Categories
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `GET /api/admin/categories/:id`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`
- `POST /api/admin/categories/:id/image` - Upload image

### Brands
- `GET /api/admin/brands`
- `POST /api/admin/brands`
- `GET /api/admin/brands/:id`
- `PUT /api/admin/brands/:id`
- `DELETE /api/admin/brands/:id`
- `POST /api/admin/brands/:id/image` - Upload image

### Subcategories
- `GET /api/admin/subcategories`
- `POST /api/admin/subcategories`
- `GET /api/admin/subcategories/:id`
- `PUT /api/admin/subcategories/:id`
- `DELETE /api/admin/subcategories/:id`

---

## 🖼️ Image Upload Testing

Visit: `http://localhost:8000/public/test-upload.html`

This page lets you:
- Upload images for categories, brands, and products
- Preview uploaded images
- Test single and multiple image uploads
- Images are automatically numbered (1.jpg, 2.png, etc.)

---

## 🔑 Important Notes

1. **Password Requirements:**
   - Minimum 6 characters
   - Automatically hashed with bcrypt

2. **User Roles:**
   - `user` (default)
   - `admin`

3. **JWT Token:**
   - Returned on successful login
   - Use in Authorization header: `Bearer <token>`
   - Token expires based on `JWT_EXPIRE_TIME` in config.env

4. **Error Messages:**
   - `401`: Invalid credentials or user not found
   - `400`: Missing email or password
   - `404`: User not found (for specific endpoints)

---

## 🎯 Next Steps

1. **Create your first user** using the signup endpoint
2. **Login** to get a JWT token
3. **Test your frontend** - it should now work!
4. Check `http://localhost:8000/public/test-upload.html` for image uploads

---

## 🆘 Still Having Issues?

Make sure:
- ✅ Server is running on port 8000
- ✅ MongoDB is connected
- ✅ You've created a user account first (signup before login)
- ✅ Email and password match exactly
- ✅ Your frontend is hitting the correct endpoints

---

**Your backend is now 100% compatible with your frontend! 🎉**

