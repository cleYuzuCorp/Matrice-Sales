import { InputAdornment, Stack, TextField, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"

const MInput = (props: { label: string, devise: string, description: string }) => {

    const { label, devise, description } = props

    return (
        <Stack>
            <TextField
                type="number"
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
        </Stack>
    )
}

export default MInput