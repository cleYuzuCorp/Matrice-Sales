import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Stack, Tooltip } from "@mui/material"

const ALabel = (props: { label: string, description?: string, size?: string }) => {

    const { label, description, size } = props

    return (
        <Stack direction="row" alignItems="center" fontSize={size}>
            {label} {'\u00a0'}

            {description ? <Tooltip title={description} placement="top" arrow>
                <FontAwesomeIcon icon={faCircleInfo} />
            </Tooltip> : null}
        </Stack>
    )
}

export default ALabel