import { Modal, Stack, Typography } from "@mui/material"
import MKpi from "../molecules/m-kpi"
import { useEffect, useState } from "react"
import AButton from "../atoms/a-button"
import theme from "../../theme"
import Chart from "react-apexcharts"
import { faCalendarDay, faPeopleArrows } from "@fortawesome/free-solid-svg-icons"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import OFormContact from "../organisms/o-form-contact"
import axios from "axios"

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
    const [submittedData, setSubmittedData] = useState({ formSubmitted: false, firstName: '', lastName: '', email: '' })

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

            if (submittedData.formSubmitted) {
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
    }, [data, submittedData.formSubmitted])

    const convertChartToImage = async () => {
        const chartContainer = document.getElementById('chart-container')
        if (chartContainer) {
            const canvas = await html2canvas(chartContainer)
            return canvas.toDataURL('image/png')
        }
        return null
    }

    console.log(submittedData, 'data')

    const generatePDF = async (download?: boolean) => {
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
        addTextWithWrap(`Objectif C.A. défini: ${data.goal} €/an`, 30, 140)
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

        const emailParts = submittedData.email.split('@')
        const emailDomain = emailParts.length === 2 ? emailParts[1].toLowerCase() : ''
        const emailCurrency = emailDomain.replace(/\.[^.]+$/, '')
        const fileName = `${emailCurrency} - ${submittedData.firstName} ${submittedData.lastName} - YuzuCorp - Activite.pdf`

        const pdfBlob = pdf.output('blob')

        const formData = new FormData()
        formData.append('file', pdfBlob, fileName)
        try {
            if (process.env.REACT_APP_API_UPLOAD_URL) {
                await axios.post(process.env.REACT_APP_API_UPLOAD_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-filename': fileName
                    },
                })
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi du fichier PDF :', error)
        }

        if (download) {
            pdf.save(fileName)
        }
    }

    const handleFormSubmit = async (data: { formSubmitted: boolean, firstName: string, lastName: string, email: string }) => {
        await setSubmittedData(data)
        generatePDF()
    }

    console.log(process.env.REACT_APP_API_URL, 'url')
    console.log(process.env.REACT_APP_API_UPLOAD_URL, 'upload')

    return (
        <Stack spacing={6}>
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
                <AButton
                    variant={submittedData.formSubmitted ? "outlined" : "contained"}
                    disabled={submittedData.formSubmitted ? true : false}
                    onClick={() => setOpenModal(true)}
                >
                    Générer le rapport
                </AButton>
            </Stack>

            <Stack alignItems="center">
                <AButton
                    variant={submittedData.formSubmitted ? "contained" : "outlined"}
                    disabled={submittedData.formSubmitted ? false : true}
                    onClick={() => generatePDF(true)}
                >
                    Télécharger le PDF
                </AButton>
            </Stack>

            <Stack id="chart-container" sx={{ filter: !submittedData.formSubmitted ? 'blur(8px)' : null }}>
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

            <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                    filter: !submittedData.formSubmitted ? 'blur(8px)' : null
                }}
            >
                <MKpi
                    variant="h2"
                    label="Base de contact nécessaire"
                    data={contactBase}
                    icon={faPeopleArrows}
                />

                <MKpi
                    variant="h2"
                    label="Nombre d'action de prospection par jour nécessaire"
                    data={prospectingAction}
                    icon={faCalendarDay}
                />
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
                <Stack>
                    <OFormContact setOpenModal={setOpenModal} onSubmit={handleFormSubmit} />
                </Stack>
            </Modal>
        </Stack>
    )
}

export default OResults
