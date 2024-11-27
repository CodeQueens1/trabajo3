import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
})
export class RegistrarmePage implements OnInit {
  public usuario: Usuario = new Usuario();
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  
  // Propiedad para repetir la contraseña
  public repetirPassword: string = '';
 

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertCtrl: AlertController,
    private dataBaseService: DataBaseService
  ) {}

  ngOnInit() {}

  async crearCuenta() {
    // Validar que las contraseñas coincidan
    if (this.usuario.password !== this.repetirPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Guardar el usuario usando el servicio AuthService
    //this.authService.guardarUsuarioAutenticado(this.usuario);

     try {
      await this.dataBaseService.guardarUsuario(this.usuario);  // Guarda el nuevo usuario
      await this.dataBaseService.leerUsuarios();  // Actualiza la lista de usuarios
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }

    // Mostrar mensaje de éxito
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Cuenta creada exitosamente. Iniciando sesión...',
      buttons: ['OK'],
    });
    await alert.present();

    // Iniciar sesión automáticamente con la cuenta recién creada
    await this.authService.login(this.usuario.cuenta, this.usuario.password);

    // Redirigir al sistema (página principal)
    this.router.navigate(['/inicio']);
  }

  navegateIngreso() {
    this.router.navigate(['/ingreso']);
  }
}
