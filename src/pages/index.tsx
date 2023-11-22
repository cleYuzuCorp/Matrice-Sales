import { Container, Stack, ThemeProvider, Typography } from "@mui/material"
import theme from "../theme"
import THeader from "../components/templates/t-header"
import MInput from "../components/molecules/m-input"
import OFormBuisnessActivity from "../components/organisms/o-form-buisness-activity"

const Home = () => {
    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row" justifyContent="space-between">
                <THeader />

                <Container maxWidth="xl">
                    <Stack spacing={8} alignItems="center" marginTop="120px" marginBottom="120px">
                        <Typography variant="h3">
                            Activité Commerciale
                        </Typography>

                        <OFormBuisnessActivity />
                    </Stack>
                </Container>

                <Container maxWidth="sm">
                    <Stack spacing={8} alignItems="center" marginTop="200px" marginBottom="150px">
                        <Typography variant="h4">
                            Résultats
                        </Typography>
                    </Stack>
                </Container>
            </Stack>
        </ThemeProvider>
    )
}

export default Home