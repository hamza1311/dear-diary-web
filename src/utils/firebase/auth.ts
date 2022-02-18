import {getAuth, signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase} from "firebase/auth";

export const signInWithEmailAndPassword = (email: string, password: string) => signInWithEmailAndPasswordFirebase(getAuth(), email, password)
