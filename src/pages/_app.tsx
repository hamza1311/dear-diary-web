import type {AppProps} from 'next/app'
import { initializeApp } from 'firebase/app'
import React, {useEffect, useMemo, useState} from "react";
import initAuth from "../utils/initAuth";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from '@mui/material'
import Head from 'next/head'
import LoadingIndicator from "../components/LoadingIndicator";

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

initializeApp(firebaseConfig)

initAuth('_app.tsx')


function MyApp({Component, pageProps, router}: AppProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url: string) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    const theme = useMemo(
        () => createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Dear Diary</title>
            </Head>
            <CssBaseline/>
            {loading && <LoadingIndicator/>}
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
