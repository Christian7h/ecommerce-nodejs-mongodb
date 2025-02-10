const CategoryList = ({ categories }) => {
  if (!categories.length) {
    return <p className="text-white text-center text-xl">No hay categorías disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {categories.map((category) => (
        <a
          key={category._id}
          href={`/node/category/${category._id}`}
          className="bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105 flex flex-col items-center text-center"
          aria-label={`Categoría ${category.name}`}
        >
          {/* Ícono o imagen de categoría */}
          <div className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded-full mb-4">
            <span className="text-lg font-bold text-valorant">{category.name[0]}</span>
          </div>
          <h3 className="text-xl font-semibold">{category.name}</h3>
          <p className="text-sm text-gray-400 mt-2">{category.description}</p>
        </a>
      ))}
    </div>
  );
};

export default CategoryList;