
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule],

})
export class CodigoqrComponent  implements OnDestroy {
  @ViewChild('video') private video!:ElementRef;
  @ViewChild('canvas') private canvas!:ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>(); 


  public usuario: Usuario = new Usuario();
  public escaneando = false;
  datosQR: string = '';
  mediaStream: MediaStream | null = null;//nuevo
  constructor(private authService: AuthService)
   { 
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado)=>{
      if(usuarioAutenticado){
        this.usuario = usuarioAutenticado;
      }
    });
    this.comenzarEscaneoQR();
  }
  
  private esDispositivoMovil(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  private showasistenciaComponent(qrData: any) {
    // Lógica para mostrar el componente de asistencia
    console.log("Datos de QR recibidos:", qrData);
    // Agrega aquí la lógica específica que necesitas
  }
  
  

  public async comenzarEscaneoQR() {
    if (this.esDispositivoMovil()) {
      try {
        // Pedir permiso para usar la cámara
        await BarcodeScanner.checkPermission({ force: true });
        
        // Ocultar la vista de la app para que se muestre la cámara
        BarcodeScanner.hideBackground();

        // Iniciar el escaneo
        const qrData = await BarcodeScanner.startScan();
        
        if (qrData.hasContent) {
          this.escaneando = false;
          this.showasistenciaComponent(qrData.content);
        }
      } catch (error) {
        console.error("Error al escanear QR", error);
      } finally {
        BarcodeScanner.showBackground();
      }
    } else {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {facingMode: 'environment'}
      });
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      this.escaneando = true;
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR()|| !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      console.log(qrCode.data)
      if (data !== '') {
        this.escaneando = false;
        this.detenerCamara();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }



  detenerEscaneoQr(): void {
    this.detenerCamara();

    this.escaneando = false;
  }

  
  ngOnDestroy() {
    this.detenerCamara();
  }

  
  detenerCamara() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

}
