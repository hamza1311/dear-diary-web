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

type signinOrSignup = 'Login' | 'Sign up'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    matcher = new FormErrorStateMatcher();

    signinOrSignup: signinOrSignup = 'Login';

    credentials = { email: '', password: '', displayName: '' }

    // eslint-disable-next-line
    constructor(private router: Router, private auth: AngularFireAuth, private ngZone: NgZone) {}

    ngOnInit(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.auth.onAuthStateChanged(user => {
            if (user) {
                this.ngZone.run(() => {
                    this.router.navigateByUrl('/').then(() => {})
                })
            }
        })
    }

    swapSigninOrSignup() {
        this.signinOrSignup = this.signinOrSignup == 'Login' ? 'Sign up' : 'Login'
    }

    async loginOrSignup() {
        const { email, password } = this.credentials
        if (this.signinOrSignup == 'Login') {
            await this.auth.signInWithEmailAndPassword(email, password)
        } else {
            const resp = await this.auth.createUserWithEmailAndPassword(email, password)
            await resp.user.updateProfile({ displayName: this.credentials.displayName })
        }
        await this.router.navigateByUrl('/')
    }
}
