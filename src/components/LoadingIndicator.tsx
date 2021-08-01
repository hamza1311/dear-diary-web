import React from "react";
import {LinearProgress} from "@material-ui/core";

interface LoadingIndicatorProps {
    color: 'primary' | 'secondary',
    isVisible: boolean

}

function LoadingIndicator({color, isVisible}: LoadingIndicatorProps) {
    if (!isVisible) {
        return <></>
    }
    return <LinearProgress color={color} />
}


LoadingIndicator.defaultProps = {
    color: 'secondary',
    isVisible: true
}

export default LoadingIndicator
