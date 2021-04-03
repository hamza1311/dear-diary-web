import {makeStyles} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import React from "react";

const useStyles = makeStyles({
    fab: {
        position: "fixed",
        bottom: 32,
        right: 32,
    }
})

// don't know how to fix
// @ts-ignore
export default function BottomFab({ children, ...rest }) {
    const classes = useStyles();
    return <>
        <Fab color="primary" aria-label="add" className={classes.fab} {...rest}>
            { children }
        </Fab>
    </>
}
