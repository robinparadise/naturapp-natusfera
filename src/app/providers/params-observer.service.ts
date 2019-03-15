import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Subscriber} from 'rxjs/src/internal/Subscriber';

@Injectable({
  providedIn: 'root'
})
export class ParamsObserverService implements OnInit{

  published : (item: any) => any;// Observable<any>;
  private observable: Subscriber<any>;

  constructor() {
    // const some = new Subscriber<any>();
    // some.obser

  }
  public publish(item: any){
    if(this.published) this.published(item);
    // this.observable.next(item);
  }

  async ngOnInit() {
    // this.publish = Observable.create((observer) =>{
    //   this.observable = observer;
    // });
  }
}
