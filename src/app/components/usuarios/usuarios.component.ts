import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Usuario } from 'src/app/model/usuario';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
  
})
export class UsuariosComponent implements OnInit {
  listaUsuarios: Usuario[] = [];

  constructor(private dataBaseService: DataBaseService) {}

  ngOnInit() {
    // Suscribirse a la lista de usuarios del servicio
    this.dataBaseService.listaUsuarios.subscribe((usuarios) => {
      this.listaUsuarios = usuarios;
    });

    // Llamar a leerUsuarios para cargar los datos al iniciar el componente
    this.dataBaseService.leerUsuarios();
  }

  // Método para eliminar un usuario por su cuenta
  eliminarUsuario(cuenta: string) {
    this.dataBaseService.eliminarUsuarioUsandoCuenta(cuenta);
  }
}
