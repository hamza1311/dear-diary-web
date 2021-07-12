import '../styles/globals.css'
import type {AppProps} from 'next/app'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import React, {useMemo} from "react";
import initAuth from "../utils/initAuth";
import Navbar from "../components/Navbar";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from '@material-ui/core'
import Head from 'next/head'

const firebaseConfig = {
    apiKey: "AIzaSyAJkHSx75YpS8T0NQfrtDtW9BmAXXd2X9I",
    authDomain: "deardiary-app.firebaseapp.com",
    databaseURL: "https://deardiary-app.firebaseio.com",
    projectId: "deardiary-app",
    storageBucket: "deardiary-app.appspot.com",
    messagingSenderId: "761738467160",
    appId: "1:761738467160:web:5a5d871b9c8208050fb72d",
    measurementId: "G-QM25L2V45S"
}

if (firebase.apps.length != 1) {
    firebase.initializeApp(firebaseConfig)
}

initAuth()


function MyApp({Component, pageProps}: AppProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Dear Diary</title>
            </Head>
            <CssBaseline />
            <Navbar />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
