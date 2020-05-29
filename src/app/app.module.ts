import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment'
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { LoginComponent } from './components/login/login.component'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HomeComponent } from './components/home/home.component'
import { MatIconModule } from '@angular/material/icon'
import { NewItemComponent } from './components/new-item/new-item.component'
import { MatCardModule } from '@angular/material/card'
import { ShowItemCardComponent } from './components/show-item-card/show-item-card.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { MatMenuModule } from '@angular/material/menu'

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        NewItemComponent,
        ShowItemCardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        NoopAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        MatMenuModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
