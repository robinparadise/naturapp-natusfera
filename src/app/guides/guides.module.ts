import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {GuidesPage} from './guides.page';
import {GuideDetailComponent} from './guide-detail/guide-detail.component';
import {SharedModule} from '../shared/shared.module';
import {ImgFallbackDirective} from '../shared/img/img-fallback.directive';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: GuidesPage
  },
  { path: 'guide-detail', component: GuideDetailComponent}
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
  declarations: [
    GuidesPage,
    GuideDetailComponent
  ]
})
export class GuidesPageModule {}
