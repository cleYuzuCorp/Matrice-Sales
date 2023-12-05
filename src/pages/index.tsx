import { BottomNavigation, BottomNavigationAction, Container, Drawer, Stack, ThemeProvider, useMediaQuery, useTheme } from "@mui/material"
import theme from "../theme"
import THeader from "../components/templates/t-header"
import OFormBuisnessActivity from "../components/organisms/o-form-buisness-activity"
import OResults from "../components/organisms/o-results"
import { useState } from "react"
import { faBars, faChartSimple, faFileLines, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

    const theming = useTheme()
    const isDesktop = useMediaQuery(theming.breakpoints.up('lg'))

    const [formData, setFormData] = useState<FormData>()
    const [page, setPage] = useState<number>(1)
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    const handleFormSubmit = (data: FormData) => {
        setFormData(data)
    }

    const matrices = [
        {
            label: "Activité commerciale",
            icone: faHandHoldingDollar
        },
        {
            label: "Team SaaS",
            icone: faHandHoldingDollar
        },
        {
            label: "Autres",
            icone: faHandHoldingDollar
        }
    ]

    const [currentContent, setCurrentContent] = useState(<OFormBuisnessActivity onDataSubmit={handleFormSubmit} />)

    return (
        <ThemeProvider theme={theme}>
            {isDesktop ? <Stack direction="row" justifyContent="space-between">
                <THeader matrices={matrices} />

                <Stack spacing={8} alignItems="center" padding="150px 30px 150px 30px">
                    <OFormBuisnessActivity onDataSubmit={handleFormSubmit} />
                </Stack>

                <Stack sx={{ borderRadius: '30px 0px 0px 0px', boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)' }}>
                    <Stack spacing={8} alignItems="center" padding="200px 30px 150px 30px">
                        <OResults data={formData} />
                    </Stack>
                </Stack>
            </Stack> : <Stack>
                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <THeader matrices={matrices} />
                </Drawer>

                {page === 1 ? <Container maxWidth="xl">
                    <Stack spacing={8} alignItems="center" marginTop="75px" marginBottom="75px">
                        <OFormBuisnessActivity onDataSubmit={handleFormSubmit} />
                    </Stack>
                </Container> : page === 2 ? <Container maxWidth="xl">
                    <Stack spacing={8} alignItems="center" marginTop="75px" marginBottom="75px">
                        <OResults data={formData} />
                    </Stack>
                </Container> : null}

                <BottomNavigation
                    showLabels
                    value={page}
                    onChange={(event, newPage) => {
                        if (newPage === 0) {
                            setDrawerOpen(true)
                        } else {
                            setPage(newPage)
                            if (newPage === 1) {
                                setCurrentContent(<OFormBuisnessActivity onDataSubmit={handleFormSubmit} />)
                            } else if (newPage === 2) {
                                setCurrentContent(<OResults data={formData} />)
                            }
                        }
                    }}
                    sx={{
                        width: '100%',
                        position: "fixed",
                        bottom: 0,
                        background: theme.palette.background.default,
                        borderRadius: '15px 15px 0px 0px',
                        boxShadow: '0px -4px 10px 0px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    <BottomNavigationAction icon={<FontAwesomeIcon icon={faBars} />} onClick={() => setDrawerOpen(true)} />
                    <BottomNavigationAction label={matrices[0].label} />
                    <BottomNavigationAction label="Résultats" icon={<FontAwesomeIcon icon={faChartSimple} />} />
                </BottomNavigation>
            </Stack>}
        </ThemeProvider>
    )
}

export default Home