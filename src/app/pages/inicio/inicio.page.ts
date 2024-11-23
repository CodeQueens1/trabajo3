import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonButton, IonIcon, IonSegment } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, pencilOutline, schoolOutline } from 'ionicons/icons';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from 'src/app/services/auth.service';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { Asistencia } from 'src/app/model/asistencia';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonFooter, IonSegment, IonIcon, IonButton, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule, CodigoqrComponent, MiclaseComponent,
    ForoComponent,HeaderComponent,FooterComponent,MisdatosComponent]
})
export class InicioPage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  componenteSeleccionado = 'welcome';

  constructor(private authService: AuthService,private scanner:ScannerService) {
    this.authService.componenteSeleccionado.subscribe((componenteSeleccionado)=>{
      this.componenteSeleccionado=componenteSeleccionado;
    });

   
   }

   async startQrScan(){
    if(Capacitor.getPlatform() === 'web') {
      this.componenteSeleccionado = 'codigoqr';
    }else{
      this.showasistenciaComponent(await this.scanner.scan());
    }
   }

   webQrScanned(qr: string) {
    console.log('QR ESCANEADO',qr)
    this.showasistenciaComponent(qr);
  }

  webQrStopped(){
  this.footer.cambiarComponente('welcome')
  }



   showasistenciaComponent(qr: string){
    console.log('verificando qr',qr)
    if (qr === '') {
      this.footer.cambiarComponente('welcome');
      return;
    }
    if (Asistencia.isValidAsistenciaQrCode(qr, true)) {
      this.authService.qrCodeData.next(qr);
      console.log('qr valido:',qr)
      this.footer.cambiarComponente('miclase');
      console.log('aqui',qr)
    } else {
      this.footer.cambiarComponente('welcome');
    }
  }


}
