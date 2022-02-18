import React, {useState} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";

export default function UpdatePhotoButton() {
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removePhoto = () => {
        // TODO
        handleClose()
    }

    return (<>
        <IconButton sx={{marginLeft: "auto"}} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreHoriz/>
        </IconButton>
        <Menu
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
        >
            <MenuItem onClick={removePhoto}>Remove Photo</MenuItem>
            <MenuItem>Update Photo</MenuItem>
        </Menu>
    </>)
}
