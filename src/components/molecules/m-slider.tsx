import { Slider, Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"

const MSlider = (props: { label: string, description: string, max?: number, value?: number, onChange?: (value: number) => void }) => {

    const { label, description, max, value, onChange } = props

    const handleChange = (event: Event, newValue: number | number[]) => {
        const newValueAsNumber = newValue as number
        onChange && onChange(newValueAsNumber)
    }

    return (
        <Stack spacing={1}>
            <ALabel label={label} description={description} />
            <Stack spacing={2} direction="row">
                <Slider
                    max={max}
                    value={value}
                    onChange={handleChange}
                />
                <Typography>{value}{max ? "" : "%"}</Typography>
            </Stack>
        </Stack>
    )
}

export default MSlider