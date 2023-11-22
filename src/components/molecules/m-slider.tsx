import { Slider, Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"
import theme from "../../theme"
import { useState } from "react"

const MSlider = (props: { label: string, description: string }) => {

    const { label, description } = props

    const [percentage, setPercentage] = useState<number>(0)

    const handleSliderChange = (event: Event, newPercentage: number | number[]) => {
        setPercentage(newPercentage as number);
    }

    return (
        <Stack spacing={1}>
            <ALabel label={label} description={description} />
            <Stack spacing={2} direction="row">
                <Slider
                    value={percentage}
                    onChange={handleSliderChange}
                />
                <Typography>{percentage}%</Typography>
            </Stack>
        </Stack>
    )
}

export default MSlider