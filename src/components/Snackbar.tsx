import {IconButton, SnackbarCloseReason, Snackbar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

interface Props {
    message: string,
    action?: React.ReactNode
    open: boolean
    closeSnackbar: () => void
    onSnackbarClose?: (reason: SnackbarCloseReason) => void
}

function SimpleSnackbar(props: Props) {
    const onSnackbarClose = (e: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return
        }

        if (props.onSnackbarClose) {
            props.onSnackbarClose(reason)
        }
        props.closeSnackbar()
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={props.open}
                autoHideDuration={4000}
                onClose={onSnackbarClose}
                message={props.message}
                action={<>
                    {props.action}

                    <IconButton size="small" aria-label="close" color="inherit" onClick={props.closeSnackbar}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </>}
            />
        </div>
    );
}

export default SimpleSnackbar
