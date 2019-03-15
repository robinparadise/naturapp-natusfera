import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs.router.module';

import {TabsPage} from './tabs.page';
import {ContactPageModule} from '../contact/contact.module';
import {AboutPageModule} from '../about/about.module';
import {HomePageModule} from '../home/home.module';
import {GuidesPageModule} from '../guides/guides.module';
import {ProjectsPageModule} from '../projects/projects.module';
import {MePageModule} from '../me/me.module';
import {ObservePageModule} from '../observe/observe.module';
import {SearchPageModule} from '../search/search.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    AboutPageModule,
    ContactPageModule,
    MePageModule,
    GuidesPageModule,
    ProjectsPageModule,
    ObservePageModule,
    SearchPageModule,
    TranslateModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
