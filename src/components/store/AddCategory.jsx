import { useState, useEffect } from "react";

function AddCategory({ token }) {
  const [formData, setFormData] = useState({ name: "", icon: "", color: "" });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    <div className="bg-valorant-dark grid grid-cols-1 md:grid-cols-2 gap-2 p-8 justify-center">
      <div className="max-w-4xl bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-3xl font-bold text-valorant mb-6">{selectedCategory ? "Editar Categoría" : "Añadir Categoría"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xl text-white">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Electrónica"
              value={formData.name}
              onChange={handleChange}
              className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-xl text-white">Icono</label>
            <input
            type="text"
            name="icon"
            placeholder="Icon"
            value={formData.icon}
            onChange={handleChange}
              className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-xl text-white">Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              placeholder="Color"
              onChange={handleChange}
              className="w-full h-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {selectedCategory ? "Actualizar" : "Añadir"}
          </button>
        </form>
        </div>
        <div className="max-w-xl bg-gray-800 rounded-lg shadow-md p-6 space-y-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-valorant mb-4">Categorías Existentes</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="bg-gray-700 p-2 rounded-lg flex justify-between items-center">
              <span className="text-white">{category.name} - {category.icon} - <span style={{ color: category.color }}>{category.color}</span></span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(category)} className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transition duration-200">Editar</button>
                <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-700 transition duration-200">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddCategory;
