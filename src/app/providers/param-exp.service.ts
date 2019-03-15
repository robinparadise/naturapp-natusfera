import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamExpService {

  private _item: any;
  private _user: any;
  public project: any;
  reload: boolean;

  constructor() { }

    get item(): any {
        return this._item;
    }

    set item(value: any) {
        this._item = value;
    }

    get user(): any {
        return this._user;
    }

    set user(value: any) {
        this._user = value;
    }

}
