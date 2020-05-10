import { NgModule } from '@angular/core'
// eslint-disable-next-line no-unused-vars
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { HomeComponent } from './components/home/home.component'
import { NewItemComponent } from './components/new-item/new-item.component'
import { AngularFireAuthGuard } from '@angular/fire/auth-guard'

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard] },
    { path: 'login', component: LoginComponent },
    {
        path: 'item', canActivate: [AngularFireAuthGuard], children: [
            { path: 'new', component: NewItemComponent },
            { path: 'edit/:id', component: NewItemComponent },
        ]
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
