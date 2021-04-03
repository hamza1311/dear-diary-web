import React, {useMemo} from 'react';
import 'firebase/firestore';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from "./components/Routes";

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',
                },
                typography: {
                    fontFamily: [
                        'Open Sans',
                        'Roboto',
                        'sans-serif'
                    ].join(','),
                    fontSize: 15,
                }
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes />
        </ThemeProvider>
    );
}

export default App;
