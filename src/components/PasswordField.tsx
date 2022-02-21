import React, {useState} from "react";
import {FormControl, IconButton, OutlinedInput, InputAdornment, InputLabel} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function PasswordField(props: { disabled: boolean, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <FormControl disabled={props.disabled} variant="outlined">
            <InputLabel htmlFor="password">{props.label}</InputLabel>
            <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={props.value}
                onChange={props.onChange}
                label="password"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}
