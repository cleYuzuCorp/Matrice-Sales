import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material"
import MInput from "../molecules/m-input"
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
        numberAttempts: number
        stepValues: Array<{ source: string; distribution: number; conversionRateStep: number }>
    }) => void
}

const OFormBuisnessActivity: FC<OFormBusinessActivityProps> = ({ onDataSubmit }) => {

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
    const [numberAttempts, setNumberAttempts] = useState<number>(0)

    const [activeStep, setActiveStep] = useState<number>(0)
    const [stepValues, setStepValues] = useState<Array<{ source: string; distribution: number; conversionRateStep: number }>>(
        Array.from({ length: steps.length }, () => ({ source: 'Outbound / Prospection', distribution: 0, conversionRateStep: 0 }))
    )

    const handleDataChange = () => {
        onDataSubmit({
            goal: goal,
            wallet: wallet,
            averrageBasket: averrageBasket,
            sell: sell,
            conversionRate: conversionRate,
            numberAttempts: numberAttempts,
            stepValues: stepValues,
        })
    }

    useEffect(() => {
        handleDataChange()
    }, [goal, wallet, averrageBasket, sell, conversionRate, numberAttempts, stepValues])

    const handleSourceChange = (event: SelectChangeEvent) => {
        const newSource = event.target.value as string
        setStepValues((prevValues) => {
            const updatedValues = [...prevValues]
            updatedValues[activeStep] = { ...updatedValues[activeStep], source: newSource }
            return updatedValues
        })
    }

    const handleDistributionChange = (newDistribution: number) => {
        setStepValues((prevValues) => {
            const updatedValues = [...prevValues]
            updatedValues[activeStep] = { ...updatedValues[activeStep], distribution: newDistribution }
            return updatedValues
        })
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
            setActiveStep(activeStep - 1)
        }
    }

    const handleNext = () => {
        if (activeStep !== 3) {
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

    const options = [
        {
            label: "Outbound / Prospection",
            value: "Outbound / Prospection"
        },
        {
            label: "Inbound",
            value: "Inbound"
        },
        {
            label: "Partenaires (indirect)",
            value: "Partenaires (indirect)"
        },
        {
            label: "Réseau",
            value: "Réseau"
        },
        {
            label: "Event (salon, webinar, ect)",
            value: "Event (salon, webinar, ect)"
        },
        {
            label: "Autres",
            value: "Autres"
        }
    ]

    return (
        <Stack spacing={8} alignItems="center">
            <Typography variant="h3">
                Activité Commerciale
            </Typography>

            <Stack spacing={2} direction="row">
                {inputs.map((input) => <MInput
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

                <FormControl>
                    <InputLabel>Source d'opportunité n°{activeStep + 1}</InputLabel>
                    <Select
                        label={`Source d'opportunité n°${activeStep + 1}`}
                        value={stepValues[activeStep].source}
                        onChange={handleSourceChange}
                    >
                        {options.map((option) => <MenuItem value={option.value}>{option.label}</MenuItem>)}
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

            <Stack spacing={2} width="100%">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => <Step>
                        <StepLabel>{step}</StepLabel>
                    </Step>)}
                </Stepper>

                <Stack direction="row" justifyContent="space-around">
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
            </Stack>

            <Stack spacing={4} maxWidth="500px" width="100%">
                <MSlider
                    value={conversionRate}
                    onChange={(newConversionRate) => setConversionRate(newConversionRate)}
                    label="Taux de conversion"
                    description="Entre un acte de prospection et la création d'un RDV"
                />
                <MSlider
                    value={numberAttempts}
                    onChange={(newNumberAttempts) => setNumberAttempts(newNumberAttempts)}
                    label="Nombre de tentative"
                    description="Pour contacter une personne"
                />
            </Stack>
        </Stack>
    )
}

export default OFormBuisnessActivity