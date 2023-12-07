import { Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

const MKpi = (props: { label: string, description?: string, data: number, devise?: string, icon?: IconProp }) => {

    const { label, description, data, devise, icon } = props

    return (
        <Stack spacing={1} alignItems="center">
            <ALabel label={label} description={description} size="12px" />
            <Stack spacing={2} direction="row">
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {data}{devise}
                </Typography>
                {icon ? <FontAwesomeIcon icon={icon} size="2x" /> : null}
            </Stack>
        </Stack>
    )
}

export default MKpi