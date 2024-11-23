import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation'; // 'Position' viene de @capacitor/geolocation
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private platform: Platform, private http: HttpClient) {}

  // Cambiamos el tipo de retorno a solo latitud y longitud
  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    try {
      // Si estamos en un dispositivo móvil usando Capacitor
      if (this.platform.is('capacitor')) {
        console.log('Calculando posición con el dispositivo móvil');
        const position: Position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true, // Alta precisión
          timeout: 10000,           // Tiempo máximo en milisegundos antes de un error (opcional)
          maximumAge: 0             // No usar ubicaciones almacenadas en caché
        });
        
        // Extraemos la latitud y longitud de la posición obtenida por Capacitor
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        return { lat, lng };
      } 

      // Si estamos en un entorno web
      if (this.platform.is('desktop') || this.platform.is('pwa')) {
        return new Promise((resolve, reject) => {
          if ('geolocation' in navigator) {
            console.log('Calculando posición con el navegador');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                resolve({ lat, lng });
              },
              (error) => reject(error)
            );
          } else {
            reject('Geolocalización no está soportada en este navegador.');
          }
        });
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo la posición:', error);
      return null;
    }
  }

  getPlaceFromCoordinates(lat: number, lng: number): Observable<any> {
    const apiUrl = 'https://nominatim.openstreetmap.org/reverse';
    const url = `${apiUrl}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

    https://nominatim.openstreetmap.org/reverse?format=json&lat=-33.5406215&lon=-70.5578871&zoom=18&addressdetails=1

    return this.http.get(url);
  }

}
