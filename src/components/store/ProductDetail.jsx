import { formatPriceToCLP } from "../../utils/formattedPriceToClp";

const ProductDetail = ({ product }) => {
  if (!product) {
    return <p className="text-red-500">Producto no encontrado.</p>;
  }
  
  return (
    <div>
      <a
        href="/node/store"
        className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200 mb-4 inline-block"
      >
        ← Volver a Inicio
      </a>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:flex">
        {/* Imagen del producto */}
        <div className="md:w-1/2">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name || "Imagen del producto"}
            className="w-full h-96 object-cover rounded-lg mb-4 md:mb-0 shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Detalles del producto */}
        <div className="md:w-1/2 md:pl-6 flex flex-col justify-center">
          <h3 className="text-4xl font-bold mb-4 text-valorant">{product.name}</h3>
          <p className="text-gray-400 text-lg mb-4">{product.description || "No hay descripción disponible."}</p>

          {/* Precio */}
          <p className="text-2xl font-bold mb-4 text-green-400">
            {formatPriceToCLP(product.price)}
          </p>

          {/* Información adicional */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">⭐ Rating:</span>
              <span className="text-yellow-400 font-semibold">{product.rating || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">📝 Reseñas:</span>
              <span className="text-blue-400 font-semibold">{product.numReviews || 0}</span>
            </div>
          </div>

          {/* Botón de acción */}
          <button className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
            🛒 Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
