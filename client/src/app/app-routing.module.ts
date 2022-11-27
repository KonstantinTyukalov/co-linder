import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ApartmentsComponent } from './components/apartments/apartments.component';
import { MenuComponent } from './components/menu/menu.component';
import { TestComponent } from './components/test/test.component';
import { FlatComponent } from './components/flat/flat.component';
import { ChatComponent } from './components/chat/chat.component';
import { GetUserGuard } from './guards/user.guard';

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
