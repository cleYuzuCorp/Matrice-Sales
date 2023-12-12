import { Checkbox, FormControlLabel } from "@mui/material"
import theme from "../../theme"

const ACheck = (props: { label: string, checked: boolean, onChange: (value: boolean) => void, error?: string }) => {

    const { label, checked, onChange, error } = props

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked)
    }

    return (
        <FormControlLabel
            label={label + '*'}
            control={
                <Checkbox
                    value={checked}
                    onChange={handleCheckboxChange}
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
    )
}

export default ACheck