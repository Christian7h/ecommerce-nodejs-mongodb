import type { APIContext } from "astro";
import { jwtDecode } from "jwt-decode";
export const prerender = false;

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Verificar que el email y el password sean cadenas
  if (typeof email !== "string" || typeof password !== "string") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/node/login?error=Datos%20inválidos",  // %20 es un espacio en URL
      },
    });
  }

  try {
    // Enviar una solicitud POST al backend de autenticación
    const response = await fetch("https://nodejs-eshop-api-course-2c70.onrender.com/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // Obtener el token de la respuesta
    const { token } = await response.json();
    
    // Decodificar el token
    const decodedToken: { isAdmin: boolean; userId: string } = jwtDecode(token);

    // Guardar el token en las cookies con la configuración adecuada
    context.cookies.set("token", token, {
      httpOnly: true, // No se puede acceder con JavaScript
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS si está en producción
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
    });

    // Redirigir dependiendo de si es administrador o no
    const redirectPath = decodedToken.isAdmin ? "/node/store" : "/";
    return context.redirect(redirectPath);

  } catch (error) {
    // En caso de error, redirigir con el mensaje de error
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/node/login?error=${encodeURIComponent(error.message)}`, // Corregir el error tipográfico aquí
      },
    });
  }
}
