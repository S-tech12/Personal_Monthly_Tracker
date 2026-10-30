export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#00236f',        // Primary (Deep Blue)
  Transport: '#006a61',   // Secondary (Teal)
  Rent: '#1e3a8a',        // Primary Container (Medium Blue)
  Shopping: '#8b5cf6',    // Complementary Purple
  Entertainment: '#eab308', // Complementary Yellow
  Bills: '#ba1a1a',       // Error (Red)
  Health: '#10b981',      // Complementary Emerald Green
  Other: '#64748b'        // Slate Gray
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || '#94a3b8'; // Neutral gray fallback
};
