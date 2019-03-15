import { AuthGuard } from './utils/AuthGuard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'guides', loadChildren: './guides/guides.module#GuidesPageModule' },
  { path: 'projects', loadChildren: './projects/projects.module#ProjectsPageModule' },
  { path: 'me', loadChildren: './me/me.module#MePageModule'},
  { path: 'explore', loadChildren: './home/explore-detail/explore-detail.module#ExploreDetailPageModule' },
  { path: 'observe', loadChildren: './observe/observe.module#ObservePageModule' },
  { path: 'cam', loadChildren: './observe/observe-cam/observe-cam.module#ObserveCamPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'PhotoViewerZoom', loadChildren: './shared/photo-viewer-zoom/photo-viewer-zoom.module#PhotoViewerZoomPageModule' },
  { path: 'position', loadChildren: './observe/select-position/select-position.module#SelectPositionPageModule' },
  { path: 'people', loadChildren: './people/people.module#PeoplePageModule' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
