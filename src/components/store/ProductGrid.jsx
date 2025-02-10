import PayButton from "../../components/webpay/PayButton";
import { formatPriceToCLP } from "../../utils/formattedPriceToClp";

const ProductGrid = ({ products }) => {
  if (!products.length) {
    return <p className="text-white">No se encontraron productos.</p>;
  }

  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex flex-col">
          <a href={`/node/product/${product._id}`} aria-label={`Ver detalles de ${product.name}`}>
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-52 object-cover rounded-lg mb-4 hover:scale-105 transition-transform duration-300"
            />
          </a>
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{product.description}</p>
          <p className="text-lg font-bold text-valorant mb-2">{formatPriceToCLP(product.price)}</p>
          <div className="flex flex-col space-y-2 mt-auto">
            <PayButton amount={product.price} productId={product._id} client:load />
            <button className="w-full bg-valorant py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
              Añadir al Carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
