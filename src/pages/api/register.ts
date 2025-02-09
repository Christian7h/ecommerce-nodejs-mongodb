// src/pages/api/register.ts
export const prerender = false;

import type { APIContext } from "astro";
export async function POST(context: APIContext): Promise<Response> {
  // Leer los datos del formulario
  const formData = await context.request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");
  const city = formData.get("city");
  const country = formData.get("country");

  // Validar los datos
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof phone !== "string" || typeof city !== "string" || typeof country !== "string") {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/node/register?error=Datos inválidos",
      },
    });
  }

  // Crear un nuevo usuario
  let user = {
    name: name,
    email: email,
    password: password,  // Enviar la contraseña sin encriptar, el backend la manejará
    phone: phone,
    city: city,
    country: country,
  };

  // Enviar la solicitud a tu API de Node.js para guardar el usuario
  const response = await fetch('https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  // Manejar la respuesta
  if (response.ok) {
    return context.redirect("/node/login");              
  } else {
    const errorText = await response.text();
    return new Response(null, {
      status: 302,
      headers: {
        "Location": `/node/register?error=${encodeURIComponent(errorText)}`,
      },
    });
  }
} 
