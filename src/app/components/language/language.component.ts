import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [
    CommonModule,    // Permite usar directivas comunes de Angular
    FormsModule,     // Permite usar formularios
    IonicModule,     // Permite usar componentes de Ionic
    TranslateModule  // Permite usar la canalización 'translate'
  ]
})
export class LanguageComponent {

  @Output() changeCurrentLanguage = new EventEmitter();

  languageSelected = "es";

  constructor(private translate: TranslateService) { 
    const savedLanguage = localStorage.getItem('language') || 'es'; // Carga el idioma guardado o usa 'es' por defecto
    this.translate.use(savedLanguage);
    this.languageSelected = savedLanguage;
  }

  setCurrentLanguage() {
    this.languageSelected = this.translate.currentLang; // Sincroniza el idioma seleccionado con el actual
  }

  changeLanguage(value: string) {
    this.translate.use(value);
    localStorage.setItem('language', value); // Guarda el idioma seleccionado
    this.changeCurrentLanguage.emit(value);
    this.languageSelected = value; // Actualiza el idioma seleccionado localmente
  }
}
