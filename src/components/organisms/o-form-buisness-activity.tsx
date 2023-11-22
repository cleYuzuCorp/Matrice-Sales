import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material"
import MInput from "../molecules/m-input"
import MSlider from "../molecules/m-slider"
import ALabel from "../atoms/a-label"
import { useState } from "react"
import AButton from "../atoms/a-button"

const OFormBuisnessActivity = () => {

    const [source, setSource] = useState<string>('Outbound / Prospection')
    const [activeStep, setActiveStep] = useState<number>(0)

    const handleSourceChange = (event: SelectChangeEvent) => {
        setSource(event.target.value as string)
    }

    const inputs = [
        {
            label: "Objectif C.A",
            devise: "€/an",
            description: "Indiquez l'objectif de C.A. que vous devez réaliser cette année. Vous pouvez indiquez un objectif pour l'ensemble de l'équipe ou un seul contributeur."
        },
        {
            label: "Valeur portfeuille client",
            devise: "€/an",
            description: "Indiquez le montant total de votre embarqué. Celui-ci correspond au C.A. déjà signé et en gestion au sein de votre équipe commerciale ou dans le perimètre du contributeur."
        },
        {
            label: "Panier moyen d'un client",
            devise: "€",
            description: "Indiquez le montant moyen d'une première vente avec un nouveau client."
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

    const steps = [
        "Source n°1",
        "Source n°2",
        "Source n°3",
        "Source n°4"
    ]

    return (
        <Stack spacing={8} alignItems="center">
            <Stack spacing={2} direction="row">
                {inputs.map((input) => <MInput
                    label={input.label}
                    devise={input.devise}
                    description={input.description}
                />)}
            </Stack>

            <Stack maxWidth="500px" width="100%">
                <MSlider label="Up-Sell et Cross Sell" description="Indiquez la part d'Up-Sell et/ou Cross Sell que vous pensez réaliser cette année sur votre portfeuille client." />
            </Stack>

            <Stack spacing={4} alignItems="center" width="100%">
                <Typography variant="h4">
                    Vos sources de leads :
                </Typography>

                <FormControl>
                    <InputLabel>Source d'opportunité</InputLabel>
                    <Select
                        label="Source d'opportunité"
                        value={source}
                        onChange={handleSourceChange}
                    >
                        {options.map((option) => <MenuItem value={option.value}>{option.label}</MenuItem>)}
                    </Select>
                </FormControl>

                <Stack spacing={4} maxWidth="500px" width="100%">
                    <MSlider label="Répartition de la source" description={source} />
                    <MSlider label="Taux de conversion" description={source} />
                </Stack>
            </Stack>

            <Stack spacing={2} width="100%">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => <Step>
                        <StepLabel>{step}</StepLabel>
                    </Step>)}
                </Stepper>

                <Stack direction="row" justifyContent="space-around">
                    <AButton variant="text" color="colorful" disabled={activeStep === 0 ? true : false} onClick={() => setActiveStep(activeStep - 1)}>
                        Retour
                    </AButton>

                    <AButton variant="text" color="colorful" disabled={activeStep === 4 ? true : false} onClick={() => setActiveStep(activeStep + 1)}>
                        {activeStep === 3 ? "Termniné" : "Suivant"}
                    </AButton>
                </Stack>
            </Stack>

            <Stack spacing={4} maxWidth="500px" width="100%">
                <MSlider label="Taux de conversion" description="Entre un acte de prospection et la création d'un RDV" />
                <MSlider label="Nombre de tentative" description="Pour contacter une personne" />
            </Stack>
        </Stack>
    )
}

export default OFormBuisnessActivity