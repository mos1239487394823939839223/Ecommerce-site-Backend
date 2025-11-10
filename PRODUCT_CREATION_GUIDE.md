# 📦 Product Creation Guide for Frontend

## ❌ Why You're Getting 400 Error

Your frontend is missing **required fields** when creating a product.

---

## ✅ Required Fields

When creating a product, you **MUST** send these fields:

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| `title` | string | Min 3 chars, Max 100 | `"iPhone 15 Pro"` |
| `description` | string | Min 20 chars | `"The latest iPhone with advanced features..."` |
| `price` | number | Max 1,000,000 | `999.99` |
| `quantity` | number | Any positive number | `50` |
| `category` | string | Valid MongoDB ID | `"690b3b389ce68bfed9eb7b85"` |
| `imageCover` | string | URL or path | `"https://example.com/image.jpg"` |

---

## 🔧 Optional Fields

These fields are optional but recommended:

| Field | Type | Example |
|-------|------|---------|
| `brand` | string (ID) | `"690b3b3b9ce68bfed9eb7b9e"` |
| `colors` | array of strings | `["red", "blue", "black"]` |
| `images` | array of URLs | `["https://...", "https://..."]` |
| `subcategories` | array of IDs | `["690750bedc07d31d49e08b0c"]` |
| `priceAfterDiscount` | number | `799.99` |
| `ratingsAverage` | number (1-5) | `4.5` |
| `sold` | number | `10` |

---

## 📝 Correct Request Example

### **Minimum Required Fields:**

```json
{
  "title": "iPhone 15 Pro",
  "description": "The most advanced iPhone ever with A17 Pro chip and titanium design",
  "price": 999.99,
  "quantity": 50,
  "category": "690b3b389ce68bfed9eb7b85",
  "imageCover": "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800"
}
```

### **Full Example with Optional Fields:**

```json
{
  "title": "iPhone 15 Pro Max",
  "description": "The ultimate iPhone with 6.7-inch Super Retina XDR display, A17 Pro chip, and pro camera system with advanced features",
  "price": 1199.99,
  "priceAfterDiscount": 1099.99,
  "quantity": 30,
  "sold": 5,
  "imageCover": "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800",
  "images": [
    "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800",
    "https://images.unsplash.com/photo-1621768216002-5ac171876626?w=800",
    "https://images.unsplash.com/photo-1621768216002-5ac171876627?w=800"
  ],
  "colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
  "category": "690b3b389ce68bfed9eb7b85",
  "brand": "690b3b3b9ce68bfed9eb7b9e",
  "subcategories": [],
  "ratingsAverage": 4.8
}
```

---

## 🎯 Frontend Implementation

### **React/TypeScript Example:**

```typescript
interface ProductFormData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageCover: string;
  brand?: string;
  colors?: string[];
  images?: string[];
  subcategories?: string[];
  priceAfterDiscount?: number;
  ratingsAverage?: number;
}

async function createProduct(data: ProductFormData) {
  // Validation before sending
  if (!data.title || data.title.length < 3) {
    throw new Error('Title must be at least 3 characters');
  }
  
  if (!data.description || data.description.length < 20) {
    throw new Error('Description must be at least 20 characters');
  }
  
  if (!data.price || data.price <= 0) {
    throw new Error('Price is required and must be positive');
  }
  
  if (!data.quantity || data.quantity < 0) {
    throw new Error('Quantity is required and must be non-negative');
  }
  
  if (!data.category) {
    throw new Error('Category is required');
  }
  
  if (!data.imageCover) {
    throw new Error('Image cover is required');
  }
  
  // Send to backend
  const response = await fetch('http://localhost:8000/backend/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.msg || 'Failed to create product');
  }
  
  return response.json();
}
```

---

## 🔍 Common Validation Errors

### **1. Title Too Short**
```json
{
  "error": "must be at least 3 chars"
}
```
**Fix:** Make sure `title` has at least 3 characters

---

### **2. Description Too Short**
```json
{
  "error": "Description is required"
}
```
**Fix:** Make sure `description` has at least 20 characters

---

### **3. Invalid Category ID**
```json
{
  "error": "Invalid ID formate"
}
```
**Fix:** Make sure `category` is a valid MongoDB ObjectId (24 hex characters)

---

### **4. Category Doesn't Exist**
```json
{
  "error": "No category found for this id: 123"
}
```
**Fix:** Use a valid category ID that exists in your database

---

### **5. Missing Required Fields**
```json
{
  "error": "Product price is required"
}
```
**Fix:** Include all required fields listed above

---

## 🧪 Test with cURL

```bash
# Working example
curl -X POST http://localhost:8000/backend/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "This is a test product with enough description characters to pass validation",
    "price": 99.99,
    "quantity": 10,
    "category": "690b3b389ce68bfed9eb7b85",
    "imageCover": "https://via.placeholder.com/400"
  }'
```

---

## 📋 Get Valid Category/Brand IDs

### **Get Categories:**
```bash
curl http://localhost:8000/backend/categories
```

### **Get Brands:**
```bash
curl http://localhost:8000/backend/brands
```

### **Example Response:**
```json
{
  "status": "success",
  "results": 8,
  "data": [
    {
      "_id": "690b3b389ce68bfed9eb7b85",  ← Use this ID
      "name": "Electronics",
      "slug": "electronics"
    }
  ]
}
```

---

## 🎨 Frontend Form Example

```tsx
import { useState, useEffect } from 'react';

export default function ProductForm() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    imageCover: '',
    brand: '',
    colors: [],
    priceAfterDiscount: 0
  });

  // Load categories and brands
  useEffect(() => {
    fetch('http://localhost:8000/backend/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data));
    
    fetch('http://localhost:8000/backend/brands')
      .then(res => res.json())
      .then(data => setBrands(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (formData.title.length < 3) {
      alert('Title must be at least 3 characters');
      return;
    }
    
    if (formData.description.length < 20) {
      alert('Description must be at least 20 characters');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/backend/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.msg || 'Failed to create product');
      }
      
      const result = await response.json();
      alert('Product created successfully!');
      console.log(result.data);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          minLength={3}
          maxLength={100}
          required
        />
      </div>

      <div>
        <label>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          minLength={20}
          required
        />
      </div>

      <div>
        <label>Price *</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          min={0}
          step={0.01}
          required
        />
      </div>

      <div>
        <label>Quantity *</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
          min={0}
          required
        />
      </div>

      <div>
        <label>Category *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Brand (Optional)</label>
        <select
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
        >
          <option value="">Select a brand</option>
          {brands.map(brand => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Image Cover URL *</label>
        <input
          type="url"
          value={formData.imageCover}
          onChange={(e) => setFormData({...formData, imageCover: e.target.value})}
          required
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label>Discount Price (Optional)</label>
        <input
          type="number"
          value={formData.priceAfterDiscount}
          onChange={(e) => setFormData({...formData, priceAfterDiscount: parseFloat(e.target.value)})}
          min={0}
          step={0.01}
        />
      </div>

      <button type="submit">Create Product</button>
    </form>
  );
}
```

---

## ✅ Checklist Before Submitting

Before sending the product creation request, verify:

- [ ] `title` has at least 3 characters
- [ ] `description` has at least 20 characters
- [ ] `price` is a positive number
- [ ] `quantity` is a non-negative number
- [ ] `category` is a valid category ID (get from `/backend/categories`)
- [ ] `imageCover` is a valid URL or path
- [ ] Optional: `brand` is a valid brand ID (get from `/backend/brands`)
- [ ] Optional: `priceAfterDiscount` is less than `price`

---

## 🎯 Quick Fix for Your Error

Your frontend needs to:

1. **Fetch categories** before showing the form
2. **Validate all required fields** before submission
3. **Use actual category IDs** from the database
4. **Ensure description is at least 20 characters**
5. **Make sure all numbers are sent as numbers**, not strings

---

## 📞 Need Help?

Check these files:
- `FRONTEND_API_ENDPOINTS.md` - All API endpoints
- `IMAGE_UPLOAD_FLOW.md` - How to upload images
- `uploads/README.md` - Image upload guide

**Once you include all required fields, product creation will work! 🎉**

