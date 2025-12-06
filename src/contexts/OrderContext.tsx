import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import notificationService from "@/services/notificationService"; // Add this import

interface OrderItem {
  id: string;
  name: string;
  seller: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shipping: ShippingInfo;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: "processing",
      ...orderData
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status };
          
          // Send comprehensive order update notification
          notificationService.sendOrderUpdateNotification(
            order.shipping.name,
            order.shipping.email,
            order.shipping.phone,
            order.id,
            status,
            order.items[0]?.name || "your order"
          ).catch(error => {
            console.error('Failed to send order update notification:', error);
          });
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};