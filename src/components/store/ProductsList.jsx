//src/components/store/ProductsList.jsx
import { useEffect, useState } from "react";
import Pagination from "../Pagination.astro";
import { jwtDecode } from "jwt-decode";
import { navigate } from "astro:transitions/client";

const ListStore = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const itemsPerPage = 6;

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
    if (token) {
      checkAdmin(token);
    }
  }, [token]);

  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products"
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const checkAdmin = (token) => {
    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.isAdmin);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (productId) => {
    if (!isAdmin) {
      alert("No tienes permisos para eliminar este producto.");
      return;
    }

    const token = document.cookie.replace("token=", "");
    try {
      const res = await fetch(
        `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Producto eliminado con éxito");
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        const data = await res.json();
        alert(`Error eliminando el producto: ${data.message}`);
      }
    } catch (error) {
      console.error("Error eliminando el producto:", error);
    }
  };  

  const handleUpdate = (productId) => {
    navigate(`/node/admin/edit-product/${productId}`); // Redirige a la página de edición
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const productsOnPage = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-valorant-dark min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-6 text-valorant text-center">Lista de Productos</h1>

      <form className="mb-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={filters.name}
            onChange={handleFilterChange}
            className="mb-4 md:mb-0 p-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
          />
          <input
            type="text"
            name="brand"
            placeholder="Marca"
            value={filters.brand}
            onChange={handleFilterChange}
            className="p-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
          />
        </div>
      </form>

      <ul className="list-disc list-inside bg-gray-800 p-4 rounded-md shadow-md space-y-4">
        {productsOnPage.length === 0 ? (
          <p className="text-red-500">No se encontraron productos.</p>
        ) : (
          productsOnPage.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center border-b border-gray-700 p-4 last:border-none"
            >
              <div>
                <p className="text-lg font-semibold text-white">{product.name}</p>
                <p className="text-sm text-gray-400">Marca: {product.brand}</p>
                <p className="text-sm text-gray-400">
                  Precio:{" "}
                  {product.price.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </p>
              </div>
              {isAdmin && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Actualizar
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListStore;
