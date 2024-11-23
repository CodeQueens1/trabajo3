import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, pencilOutline, schoolOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
   

  ]
})
export class FooterComponent {

  componenteSeleccionado: string = 'codigoqr';

  constructor(private authService: AuthService) { 
    addIcons({ homeOutline, schoolOutline, pencilOutline, gridOutline });
  }

  cambiarComponente(componenteSeleccionado: string){
    
    this.componenteSeleccionado = componenteSeleccionado//muestra el valor de los ion-segment
  
    this.authService.componenteSeleccionado.next(this.componenteSeleccionado);
  }

}
