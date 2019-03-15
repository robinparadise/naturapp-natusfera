import {NgModule} from '@angular/core';
import {SelectSpeciesComponent} from './select-species/select-species.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PhotoViewerZoomPage} from './photo-viewer-zoom/photo-viewer-zoom.page';
import { ImgFallbackDirective } from './img/img-fallback.directive';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      TranslateModule
    ],
    declarations: [
        SelectSpeciesComponent,
        PhotoViewerZoomPage,
        ImgFallbackDirective
    ],
    exports: [
        SelectSpeciesComponent,
        PhotoViewerZoomPage,
        ImgFallbackDirective
    ],
})
export class SharedModule {

}
