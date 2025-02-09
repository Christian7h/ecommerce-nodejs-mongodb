// handleDelete.ts

export async function handleDelete(movieId: string) {
    try {
      const response = await fetch(`https://christian-api-node-movies.netlify.app/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Película eliminada con éxito');
        window.location.reload(); // Recargar la página después de eliminar
      } else {
        alert(data.status || 'No se pudo eliminar la película');
      }
    } catch (error) {
      console.error('Error al eliminar la película:', error);
      alert('Hubo un error al eliminar la película');
    }
  }
  