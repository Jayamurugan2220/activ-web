import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import notificationService from "@/services/notificationService";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  seller: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.productId === item.productId);
      
      if (existingItem) {
        // If item already exists, update quantity
        const newQuantity = existingItem.quantity + item.quantity;
        const updatedItems = prevItems.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: newQuantity } 
            : i
        );
        
        // Send cart update notification for quantity increase
        const userName = localStorage.getItem('userName') || 'Member';
        notificationService.sendCartUpdateNotification(
          userName,
          undefined, // email
          undefined, // phone
          "updated",
          item.name,
          newQuantity
        ).catch(error => {
          console.error('Failed to send cart update notification:', error);
        });
        
        return updatedItems;
      } else {
        // If new item, add to cart with unique ID
        const newItem = { ...item, id: `cart-${Date.now()}-${Math.random()}` };
        
        // Send cart update notification for new item
        const userName = localStorage.getItem('userName') || 'Member';
        notificationService.sendCartUpdateNotification(
          userName,
          undefined, // email
          undefined, // phone
          "added",
          item.name,
          item.quantity
        ).catch(error => {
          console.error('Failed to send cart update notification:', error);
        });
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      // Send cart update notification for item removal
      if (itemToRemove) {
        const userName = localStorage.getItem('userName') || 'Member';
        notificationService.sendCartUpdateNotification(
          userName,
          undefined, // email
          undefined, // phone
          "removed",
          itemToRemove.name,
          0
        ).catch(error => {
          console.error('Failed to send cart update notification:', error);
        });
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, quantity };
          
          // Send cart update notification for quantity change
          const userName = localStorage.getItem('userName') || 'Member';
          notificationService.sendCartUpdateNotification(
            userName,
            undefined, // email
            undefined, // phone
            "quantity updated",
            item.name,
            quantity
          ).catch(error => {
            console.error('Failed to send cart update notification:', error);
          });
          
          return updatedItem;
        }
        return item;
      });
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    
    // Send cart update notification for cart cleared
    const userName = localStorage.getItem('userName') || 'Member';
    notificationService.sendCartUpdateNotification(
      userName,
      undefined, // email
      undefined, // phone
      "cleared",
      "all items",
      0
    ).catch(error => {
      console.error('Failed to send cart update notification:', error);
    });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};