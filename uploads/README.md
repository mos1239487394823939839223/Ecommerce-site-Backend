# 📸 Uploads Directory

This folder contains all uploaded images from the admin panel.

## 📁 Folder Structure

```
uploads/
├── brands/        → Brand logos and images
├── categories/    → Category images
└── products/      → Product images (covers + gallery)
```

## 🎯 How It Works

### Automatic Serial Naming
Images are automatically numbered sequentially:
- First image: `1.jpg`
- Second image: `2.png`
- Third image: `3.webp`
- And so on...

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### File Size Limit
- Maximum: 5MB per image

## 🔗 Access URLs

Once uploaded, images are accessible via:

**Products:**
```
http://localhost:8000/uploads/products/1.jpg
http://localhost:8000/uploads/products/2.png
```

**Categories:**
```
http://localhost:8000/uploads/categories/1.jpg
```

**Brands:**
```
http://localhost:8000/uploads/brands/1.jpg
```

## 📤 Upload Endpoints

### Upload Brand Image
```bash
POST /api/admin/brands/:id/image
POST /backend/brands/:id/image
```

### Upload Category Image
```bash
POST /api/admin/categories/:id/image
POST /backend/categories/:id/image
```

### Upload Product Cover Image
```bash
POST /api/admin/products/:id/image
POST /backend/products/:id/image
```

### Upload Product Gallery (Multiple)
```bash
POST /api/admin/products/:id/images
POST /backend/products/:id/images
```

## 🧪 Test Upload Page

Access the test page at:
```
http://localhost:8000/public/test-upload.html
```

This page lets you:
- ✅ Upload images for products, categories, brands
- ✅ Preview uploaded images immediately
- ✅ Test single and multiple image uploads
- ✅ See the serial numbers assigned

## 🔧 How Uploads Work

1. **Admin uploads image** via form
2. **Multer middleware** processes the file
3. **Serial number** is automatically assigned
4. **File is saved** in the appropriate folder
5. **Database is updated** with the image path
6. **Image is accessible** via URL

## 📝 Example Upload with cURL

```bash
# Upload a brand image
curl -X POST http://localhost:8000/backend/brands/690b3b3b9ce68bfed9eb7b9e/image \
  -F "image=@/path/to/your/logo.jpg"

# Upload a product cover
curl -X POST http://localhost:8000/backend/products/690b48537ca14287c9ed2448/image \
  -F "image=@/path/to/product.jpg"

# Upload multiple product images
curl -X POST http://localhost:8000/backend/products/690b48537ca14287c9ed2448/images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

## 🎨 Frontend Integration

### JavaScript/TypeScript Example

```typescript
// Upload single image
async function uploadProductImage(productId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`http://localhost:8000/backend/products/${productId}/image`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Uploaded:', data.data.imageUrl);
  // Result: /uploads/products/5.jpg
}

// Upload multiple images
async function uploadProductGallery(productId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await fetch(`http://localhost:8000/backend/products/${productId}/images`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('Uploaded:', data.data.imageUrls);
  // Result: ["/uploads/products/6.jpg", "/uploads/products/7.jpg"]
}
```

## ✅ Features

- ✅ Automatic folder creation on server start
- ✅ Sequential serial numbering
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- ✅ Multiple image support for products
- ✅ Public URL access via `/uploads/*`
- ✅ Clean, organized structure
- ✅ No filename conflicts (serial numbers)

## 🗂️ Database Storage

When an image is uploaded, the database stores:

**For Products:**
```json
{
  "imageCover": "/uploads/products/1.jpg",
  "images": [
    "/uploads/products/2.jpg",
    "/uploads/products/3.jpg"
  ]
}
```

**For Categories:**
```json
{
  "image": "/uploads/categories/1.jpg"
}
```

**For Brands:**
```json
{
  "image": "/uploads/brands/1.jpg"
}
```

## 🔒 Security Notes

- ✅ Only image files accepted (jpeg, jpg, png, gif, webp)
- ✅ File size limited to 5MB
- ✅ Files are stored with serial numbers (no user-controlled filenames)
- ✅ Validation happens before saving
- ⚠️ Add authentication middleware in production!

## 🚀 Ready to Use!

The uploads system is fully configured and ready. Just upload images through:
1. The test page: `http://localhost:8000/public/test-upload.html`
2. Your admin panel frontend
3. Direct API calls (as shown above)

**All images are automatically organized and accessible! 📸**

