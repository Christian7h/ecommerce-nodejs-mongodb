import React, { useState, useEffect } from "react";
import Pagination from "../Pagination.jsx";
import CategoryList from "./CategoryList.jsx";
import Filters from "./Filters.jsx";
import ProductGrid from "./ProductGrid.jsx";

const ListStore = ({ token, initialProducts, initialCategories }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ name: "", brand: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
          product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    };

    filterProducts();
  }, [products, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="bg-gray-800/30 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-white">Cargando datos...</p>}

        {/* Layout de la Tienda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Izquierda (Categorías) */}
          <aside className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Categorías</h2>
            <CategoryList categories={categories} />
          </aside>

          {/* Contenido Principal (Filtros + Productos) */}
          <section className="md:col-span-3">
            {/* Filtros */}
            <div className="mb-8">
              <Filters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Productos */}
            <h2 className="text-3xl font-bold text-valorant mb-4">Productos</h2>
            <ProductGrid products={currentItems} />
          </section>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 py-4 shadow-lg">
            <div className="container mx-auto px-4">
              <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListStore;
