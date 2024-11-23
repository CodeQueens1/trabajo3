import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DataBaseService } from 'src/app/services/data-base.service'; // Importar el servicio de base de datos

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
})
export class MisdatosComponent implements OnInit {
  public usuario: Usuario = new Usuario();
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  constructor(private authService: AuthService, private dbService: DataBaseService) {
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuario = usuarioAutenticado;
  
        // Asegurarse de que nivelEducacional sea un objeto con un ID válido
        if (this.usuario.nivelEducacional && typeof this.usuario.nivelEducacional === 'number') {
          this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(this.usuario.nivelEducacional) || NivelEducacional.buscarNivelEducacional(1)!;
        } else if (!this.usuario.nivelEducacional) {
          this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
        }
      }
    });
  
  
  
  
    
  }

  ngOnInit() {}
  async actualizarUsuario() {
    try {
      console.log('Datos del usuario antes de guardar:', this.usuario);
      console.log('Tipo de fechaNacimiento:', typeof this.usuario.fechaNacimiento);
      console.log('Valor de fechaNacimiento:', this.usuario.fechaNacimiento);
  
      // Guarda el usuario en el almacenamiento local
      this.authService.guardarUsuarioAutenticado(this.usuario);
      console.log('Usuario guardado en el almacenamiento local.');
  
      // Guarda en la base de datos
      await this.dbService.guardarUsuario(this.usuario);
      console.log('Usuario guardado correctamente en la base de datos.');
  
      alert('Datos actualizados exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      const mensajeError = error?.message || 'Ocurrió un error desconocido.';
      alert(`Error al actualizar los datos del usuario: ${mensajeError}. Por favor, inténtalo de nuevo.`);
    }
  }
  
  onNivelEducacionalChange(nivelId: number): void {
    const nivel = this.listaNivelesEducacionales.find(n => n.id === nivelId);
    if (nivel) {
      this.usuario.nivelEducacional = nivel;
      console.log('Nivel educacional actualizado:', nivel);
    } else {
      console.warn('Nivel educacional inválido:', nivelId);
      // Si no se encuentra el nivel, asigna un nivel por defecto
      this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    }
  }
  
  
  
  
}
