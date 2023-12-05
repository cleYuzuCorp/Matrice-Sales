import { Stack, TextField } from "@mui/material"
import ALabel from "../atoms/a-label"

const MInputText= (props: { type: string, label: string, value?: string, onChange?: (value: string) => void }) => {

    const { type, label, value, onChange } = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        onChange && onChange(newValue)
    }

    return (
        <Stack>
            <TextField
                type={type === 'email' ? 'email' : 'text'}
                value={value}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true
                }}
                label={<ALabel label={label} />}
                sx={{
                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                }}
            />
        </Stack>
    )
}

export default MInputText