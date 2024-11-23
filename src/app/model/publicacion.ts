export class Publicacion {
  id?: number;            // Hacer el id opcional
  correo: string;
  nombre: string;
  apellido: string;
  titulo: string;
  contenido: string;
  usuario: string;

  constructor() {
    this.correo = '';
    this.nombre = '';
    this.apellido = '';
    this.titulo = '';
    this.contenido = '';
    this.usuario = '';
  }
}
