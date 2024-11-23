import { Component, OnInit,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent ]
})
export class IngresoPage implements OnInit {

  cuenta: string = '';
  password: string = '';

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  constructor(private authService: AuthService //inyectar servicio de autenticación
              , private translate: TranslateService, private router: Router
  ) { }

  ngOnInit() {
    this.cuenta = 'atorres';
    this.password = '1234';
  }

  iniciarSesion() {
    this.authService.login(this.cuenta, this.password);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  recuperarContrasena(){
    this.router.navigate(['/correo'])
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navegateRegistrarme(){
    this.router.navigate(['/registrarme'])
  }

}
