import { Checkbox, FormControl, FormControlLabel, Stack } from "@mui/material"
import { useState } from "react"
import theme from "../../theme"

const ACheck = (props: { label: string, error?: string }) => {

    const { label, error } = props

    const [checked, setChecked] = useState(false)

    const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }
    return (
        <Stack>
            <FormControlLabel
                label={label + '*'}
                control={
                    <Checkbox
                        value={checked}
                        onChange={handleCheckChange}
                        sx={{
                            color: error && checked === false ? theme.palette.error.main : "inherit"
                        }}
                    />
                }
                sx={{
                    '& .MuiFormControlLabel-label': {
                        color: error && checked === false ? theme.palette.error.main : "inherit"
                    }
                }}
            />
        </Stack>
    )
}

export default ACheck