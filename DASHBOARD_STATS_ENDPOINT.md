# Dashboard Statistics Endpoint

## Overview
This endpoint provides dashboard statistics including total products, orders, users, and revenue.

## Endpoint Details

### Get Dashboard Statistics

**URL:** `/api/admin/dashboard/stats` or `/backend/dashboard/stats`

**Full URL:** `http://localhost:8000/api/admin/dashboard/stats`

**Method:** `GET`

**Authentication:** Not required (but should be protected in production)

---

## Response Format

```json
{
  "status": "success",
  "data": {
    "totalProducts": 5,
    "totalOrders": 10,
    "totalUsers": 20,
    "totalRevenue": 5000,
    "overview": {
      "totalUsers": 20,
      "totalProducts": 5,
      "totalOrders": 10,
      "totalRevenue": 5000,
      "totalCategories": 7,
      "totalBrands": 7,
      "totalSubcategories": 4,
      "activeUsers": 18,
      "adminUsers": 2
    },
    "productStats": {
      "totalValue": 15000,
      "avgPrice": 250,
      "totalStock": 100,
      "lowStockCount": 3
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
      "lowStockProducts": [...]
    }
  }
}
```

---

## Key Fields

### Top-Level Stats (Quick Access)
- `totalProducts` - Total number of products in the system
- `totalOrders` - Total number of orders placed
- `totalUsers` - Total number of registered users
- `totalRevenue` - Total revenue from all orders (sum of all order prices)

### Overview Object
Contains the same stats plus additional information:
- `totalCategories` - Total categories
- `totalBrands` - Total brands
- `totalSubcategories` - Total subcategories
- `activeUsers` - Number of active users
- `adminUsers` - Number of admin users

---

## Frontend Usage

### In TypeScript/JavaScript:

```typescript
import { adminApi } from '@/services/adminApi';

async function fetchDashboardData() {
  try {
    const response = await adminApi.getDashboardStats();
    
    if (response?.data) {
      const stats = {
        totalProducts: response.data.totalProducts || 0,
        totalOrders: response.data.totalOrders || 0,
        totalUsers: response.data.totalUsers || 0,
        totalRevenue: response.data.totalRevenue || 0,
      };
      
      console.log('Dashboard Stats:', stats);
      return stats;
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
}
```

### Using fetch directly:

```javascript
fetch('http://localhost:8000/api/admin/dashboard/stats')
  .then(response => response.json())
  .then(data => {
    console.log('Total Products:', data.data.totalProducts);
    console.log('Total Orders:', data.data.totalOrders);
    console.log('Total Users:', data.data.totalUsers);
    console.log('Total Revenue:', data.data.totalRevenue);
  })
  .catch(error => console.error('Error:', error));
```

### Using curl (for testing):

```bash
# Get all stats
curl http://localhost:8000/api/admin/dashboard/stats

# Get only the key stats (using jq)
curl -s http://localhost:8000/api/admin/dashboard/stats | jq '.data | {totalProducts, totalOrders, totalUsers, totalRevenue}'
```

---

## Implementation Details

### Backend Controller
File: `controllers/dashboardController.js`

The endpoint:
1. Counts total users using `User.countDocuments()`
2. Counts total products using `Product.countDocuments()`
3. Counts total orders using `Order.countDocuments()`
4. Calculates total revenue using MongoDB aggregation on orders

```javascript
// Calculate total revenue
const revenueData = await Order.aggregate([
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalOrderPrice" },
    },
  },
]);

const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
```

### Frontend Integration
File: `src/app/admin/page.tsx`

The dashboard page now fetches data from this endpoint and displays it in stat cards.

---

## Testing

### Test the endpoint:
```bash
curl http://localhost:8000/api/admin/dashboard/stats
```

### Expected result:
```json
{
  "status": "success",
  "data": {
    "totalProducts": 5,
    "totalOrders": 0,
    "totalUsers": 5,
    "totalRevenue": 0,
    ...
  }
}
```

---

## Notes

1. **Revenue Calculation**: Revenue is calculated from the `totalOrderPrice` field in the Order model
2. **Real-time Data**: All statistics are calculated in real-time from the database
3. **Performance**: Uses MongoDB's `countDocuments()` for fast counting
4. **Future Enhancements**: 
   - Add caching for better performance
   - Add date range filters (today, this week, this month, etc.)
   - Add growth percentages and trends
   - Add paid vs unpaid order statistics

---

## Related Endpoints

- Products: `/api/v1/products`
- Orders: `/api/v1/orders`
- Users: `/api/v1/users`
- Categories: `/api/v1/categories`
- Brands: `/api/v1/brands`

