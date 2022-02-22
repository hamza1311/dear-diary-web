import React from "react";
import {LinearProgress} from "@mui/material";

interface LoadingIndicatorProps {
    color?: 'primary' | 'secondary',
    isVisible?: boolean
}

function LoadingIndicator({color = 'secondary', isVisible = true}: LoadingIndicatorProps) {
    if (!isVisible) {
        return <></>
    }
    return <LinearProgress color={color} />
}

export default LoadingIndicator
