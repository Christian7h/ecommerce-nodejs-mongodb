import { useState, useEffect } from "react";
import { formatPriceToCLP } from "../../utils/formattedPriceToClp";

const CategoryProducts = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado para el loader

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      console.log("ID de la categoría recibida:", categoryId); // Verificar el ID recibido

      setIsLoading(true); // Mostrar el loader al iniciar la carga

      try {
        // Hacer la solicitud a la API
        const response = await fetch(
          `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products`
        );
        const data = await response.json();

        console.log("Productos recibidos de la API:", data); // Inspeccionar los datos recibidos

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar los productos");
        }

        // Filtrar los productos que pertenecen a la categoría seleccionada
        const filteredProducts = data.filter(
          (product) => product.category && product.category._id === categoryId
        );

        setProducts(filteredProducts);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los productos");
      } finally {
        setIsLoading(false); // Ocultar el loader al finalizar
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  return (
    <div className="space-y-8">
      {/* Botón "Volver" */}
      <a
        href="/node/store"
        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 mb-4 inline-block"
      >
        Volver a Categorías
      </a>

      {/* Loader */}
      {isLoading ? (
        <p className="text-white">Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
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
