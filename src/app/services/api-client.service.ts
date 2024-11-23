import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publicacion } from '../model/publicacion';
import { showToast } from '../tools/message-routines';


@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  

  // Variable reactiva que almacenará la lista de publicaciones
  listaPublicaciones: BehaviorSubject<Publicacion[]> = new BehaviorSubject<Publicacion[]>([]);

  // Cambia esta URL según el dispositivo en que estés probando
 private apiUrl = 'http://localhost:3000/posts';
 // Cambia 'localhost' por la IP si estás en un dispositivo móvil

  constructor(private http: HttpClient) {}

  // Método para cargar publicaciones desde la API
  cargarPublicaciones() {
    this.leerPublicaciones().subscribe({
      next: (publicaciones) => {
        this.listaPublicaciones.next(publicaciones as Publicacion[]);
      },
      error: (error: any) => {
        showToast('El servicio API Rest de Publicaciones no está disponible');
        this.listaPublicaciones.next([]);
      }
    });
  }

  obtenerPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl);
  }
  

  // Método para crear una publicación
  crearPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl, publicacion); // Asegúrate de que el endpoint es correcto
  }

  // Método para leer todas las publicaciones
  leerPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}`);
  }

  // Método para leer una publicación específica
  leerPublicacion(idPublicacion: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${idPublicacion}`);
  }

  // Método para actualizar una publicación existente
  actualizarPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.apiUrl}/${publicacion.id}`, publicacion, this.httpOptions);
  }

  // Método para eliminar una publicación por su ID
  eliminarPublicacion(publicacionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${publicacionId}`, this.httpOptions);
  }
  
}
