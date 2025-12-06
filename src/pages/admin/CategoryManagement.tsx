import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter
} from "lucide-react";
import { allCategories, Category } from "@/data/categories";

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    isActive: true,
    sortOrder: 0
  });

  const filteredCategories = allCategories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(category => {
      if (selectedType === "all") return true;
      return category.id.startsWith(selectedType);
    });

  const handleAddCategory = () => {
    // In a real app, this would make an API call
    console.log("Adding category:", formData);
    setIsAddingCategory(false);
    resetForm();
  };

  const handleUpdateCategory = () => {
    // In a real app, this would make an API call
    console.log("Updating category:", editingCategory?.id, formData);
    setEditingCategory(null);
    resetForm();
  };

  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, this would make an API call
    console.log("Deleting category:", categoryId);
    if (window.confirm("Are you sure you want to delete this category?")) {
      // Delete logic here
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: "",
      isActive: true,
      sortOrder: 0
    });
  };

  const prepareEditForm = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
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
          <h1 className="text-2xl font-bold">Category Management</h1>
          <Button className="ml-auto" onClick={() => setIsAddingCategory(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Categories</p>
                  <p className="text-3xl font-bold">{allCategories.length}</p>
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
                  <p className="text-sm text-muted-foreground">B2B Categories</p>
                  <p className="text-3xl font-bold">{allCategories.filter(c => c.id.startsWith("b2b")).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">B2C Categories</p>
                  <p className="text-3xl font-bold">{allCategories.filter(c => c.id.startsWith("b2c")).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Type Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="b2b">B2B Only</option>
                <option value="b2c">B2C Only</option>
              </select>
              
              {/* Status Filter */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                disabled
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Category Form */}
        {(isAddingCategory || editingCategory) && (
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle>
                {isAddingCategory ? "Add New Category" : `Edit Category: ${editingCategory?.name}`}
              </CardTitle>
              <CardDescription>
                {isAddingCategory 
                  ? "Create a new product category for your catalog" 
                  : "Update the category details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category Name *</label>
                    <Input
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                      placeholder="category-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Parent Category</label>
                    <select
                      className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                      value={formData.parentId}
                      onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                    >
                      <option value="">None (Top Level)</option>
                      {allCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Enter category description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Sort Order</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          className="h-4 w-4"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isAddingCategory ? handleAddCategory : handleUpdateCategory}
                >
                  {isAddingCategory ? "Add Category" : "Update Category"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Table */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Manage your product category hierarchy</CardDescription>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Category</th>
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Description</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Sort Order</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">/{category.slug}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant={category.id.startsWith("b2b") ? "default" : "secondary"}>
                          {category.id.startsWith("b2b") ? "B2B" : "B2C"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description || "No description"}
                        </p>
                      </td>
                      <td className="py-4">
                        <Badge variant={category.isActive ? "default" : "destructive"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {category.sortOrder}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => prepareEditForm(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No categories found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManagement;