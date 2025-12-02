import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUser, FaClipboardList, FaCertificate, FaQuestionCircle, FaCalendarAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const nav = [
    { to: '/member/dashboard', label: 'Home', icon: <FaHome /> },
    { to: '/explore', label: 'Explore', icon: <FaSearch /> },
    { to: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { to: '/member/profile', label: 'My Profile', icon: <FaUser /> },
    { to: '/member/adf', label: 'ADF Form', icon: <FaClipboardList /> },
    { to: '/member/certificate', label: 'Certificate', icon: <FaCertificate /> },
    { to: '/member/help', label: 'Help', icon: <FaQuestionCircle /> },
    { to: '/member/events', label: 'Upcoming Events', icon: <FaCalendarAlt /> },
  ];

    const handleLogout = () => {
        // clear session and user info
        localStorage.removeItem("userName");
        localStorage.removeItem("memberId");
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("isLoggedIn");
      navigate("/login");
      onClose();
    };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FaTimes className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? userName.split(" ").map(n => n[0]).join("") : "SD"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{userName || "Member"}</div>
              <div className="text-sm text-muted-foreground">TechCorp Solution</div>
            </div>
          </div>
        </div>

        <nav className="p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`flex items-center gap-3 px-3 py-3 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={onClose}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t">
          <Button variant="ghost" onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-3">
            <FaSignOutAlt className="w-5 h-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}