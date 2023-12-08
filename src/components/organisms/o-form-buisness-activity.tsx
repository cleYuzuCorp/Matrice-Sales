import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slide, Stack, Step, StepLabel, Stepper, Typography, useMediaQuery, useTheme } from "@mui/material"
import MInputNumber from "../molecules/m-input-number"
import MSlider from "../molecules/m-slider"
import { FC, useEffect, useState } from "react"
import AButton from "../atoms/a-button"

interface OFormBusinessActivityProps {
    onDataSubmit: (data: {
        goal: number
        wallet: number
        averrageBasket: number
        sell: number
        conversionRate: number
        attempts: number
        stepValues: Array<{ source: string; distribution: number; conversionRateStep: number }>
    }) => void
}

const OFormBuisnessActivity: FC<OFormBusinessActivityProps> = ({ onDataSubmit }) => {

    const theming = useTheme()
    const isMobile = useMediaQuery(theming.breakpoints.up('sm'))
    const isDesktop = useMediaQuery('(min-width:1410px)')

    const steps = [
        "Source n°1",
        "Source n°2",
        "Source n°3",
        "Source n°4"
    ]

    const [goal, setGoal] = useState<number>(0)
    const [wallet, setWallet] = useState<number>(0)
    const [averrageBasket, setAverrageBasket] = useState<number>(0)
    const [sell, setSell] = useState<number>(0)

    const [conversionRate, setConversionRate] = useState<number>(0)
    const [attempts, setAttempts] = useState<number>(0)

    const [activeStep, setActiveStep] = useState<number>(0)
    const [backButtonClicked, setBackButtonClicked] = useState<boolean>(false)
    const [stepValues, setStepValues] = useState<Array<{ source: string; distribution: number; conversionRateStep: number }>>(
        Array.from({ length: steps.length }, () => ({ source: '', distribution: 0, conversionRateStep: 0 }))
    )

    const[distributionTotal, setDistributionTotal] = useState<number>(0)

    const [options, setOptions] = useState<Array<{ label: string; value: string; disabled?: boolean }>>([
        { label: "Outbound / Prospection", value: "Outbound / Prospection" },
        { label: "Inbound", value: "Inbound" },
        { label: "Partenaires (indirect)", value: "Partenaires (indirect)" },
        { label: "Réseau", value: "Réseau" },
        { label: "Event (salon, webinar, ect)", value: "Event (salon, webinar, ect)" },
        { label: "Autres", value: "Autres" }
    ])

    const handleDataChange = () => {
        onDataSubmit({
            goal: goal,
            wallet: wallet,
            averrageBasket: averrageBasket,
            sell: sell,
            conversionRate: conversionRate,
            attempts: attempts,
            stepValues: stepValues,
        })
    }

    useEffect(() => {
        handleDataChange()
    }, [goal, wallet, averrageBasket, sell, conversionRate, attempts, stepValues])

    const handleSourceChange = (event: SelectChangeEvent) => {
        const newSource = event.target.value as string

        setStepValues((prevValues) => {
            const updatedValues = [...prevValues]
            updatedValues[activeStep] = { ...updatedValues[activeStep], source: newSource }
            return updatedValues
        })
    }

    useEffect(() => {
        setOptions((prevOptions) => {
            return prevOptions.map((option) => {
                const isOptionSelected = stepValues.some((step) => step.source === option.value)
                return {
                    ...option,
                    disabled: isOptionSelected,
                }
            })
        })
    }, [stepValues])

    const handleDistributionChange = (newDistribution: number) => {
        const totalDistribution = stepValues.reduce((sum, step) => sum + step.distribution, 0)
        const remainingDistribution = 100 - totalDistribution + stepValues[activeStep].distribution
    
        if (newDistribution >= 0 && newDistribution <= remainingDistribution) {
            setStepValues((prevValues) => {
                const updatedValues = [...prevValues]
                updatedValues[activeStep] = {
                    ...updatedValues[activeStep],
                    distribution: newDistribution,
                }
                return updatedValues
            })
        }
    }
    
    

    const handleConversionRateStepChange = (newConversionRateStep: number) => {
        setStepValues((prevValues) => {
            const updatedValues = [...prevValues]
            updatedValues[activeStep] = { ...updatedValues[activeStep], conversionRateStep: newConversionRateStep }
            return updatedValues
        })
    }

    const handleBack = () => {
        if (activeStep !== 0) {
            setBackButtonClicked(true)
            setActiveStep(activeStep - 1)
        }
    }

    const handleNext = () => {
        if (activeStep !== 3) {
            setBackButtonClicked(false)
            setActiveStep(activeStep + 1)
        }
    }

    const inputs = [
        {
            label: "Objectif C.A",
            devise: "€/an",
            description: "Indiquez l'objectif de C.A. que vous devez réaliser cette année. Vous pouvez indiquez un objectif pour l'ensemble de l'équipe ou un seul contributeur.",
            value: goal,
            onChange: (newGoal: number) => setGoal(newGoal)
        },
        {
            label: "Valeur portfeuille client",
            devise: "€/an",
            description: "Indiquez le montant total de votre embarqué. Celui-ci correspond au C.A. déjà signé et en gestion au sein de votre équipe commerciale ou dans le perimètre du contributeur.",
            value: wallet,
            onChange: (newWallet: number) => setWallet(newWallet)
        },
        {
            label: "Panier moyen d'un client",
            devise: "€",
            description: "Indiquez le montant moyen d'une première vente avec un nouveau client.",
            value: averrageBasket,
            onChange: (newAverrageBasket: number) => setAverrageBasket(newAverrageBasket)
        }
    ]

    return (
        <Stack spacing={8} alignItems="center" textAlign="center">
            <Typography variant="h3">
                Activité Commerciale
            </Typography>

            <Stack spacing={2} direction={isDesktop ? 'row' : 'column'}>
                {inputs.map((input) => <MInputNumber
                    label={input.label}
                    devise={input.devise}
                    description={input.description}
                    value={input.value}
                    onChange={input.onChange}
                />)}
            </Stack>

            <Stack maxWidth="500px" width="100%">
                <MSlider
                    value={sell}
                    onChange={(newSell) => setSell(newSell)}
                    label="Up-Sell et Cross Sell"
                    description="Indiquez la part d'Up-Sell et/ou Cross Sell que vous pensez réaliser cette année sur votre portfeuille client."
                />
            </Stack>

            <Stack spacing={4} alignItems="center" width="100%">
                <Typography variant="h4">
                    Vos sources de leads :
                </Typography>

                <Slide key={activeStep} direction={backButtonClicked ? 'left' : 'right'} in={true} timeout={500}>
                    <Stack spacing={4} alignItems="center" width="100%">
                        <FormControl>
                            <InputLabel>Source d'opportunité n°{activeStep + 1}</InputLabel>
                            <Select
                                label={`Source d'opportunité n°${activeStep + 1}`}
                                value={stepValues[activeStep].source}
                                onChange={handleSourceChange}
                                sx={{
                                    minWidth: '250px'
                                }}
                            >
                                {options.map((option) => <MenuItem disabled={option.disabled} value={option.value}>{option.label}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <Stack spacing={4} maxWidth="500px" width="100%">
                            <MSlider
                                value={stepValues[activeStep].distribution}
                                onChange={handleDistributionChange}
                                label="Répartition de la source"
                                description={stepValues[activeStep].source}
                            />
                            <MSlider
                                value={stepValues[activeStep].conversionRateStep}
                                onChange={handleConversionRateStepChange}
                                label="Taux de conversion"
                                description={stepValues[activeStep].source}
                            />
                        </Stack>
                    </Stack>
                </Slide>
            </Stack>

            {isMobile ? <Stack spacing={2} width="100%">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => <Step>
                        <StepLabel>{step}</StepLabel>
                    </Step>)}
                </Stepper>

                <Stack direction="row" alignItems="center" justifyContent="space-around">
                    <AButton
                        variant="text"
                        color="colorful"
                        disabled={activeStep === 0 ? true : false}
                        onClick={handleBack}
                    >
                        Retour
                    </AButton>

                    <AButton
                        variant="text"
                        color="colorful"
                        disabled={activeStep === 3 ? true : false}
                        onClick={handleNext}
                    >
                        Suivant
                    </AButton>
                </Stack>
            </Stack> : <Stack>
                <Stack spacing={4} direction="row" alignItems="center">
                    <AButton
                        variant="text"
                        color="colorful"
                        disabled={activeStep === 0 ? true : false}
                        onClick={handleBack}
                    >
                        {"< Retour"}
                    </AButton>

                    <Typography variant="body1">
                        {activeStep + 1}/4
                    </Typography>

                    <AButton
                        variant="text"
                        color="colorful"
                        disabled={activeStep === 3 ? true : false}
                        onClick={handleNext}
                    >
                        {"Suivant >"}
                    </AButton>
                </Stack>
            </Stack>}

            <Stack spacing={4} maxWidth="500px" width="100%">
                <MSlider
                    value={conversionRate}
                    onChange={(newConversionRate) => setConversionRate(newConversionRate)}
                    label="Taux de conversion"
                    description="Entre un acte de prospection et la création d'un RDV"
                />
                <MSlider
                    value={attempts}
                    onChange={(newattempts) => setAttempts(newattempts)}
                    label="Nombre de tentative"
                    description="Pour contacter une personne"
                    max={20}
                />
            </Stack>
        </Stack>
    )
}

export default OFormBuisnessActivity