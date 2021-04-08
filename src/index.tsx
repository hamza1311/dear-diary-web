import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FirebaseAppProvider } from 'reactfire';
import firebase from "firebase/app";
import "firebase/firestore";

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

const app = firebase.initializeApp(firebaseConfig);

/*const db = app.firestore();
db.useEmulator("localhost", 8080);

const auth = app.auth()
auth.useEmulator("http://localhost:9099");*/

ReactDOM.render(
    <FirebaseAppProvider firebaseApp={app}>
        <App />
    </FirebaseAppProvider>,
  document.getElementById('root')
);
