import { useState, useEffect } from "react";
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
import inventoryService, { InventoryItem } from "@/services/inventoryService";

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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [filter, setFilter] = useState("all");
  
  // Load inventory items on component mount
  useEffect(() => {
    const items = inventoryService.getAllItems();
    setInventoryItems(items);
  }, []);

  const filteredItems = inventoryService.filterByStockStatus(
    inventoryService.filterByLocation(
      inventoryService.filterByCategory(
        inventoryService.filterBySearch(inventoryItems, searchTerm),
        selectedCategory
      ),
      selectedLocation
    ),
    filter
  );

  const stats = inventoryService.getStats();

  // Function to send WhatsApp alert
  const sendWhatsAppAlert = (item: InventoryItem) => {
    const message = `⚠️ LOW STOCK ALERT ⚠️%0A%0AItem: ${item.name}%0ACurrent Stock: ${item.currentStock} ${item.unit}%0AMinimum Required: ${item.minStock} ${item.unit}%0AMember: ${item.memberName}%0ALocation: ${item.location}%0A%0APlease restock immediately.`;
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
                  <p className="text-3xl font-bold">{stats.totalItems}</p>
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
                  <p className="text-3xl font-bold text-amber-600">{stats.lowStockItems}</p>
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
                  <p className="text-3xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold">{stats.uniqueMembers}</p>
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
                          <p className="font-medium">{item.name}</p>
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
        {stats.lowStockItems > 0 && (
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
                {inventoryItems.filter(item => item.lowStock).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
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