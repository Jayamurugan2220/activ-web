import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Search,
  Filter
} from "lucide-react";

// Mock admin inventory data with multiple members
const adminInventoryItems = [
  {
    id: "INV001",
    memberId: "MEM001",
    memberName: "John Doe Enterprises",
    itemName: "Organic Cotton Textiles - 54 inches",
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
    itemName: "Organic Cotton Textiles - 48 inches",
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
    itemName: "Handcrafted Pottery - Small Bowl",
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
    itemName: "Handcrafted Pottery - Large Vase",
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
    itemName: "Spices Collection - 500g Pack",
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
    itemName: "Organic Rice - 10kg Pack",
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

const categories = [
  "All Categories",
  "Textiles",
  "Handicrafts",
  "Food Products",
  "Furniture",
  "Health & Wellness"
];

const locations = [
  "All Locations",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Bangalore"
];

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [filter, setFilter] = useState("all");
  
  const filteredItems = adminInventoryItems
    .filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => 
      selectedCategory === "All Categories" || item.category === selectedCategory
    )
    .filter(item => 
      selectedLocation === "All Locations" || item.location === selectedLocation
    )
    .filter(item => {
      if (filter === "all") return true;
      if (filter === "low") return item.lowStock;
      if (filter === "normal") return !item.lowStock;
      return true;
    });

  const totalItems = adminInventoryItems.length;
  const lowStockItems = adminInventoryItems.filter(item => item.lowStock).length;
  const totalValue = adminInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const uniqueMembers = Array.from(new Set(adminInventoryItems.map(item => item.memberId))).length;

  // Function to send WhatsApp alert
  const sendWhatsAppAlert = (item: any) => {
    const message = `⚠️ LOW STOCK ALERT ⚠️%0A%0AItem: ${item.itemName}%0ACurrent Stock: ${item.currentStock} ${item.unit}%0AMinimum Required: ${item.minStock} ${item.unit}%0AMember: ${item.memberName}%0ALocation: ${item.location}%0A%0APlease restock immediately.`;
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Admin Inventory Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold text-amber-600">{lowStockItems}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                  <p className="text-3xl font-bold">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-3xl font-bold">{uniqueMembers}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by item, SKU, or member..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Location Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              {/* Stock Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock</option>
                <option value="normal">Normal Stock</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Track inventory across all members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Member</th>
                    <th className="text-left py-3">Item</th>
                    <th className="text-left py-3">SKU</th>
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Location</th>
                    <th className="text-left py-3">Current Stock</th>
                    <th className="text-left py-3">Min Stock</th>
                    <th className="text-left py-3">Last Updated</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className={`border-b ${item.lowStock ? "bg-amber-50" : ""}`}>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{item.memberName}</p>
                          <p className="text-sm text-muted-foreground">{item.memberId}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">₹{item.price.toLocaleString()}</span>
                            {item.lowStock && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-mono">{item.sku}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm">{item.location}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span>{item.currentStock} {item.unit}</span>
                          {item.currentStock > item.maxStock && (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span>{item.minStock} {item.unit}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">{item.lastUpdated}</span>
                      </td>
                      <td className="py-4">
                        {item.lowStock && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => sendWhatsAppAlert(item)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden md:inline">Alert</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No inventory items found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        {lowStockItems > 0 && (
          <Card className="shadow-medium border-0 border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Items that need immediate attention across all members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminInventoryItems.filter(item => item.lowStock).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        Member: {item.memberName} | Current: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => sendWhatsAppAlert(item)}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Alert</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;