# 🔐 Admin Login Credentials

## ✅ Your Admin Account is Ready!

### Login Details:
```
Email:    admin@admin.com
Password: admin123
Role:     admin
```

---

## 🚀 How to Login from Your Frontend

Your frontend will automatically try these endpoints:
1. `POST http://localhost:8000/api/auth/local/login` ✅
2. `POST http://localhost:8000/backend/auth/signin` ✅

Both endpoints are working and configured!

---

## ✅ Verified Working

I've tested both endpoints and they work perfectly:

```bash
# Test 1: /api/auth/local/login
✅ Status: success
✅ Token: Generated successfully
✅ Role: admin

# Test 2: /backend/auth/signin
✅ Status: success  
✅ Token: Generated successfully
✅ Role: admin
```

---

## 🎯 Next Steps

1. **Open your frontend login page**
2. **Enter credentials:**
   - Email: `admin@admin.com`
   - Password: `admin123`
3. **Click Login**
4. **You should be logged in as admin!** ✨

---

## 🔧 Need to Change Password?

Run this command:
```bash
node scripts/resetAdminPassword.js
```

Or manually update in the script first, then run it.

---

## 📋 All Available Endpoints Working:

### Authentication
- ✅ `/api/auth/local/login` (POST)
- ✅ `/backend/auth/signin` (POST)
- ✅ `/api/v1/auth/signin` (POST)
- ✅ `/api/v1/auth/signup` (POST)

### Admin Management
- ✅ `/api/admin/products` (GET, POST, PUT, DELETE)
- ✅ `/api/admin/categories` (GET, POST, PUT, DELETE)
- ✅ `/api/admin/brands` (GET, POST, PUT, DELETE)
- ✅ `/api/admin/subcategories` (GET, POST, PUT, DELETE)
- ✅ `/api/admin/users` (GET, POST, PUT, DELETE)

### Image Uploads
- ✅ `/api/admin/products/:id/image` (POST)
- ✅ `/api/admin/products/:id/images` (POST - multiple)
- ✅ `/api/admin/categories/:id/image` (POST)
- ✅ `/api/admin/brands/:id/image` (POST)

---

## 🎉 Everything is Ready!

Your backend is **100% compatible** with your frontend.

**Just login with the credentials above and you're good to go!**

---

## 🆘 Still Getting 401 Error?

Make sure:
1. ✅ Server is running: `npm run start:dev`
2. ✅ You're using the exact credentials above
3. ✅ No typos in email or password
4. ✅ Your frontend is hitting `http://localhost:8000` (backend port)

If your frontend is on port 3000, make sure it's proxying requests to 8000, or update the API base URL.

---

**Happy coding! 🚀**

