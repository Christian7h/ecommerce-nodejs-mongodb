import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Pagination from "./Pagination";

const ManageProducts = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: "", brand: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState(""); // Para notificaciones
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const itemsPerPage = 8;

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    richDescription: "",
    brand: "",
    price: 0,
    category: "",
    countInStock: 0,
    isFeatured: false,
    rating: 0, // Campo agregado
    numReviews: 0, // Campo agregado
    image: null,
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    fetchCategories();
    fetchProducts();
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Error fetching categories: ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products"
      );
      if (!res.ok) throw new Error(`Error fetching products: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert("No tienes permisos para gestionar productos.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    const endpoint = form.id
      ? `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/${form.id}`
      : "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products";
    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setNotification(
          `Producto ${form.id ? "actualizado" : "añadido"} con éxito.`
        );
        fetchProducts();
        resetForm();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setModalOpen(true);
  };
  const handleDelete = async () => {
    if (!isAdmin || !productToDelete) {
      alert("No tienes permisos para eliminar productos.");
      return;
    }

    try {
      const res = await fetch(
        `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setNotification("Producto eliminado con éxito");
        setProducts(products.filter((p) => p._id !== productToDelete));
      } else {
        const data = await res.json();
        alert(`Error eliminando el producto: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      richDescription: "",
      brand: "",
      price: 0,
      category: "",
      countInStock: 0,
      isFeatured: false,
      image: null,
    });
  };

  const handleEdit = (product) => {
    setForm({
      id: product._id,
      name: product.name,
      description: product.description,
      richDescription: product.richDescription,
      brand: product.brand,
      price: product.price,
      category: product.category._id || "", // Usa el _id de la categoría
      countInStock: product.countInStock,
      isFeatured: product.isFeatured,
      rating: product.rating,
      numReviews: product.numReviews,
      image: null,
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      product.brand.toLowerCase().includes(filters.brand.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const productsOnPage = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (!categories.length || !products.length) {
    return <div className="text-valorant">Cargando datos...</div>;
  }

  return (
    <div className="bg-valorant-dark rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 p-8 justify-center">
      <div className="max-w-2xl bg-gray-800 rounded-lg shadow-md p-6 space-y-6 content-stretch">
        <h1 className="text-2xl font-bold text-valorant mb-6">
          Gestión de Productos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {notification && (
            <div className="text-green-500 bg-gray-900 rounded-lg p-4 mb-4">
              {notification}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xl text-white">
                Nombre del Producto
              </label>
              <input
                placeholder="Nike Air Max 90"
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-xl text-white">
                Marca
              </label>
              <input
                placeholder="Nike"
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                pattern="^[a-zA-Z\s]+$"
                title="La marca solo puede contener letras y espacios."
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xl text-white">
                Descripción
              </label>
              <textarea
                placeholder="Zapatillas deportivas Nike Air Max 90"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="richDescription"
                className="block text-xl text-white"
              >
                Descripción Larga
              </label>
              <textarea
                placeholder="Zapatillas deportivas Nike Air Max 90, ideales para correr y hacer deporte."
                name="richDescription"
                value={form.richDescription}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-xl text-white">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                min="0"
                max="1500000"
                required
              />
              {form.price < 0 && (
                <p className="text-red-500">El precio no puede ser negativo.</p>
              )}
            </div>
            <div>
              <label
                htmlFor="countInStock"
                className="block text-xl text-white"
              >
                Cantidad en Stock
              </label>
              <input
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                min="0"
                max="254"
                required
              />
              {form.countInStock < 0 && (
                <p className="text-red-500">
                  La cantidad en stock no puede ser negativa.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="category" className="block text-xl text-white">
                Categoría
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rating" className="block text-xl text-white">
                Calificación
              </label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                min="0"
                max="5"
                step="0.1"
                required
              />
              {form.rating < 0 ||
                (form.rating > 5 && (
                  <p className="text-red-500">
                    La calificación debe estar entre 0 y 5.
                  </p>
                ))}
            </div>
            <div>
              <label htmlFor="numReviews" className="block text-xl text-white">
                Número de Reseñas
              </label>
              <input
                type="number"
                name="numReviews"
                value={form.numReviews}
                onChange={handleFormChange}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                min="0"
              />
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                className="h-5 w-5 text-red-600 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-red-600"
                checked={form.isFeatured}
                onChange={handleFormChange}
              />
              <span className="text-white text-lg font-semibold">
                Destacado
              </span>
            </label>
            <div>
              <label htmlFor="image" className="block text-xl text-white">
                Imagen
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="p-2 w-auto bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {form.id ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-valorant mb-4">
          Lista de Productos
        </h2>
        <ul className="space-y-2">
          {productsOnPage.map((product) => (
            <li
              key={product._id}
              className="bg-gray-700 p-2 rounded-lg flex justify-between items-center"
            >
              <div className="text-white">
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-sm">
                  Destacado: {product.isFeatured ? "Sí" : "No"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => openDeleteModal(product._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-valorant-dark p-6 rounded-lg shadow-lg">
            <p>¿Estás seguro de que deseas eliminar este producto?</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
