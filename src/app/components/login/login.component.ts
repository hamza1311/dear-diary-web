/* eslint-disable no-unused-vars */
import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
/* eslint-enable no-unused-vars */

/** Error when invalid control is dirty, touched, or submitted. */
export class FormErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
    }
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    // eslint-disable-next-line
    constructor(private router: Router, private auth: AngularFireAuth, private ngZone: NgZone) {}

    ngOnInit(): void {
        // noinspection JSIgnoredPromiseFromCall
        /*this.auth.onAuthStateChanged(user => {
            if (user) {
                this.ngZone.run(() => {
                    this.router.navigateByUrl('/').then(() => {})
                })
            }
        })*/
    }
    redirect() {
        this.router.navigateByUrl('/').then(() => {})
    }
}
