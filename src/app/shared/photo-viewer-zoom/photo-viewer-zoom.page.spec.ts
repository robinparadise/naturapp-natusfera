import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewerZoomPage } from './photo-viewer-zoom.page';

describe('PhotoViewerZoomPage', () => {
  let component: PhotoViewerZoomPage;
  let fixture: ComponentFixture<PhotoViewerZoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoViewerZoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoViewerZoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
