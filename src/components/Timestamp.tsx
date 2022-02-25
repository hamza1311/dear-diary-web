import React, {ElementType} from "react";
import {isToday, isYesterday, isThisWeek, isThisYear, getDate, getYear, format} from 'date-fns'
import {Typography, Box} from "@mui/material/";
import {useIsOnMobile} from "../utils/hooks";

const formatTime = (date: Date): string => {
    const isCurrentWeek = isThisWeek(date)
    const isDateYesterday = isYesterday(date)
    let out = ""
    if (isToday(date)) {
        out += "Today"
    } else if (isDateYesterday) {
        out += "Yesterday"
    } else if (isCurrentWeek) {
        out += format(date, 'EEE')
    }

    if (!isCurrentWeek && !isDateYesterday) {
        out += `${getDate(date)} ${format(date, 'MMM')}`

        if (!isThisYear(date)) {
            out += ' '
            out += getYear(date)
        }
    }
    out += ', '
    out += format(date, 'hh:mm aaa').toUpperCase()

    return out
}

export const Timestamp = ({timestamp, icon: Icon}: { timestamp: Date, icon: ElementType }) => {
    const isOnMobile = useIsOnMobile();
    const variant = isOnMobile ? "subtitle2" : "subtitle1";

    return <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: {
            sm: 'max-content'
        }
    }}>
        <Icon />
        <Typography variant={variant} component="span">{formatTime(timestamp)}</Typography>
    </Box>
}

