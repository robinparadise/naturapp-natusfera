import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ObservePage} from './observe.page';
import {ChooseProjectComponent} from './choose-project/choose-project.component';
import {SelectPositionComponent} from './select-position/select-position.component';
import {SafeImg} from '../utils/SafeImg';
import {SelectSpeciesComponent} from '../shared/select-species/select-species.component';
import {SharedModule} from '../shared/shared.module';
import {SelectPositionPageModule} from './select-position/select-position.module';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: ObservePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    SelectPositionPageModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [
    ObservePage,
    ChooseProjectComponent,
    ChooseProjectComponent,
    // TaxonomyPage,
    // SelectPositionComponent,
    SafeImg,
    // SelectSpeciesComponent,
  ],
  entryComponents: [ ChooseProjectComponent, // TaxonomyPage,
    SelectPositionComponent,
    SelectSpeciesComponent
  ]
})
export class ObservePageModule {}
