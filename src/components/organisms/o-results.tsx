import { FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import MKpi from "../molecules/m-kpi"
import { useEffect, useState } from "react"
import AButton from "../atoms/a-button"
import MInputText from "../molecules/m-input-text"
import theme from "../../theme"
import ACheck from "../atoms/a-check"
import Chart from "react-apexcharts"

const OResults = (props: { data: any }) => {

    const { data } = props

    const [averrageBasket, setAverrageBasket] = useState<number>(0)
    const [share, setShare] = useState<number>(0)
    const [opportunities, setOpportunities] = useState<number>(0)
    const [stepValues, setStepValues] = useState<Array<{ label: string, valueDeal: number, valueLead: number }>>()
    const [stepLabel, setStepLabel] = useState<Array<string>>([])
    const [stepDealValues, setStepDealValues] = useState<Array<number>>([])
    const [stepLeadValues, setStepLeadValues] = useState<Array<number>>([])

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('commercial')

    const [errors, setErrors] = useState<string>('')

    useEffect(() => {
        if (data) {
            setAverrageBasket(Math.round(data.averrageBasket + (data.averrageBasket * (data.sell / 100))))
            setShare(Math.round(data.goal - data.wallet))
            if (averrageBasket !== 0) {
                setOpportunities(Math.round(share / averrageBasket))
            }

            const newStepLabel = data.stepValues.map((stepValue: { source: string }) => stepValue.source);

            const newStepDealValues = data.stepValues.map((stepValue: { distribution: number }) => {
                if (stepValue && stepValue.distribution !== undefined) {
                    const valueDeal = Math.round(opportunities * (stepValue.distribution / 100));
                    return valueDeal;
                }
                return 0;
            });

            const newStepLeadValues = data.stepValues.map((stepValue: { distribution: number, conversionRateStep: number }) => {
                if (stepValue && stepValue.distribution !== undefined && stepValue.conversionRateStep !== undefined) {
                    const valueLead = Math.round(opportunities * (stepValue.distribution / 100) / (stepValue.conversionRateStep / 100));
                    return isFinite(valueLead) ? valueLead : 0;
                }
                return 0;
            });

            setStepLabel(newStepLabel)
            setStepDealValues(newStepDealValues)
            setStepLeadValues(newStepLeadValues)
        }
    }, [data])

    const handleDependingChange = (event: SelectChangeEvent) => {
        setRole(event.target.value)
    }

    const handleSubmit = () => {
        if (firstName && lastName && phone && email && role) {
            console.log('gagné')
        } else {
            setErrors('Le champs est requis')
        }
    }

    const inputs = [
        {
            type: "text",
            label: "Prénom",
            value: firstName,
            onChange: (newFirstName: string) => setFirstName(newFirstName)
        },
        {
            type: "text",
            label: "Nom",
            value: lastName,
            onChange: (newLastName: string) => setLastName(newLastName)
        },
        {
            type: "text",
            label: "Numéro de téléphone",
            value: phone,
            onChange: (newPhone: string) => setPhone(newPhone)
        },
        {
            type: "email",
            label: "Email",
            value: email,
            onChange: (newEmail: string) => setEmail(newEmail)
        }
    ]

    const options = [
        {
            label: "Commercial",
            value: "commercial"
        },
        {
            label: "Directeur des ventes",
            value: "sales manager"
        },
        {
            label: "Directeur Marketing",
            value: "marketing manager"
        },
        {
            label: "Dirigeant d'une entreprise",
            value: "company manager"
        },
        {
            label: "Autres",
            value: "other"
        }
    ]

    return (
        <Stack spacing={4}>
            <Typography variant="h4">
                Résultats
            </Typography>

            <Stack direction="row" justifyContent="space-around">
                <MKpi
                    label="panier moyen"
                    description="Le panier moyen d'une opportunité chez vous."
                    data={averrageBasket}
                    devise="€"
                />

                <MKpi
                    label="quote-part de nouveaux clients"
                    description={`Pour atteindre votre objectif il vous faudra signer ${share}€ de nouveaux clients.`}
                    data={share}
                    devise="€"
                />

                <MKpi
                    label="nombre d'opportunités"
                    description={`Il vous faut réaliser un closin de ${opportunities} opportunitées sur les 12 prochains mois pour vous permettre d'atteindre votre objectif.`}
                    data={opportunities}
                />
            </Stack>

            <Stack alignItems="center">
                <AButton variant="contained" onClick={() => setOpenModal(true)}>
                    Générer le rapport
                </AButton>
            </Stack>

            <Chart
                type="bar"
                width="100%"
                height="360px"
                series={[
                    {
                        name: 'Transaction à signer',
                        data: stepDealValues
                    },
                    {
                        name: 'Lead à signer',
                        data: stepLeadValues
                    }
                ]}
                options={{
                    xaxis: {
                        categories: stepLabel,
                        labels: {
                            style: {
                                fontSize: '10px'
                            }
                        }
                    },
                    colors: [theme.palette.text.secondary, theme.palette.info.main]
                }}
            />

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack
                    spacing={4}
                    alignItems="center"
                    padding="50px"
                    borderRadius="30px"
                    sx={{
                        background: theme.palette.background.default
                    }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h4">
                            Vos coordonnées
                        </Typography>

                        <Typography variant="body2">
                            Une fois le formulaire rempli, vous pourrez: <br />
                            · Voir les graphiques en fonction de vos paramètres <br />
                            · Les modifier en temps réel pour ajuster les valeurs <br />
                            · Enregistrer vos résultats en PDF
                        </Typography>
                    </Stack>

                    <Stack spacing={errors ? 2 : 4}>
                        {inputs.map((input) => <MInputText
                            type={input.type}
                            label={input.label}
                            value={input.value}
                            onChange={input.onChange}
                            error={errors}
                        />)}

                        <FormControl>
                            <InputLabel>Fonction*</InputLabel>
                            <Select
                                label="Fonction"
                                value={role}
                                onChange={handleDependingChange}
                                sx={{
                                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                {options.map((option) => <MenuItem value={option.value}>{option.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack spacing={2}>
                        <ACheck label="J'accepte que YuzuCorp enregistre mes données" error={errors} />
                        <ACheck label="J'accepte de recevoir des propositions marketing de YuzuCorp" error={errors} />
                    </Stack>

                    <AButton variant="contained" onClick={handleSubmit}>
                        Valider
                    </AButton>
                </Stack>
            </Modal>
        </Stack>
    )
}

export default OResults