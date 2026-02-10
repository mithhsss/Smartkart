export const offers = [
  { id: 1, code: "SMART150", description: "₹150 OFF on orders above ₹999", minOrder: 999, discount: 150, type: "flat" },
  { id: 2, code: "FRESH20", description: "20% OFF on Fruits & Vegetables", minOrder: 299, discount: 20, type: "percentage", category: "fruits-vegetables" },
  { id: 3, code: "DAIRY10", description: "10% OFF on Dairy products", minOrder: 199, discount: 10, type: "percentage", category: "dairy-breakfast" },
  { id: 4, code: "NEWUSER", description: "Flat ₹200 OFF for new users", minOrder: 499, discount: 200, type: "flat" },
  { id: 5, code: "WEEKEND50", description: "₹50 OFF on weekend orders", minOrder: 399, discount: 50, type: "flat" },
  { id: 6, code: "FREESHIP", description: "FREE delivery on orders above ₹499", minOrder: 499, discount: 0, type: "delivery" },
];

export const applyOffer = (code, cartTotal) => {
  const offer = offers.find(o => o.code === code.toUpperCase());
  if (!offer) return { success: false, message: "Invalid coupon code" };
  if (cartTotal < offer.minOrder) return { success: false, message: `Minimum order ₹${offer.minOrder} required` };
  
  let discountAmount = 0;
  if (offer.type === "flat") discountAmount = offer.discount;
  else if (offer.type === "percentage") discountAmount = Math.round(cartTotal * offer.discount / 100);
  
  return { success: true, discount: discountAmount, message: `₹${discountAmount} discount applied!` };
};
