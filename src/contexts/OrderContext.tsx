import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
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