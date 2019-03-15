import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[src-default]'
})
export class ImgFallbackDirective {

  @Input('src-fallback') imgSrc: string;
  @Output('loaded') loaded = new EventEmitter();
  private nativeElement: HTMLElement;
  private isApplied: boolean = false;
  private ERROR_EVENT_TYPE: string = 'error';
  private LOAD_EVENT_TYPE: string = 'load';
  private cancelOnError: Function;
  private cancelOnLoad: Function;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.nativeElement = el.nativeElement;
console.log("constructor");
    this.onError = this.onError.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.addEvents();
  }

  ngOnDestroy() {
    this.removeErrorEvent();
    this.removeOnLoadEvent();
  }

  private onError() {
    if (this.nativeElement.getAttribute('src') !== this.imgSrc) {
      this.isApplied = true;
      this.renderer.setAttribute(this.nativeElement, 'src', this.imgSrc);
    } else {
      this.removeOnLoadEvent();
    }
  }

  private onLoad() {
    // this.loaded.emit(this.isApplied);
  }

  private removeErrorEvent() {
    if (this.cancelOnError) {
      this.cancelOnError();
    }
  }

  private removeOnLoadEvent() {
    if (this.cancelOnLoad) {
      this.cancelOnLoad();
    }
  }

  private addEvents() {
    this.cancelOnError = this.renderer.listen(this.nativeElement, this.ERROR_EVENT_TYPE, this.onError);
    this.cancelOnLoad = this.renderer.listen(this.nativeElement, this.LOAD_EVENT_TYPE, this.onLoad);
  }
}
