import Fab, {FabProps} from "@mui/material/Fab";
import React from "react";

export default function BottomFab({ children, ...rest }: FabProps) {
    return <>
        <Fab color="primary" aria-label="add" sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
        }} {...rest}>
            { children }
        </Fab>
    </>
}
