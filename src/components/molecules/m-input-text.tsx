import { Stack, TextField } from "@mui/material"
import ALabel from "../atoms/a-label"

const MInputText= (props: { type: string, label: string, error?: string, value?: string, onChange?: (value: string) => void }) => {

    const { type, label, error, value, onChange } = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        onChange && onChange(newValue)
    }

    return (
        <Stack>
            <TextField
                type={type === 'email' ? 'email' : 'text'}
                required={true}
                value={value}
                onChange={handleChange}
                label={label}
                error={error && value === '' ? true : false}
                helperText={error && value === '' ? error : null}
                sx={{
                    boxShadow: error && value === '' ? 'none' : '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                }}
            />
        </Stack>
    )
}

export default MInputText