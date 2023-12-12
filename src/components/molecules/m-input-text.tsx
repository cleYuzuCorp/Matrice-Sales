import { TextField } from "@mui/material"

const MInputText = (props: { type: string, label: string, error?: string, value?: string, onChange?: (value: string) => void }) => {

    const { type, label, error, value, onChange } = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        onChange && onChange(newValue)
    }

    return (
        <TextField
            type={type === 'email' ? 'email' : 'text'}
            required={true}
            value={value}
            onChange={handleChange}
            label={label}
            error={error ? true : false}
            helperText={error ? error : null}
            sx={{
                boxShadow: error && value === '' ? 'none' : '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
            }}
        />
    )
}

export default MInputText