import {getAuth, signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase, signOut as signOutFirebase} from "firebase/auth";

export const signInWithEmailAndPassword = (email: string, password: string) => signInWithEmailAndPasswordFirebase(getAuth(), email, password)

export const signOut = () => signOutFirebase(getAuth())
