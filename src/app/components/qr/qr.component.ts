import { Component } from '@angular/core';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent {
  public qrData: string = 'https://example.com';  // Puedes cambiarlo por algo dinámico

  constructor() {}
}
