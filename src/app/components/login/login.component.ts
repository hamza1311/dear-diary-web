/* eslint-disable no-unused-vars */
import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
/* eslint-enable no-unused-vars */

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
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

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    passwordFormControl = new FormControl('', [
        Validators.required,
    ]);

    matcher = new MyErrorStateMatcher();

    signinOrSignup: signinOrSignup = 'Login';
    
    credentials = { email: '', password: '', displayName: '' }

    // eslint-disable-next-line
    constructor(private router: Router, private auth: AngularFireAuth, private ngZone: NgZone) {}

    ngOnInit(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.auth.onAuthStateChanged(user => {
            if (user) {
                console.log('navuagte')
                this.ngZone.run(() => {
                    this.router.navigateByUrl('/home').then(() => {})
                })
            }
        })
    }

    swapSigninOrSignup() {
        this.signinOrSignup = this.signinOrSignup == 'Login' ? 'Sign up' : 'Login'
    }

    async loginOrSignup() {
        console.log(this.credentials)
        const { email, password } = this.credentials
        if (this.signinOrSignup == 'Login') {
            await this.auth.signInWithEmailAndPassword(email, password)
        } else {
            const resp = await this.auth.createUserWithEmailAndPassword(email, password)
            console.log(this.credentials.displayName)
            await resp.user.updateProfile({ displayName: this.credentials.displayName })
        }
        await this.router.navigateByUrl('/home')
        const cu = await this.auth.currentUser
        console.log((cu))
        console.log(cu.displayName)
    }
}
