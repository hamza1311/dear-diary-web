/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core'
import { FormErrorStateMatcher } from '../login/login.component'
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
/* eslint-enable no-unused-vars */

@Component({
    selector: 'app-change-user-settings',
    templateUrl: './change-user-settings.component.html',
    styleUrls: ['./change-user-settings.component.scss']
})
export class ChangeUserSettingsComponent implements OnInit {
    newPassword: string
    newName: string
    currentPassword: string

    matcher = new FormErrorStateMatcher();

    // eslint-disable-next-line no-unused-vars
    constructor(private auth: AngularFireAuth, public dialogRef: MatDialogRef<ChangeUserSettingsComponent>, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
    }

    async save() {
        let updated = false
        if (this.newPassword) {
            const user = await this.auth.currentUser
            let credential = EmailAuthProvider.credential(user.email, this.currentPassword)
            try {
                await user.reauthenticateWithCredential(credential)
                await user.updatePassword(this.newPassword)
            } catch (e) {
                console.error(e)
                alert(e.toString())
                return
            }
            updated = true
        }

        if (this.newName) {
            const user = await this.auth.currentUser
            await user.updateProfile({
                displayName: this.newName
            })
            updated = true
        }

        this.dialogRef.close()
        if (updated) {
            this.snackBar.open('Updated successfully', undefined, {
                duration: 3000
            })
        }
    }
}
