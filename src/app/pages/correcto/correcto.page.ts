import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HeaderComponent,TranslateModule]
})
export class CorrectoPage implements OnInit {
  
usuario: Usuario = new Usuario();
password: string | undefined

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {

    this.authService.usuarioAutenticado.subscribe( (usuarioAutenticado)=>{
      
      if(usuarioAutenticado){
         this.usuario = usuarioAutenticado
        console.log('Usuario cargado en PreguntaPage:', this.usuario);
      }
    });
  }

  
  public navigateToLogin(): void {
    this.router.navigate(['/ingreso']);  // Usa el servicio Router para navegar
  } 

}
