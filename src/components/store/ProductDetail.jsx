import React from "react";
import { formatPriceToCLP } from "../../utils/formattedPriceToClp";

const ProductDetail = ({ product }) => {
  if (!product) {
    return <p className="text-red-500">Producto no encontrado.</p>;
  }
  
  return (
    <div className="space-y-8 bg-valorant-dark min-h-screen p-8">
      <a
        href="/node/store"
        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 mb-4 inline-block"
      >
        Volver a Inicio
      </a>
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 md:flex">
        <div className="md:w-1/2">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg mb-4 md:mb-0"
          />
        </div>
        <div className="md:w-1/2 md:pl-6">
          <h3 className="text-3xl font-semibold mb-4 text-valorant">{product.name}</h3>
          <p className="text-gray-400 text-lg mb-4">{product.description}</p>
          <p className="text-lg font-bold mb-4">{formatPriceToCLP(product.price)}</p>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Rating:</span>
              <span className="text-valorant">{product.rating}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Reseñas:</span>
              <span className="text-valorant">{product.numReviews}</span>
            </div>
          </div>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
