import { Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"
import theme from "../../theme"

const MKpi = (props: { label: string, description: string, data: number, devise?: string }) => {

    const { label, description, data, devise } = props

    return (
        <Stack spacing={1} alignItems="center">
            <ALabel label={label} description={description} />
            <Typography variant="h2" sx={{ color: theme.palette.text.primary }}>
                {data}{devise}
            </Typography>
        </Stack>
    )
}

export default MKpi