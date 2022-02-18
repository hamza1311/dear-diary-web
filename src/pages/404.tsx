import {AuthAction, withAuthUser} from "next-firebase-auth";

function NotFound() {
    return <h1>404 - Page Not Found</h1>
}

export default withAuthUser({ whenAuthed: AuthAction.REDIRECT_TO_APP })(NotFound)
