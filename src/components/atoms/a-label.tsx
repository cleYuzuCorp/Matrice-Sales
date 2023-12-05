import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Stack, Tooltip } from "@mui/material"

const ALabel = (props: { label: string, description?: string }) => {

    const { label, description } = props

    return (
        <Stack direction="row">
            {label} {'\u00a0'}
            {description ? <Tooltip title={description} placement="top" arrow>
                <FontAwesomeIcon icon={faCircleInfo} />
            </Tooltip> : null}
        </Stack>
    )
}

export default ALabel