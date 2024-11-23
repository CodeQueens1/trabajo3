import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/home'; // Verifica si la ruta actual es 'home'
  }

}
