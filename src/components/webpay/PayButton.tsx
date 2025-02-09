import React from 'react';
import webpayLogo from '../../assets/webpaylogo1.png?url'; // Importar la imagen del logo de Webpay como URL
interface PayButtonProps {
  amount: number;
  productId: number; // Agregar el ID del producto como prop
}

const PayButton: React.FC<PayButtonProps> = ({ amount, productId }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/webpay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Usa el monto recibido como prop
          sessionId: 'session123', // ID de la sesión del usuario
          buyOrder: `order-${Date.now()}`, // Número de orden único
          returnUrl: `https://apis-cristian.netlify.app/thank-you?productId=${productId}`, // URL de confirmación con el ID del producto
        }),
      });

      const data = await response.json();

      if (data.token && data.url) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Ocurrió un error al procesar el pago');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handlePayment}
        className="bg-[#ff4655] hover:bg-[#0f1923] text-[#0f1923] hover:text-[#d5d6c3] font-bold py-2 px-4 mt-4 border transition duration-200 ease-in-out w-full rounded-xl"
      >
        Pagar con WEBPAY
      </button>
      <img
        src={webpayLogo} // Reemplaza con la ruta correcta a la imagen del logo de Webpay
        alt="Webpay Logo"
        className="w-full h-auto max-w-xs mx-auto"
      />
    </div>
  );
};

export default PayButton;
