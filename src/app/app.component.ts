/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { ChangeUserSettingsComponent } from './components/change-user-settings/change-user-settings.component'
/* eslint-enable no-unused-vars */

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    currentUser;

    // eslint-disable-next-line no-unused-vars
    constructor(private auth: AngularFireAuth, private router: Router, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user
        })
    }


    logout() {
        this.auth.signOut().then(() => {
            this.router.navigateByUrl('/login').then(() => {})
        })
    }

    async changeUserSettings() {
        this.dialog.open(ChangeUserSettingsComponent, {
            width: '50em'
        })
    }

    onSignOut() {
        this.router.navigateByUrl('/login').then(() => {})
    }
}
