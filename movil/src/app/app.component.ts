import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  libraryOutline,
  layersOutline,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  searchOutline,
  calendarOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  timeOutline,
  documentTextOutline,
  eyeOutline,
  closeOutline,
  refreshOutline,
  shieldCheckmarkOutline,
  personOutline,
  lockClosedOutline,
  cardOutline,
  homeOutline,
  businessOutline,
  folderOutline,
  openOutline,
  cameraOutline,
  moonOutline,
  sunnyOutline
} from 'ionicons/icons';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  constructor(private _theme: ThemeService) {
    addIcons({
      'book-outline': bookOutline,
      'library-outline': libraryOutline,
      'layers-outline': layersOutline,
      'person-circle-outline': personCircleOutline,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'search-outline': searchOutline,
      'calendar-outline': calendarOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'alert-circle-outline': alertCircleOutline,
      'time-outline': timeOutline,
      'document-text-outline': documentTextOutline,
      'eye-outline': eyeOutline,
      'close-outline': closeOutline,
      'refresh-outline': refreshOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'person-outline': personOutline,
      'lock-closed-outline': lockClosedOutline,
      'card-outline': cardOutline,
      'home-outline': homeOutline,
      'business-outline': businessOutline,
      'folder-outline': folderOutline,
      'open-outline': openOutline,
      'camera-outline': cameraOutline,
      'moon-outline': moonOutline,
      'sunny-outline': sunnyOutline
    });
  }
}

