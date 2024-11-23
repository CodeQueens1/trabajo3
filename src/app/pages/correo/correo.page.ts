import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HeaderComponent,TranslateModule]
})
export class CorreoPage implements OnInit {

  public correo: string = ''; 
  public cuenta: string = ''; 
  public usuario:Usuario = new Usuario(); 
  toastMessage: string = '';
  showToast: boolean = false;
  

  constructor(private router: Router,private authService: AuthService,private dbService: DataBaseService) {
  }

  ngOnInit() {
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuario = usuarioAutenticado;
        console.log('Usuario cargado en PreguntaPage:', this.usuario);
      } else {
        // Muestra un mensaje o habilita el formulario en lugar de redirigir inmediatamente
        console.warn('Usuario no autenticado, pero permitiendo acceso a la página de correo.');
      }
    });
  }
  

  async validarCorreo() {
    console.log('Validando correo:', this.correo); // Confirmar el correo ingresado
  
    if (!this.correo) {
      this.presentToast('Ingrese un correo válido');
      return;
    }
  
    try {
      console.log('Buscando usuario con el correo:', this.correo); // Confirmar antes de buscar
      const usuario = await this.dbService.buscarUsuarioPorCorreo(this.correo);
  
      if (usuario) {
        console.log('Usuario encontrado, guardando en AuthService y redirigiendo:', usuario);
        
        // Guardar el usuario en el AuthService
        this.authService.guardarUsuarioAutenticado(usuario);
  
        // Navegar a la página de pregunta
        this.router.navigate(['/pregunta']);
      } else {
        console.warn('Usuario no encontrado, redirigiendo a la página de incorrecto.');
        this.router.navigate(['/incorrecto']); // Redirigir a la página de incorrecto
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      this.presentToast('Ha sucedido un error');
    }
  }
  

  presentToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  public navigateToLogin(): void {
    this.router.navigate(['/ingreso']);
  }
}



