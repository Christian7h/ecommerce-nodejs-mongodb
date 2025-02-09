// src/utils/formatted.ts

export const formatPriceToCLP = (price: number): string => {
  // Convertir el precio a CLP (supongamos que 1 USD = 800 CLP) y redondear al entero más cercano
  const priceInCLP = Math.round(price * 970);

  // Formatear el precio en CLP
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(priceInCLP);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
  }).format(price);
};