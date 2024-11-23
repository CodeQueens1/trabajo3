import { Component, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule ]

})
export class MiclaseComponent  {
  miclase: any;
  private subs: Subscription;

  public usuario: Usuario = new Usuario();
  constructor(private authService: AuthService) { 
    this.subs = this.authService.qrCodeData.subscribe((qr)=>{
      console.log('Datos QR recibidos:', qr);
      this.miclase = qr? JSON.parse(qr): null;
    });

  }

ngOnDestroy(): void {
 this.subs.unsubscribe();
 }

}
