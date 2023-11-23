import { Container, Stack, ThemeProvider } from "@mui/material"
import theme from "../theme"
import THeader from "../components/templates/t-header"
import OFormBuisnessActivity from "../components/organisms/o-form-buisness-activity"
import OResults from "../components/organisms/o-results"
import { useState } from "react"

interface FormData {
    goal: number
    wallet: number
    averrageBasket: number
    sell: number
    conversionRate: number
    numberAttempts: number
    stepValues: Array<{ source: string; distribution: number; conversionRateStep: number }>
}

const Home = () => {

    const [formData, setFormData] = useState<FormData>()

    const handleFormSubmit = (data: FormData) => {
        setFormData(data)
    }

    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row" justifyContent="space-between">
                <THeader />

                <Container maxWidth="xl">
                    <Stack spacing={8} alignItems="center" marginTop="120px" marginBottom="120px">
                        <OFormBuisnessActivity onDataSubmit={handleFormSubmit} />
                    </Stack>
                </Container>

                <Container maxWidth="sm">
                    <Stack spacing={8} alignItems="center" marginTop="200px" marginBottom="150px">
                        <OResults data={formData} />
                    </Stack>
                </Container>
            </Stack>
        </ThemeProvider>
    )
}

export default Home