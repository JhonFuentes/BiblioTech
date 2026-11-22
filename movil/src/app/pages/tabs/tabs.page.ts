import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs-movil',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" style="--background: #ffffff; border-top: 1px solid #e2e8f0; height: 60px;">
        <ion-tab-button tab="prestamos">
          <ion-icon name="calendar-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 700;">Préstamos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="disponibilidad">
          <ion-icon name="layers-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 700;">Ejemplares</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil">
          <ion-icon name="person-circle-outline"></ion-icon>
          <ion-label style="font-size: 11px; font-weight: 700;">Mi Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsPage { }
