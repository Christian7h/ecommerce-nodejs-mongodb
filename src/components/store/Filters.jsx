const Filters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">Filtros</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Buscar por nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ej: Camiseta"
            value={filters.name}
            onChange={onFilterChange}
            className="mt-1 p-3 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-valorant focus:border-valorant transition"
          />
        </div>

        {/* Filtro por Marca */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-300">
            Buscar por marca
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            placeholder="Ej: Nike"
            value={filters.brand}
            onChange={onFilterChange}
            className="mt-1 p-3 w-full rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-valorant focus:border-valorant transition"
          />
        </div>

        {/* Botón para limpiar filtros */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onFilterChange({ target: { name: "name", value: "" } }) || onFilterChange({ target: { name: "brand", value: "" } })}
            className="w-full bg-gray-600 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Limpiar Filtros
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filters;