import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {NatuClientService} from '../providers/natu-client.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!JSON.parse(localStorage.getItem('user'))) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

}
