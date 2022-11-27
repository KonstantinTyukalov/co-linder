import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { user } from "../store/selectors/user.selectors";
import { userCreateOrUpdateInStore } from "../store/actions/user.actions";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class GetUserGuard implements CanActivate {

    private readonly user$ = this.store.select(user);

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.user$.pipe(
            map((user) => {
                if (user) {
                    return true;
                }

                const userFromLocalStorage = localStorage.getItem('userMetaData');
                if (userFromLocalStorage) {
                    this.store.dispatch(userCreateOrUpdateInStore({ user: JSON.parse(userFromLocalStorage) }));
                    return true;
                }

                this.router.navigate(['login'], { replaceUrl: true });
                return false;
            })
        );
    }
}