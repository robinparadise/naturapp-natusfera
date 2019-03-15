import {DomSanitizer} from '@angular/platform-browser';
import {Pipe} from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';


@Pipe({name: 'safeImg'})
export class SafeImg{
    constructor(private sanitizer:DomSanitizer, private webview: WebView){}

    transform(html) {
        // if(isIOS) html = html.replace(/^file:\/\//, '')
        // return this.sanitizer.bypassSecurityTrustResourceUrl(html);
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.webview.convertFileSrc(html));
    }
}
