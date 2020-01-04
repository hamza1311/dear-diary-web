const auth = firebase.auth()

async function login(creds) {
    const { email, password } = creds
    await auth.signInWithEmailAndPassword(email, password)
    return currentUser()
}

function currentUser() {
    const currentUser = firebase.auth().currentUser
    const user = {
        Uid: currentUser.uid,
        DisplayName: currentUser.displayName,
        Email: currentUser.email,
    }
    console.log(user)
    return user;
}

async function logout() {
    await auth.signOut()
}