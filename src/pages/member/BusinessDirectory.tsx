import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Users,
  Building
} from "lucide-react";

// Mock business data
const businesses = [
  {
    id: "B001",
    name: "Green Textiles Co.",
    owner: "John Doe",
    category: "Textiles",
    rating: 4.7,
    reviews: 128,
    location: "Coimbatore, Tamil Nadu",
    members: "50-100",
    image: "/placeholder.svg",
    verified: true,
    description: "Premium organic cotton textiles for sustainable fashion brands"
  },
  {
    id: "B002",
    name: "Artisan Pottery Studio",
    owner: "Jane Smith",
    category: "Handicrafts",
    rating: 4.5,
    reviews: 86,
    location: "Jaipur, Rajasthan",
    members: "10-50",
    image: "/placeholder.svg",
    verified: true,
    description: "Traditional handcrafted pottery with modern designs"
  },
  {
    id: "B003",
    name: "Heritage Spices Ltd",
    owner: "Robert Brown",
    category: "Food Products",
    rating: 4.9,
    reviews: 214,
    location: "Kochi, Kerala",
    members: "100-200",
    image: "/placeholder.svg",
    verified: false,
    description: "Premium quality spices sourced directly from farmers"
  },
  {
    id: "B004",
    name: "Traditional Weavers",
    owner: "Emily Davis",
    category: "Textiles",
    rating: 4.6,
    reviews: 97,
    location: "Varanasi, Uttar Pradesh",
    members: "20-100",
    image: "/placeholder.svg",
    verified: true,
    description: "Authentic handloom silk sarees with traditional designs"
  },
  {
    id: "B005",
    name: "Eco Furniture Makers",
    owner: "Michael Wilson",
    category: "Furniture",
    rating: 4.4,
    reviews: 63,
    location: "Mysore, Karnataka",
    members: "10-50",
    image: "/placeholder.svg",
    verified: false,
    description: "Sustainable bamboo furniture for eco-friendly homes"
  },
  {
    id: "B006",
    name: "Natural Wellness Co",
    owner: "Sarah Johnson",
    category: "Health & Wellness",
    rating: 4.8,
    reviews: 156,
    location: "Bangalore, Karnataka",
    members: "50-100",
    image: "/placeholder.svg",
    verified: true,
    description: "Pure Ayurvedic products for health and wellness"
  }
];

const categories = [
  "All Categories",
  "Textiles",
  "Handicrafts",
  "Food Products",
  "Furniture",
  "Health & Wellness",
  "Electronics",
  "Agricultural Products"
];

const BusinessDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("rating");

  const filteredBusinesses = businesses
    .filter(business => 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(business => 
      selectedCategory === "All Categories" || business.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/member/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Business Directory</h1>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-medium border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses, owners, or locations..."
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
              
              {/* Sort */}
              <select
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Businesses</p>
                  <p className="text-2xl font-bold">{businesses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{businesses.filter(b => b.verified).length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-medium border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">
                    {(businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="shadow-medium border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Business Image */}
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <img 
                    src={business.image} 
                    alt={business.name} 
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                
                {/* Business Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{business.name}</h3>
                      <p className="text-sm text-muted-foreground">{business.owner}</p>
                    </div>
                    {business.verified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{business.description}</p>
                  
                  {/* Category and Location */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{business.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{business.location}</span>
                    </div>
                  </div>
                  
                  {/* Rating and Members */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{business.rating}</span>
                      <span className="text-xs text-muted-foreground">({business.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{business.members}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <Button className="w-full" asChild>
                    <Link to={`/member/business/${business.id}`}>
                      View Business Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredBusinesses.length === 0 && (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No businesses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessDirectory;