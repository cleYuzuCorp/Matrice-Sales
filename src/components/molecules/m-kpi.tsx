import { Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import theme from "../../theme"

const MKpi = (props: { variant?: "h2" | "h3", label: string, description?: string, data: number, devise?: string, icon?: IconProp }) => {

    const { variant, label, description, data, devise, icon } = props

    return (
        <Stack spacing={1} alignItems="center">
            <ALabel label={label} description={description} size="12px" />
            <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant={variant === "h2" ? variant : 'h3'} color={theme.palette.info.main} sx={{ fontWeight: 700 }}>
                    {data}{devise}
                </Typography>
                {icon ? <FontAwesomeIcon icon={icon} size={variant ? "3x" : "2x"} color={theme.palette.info.main} /> : null}
            </Stack>
        </Stack>
    )
}

export default MKpi