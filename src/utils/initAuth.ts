// ./initAuth.js


const initAuth = async () => {
    const { init } = await import('next-firebase-auth')
    init({
        authPageURL: '/auth',
        appPageURL: '/',
        loginAPIEndpoint: '/api/login', // required
        logoutAPIEndpoint: '/api/logout', // required
        // Required in most cases.
        firebaseAdminInitConfig: {
            credential: {
                projectId: "deardiary-app",
                clientEmail: "firebase-adminsdk-etj6s@deardiary-app.iam.gserviceaccount.com",
                // The private key must not be accesssible on the client side.
                // @ts-ignore
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? undefined,
            },
            databaseURL: 'https://deardiary-app.firebaseio.com',
        },
        firebaseClientInitConfig: {
            apiKey: "AIzaSyAJkHSx75YpS8T0NQfrtDtW9BmAXXd2X9I",
            authDomain: "deardiary-app.firebaseapp.com",
            databaseURL: "https://deardiary-app.firebaseio.com",
            projectId: "deardiary-app",
            storageBucket: "deardiary-app.appspot.com",
            messagingSenderId: "761738467160",
            appId: "1:761738467160:web:5a5d871b9c8208050fb72d",
            measurementId: "G-QM25L2V45S",
        },
        cookies: {
            name: 'deardiary-app', // required
            // Keys are required unless you set `signed` to `false`.
            // The keys cannot be accessible on the client side.
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS,
            ],
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
            overwrite: true,
            path: '/',
            sameSite: 'strict',
            secure: true, // set this to false in local (non-HTTPS) development
            signed: true,
        },
    })
}

export default initAuth

