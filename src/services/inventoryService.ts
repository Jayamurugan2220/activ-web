// Inventory Service for handling inventory operations and alerts
import notificationService from "./notificationService";

export interface InventoryItem {
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

export interface InventoryAlert {
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

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  uniqueMembers?: number;
}

class InventoryService {
  private inventoryItems: InventoryItem[] = [];
  private alerts: InventoryAlert[] = [];
  
  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  /**
   * Initialize mock inventory data
   */
  private initializeMockData() {
    this.inventoryItems = [
      {
        id: "INV001",
        memberId: "MEM001",
        memberName: "John Doe Enterprises",
        name: "Organic Cotton Textiles - 54 inches",
        sku: "CT-54-ORG",
        category: "Textiles",
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        unit: "meters",
        price: 1200,
        lastUpdated: "2024-01-15",
        lowStock: false,
        location: "Chennai"
      },
      {
        id: "INV002",
        memberId: "MEM001",
        memberName: "John Doe Enterprises",
        name: "Organic Cotton Textiles - 48 inches",
        sku: "CT-48-ORG",
        category: "Textiles",
        currentStock: 30,
        minStock: 50,
        maxStock: 300,
        unit: "meters",
        price: 1100,
        lastUpdated: "2024-01-14",
        lowStock: true,
        location: "Chennai"
      },
      {
        id: "INV003",
        memberId: "MEM002",
        memberName: "Green Farms Co-op",
        name: "Handcrafted Pottery - Small Bowl",
        sku: "HP-SB-01",
        category: "Handicrafts",
        currentStock: 75,
        minStock: 20,
        maxStock: 200,
        unit: "pieces",
        price: 800,
        lastUpdated: "2024-01-12",
        lowStock: false,
        location: "Coimbatore"
      },
      {
        id: "INV004",
        memberId: "MEM003",
        memberName: "Artisan Collective",
        name: "Handcrafted Pottery - Large Vase",
        sku: "HP-LV-01",
        category: "Handicrafts",
        currentStock: 5,
        minStock: 10,
        maxStock: 50,
        unit: "pieces",
        price: 2500,
        lastUpdated: "2024-01-10",
        lowStock: true,
        location: "Madurai"
      },
      {
        id: "INV005",
        memberId: "MEM004",
        memberName: "Healthy Bites Ltd",
        name: "Spices Collection - 500g Pack",
        sku: "SC-500G",
        category: "Food Products",
        currentStock: 200,
        minStock: 100,
        maxStock: 1000,
        unit: "packs",
        price: 1500,
        lastUpdated: "2024-01-08",
        lowStock: false,
        location: "Bangalore"
      },
      {
        id: "INV006",
        memberId: "MEM002",
        memberName: "Green Farms Co-op",
        name: "Organic Rice - 10kg Pack",
        sku: "OR-10KG",
        category: "Food Products",
        currentStock: 25,
        minStock: 50,
        maxStock: 200,
        unit: "packs",
        price: 800,
        lastUpdated: "2024-01-16",
        lowStock: true,
        location: "Coimbatore"
      }
    ];

    // Initialize alerts based on low stock items
    this.generateAlertsFromLowStock();
  }

  /**
   * Get all inventory items
   * @returns Array of inventory items
   */
  getAllItems(): InventoryItem[] {
    return this.inventoryItems;
  }

  /**
   * Get inventory items for a specific member
   * @param memberId - Member ID
   * @returns Array of inventory items for the member
   */
  getItemsForMember(memberId: string): InventoryItem[] {
    return this.inventoryItems.filter(item => item.memberId === memberId);
  }

  /**
   * Get inventory stats
   * @param memberId - Optional member ID to filter stats
   * @returns Inventory statistics
   */
  getStats(memberId?: string): InventoryStats {
    let items = this.inventoryItems;
    if (memberId) {
      items = items.filter(item => item.memberId === memberId);
    }

    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.lowStock).length;
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    
    const stats: InventoryStats = {
      totalItems,
      lowStockItems,
      totalValue
    };

    // Add unique members count only for admin view
    if (!memberId) {
      stats.uniqueMembers = Array.from(new Set(this.inventoryItems.map(item => item.memberId))).length;
    }

    return stats;
  }

  /**
   * Update inventory item stock
   * @param itemId - Item ID
   * @param newStock - New stock level
   * @returns Updated inventory item or null if not found
   */
  async updateStock(itemId: string, newStock: number): Promise<InventoryItem | null> {
    const itemIndex = this.inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    const item = this.inventoryItems[itemIndex];
    const oldStock = item.currentStock;
    item.currentStock = newStock;
    item.lowStock = newStock < item.minStock;
    item.lastUpdated = new Date().toISOString().split('T')[0];

    // Check if we need to generate or resolve alerts
    if (oldStock >= item.minStock && newStock < item.minStock) {
      // Stock went below minimum - generate alert
      this.generateAlertForItem(item);
      // Send notification
      await this.sendLowStockNotification(item);
    } else if (oldStock < item.minStock && newStock >= item.minStock) {
      // Stock went above minimum - resolve alert
      this.resolveAlertForItem(item.id);
    }

    return item;
  }

  /**
   * Add new inventory item
   * @param item - New inventory item
   * @returns Added inventory item
   */
  addItem(item: Omit<InventoryItem, 'id' | 'lowStock' | 'lastUpdated'>): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: `INV${String(this.inventoryItems.length + 1).padStart(3, '0')}`,
      lowStock: item.currentStock < item.minStock,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    this.inventoryItems.push(newItem);
    
    // Generate alert if low stock
    if (newItem.lowStock) {
      this.generateAlertForItem(newItem);
    }

    return newItem;
  }

  /**
   * Delete inventory item
   * @param itemId - Item ID to delete
   * @returns Boolean indicating success
   */
  deleteItem(itemId: string): boolean {
    const index = this.inventoryItems.findIndex(item => item.id === itemId);
    if (index === -1) return false;

    this.inventoryItems.splice(index, 1);
    // Also remove any alerts for this item
    this.alerts = this.alerts.filter(alert => alert.itemId !== itemId);
    return true;
  }

  /**
   * Get all alerts
   * @returns Array of alerts
   */
  getAllAlerts(): InventoryAlert[] {
    return this.alerts;
  }

  /**
   * Get alerts for a specific member
   * @param memberId - Member ID
   * @returns Array of alerts for the member
   */
  getAlertsForMember(memberId: string): InventoryAlert[] {
    return this.alerts.filter(alert => 
      this.inventoryItems.find(item => item.id === alert.itemId)?.memberId === memberId
    );
  }

  /**
   * Resolve an alert
   * @param alertId - Alert ID to resolve
   * @returns Boolean indicating success
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.resolved = true;
    return true;
  }

  /**
   * Generate alerts from existing low stock items
   */
  private generateAlertsFromLowStock() {
    this.inventoryItems
      .filter(item => item.lowStock)
      .forEach(item => this.generateAlertForItem(item));
  }

  /**
   * Generate an alert for a specific item
   * @param item - Inventory item
   */
  private generateAlertForItem(item: InventoryItem) {
    // Check if alert already exists for this item
    const existingAlert = this.alerts.find(alert => 
      alert.itemId === item.id && !alert.resolved
    );

    if (existingAlert) return; // Alert already exists

    // Calculate severity based on how far below minimum stock we are
    let severity: "low" | "medium" | "high" = "low";
    const percentageBelow = (item.minStock - item.currentStock) / item.minStock;
    
    if (percentageBelow > 0.5) {
      severity = "high";
    } else if (percentageBelow > 0.2) {
      severity = "medium";
    }

    const newAlert: InventoryAlert = {
      id: `ALERT${String(this.alerts.length + 1).padStart(3, '0')}`,
      itemId: item.id,
      itemName: item.name,
      currentStock: item.currentStock,
      minStock: item.minStock,
      category: item.category,
      severity,
      date: new Date().toISOString().split('T')[0],
      resolved: false,
      memberId: item.memberId,
      memberName: item.memberName
    };

    this.alerts.push(newAlert);
  }

  /**
   * Resolve alert for a specific item
   * @param itemId - Item ID
   */
  private resolveAlertForItem(itemId: string) {
    const alert = this.alerts.find(a => a.itemId === itemId && !a.resolved);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Send low stock notification
   * @param item - Inventory item that is low on stock
   */
  private async sendLowStockNotification(item: InventoryItem) {
    // For demo purposes, we'll use mock member data
    // In a real app, this would come from the actual member data
    const memberName = item.memberName || "Valued Member";
    const memberPhone = "+919876543210"; // Mock phone number
    
    // Send WhatsApp notification
    await notificationService.sendQRCodeWhatsApp(
      memberName,
      memberPhone,
      `Low stock alert for ${item.name}. Current stock: ${item.currentStock} ${item.unit}, Minimum required: ${item.minStock} ${item.unit}.`,
      item.name
    );
  }

  /**
   * Filter items by search term
   * @param items - Items to filter
   * @param searchTerm - Search term
   * @returns Filtered items
   */
  filterBySearch(items: InventoryItem[], searchTerm: string): InventoryItem[] {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.memberName && item.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  /**
   * Filter items by category
   * @param items - Items to filter
   * @param category - Category to filter by
   * @returns Filtered items
   */
  filterByCategory(items: InventoryItem[], category: string): InventoryItem[] {
    if (category === "All Categories" || !category) return items;
    return items.filter(item => item.category === category);
  }

  /**
   * Filter items by location
   * @param items - Items to filter
   * @param location - Location to filter by
   * @returns Filtered items
   */
  filterByLocation(items: InventoryItem[], location: string): InventoryItem[] {
    if (location === "All Locations" || !location) return items;
    return items.filter(item => item.location === location);
  }

  /**
   * Filter items by stock status
   * @param items - Items to filter
   * @param filter - Stock filter ('all', 'low', 'normal')
   * @returns Filtered items
   */
  filterByStockStatus(items: InventoryItem[], filter: string): InventoryItem[] {
    if (filter === "all" || !filter) return items;
    
    if (filter === "low") {
      return items.filter(item => item.lowStock);
    } else if (filter === "normal") {
      return items.filter(item => !item.lowStock);
    }
    
    return items;
  }
}

// Export singleton instance
const inventoryService = new InventoryService();
export default inventoryService;