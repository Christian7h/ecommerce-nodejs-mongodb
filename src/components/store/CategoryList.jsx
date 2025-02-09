import { useState, useEffect } from "react";

function CategoryList({ token }) {
  const [categories, setCategories] = useState([]);
  const API_URL = "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== id));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="bg-valorant-dark min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-3xl font-bold text-valorant mb-6">Lista de Categorías</h2>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div className="text-white">
                {category.name} - <span style={{ color: category.color }}>{category.color}</span>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryList;
