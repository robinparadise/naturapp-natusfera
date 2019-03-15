import {Component, OnInit} from '@angular/core';
import {ParamExpService} from '../providers/param-exp.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    constructor(public params: ParamExpService) {}

    ngOnInit(): void {
    }

    changeTab() {
        this.params.item = null;
    }
}
