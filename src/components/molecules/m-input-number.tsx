import { InputAdornment, TextField, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"

const MInputNumber = (props: { label: string, devise: string, description: string, value?: number, onChange?: (value: number) => void }) => {

    const { label, devise, description, value, onChange } = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value)
        if (!isNaN(newValue) && newValue >= 0) {
            onChange && onChange(newValue);
        }
    }

    return (
        <TextField
            type="number"
            value={value}
            onChange={handleChange}
            InputLabelProps={{
                shrink: true
            }}
            label={<ALabel label={label} description={description} />}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <Typography variant="body1">
                        {devise}
                    </Typography>
                </InputAdornment>
            }}
            sx={{
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
            }}
        />
    )
}

export default MInputNumber