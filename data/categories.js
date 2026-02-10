export const categories = [
  { id: 1, name: "Fruits & Vegetables", slug: "fruits-vegetables", icon: "🥬", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop", color: "#4CAF50", productCount: 8 },
  { id: 2, name: "Dairy & Breakfast", slug: "dairy-breakfast", icon: "🥛", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop", color: "#2196F3", productCount: 8 },
  { id: 3, name: "Snacks & Munchies", slug: "snacks-munchies", icon: "🍿", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop", color: "#FF9800", productCount: 8 },
  { id: 4, name: "Beverages", slug: "beverages", icon: "🥤", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop", color: "#E91E63", productCount: 8 },
  { id: 5, name: "Meat & Fish", slug: "meat-fish", icon: "🍗", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop", color: "#F44336", productCount: 6 },
  { id: 6, name: "Bakery & Biscuits", slug: "bakery", icon: "🍞", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop", color: "#795548", productCount: 6 },
  { id: 7, name: "Personal Care", slug: "personal-care", icon: "🧴", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop", color: "#9C27B0", productCount: 6 },
  { id: 8, name: "Cleaning & Household", slug: "cleaning", icon: "🧹", image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=200&fit=crop", color: "#00BCD4", productCount: 6 },
  { id: 9, name: "Baby Care", slug: "baby-care", icon: "👶", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop", color: "#FF5722", productCount: 6 },
  { id: 10, name: "Pet Care", slug: "pet-care", icon: "🐾", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop", color: "#607D8B", productCount: 4 },
  { id: 11, name: "Atta, Rice & Dal", slug: "atta-rice-dal", icon: "🌾", image: "https://images.unsplash.com/photo-1586201375761-83865001e6c2?w=200&h=200&fit=crop", color: "#FFC107", productCount: 6 },
  { id: 12, name: "Masala & Spices", slug: "masala-spices", icon: "🌶️", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop", color: "#D32F2F", productCount: 8 },
];

export const getCategoryBySlug = (slug) => categories.find(c => c.slug === slug);
