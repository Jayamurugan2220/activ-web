import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Package,
  Plus,
  Edit,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

// Mock inventory data
const inventoryItems = [
  {
    id: "INV001",
    name: "Organic Cotton Textiles - 54 inches",
    sku: "CT-54-ORG",
    category: "Textiles",
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: "meters",
    price: 1200,
    lastUpdated: "2024-01-15",
    lowStock: false
  },
  {
    id: "INV002",
    name: "Organic Cotton Textiles - 48 inches",
    sku: "CT-48-ORG",
    category: "Textiles",
    currentStock: 30,
    minStock: 50,
    maxStock: 300,
    unit: "meters",
    price: 1100,
    lastUpdated: "2024-01-14",
    lowStock: true
  },
  {
    id: "INV003",
    name: "Handcrafted Pottery - Small Bowl",
    sku: "HP-SB-01",
    category: "Handicrafts",
    currentStock: 75,
    minStock: 20,
    maxStock: 200,
    unit: "pieces",
    price: 800,
    lastUpdated: "2024-01-12",
    lowStock: false
  },
  {
    id: "INV004",
    name: "Handcrafted Pottery - Large Vase",
    sku: "HP-LV-01",
    category: "Handicrafts",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unit: "pieces",
    price: 2500,
    lastUpdated: "2024-01-10",
    lowStock: true
  },
  {
    id: "INV005",
    name: "Spices Collection - 500g Pack",
    sku: "SC-500G",
    category: "Food Products",
    currentStock: 200,
    minStock: 100,
    maxStock: 1000,
    unit: "packs",
    price: 1500,
    lastUpdated: "2024-01-08",
    lowStock: false
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

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filter, setFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    currentStock: 0,
    minStock: 0,
    maxStock: 0
  });

  const filteredItems = inventoryItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => 
      selectedCategory === "All Categories" || item.category === selectedCategory
    )
    .filter(item => {
      if (filter === "all") return true;
      if (filter === "low") return item.lowStock;
      if (filter === "normal") return !item.lowStock;
      return true;
    });

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setEditData({
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock
    });
  };

  const handleSave = (id: string) => {
    // In a real app, this would update the backend
    console.log("Saving item", id, editData);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.lowStock).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <Button className="ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by item name or SKU..."
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
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Item</th>
                    <th className="text-left py-3">SKU</th>
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Current Stock</th>
                    <th className="text-left py-3">Min Stock</th>
                    <th className="text-left py-3">Max Stock</th>
                    <th className="text-left py-3">Last Updated</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className={`border-b ${item.lowStock ? "bg-amber-50" : ""}`}>
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
                        {editingItem === item.id ? (
                          <Input
                            type="number"
                            value={editData.currentStock}
                            onChange={(e) => setEditData({...editData, currentStock: parseInt(e.target.value) || 0})}
                            className="w-24"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{item.currentStock} {item.unit}</span>
                            {item.currentStock > item.maxStock && (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        {editingItem === item.id ? (
                          <Input
                            type="number"
                            value={editData.minStock}
                            onChange={(e) => setEditData({...editData, minStock: parseInt(e.target.value) || 0})}
                            className="w-24"
                          />
                        ) : (
                          <span>{item.minStock} {item.unit}</span>
                        )}
                      </td>
                      <td className="py-4">
                        {editingItem === item.id ? (
                          <Input
                            type="number"
                            value={editData.maxStock}
                            onChange={(e) => setEditData({...editData, maxStock: parseInt(e.target.value) || 0})}
                            className="w-24"
                          />
                        ) : (
                          <span>{item.maxStock} {item.unit}</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">{item.lastUpdated}</span>
                      </td>
                      <td className="py-4">
                        {editingItem === item.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSave(item.id)}>
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
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
              <CardDescription>Items that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryItems.filter(item => item.lowStock).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Restock
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

export default Inventory;