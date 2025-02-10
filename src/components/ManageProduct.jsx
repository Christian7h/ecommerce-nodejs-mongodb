import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Pagination from "./Pagination";
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX } from "react-icons/fi";

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
    <div className=" max-h-screen grid grid-cols-1 p-3 lg:grid-cols-2 gap-6">
      {/* Sección de Listado */}
      <div className="bg-valorant-card rounded-xl shadow-lg p-3">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-valorant-light">
            Gestión de Productos
          </h2>
        </div>
        <div className="space-x-2">
          <input
            placeholder="Buscar por nombre..."
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="px-4 py-2 mb-3 bg-valorant-input rounded-lg text-valorant-light placeholder-valorant-gray w-48 focus:ring-2 focus:ring-valorant-accent"
          />
          <input
            placeholder="Filtrar por marca..."
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="px-4 py-2 mb-3 bg-valorant-input rounded-lg text-valorant-light placeholder-valorant-gray w-48 focus:ring-2 focus:ring-valorant-accent"
          />
        </div>
        <div className="overflow-x-auto rounded-lg border border-valorant-light">
          <table className="w-full">
            <thead className="bg-valorant-dark">
              <tr>
                <th className="px-6 py-4 text-left text-valorant-light">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-valorant-light">
                  Marca
                </th>
                <th className="px-6 py-4 text-left text-valorant-light">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-valorant-light">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-valorant-border">
              {productsOnPage.map((product) => (
                <tr key={product._id} className="hover:bg-valorant-dark/50">
                  <td className="px-6 py-4 text-valorant-light font-medium">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-valorant-light">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        product.countInStock > 0
                          ? "bg-green-900/50 text-green-400"
                          : "bg-red-900/50 text-red-400"
                      }`}
                    >
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-valorant-accent/20 rounded-lg text-valorant-light hover:text-valorant-accent transition-colors"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product._id)}
                        className="p-2 hover:bg-red-900/20 rounded-lg text-valorant-light hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Formulario Lateral */}
      <div className="bg-valorant-card rounded-xl shadow-lg p-6 h-fit sticky top-6">
        <h3 className="text-2xl font-bold text-valorant-light mb-6">
          {form.id ? "Editar Producto" : "Nuevo Producto"}
        </h3>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.includes("eliminado")
                ? "bg-red-900/50 text-red-400"
                : "bg-green-900/50 text-green-400"
            }`}
          >
            {notification}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-valorant-light text-sm font-medium">
                Imagen del Producto
              </label>
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-valorant-border rounded-xl cursor-pointer hover:border-valorant-accent transition-colors">
                {form.image ? (
                  <img
                    src={
                      typeof form.image === "string"
                        ? form.image
                        : URL.createObjectURL(form.image)
                    }
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload
                      className="mx-auto text-valorant-gray mb-2"
                      size={24}
                    />
                    <span className="text-valorant-gray text-sm">
                      Subir imagen (PNG, JPG)
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-valorant-light text-sm font-medium">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-valorant-light text-sm font-medium">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows="2"
                className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="richDescription"
                className="text-valorant-light text-sm font-medium"
              >
                Descripción Larga
              </label>
              <textarea
                placeholder="Zapatillas deportivas Nike Air Max 90, ideales para correr y hacer deporte..."
                name="richDescription"
                value={form.richDescription}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-valorant-light text-sm font-medium">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-valorant-light text-sm font-medium">
                  Categoría
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-valorant-light text-sm font-medium">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-valorant-gray">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full pl-8 pr-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                    min="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-valorant-light text-sm font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={form.countInStock}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                  min="0"
                  max="255"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="rating"
                  className="text-valorant-light text-sm font-medium"
                >
                  Calificación
                </label>
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
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
                <label
                  htmlFor="numReviews"
                  className="text-valorant-light text-sm font-medium"
                >
                  Nro Reseñas
                </label>
                <input
                  type="number"
                  name="numReviews"
                  value={form.numReviews}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleFormChange}
                className="w-5 h-5 text-valorant-accent bg-valorant-input rounded focus:ring-valorant-accent"
              />
              <label className="text-valorant-light text-sm">
                Producto Destacado
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-valorant-accent text-valorant-light rounded-lg font-medium hover:bg-valorant-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            <FiPlus size={20} />
            {form.id ? "Actualizar Producto" : "Crear Nuevo Producto"}
          </button>
        </form>
      </div>

      {/* Modal de Confirmación */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-valorant-card rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-valorant-light">
                Confirmar Eliminación
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-valorant-gray hover:text-valorant-light"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-valorant-light mb-6">
              ¿Estás seguro de que deseas eliminar este producto
              permanentemente?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 text-valorant-light hover:bg-valorant-border rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-valorant-light rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
