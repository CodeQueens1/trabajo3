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


@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,
    IonicModule, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatNativeDateModule]
})
export class RegistrarmePage implements OnInit {
  public usuario: Usuario = new Usuario();
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  constructor(private authService:AuthService, private router: Router) {
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado)=>{
      if(usuarioAutenticado){
        this.usuario = usuarioAutenticado;
      }
    });
   }

  ngOnInit() {
  }

  navegateIngreso(){
    this.router.navigate(['/ingreso'])
  }

}
