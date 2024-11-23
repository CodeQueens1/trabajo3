import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class IncorrectoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigateToLogin(): void {
    this.router.navigate(['/ingreso']);  // Usa el servicio Router para navegar
  } 

}
