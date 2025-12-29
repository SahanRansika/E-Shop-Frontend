import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cartService';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types/types'; // <-- adjust path if needed

// Server cart item type
interface ServerCartItem {
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const { items, addItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const syncCartWithServer = async () => {
    try {
      const serverCart: ServerCartItem[] = await cartService.getCart();

      // Clear local cart and use server cart
      if (serverCart.length > 0) {
        clearCart();
        serverCart.forEach((item) => {
          addItem(item.product, item.quantity);
        });
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  const syncToServer = async () => {
    if (!isAuthenticated) return;

    try {
      // Clear server cart first
      await cartService.clearCart();

      // Add all local items to server
      for (const item of items) {
        await cartService.addToCart(item.product._id, item.quantity);
      }
    } catch (error) {
      console.error('Failed to sync cart to server:', error);
    }
  };

  useEffect(() => {
    // Sync cart with server when authenticated
    if (isAuthenticated) {
      syncCartWithServer();
    }
  }, [isAuthenticated]);

  return {
    syncCartWithServer,
    syncToServer,
  };
};
