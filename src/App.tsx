import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import MemberLogin from "./pages/member/Login";
import ForgotPassword from "./pages/member/ForgotPassword";
import BlockLogin from "./pages/admin/BlockLogin";
import MemberRegister from "./pages/member/Register";
import MemberDashboard from "./pages/member/Dashboard";
import SidebarPage from "./pages/member/SidebarPage";
import Explore from "./pages/member/Explore";
import Notifications from "./pages/member/Notifications";
import ADFForm from "./pages/member/ADF";
import MemberCertificate from "./pages/member/Certificate";
import MemberProfile from "./pages/member/Profile";
import MemberHelp from "./pages/member/Help";
import MemberEvents from "./pages/member/Events";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSidebarPage from "./pages/admin/SidebarPage";
import Approvals from "./pages/admin/Approvals";
import Members from "./pages/admin/Members";
import Settings from "./pages/admin/Settings";
import ApplicationView from "./pages/admin/ApplicationView";
import SuperAdminGenerate from "./pages/admin/SuperAdminGenerate";
import LeadsManagement from "./pages/admin/LeadsManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";

// Admin Inventory Component
import AdminInventory from "./pages/admin/Inventory";

// Payment Components
import PaymentHistory from "./pages/member/payments/History";
import MembershipRenewal from "./pages/member/payments/Membership";
import Donate from "./pages/member/payments/Donate";

// Notification Settings
import NotificationSettings from "./pages/member/NotificationSettings";

// Marketplace Components
import B2BCatalog from "./pages/marketplace/B2BCatalog";
import B2CCatalog from "./pages/marketplace/B2CCatalog";
import ProductDetail from "./pages/marketplace/ProductDetail";
import SellerDashboard from "./pages/member/SellerDashboard";
import InquiryForm from "./pages/marketplace/InquiryForm";
import SellerLeadsInbox from "./pages/member/SellerLeadsInbox";

// Shopping Cart and Order Management
import Cart from "./pages/marketplace/Cart";
import Checkout from "./pages/marketplace/Checkout";
import OrderConfirmation from "./pages/marketplace/OrderConfirmation";
import Orders from "./pages/marketplace/Orders";
import OrderDetails from "./pages/marketplace/OrderDetails";

// Business Showcase
import BusinessShowcase from "./pages/member/BusinessShowcase";
import BusinessDirectory from "./pages/member/BusinessDirectory";

// Inventory Tracking
import Inventory from "./pages/member/Inventory";
import InventoryAlerts from "./pages/member/InventoryAlerts";

// WhatsApp Sharing
import WhatsAppSharing from "./pages/member/WhatsAppSharing";
import SharedCatalog from "./pages/member/SharedCatalog";

// Social Login
import SocialCallback from "./pages/member/SocialCallback";

// Cart Context
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <OrderProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Aliases for member-specific paths used in some pages */}
              <Route path="/member/login" element={<MemberLogin />} />
              <Route path="/member/register" element={<MemberRegister />} />
              <Route path="/member/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<MemberRegister />} />

              {/* Member Routes */}
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/member/sidebar" element={<SidebarPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/member/adf" element={<ADFForm />} />
              <Route path="/member/certificate" element={<MemberCertificate />} />
              <Route path="/member/profile" element={<MemberProfile />} />
              <Route path="/member/help" element={<MemberHelp />} />
              <Route path="/member/events" element={<MemberEvents />} />
              
              {/* Payment Routes */}
              <Route path="/member/payments/history" element={<PaymentHistory />} />
              <Route path="/member/payments/membership" element={<MembershipRenewal />} />
              <Route path="/member/payments/donate" element={<Donate />} />
              
              {/* Notification Settings */}
              <Route path="/member/notification-settings" element={<NotificationSettings />} />
              
              {/* Marketplace Routes */}
              <Route path="/marketplace/b2b" element={<B2BCatalog />} />
              <Route path="/marketplace/inquiry/:productId" element={<InquiryForm />} />
              <Route path="/marketplace/b2c" element={<B2CCatalog />} />
              <Route path="/marketplace/product/:id" element={<ProductDetail />} />
              <Route path="/member/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/member/seller/leads" element={<SellerLeadsInbox />} />
              
              {/* Shopping Cart and Order Management */}
              <Route path="/marketplace/cart" element={<Cart />} />
              <Route path="/marketplace/checkout" element={<Checkout />} />
              <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/marketplace/orders" element={<Orders />} />
              <Route path="/marketplace/order/:id" element={<OrderDetails />} />
              
              {/* Business Showcase */}
              <Route path="/member/business/showcase" element={<BusinessShowcase />} />
              <Route path="/member/business/directory" element={<BusinessDirectory />} />
              
              {/* Inventory Tracking */}
              <Route path="/member/inventory" element={<Inventory />} />
              <Route path="/member/inventory/alerts" element={<InventoryAlerts />} />
              
              {/* WhatsApp Sharing */}
              <Route path="/member/whatsapp/share" element={<WhatsAppSharing />} />
              <Route path="/catalog/:catalogId" element={<SharedCatalog />} />
              
              {/* Social Login Callback */}
              <Route path="/auth/callback/:provider" element={<SocialCallback />} />
              
              {/* Admin Routes */}
              <Route path="/admin/block/login" element={<BlockLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/block/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<Approvals />} />
              <Route path="/admin/sidebar" element={<AdminSidebarPage />} />
              <Route path="/admin/approvals" element={<Approvals />} />
              <Route path="/admin/members" element={<Members />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/application/:id" element={<ApplicationView />} />
              <Route path="/admin/leads" element={<LeadsManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              
              {/* Super Admin Routes */}
              <Route path="/admin/super/generate" element={<SuperAdminGenerate />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OrderProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;