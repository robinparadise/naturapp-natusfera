import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExploreDetailPage } from './explore-detail-page.component';
import { GoogleMaps } from '@ionic-native/google-maps';
import {SelectSpeciesComponent} from '../../shared/select-species/select-species.component';
import {SharedModule} from '../../shared/shared.module';
import {PhotoViewerZoomPage} from '../../shared/photo-viewer-zoom/photo-viewer-zoom.page';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ExploreDetailPage,
  },
  {path: 'sub', component: ExploreDetailPage,}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule
  ],
  declarations: [ExploreDetailPage],
  entryComponents: [
      SelectSpeciesComponent,
      PhotoViewerZoomPage
  ],
  providers: [GoogleMaps]
})
export class ExploreDetailPageModule {}
