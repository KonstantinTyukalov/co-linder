import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from '@components/registration/registration.component';
import { LoginComponent } from '@components/login/login.component';
import { ApartmentsComponent } from '@components/content/apartments/apartments.component';
import { MenuComponent } from '@components/menu/menu.component';
import { TestComponent } from '@components/test/test.component';
import { ChatComponent } from '@components/content/chat/chat.component';
import { GetUserGuard } from './guards/user.guard';
import { FlatComponent } from '@components/content/flat/flat.component';

const routes: Routes = [
    { path: '', component: MenuComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'menu', component: MenuComponent, canActivate: [GetUserGuard] },
    { path: 'apartments', component: ApartmentsComponent, canActivate: [GetUserGuard] },
    { path: 'flats', component: ApartmentsComponent, canActivate: [GetUserGuard] },
    { path: 'flat/:id', component: FlatComponent, canActivate: [GetUserGuard] },
    { path: 'chat/:id', component: ChatComponent, canActivate: [GetUserGuard] },

    { path: 'test', component: TestComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [GetUserGuard]
})

export class AppRoutingModule {

}
