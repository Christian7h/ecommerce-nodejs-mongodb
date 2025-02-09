import { useEffect, useState } from 'react';
import { formatPriceToCLP } from '../../utils/formattedPriceToClp'; // Importar la función de formateo

const PaymentSuccess = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenWs = params.get('token_ws');
    const productId = params.get('productId'); // Obtener el ID del producto de los parámetros de la URL

    if (tokenWs) {
      const fetchTransactionDetails = async () => {
        try {
          const response = await fetch(`/api/webpay/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: tokenWs }),
          });

          if (response.ok) {
            const data = await response.json();
            setDetails(data.details);
            setLoading(false);

            // Obtener los detalles del producto
            const productResponse = await fetch(`https://dummyjson.com/products/${productId}`);
            const productData = await productResponse.json();
            setProduct(productData);
          } else {
            const errorData = await response.json();
            setError(errorData.error);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error al obtener los detalles de la transacción:', err);
          setError('Error al obtener los detalles de la transacción.');
          setLoading(false);
        }
      };

      fetchTransactionDetails();
    } else {
      setError('Token no encontrado en la URL.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p className='text-[#d5d6c3]'>Cargando detalles...</p>;
  }

  if (error) {
    return <p className='text-[#d5d6c3]'>Error: {error}</p>;
  }

  // Formatear el precio en CLP
  const formattedPrice = product ? formatPriceToCLP(product.price) : '';

  return (
    <div className='text-[#d5d6c3]'>
      <h1 className='text-4xl font-bold text-valorant mb-8'>¡Pago Exitoso!</h1>
      {details ? (
        <div>
          <p>Gracias por tu compra. Aquí están los detalles de tu transacción:</p>
          <p><strong>Monto:</strong> {details.amount}</p>
          <p><strong>Número de Orden:</strong> {details.buy_order}</p>
          <p><strong>Fecha de la Transacción:</strong> {new Date(details.transaction_date).toLocaleString()}</p>
          <p><strong>Código de Autorización:</strong> {details.authorization_code}</p>
          <p><strong>Número de Tarjeta:</strong> **** **** **** {details.card_detail.card_number}</p>
        </div>
      ) : (
        <p>No se encontraron detalles de la transacción. 7w7</p>
      )}
      {product && (
        <div className='bg-valorant-dark p-4 rounded-lg shadow-lg block hover:shadow-2xl transition-shadow duration-300 mt-8'>
          <h2 className='text-2xl font-semibold text-valorant mb-4'>Detalles del Producto</h2>
          <img src={product.images[0]} alt={product.title} className='w-full h-48 object-contain mb-4 rounded-lg' loading='lazy' />
          <p className='text-lg'>{product.description}</p>
          <p className='text-lg font-bold'>{formattedPrice}</p>
          <p className='text-lg'>Categoría: {product.category}</p>
          <p className='text-lg'>Marca: {product.brand}</p>
          <p className='text-lg'>Existencias: {product.stock}</p>
          <p className='text-lg'>Clasificación: {product.rating}</p>
        </div>
      )}
      <div>
        <button className="bg-[#d5d6c3] hover:bg-[#231f20] text-black hover:text-[#d5d6c3] font-bold py-1 px-7 mt-4 border transition duration-200 ease-in-out rounded-lg focus:ring-offset-2">
          <a href="/" className="text-[#231f20] hover:text-[#d5d6c3]">VOLVER</a>
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
