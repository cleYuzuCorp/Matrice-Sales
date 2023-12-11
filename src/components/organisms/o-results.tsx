import { FormControl, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import MKpi from "../molecules/m-kpi"
import { useEffect, useState } from "react"
import AButton from "../atoms/a-button"
import MInputText from "../molecules/m-input-text"
import theme from "../../theme"
import ACheck from "../atoms/a-check"
import Chart from "react-apexcharts"
import { faCalendarDay, faPeopleArrows, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from 'axios'
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { validate as validateEmail } from 'email-validator'

const OResults = (props: { data: any }) => {

    const { data } = props

    const [averrageBasket, setAverrageBasket] = useState<number>(25500)
    const [share, setShare] = useState<number>(350000)
    const [opportunities, setOpportunities] = useState<number>(14)

    const [stepLabel, setStepLabel] = useState<Array<string>>(['Outbound / Prospection', 'Inbound'])
    const [stepDealValues, setStepDealValues] = useState<Array<number>>([11, 3])
    const [stepLeadValues, setStepLeadValues] = useState<Array<number>>([110, 19])

    const [contactBase, setContactBase] = useState<number>(1100)
    const [prospectingAction, setProspectingAction] = useState<number>(33)

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('commercial')
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

    const [errors, setErrors] = useState<string>('')

    useEffect(() => {
        if (data) {
            setAverrageBasket(Math.round(data.averrageBasket + (data.averrageBasket * (data.sell / 100))))
            setShare(Math.round(data.goal - data.wallet))
            if (averrageBasket !== 0) {
                setOpportunities(Math.round((data.goal - data.wallet) / (data.averrageBasket + (data.averrageBasket * (data.sell / 100)))))
            }

            const newStepLabel = data.stepValues.map((stepValue: { source: string }) => stepValue.source)

            const newStepDealValues = data.stepValues.map((stepValue: { distribution: number }) => {
                if (stepValue && stepValue.distribution !== undefined) {
                    const valueDeal = Math.round((data.goal - data.wallet) / (data.averrageBasket + (data.averrageBasket * (data.sell / 100))) * (stepValue.distribution / 100))
                    return valueDeal
                }
                return 0
            })

            const newStepLeadValues = data.stepValues.map((stepValue: { distribution: number, conversionRateStep: number }) => {
                if (stepValue && stepValue.distribution !== undefined && stepValue.conversionRateStep !== undefined) {
                    const valueLead = Math.round((data.goal - data.wallet) / (data.averrageBasket + (data.averrageBasket * (data.sell / 100))) * (stepValue.distribution / 100) / (stepValue.conversionRateStep / 100))
                    return isFinite(valueLead) ? valueLead : 0
                }
                return 0
            })

            if (formSubmitted) {
                setStepLabel(newStepLabel)
                setStepDealValues(newStepDealValues)
                setStepLeadValues(newStepLeadValues)
            }

            if (data.conversionRate) {
                stepLabel.map((label, index) => {
                    if (label === 'Outbound / Prospection') {
                        setContactBase(Math.round(stepLeadValues[index] / (data.conversionRate / 100)))
                        setProspectingAction(Math.round((stepLeadValues[index] / (data.conversionRate / 100) * data.attempts / (52 - 5)) / 5))
                    }
                })
            }
        }
    }, [data])

    const handleDependingChange = (event: SelectChangeEvent) => {
        setRole(event.target.value)
    }

    const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split(';')
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim())
            if (cookieName === name) {
                return cookieValue
            }
        }
        return null
    }

    const formv3 = async (email: string, firstname: string, lastname: string, phoneNumber: string, persona: string): Promise<any> => {
        try {
            const currentTimestamp = new Date().getTime()
            const hutk = getCookie("hubspotutk")

            const data = {
                submittedAt: currentTimestamp,
                fields: [
                    {
                        objectTypeId: "0-1",
                        name: "firstname",
                        value: firstname,
                    },
                ],
                context: {
                    hutk: hutk,
                    pageUri: "https://orange-plant-081f37110.2.azurestaticapps.net/",
                    pageName: "Activité",
                },
                legalConsentOptions: {
                },
            }

            const response = await axios.post('https://api.hsforms.com/submissions/v3/integration/submit/6950252/c402f891-3444-4990-9c2e-56afb360978f', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            console.log('Form submission successful:', response.data)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const validateEmailFormat = (email: string): boolean => {
        return validateEmail(email); // Use email-validator library to validate email format
    };

    const handleSubmit = () => {
        if (firstName && lastName && phone && email && role) {
            if (!validateEmailFormat(email)) {
                setErrors('Email invalide')
                console.log(errors)
                return
            }

            setFormSubmitted(true)
            setOpenModal(false)

            formv3(email, firstName, lastName, phone, role)
        } else {
            setErrors('Le champs est requis')
        }
    }

    const convertChartToImage = async () => {
        const chartContainer = document.getElementById('chart-container')
        if (chartContainer) {
            const canvas = await html2canvas(chartContainer)
            return canvas.toDataURL('image/png')
        }
        return null
    }

    const generatePDF = async () => {
        const pdf = new jsPDF()

        const maxWidth = 150
        const lineHeight = 10

        const splitOptions = { maxWidth, lineHeight }

        const addTextWithWrap = (text: string, x: number, y: number) => {
            const splitText = pdf.splitTextToSize(text, maxWidth, splitOptions)
            pdf.text(splitText, x, y)
        }

        pdf.addImage('images/logo/logo_yuzu.png', 'PNG', 20, 20, 150, 75)

        pdf.setFont('BD Supper, sans serif', 'bold')
        pdf.setFontSize(40)
        addTextWithWrap("Rapport d'Activité", 50, 100)

        pdf.setFont('BD Supper, sans serif', 'bold')
        pdf.setFontSize(19)
        addTextWithWrap('Mes informations :', 20, 130)

        pdf.setFont('BD Supper, sans serif', 'normal')
        pdf.setFontSize(16)
        addTextWithWrap(`Objectif C.A. défini: ${data.objectif} €/an`, 30, 140)
        addTextWithWrap(`Embarqué défini: ${data.wallet} €/an`, 30, 150)
        addTextWithWrap(`Montant moyen d'un première vente: ${data.averrageBasket} €`, 30, 160)
        addTextWithWrap(`Augmentation Up-Selling et Cross Selling: ${data.sell}%`, 30, 170)
        addTextWithWrap(`Mes différentes sources:`, 30, 180)
        data.stepValues.map((stepValue: { distribution: number; source: string; conversionRateStep: number }, index: number) => {
            addTextWithWrap(`· ${stepValue.distribution}% de mes transactions sont de nature ${stepValue.source} avec ${stepValue.conversionRateStep}% de taux de conversion`, 40, 190 + (index * 10 + index * 5))
        })
        addTextWithWrap(`Mon taux de conversion entre un acte de prospection et la création d'un rendez-vous est de ${data.conversionRate}%:`, 30, 250)
        addTextWithWrap(`Mon nombre de tentative pour contacter une personne est de ${data.conversionRate}%:`, 30, 265)

        pdf.addPage()
        pdf.setFont('BD Supper, sans serif', 'bold')
        pdf.setFontSize(19)
        addTextWithWrap('Mes résultats :', 20, 20)

        pdf.setFont('BD Supper, sans serif', 'normal')
        pdf.setFontSize(16)
        addTextWithWrap(`Panier moyen: ${averrageBasket} €`, 30, 30)
        addTextWithWrap(`Quote-part de nouveaux clients: ${share} €`, 30, 40)
        addTextWithWrap(`Nombre d'opportunités: ${opportunities}`, 30, 50)

        pdf.setFont('BD Supper, sans serif', 'bold')
        pdf.setFontSize(19)
        addTextWithWrap(`Mon Graphique:`, 20, 80)

        const chartImage = await convertChartToImage()
        if (chartImage) {
            pdf.addImage(chartImage, 'PNG', 20, 100, 160, 80)
        }

        const emailParts = email.split('@')
        const emailDomain = emailParts.length === 2 ? emailParts[1].toLowerCase() : ''
        const emailCurrency = emailDomain.replace(/\.[^.]+$/, '')
        const fileName = `${emailCurrency} - ${firstName} ${lastName} - YuzuCorp - Activite.pdf`

        pdf.save(fileName)
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

            <Stack spacing={2}>
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

            <Stack alignItems="center">
                <AButton
                    variant={formSubmitted ? "contained" : "outlined"}
                    disabled={formSubmitted ? false : true}
                    onClick={generatePDF}
                >
                    Télécharger le PDF
                </AButton>
            </Stack>

            <Stack id="chart-container" sx={{ filter: !formSubmitted ? 'blur(8px)' : null }}>
                <Chart
                    type="bar"
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
                        chart: {
                            toolbar: {
                                show: false
                            }
                        },
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
            </Stack>

            <Stack spacing={2} sx={{ filter: !formSubmitted ? 'blur(8px)' : null }}>
                <MKpi label="Base de contact nécessaire" data={contactBase} icon={faPeopleArrows} />
                <MKpi label="Nombre d'action de prospection par jour nécessaire" data={prospectingAction} icon={faCalendarDay} />
            </Stack>

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
                    maxHeight="600px"
                    height="100%"
                    overflow="auto"
                    sx={{
                        position: 'relative',
                        background: theme.palette.background.default
                    }}
                >
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{
                            position: "absolute",
                            top: '10px',
                            right: '10px',
                            width: '40px',
                            height: '40px'
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
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

                    <Stack>
                        <AButton variant="contained" onClick={handleSubmit}>
                            Valider
                        </AButton>
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    )
}

export default OResults