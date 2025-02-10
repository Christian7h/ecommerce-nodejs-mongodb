import { useState, useEffect } from "react";
import { formatPriceToCLP } from "../../utils/formattedPriceToClp";

const CategoryProducts = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/?categories=${categoryId}`
        );

        if (!response.ok) throw new Error("Error al cargar los productos");

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Error al cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  return (
    <div className="space-y-8">
      {/* Botón "Volver" con mejor diseño */}
      <a
        href="/node/store"
        className="flex items-center gap-2 text-white hover:text-gray-300 transition duration-200 mb-4"
      >
        <span className="text-xl">←</span> Volver a Categorías
      </a>

      {/* Loader y errores */}
      {isLoading ? (
        <p className="text-white text-lg">Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex flex-col"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm flex-1">{product.description}</p>
              <p className="text-lg font-bold mb-2">{formatPriceToCLP(product.price)}</p>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No hay productos en esta categoría.</p>
      )}
    </div>
  );
};

export default CategoryProducts;
