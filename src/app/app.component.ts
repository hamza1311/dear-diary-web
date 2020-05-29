/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
/* eslint-enable no-unused-vars */

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    currentUser;

    // eslint-disable-next-line no-unused-vars
    constructor(private auth: AngularFireAuth, private router: Router) {
    }

    ngOnInit(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user
            console.log(this.currentUser.displayName)
        })
    }


    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('/login').then(() => {})
        })
    }
}
