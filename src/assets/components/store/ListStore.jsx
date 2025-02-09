import React, { useState, useEffect } from "react";
import Pagination from "../Pagination.jsx";
import { formatPriceToCLP } from "../../utils/formattedPriceToClp";
import PayButton from "../webpay/PayButton.js";

const ListStore = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
  });
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener productos
        const productsResponse = await fetch(
          "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products"
        );
        if (!productsResponse.ok) throw new Error("Error cargando productos");
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Obtener categorías
        const categoriesResponse = await fetch(
          "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories"
        );
        if (!categoriesResponse.ok)
          throw new Error("Error cargando categorías");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar productos según los filtros ingresados
  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
          product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); // Reiniciar a la primera página al cambiar filtros
    };

    filterProducts();
  }, [products, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="space-y-8">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-white">Cargando datos...</p>}

      {/* Sección de Categorías */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-3xl font-bold text-valorant mb-4">
          Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <a
              key={category._id}
              href={`/node/category/${category._id}`}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              aria-label={`Categoría ${category.name}`}
            >
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sección de Filtros */}
      <section aria-labelledby="filters-heading">
        <h3 id="filters-heading" className="text-2xl font-bold text-white mb-4">
          Filtros
        </h3>
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Buscar por nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nombre del producto"
                value={filters.name}
                onChange={handleFilterChange}
                className="mt-1 p-2 w-full rounded-lg bg-gray-800 text-white border border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-300">
                Buscar por marca
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                placeholder="Marca"
                value={filters.brand}
                onChange={handleFilterChange}
                className="mt-1 p-2 w-full rounded-lg bg-gray-800 text-white border border-gray-700"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Sección de Productos */}
      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="text-3xl font-bold text-valorant mb-4">
          Productos
        </h2>
        {filteredProducts.length === 0 && !loading ? (
          <p className="text-white">No se encontraron productos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <a
                  href={`/node/product/${product._id}`}
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-52 object-cover rounded-lg mb-4"
                  />
                </a>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <p className="text-lg font-bold mb-2">{formatPriceToCLP(product.price)}</p>
                <div className="flex flex-col space-y-2">
                  <PayButton amount={product.price} productId={product._id} client:load />
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mb-24">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default ListStore;
