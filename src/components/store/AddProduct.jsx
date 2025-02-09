//src/components/store/AddProduct.jsx
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AddProduct = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [richDescription, setRichDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error al cargar categorías");
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Token inválido');
      }
    }
  }, [token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setError('No tienes permisos para agregar productos');
      return;
    }

    if (!name || !description || !category || countInStock < 0) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('richDescription', richDescription);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('rating', rating);
    formData.append('numReviews', numReviews);
    formData.append('isFeatured', isFeatured);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess('Producto añadido correctamente');
        setName('');
        setDescription('');
        setRichDescription('');
        setPrice(0);
        setCategory('');
        setCountInStock(0);
        setBrand('');
        setImage(null);
        setIsFeatured(false);
        setRating('');
        setNumReviews('');
      } else {
        const data = await res.json();
        setError(data.message || 'Error al agregar el producto');
      }
    } catch (err) {
      setError('Error al agregar el producto: ' + err.message);
    }
  };

  return (
    <div className="bg-valorant-dark min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6 text-valorant">Añadir Producto</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-xl text-white">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-xl text-white">Descripción *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="richDescription" className="block text-xl text-white">Descripción Larga</label>
          <textarea
            id="richDescription"
            value={richDescription}
            onChange={(e) => setRichDescription(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-xl text-white">Marca</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-xl text-white">Precio</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            min="0"
            max="1500000"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-xl text-white">Categoría *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="countInStock" className="block text-xl text-white">Cantidad en Stock *</label>
          <input
            type="number"
            id="countInStock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            required
            min="0"
            max="254"
          />
        </div>
        <div className="mb-4">
              <label htmlFor="rating" className="block text-xl text-white">Valoración</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                required
              />
        </div>
        <div className="mb-4">
              <label htmlFor="numReviews" className="block text-xl text-white">Número de Reseñas</label>
              <input
                type="number"
                id="numReviews"
                value={numReviews}
                onChange={(e) => setNumReviews(e.target.value)}
                className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
        <div className="mb-4">
              <label htmlFor="isFeatured" className="block text-xl text-white">Destacado</label>
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="p-2"
              />
            </div>
            
        <div className="mb-4">
          <label htmlFor="image" className="block text-xl text-white">Imagen</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Añadir Producto
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
