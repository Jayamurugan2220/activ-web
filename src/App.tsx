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
import AdminProductCatalog from "./pages/admin/ProductCatalog";

// Payment Components
import PaymentHistory from "./pages/member/payments/History";
import MembershipRenewal from "./pages/member/payments/Membership";
import Donate from "./pages/member/payments/Donate";

// Access Pages
import AdminAccessPage from "./pages/admin/AdminAccessPage";
import MemberAccessPage from "./pages/member/MemberAccessPage";
import AccessSelectionPage from "./pages/AccessSelectionPage";

// Notification Settings
import NotificationSettings from "./pages/member/NotificationSettings";
import Reminders from "./pages/member/Reminders";
import TestNotifications from "./pages/member/TestNotifications";

// Marketplace Components
import B2BCatalog from "./pages/marketplace/B2BCatalog";
import B2CCatalog from "./pages/marketplace/B2CCatalog";
import ProductDetail from "./pages/marketplace/ProductDetail";
import SellerDashboard from "./pages/member/SellerDashboard";
import SellerProductCatalog from "./pages/member/SellerProductCatalog";
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
import DiscoverLoginPage from "./pages/member/MultiBusinessDiscover";

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

// Auth Context
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import { UserRole } from "./utils/jwt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/access" />} />
                <Route path="/access" element={<RoleBasedRedirect><AccessSelectionPage /></RoleBasedRedirect>} />
                <Route path="/access/member" element={<RoleBasedRedirect><MemberAccessPage /></RoleBasedRedirect>} />
                <Route path="/access/admin" element={<RoleBasedRedirect><AdminAccessPage /></RoleBasedRedirect>} />
                <Route path="/login" element={<LoginPage />} />
                {/* Aliases for member-specific paths used in some pages */}
                <Route path="/member/login" element={<MemberLogin />} />
                <Route path="/member/register" element={<MemberRegister />} />
                <Route path="/member/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<MemberRegister />} />
                
                {/* Custom login page */}
                <Route path="/member/discover-login" element={<DiscoverLoginPage />} />

                {/* Protected Member Routes */}
                <Route 
                  path="/member/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MemberDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/sidebar" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <SidebarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/explore" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Explore />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Notifications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/adf" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <ADFForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/certificate" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MemberCertificate />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/profile" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MemberProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/help" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MemberHelp />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/events" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MemberEvents />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Payment Routes */}
                <Route 
                  path="/member/payments/history" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <PaymentHistory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/payments/membership" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <MembershipRenewal />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/payments/donate" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Donate />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Notification Settings */}
                <Route 
                  path="/member/notification-settings" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <NotificationSettings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/reminders" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Reminders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/test-notifications" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <TestNotifications />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Marketplace Routes */}
                <Route 
                  path="/marketplace/b2b" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <B2BCatalog />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/inquiry/:productId" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <InquiryForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/b2c" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <B2CCatalog />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/product/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <ProductDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/seller/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/seller/catalog" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <SellerProductCatalog />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/seller/leads" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <SellerLeadsInbox />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Shopping Cart and Order Management */}
                <Route 
                  path="/marketplace/cart" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/checkout" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/order-confirmation" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/orders" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/marketplace/order/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <OrderDetails />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Business Showcase */}
                <Route 
                  path="/member/business/showcase" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <BusinessShowcase />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/business/directory" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <BusinessDirectory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/business/discover" 
                  element={
                    <DiscoverLoginPage />
                  } 
                />
                
                {/* Protected Inventory Tracking */}
                <Route 
                  path="/member/inventory" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <Inventory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/member/inventory/alerts" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <InventoryAlerts />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected WhatsApp Sharing */}
                <Route 
                  path="/member/whatsapp/share" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <WhatsAppSharing />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/catalog/:catalogId" 
                  element={
                    <ProtectedRoute requiredRoles={['member']}>
                      <SharedCatalog />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Social Login Callback */}
                <Route path="/auth/callback/:provider" element={<SocialCallback />} />
                
                {/* Admin Routes */}
                <Route path="/admin/block/login" element={<BlockLogin />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/block/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/applications" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <Approvals />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/sidebar" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <AdminSidebarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/approvals" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <Approvals />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/members" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <Members />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/inventory" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <AdminInventory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <AdminProductCatalog />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/application/:id" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <ApplicationView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/leads" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <LeadsManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute requiredRoles={['block_admin', 'district_admin', 'state_admin', 'super_admin']}>
                      <CategoryManagement />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Super Admin Routes */}
                <Route 
                  path="/admin/super/generate" 
                  element={
                    <ProtectedRoute requiredRoles={['super_admin']}>
                      <SuperAdminGenerate />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;