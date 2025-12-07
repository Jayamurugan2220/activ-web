# ACTIV Platform Services

This directory contains the service implementations for the ACTIV platform.

## Inventory Service

The inventory service manages product inventory tracking and low stock alerts for members and administrators.

### Features

1. **Inventory Management**
   - Track product stock levels across all members
   - Manage minimum and maximum stock thresholds
   - Update stock levels in real-time
   - Filter and search inventory items

2. **Alert System**
   - Automatic low stock detection
   - Severity-based alert classification (low, medium, high)
   - Alert resolution tracking
   - Multi-channel notifications (WhatsApp, Email, SMS, App)

3. **Statistics and Reporting**
   - Real-time inventory statistics
   - Low stock item tracking
   - Inventory value calculations
   - Member-specific analytics

### Components

#### InventoryItem Interface
```typescript
interface InventoryItem {
  id: string;
  memberId?: string;
  memberName?: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  lastUpdated: string;
  lowStock: boolean;
  location?: string;
}
```

#### InventoryAlert Interface
```typescript
interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  minStock: number;
  category: string;
  severity: "low" | "medium" | "high";
  date: string;
  resolved: boolean;
  memberId?: string;
  memberName?: string;
}
```

### Usage

#### Getting Inventory Items
```typescript
// Get all inventory items
const allItems = inventoryService.getAllItems();

// Get items for a specific member
const memberItems = inventoryService.getItemsForMember("MEM001");
```

#### Updating Stock Levels
```typescript
// Update stock for an item
const updatedItem = await inventoryService.updateStock("INV001", 75);
```

#### Managing Alerts
```typescript
// Get all alerts
const allAlerts = inventoryService.getAllAlerts();

// Get alerts for a member
const memberAlerts = inventoryService.getAlertsForMember("MEM001");

// Resolve an alert
const success = inventoryService.resolveAlert("ALERT001");
```

#### Filtering and Searching
```typescript
// Filter by search term
const filteredItems = inventoryService.filterBySearch(items, "textiles");

// Filter by category
const categoryItems = inventoryService.filterByCategory(items, "Textiles");

// Filter by stock status
const lowStockItems = inventoryService.filterByStockStatus(items, "low");
```

### Integration with Notification Service

The inventory service integrates with the notification service to send automatic alerts when stock levels fall below minimum thresholds:

```typescript
// Automatically sends WhatsApp notification when stock goes below minimum
await inventoryService.updateStock("INV001", 25); // If minStock is 50, this will trigger an alert
```

### Admin vs Member Views

The service supports both member-specific and administrative views:

- **Member View**: Shows only inventory items belonging to a specific member
- **Admin View**: Shows all inventory items across all members with additional filtering options

## Notification Service

The notification service handles all outgoing communications for the platform.

### Supported Channels
- Email
- SMS
- WhatsApp
- In-app notifications

### Notification Types
- Registration confirmations
- Payment receipts
- Approval notifications
- Escalation alerts
- Reminders
- Profile updates
- Cart updates
- Order updates
- Inquiries and responses
- Document sharing (QR codes, catalogs)

For more details, see the notificationService.ts file.