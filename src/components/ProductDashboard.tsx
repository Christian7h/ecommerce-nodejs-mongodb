import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  richDescription: string;
  brand: string;
  price: number;
  category: Category;
  countInStock: number;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  image: string;
}

interface ProductForm {
  id: string | null;
  name: string;
  description: string;
  richDescription: string;
  brand: string;
  price: number;
  category: string;
  countInStock: number;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  image: File | null;
}

export default function ProductDashboard({ token }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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
  const [form, setForm] = useState<ProductForm>({
    id: null,
    name: "",
    description: "",
    richDescription: "",
    brand: "",
    price: 0,
    category: "",
    countInStock: 0,
    isFeatured: false,
    rating: 0,
    numReviews: 0,
    image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories`
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(key, value.toString());
        }
      });
      if (form.image) {
        formData.append("image", form.image);
      }

      const url = form.id
        ? `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/${form.id}`
        : `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products`;
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save product");

      setNotification(
        form.id
          ? "Producto actualizado con éxito"
          : "Producto agregado con éxito"
      );
      fetchProducts();
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
        rating: 0,
        numReviews: 0,
        image: null,
      });
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      setNotification("Producto eliminado con éxito");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
        <h1 className="text-2xl font-bold text-white">Product Dashboard</h1>
      </div>
      <div className="p-6">
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
              {(form.rating < 0 || form.rating > 5) && (
                <p className="text-red-500">
                  La calificación debe estar entre 0 y 5.
                </p>
              )}
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
            <div>
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
            </div>
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

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  En Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {product.countInStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
