import api from './api';

export const cartService = {
  // Cart එක ලබා ගැනීම
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Cart එකට භාණ්ඩයක් එක් කිරීම
  addToCart: async (productId: string, quantity: number) => {
    // මෙහි "productId" නම Backend එකේ req.body.productId සමඟ ගැලපිය යුතුයි
    const response = await api.post('/cart', { 
      productId: productId, 
      quantity: quantity 
    });
    return response.data;
  },

  // Cart එකෙන් භාණ්ඩයක් ඉවත් කිරීම
  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  // Cart එක සම්පූර්ණයෙන් හිස් කිරීම
  clearCart: async () => {
    const response = await api.post('/cart/clear');
    return response.data;
  }
};