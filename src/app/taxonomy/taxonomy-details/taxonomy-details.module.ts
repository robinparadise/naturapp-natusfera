import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TaxonomyDetailsPage } from './taxonomy-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaxonomyDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TaxonomyDetailsPage]
})
export class TaxonomyDetailsPageModule {}
