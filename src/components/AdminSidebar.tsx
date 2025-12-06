import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, Users, CheckCircle, XCircle, 
  Clock, Home, List, User,
  Menu, TrendingUp, MapPin, UserCheck, AlertTriangle, Package,
  MessageCircle, LogOut
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Props = {
  className?: string;
};

export default function AdminSidebar({ className = '' }: Props) {
  const location = useLocation();

  const menuItems = [
    { to: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { to: "/admin/applications", icon: FileText, label: "Applications" },
    { to: "/admin/members", icon: Users, label: "Members" },
    { to: "/admin/inventory", icon: Package, label: "Inventory" },
    { to: "/admin/leads", icon: MessageCircle, label: "Leads Management" },
    { to: "/admin/settings", icon: List, label: "Settings" },
  ];

  return (
    <aside className={`bg-white h-full flex flex-col justify-between ${className}`}>
      <div className="p-2 md:p-4">
        <div className="hidden md:flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 md:w-12 md:h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <div className="font-semibold text-sm md:text-base">Admin User</div>
            <div className="text-xs md:text-sm text-muted-foreground">Administrator</div>
          </div>
        </div>

        <nav className="space-y-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {menuItems.map((item) => {
          // Check if current path starts with the nav item path for better matching
          const active = location.pathname === item.to || 
                        (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));
          const IconComponent = item.icon;
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex items-center gap-3 px-2 py-2 md:px-3 md:py-2 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-sm hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      </div>

      <div className="p-2 md:p-4">
        <Button variant="ghost" onClick={() => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('memberId'); localStorage.removeItem('userName'); window.location.href = '/admin/block/login'; }} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 md:p-3">
          <LogOut className="w-5 h-5" />
          <span className="hidden lg:inline">Log out</span>
        </Button>
      </div>
    </aside>
  );
}