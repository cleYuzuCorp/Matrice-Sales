import { Slider, Stack, Typography } from "@mui/material"
import ALabel from "../atoms/a-label"
import theme from "../../theme"
import { useState } from "react"

const MSlider = (props: { label: string, description: string, value?: number, onChange?: (value: number) => void }) => {

    const { label, description, value, onChange } = props

    const handleChange = (event: Event, newValue: number | number[]) => {
        const newValueAsNumber = newValue as number
        onChange && onChange(newValueAsNumber)
    }

    return (
        <Stack spacing={1}>
            <ALabel label={label} description={description} />
            <Stack spacing={2} direction="row">
                <Slider
                    value={value}
                    onChange={handleChange}
                />
                <Typography>{value}%</Typography>
            </Stack>
        </Stack>
    )
}

export default MSlider