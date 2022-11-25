import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from "./components/registration/registration.component";
import { LoginComponent } from "./components/login/login.component";
import { ApartmentsComponent } from "./components/apartments/apartments.component";
import { MenuComponent } from "./components/menu/menu.component";
import { TestComponent } from "./components/test/test.component";
import { FlatComponent } from "./components/flat/flat.component";
import { ChatComponent } from "./components/chat/chat.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'apartments', component: ApartmentsComponent },
    { path: 'flats', component: ApartmentsComponent },
    { path: 'flat/:id', component: FlatComponent },
    { path: 'chat/:id', component: ChatComponent },


    { path: 'test', component: TestComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
