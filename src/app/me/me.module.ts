import { AuthGuard } from './../utils/AuthGuard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MePage } from './me.page';
import { SettingsComponent } from './settings/settings.component';
import {TranslateModule} from '@ngx-translate/core';
import {NotificationsPage} from './notifications/notifications.page';

const routes: Routes = [
  {
    path: '',
    component: MePage, canActivate:[AuthGuard] 
  },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsPage }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [
    MePage,
    SettingsComponent,
    NotificationsPage
  ]
})
export class MePageModule {}
