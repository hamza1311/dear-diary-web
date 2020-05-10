import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    currentUser;

    constructor(private auth: AngularFireAuth, private router: Router) {
    }

    ngOnInit(): void {
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user
        })
    }


    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('/login').then(() => {})
        })
    }
}
