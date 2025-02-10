import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiX, FiTag } from "react-icons/fi";

function AddCategory({ token }) {
  const [formData, setFormData] = useState({ name: "", icon: "", color: "#FF4655" });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const API_URL = "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch existing categories
  const fetchCategories = async () => {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selectedCategory ? "PUT" : "POST";
    const url = selectedCategory ? `${API_URL}/${selectedCategory.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCategories(); // Refresh categories after adding/updating
        setFormData({ name: "", icon: "", color: "" }); // Reset form
        setSelectedCategory(null); // Reset selected category
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, icon: category.icon, color: category.color });
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(`${API_URL}/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchCategories(); // Refresh categories after deletion
      } else {
        const data = await response.json();
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };  if (!categories.length || !categories.length) {
    return <div className="text-valorant">Cargando datos...</div>;
  }

  return (
    <div className="bg-valorant-dark  max-h-screen grid grid-cols-1 p-3 lg:grid-cols-2 gap-6">
    {/* Formulario de Categorías */}
    <div className="bg-valorant-card rounded-xl shadow-lg p-6 h-fit sticky top-6">
      <h2 className="text-2xl font-bold text-valorant-light mb-6 flex items-center gap-2">
        <FiTag size={24} />
        {selectedCategory ? "Editar Categoría" : "Nueva Categoría"}
      </h2>

      {notification && (
        <div className="mb-4 p-4 rounded-lg bg-green-900/50 text-green-400">
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-valorant-light text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            placeholder="Ej: Electrónica"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-valorant-light text-sm font-medium">Icono (Clase)</label>
          <input
            type="text"
            name="icon"
            placeholder="Ej: FiSmartphone"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-valorant-input rounded-lg text-valorant-light focus:ring-2 focus:ring-valorant-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-valorant-light text-sm font-medium">Color</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
            </div>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-8 bg-valorant-input rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-valorant-accent text-valorant-light rounded-lg font-medium hover:bg-valorant-accent/90 transition-colors flex items-center justify-center gap-2"
        >
          <FiPlus size={20} />
          {selectedCategory ? "Actualizar Categoría" : "Crear Categoría"}
        </button>
      </form>
    </div>

    {/* Listado de Categorías */}
    <div className="bg-valorant-card rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-valorant-light mb-6 flex items-center gap-2">
        <FiTag size={20} />
        Categorías Existentes ({categories.length})
      </h3>

      <div className="overflow-x-auto rounded-lg border border-valorant-border">
        <table className="w-full">
          <thead className="bg-valorant-dark">
            <tr>
              <th className="px-6 py-4 text-left text-valorant-light">Nombre</th>
              <th className="px-6 py-4 text-left text-valorant-light">Color</th>
              <th className="px-6 py-4 text-left text-valorant-light">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-valorant-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-valorant-dark/50">
                <td className="px-6 py-4 text-valorant-light font-medium">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <FiTag 
                          size={20} 
                          style={{ color: category.color }} 
                        />
                      </div>
                    )}
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-lg border border-valorant-border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-valorant-light">
                      {category.color}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-valorant-accent/20 rounded-lg text-valorant-light hover:text-valorant-accent transition-colors"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteModal(category.id)}
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
    </div>

    {/* Modal de Confirmación */}
    {deleteModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-valorant-card rounded-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-valorant-light">Confirmar Eliminación</h3>
            <button 
              onClick={() => setDeleteModal(null)}
              className="text-valorant-gray hover:text-valorant-light"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-valorant-light mb-6">¿Estás seguro de eliminar esta categoría? Todos los productos asociados serán afectados.</p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setDeleteModal(null)}
              className="px-6 py-2 text-valorant-light hover:bg-valorant-border rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleDelete(deleteModal);
                setDeleteModal(null);
              }}
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
}

export default AddCategory;
