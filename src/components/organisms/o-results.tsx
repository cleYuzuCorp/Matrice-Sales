import { Modal, Stack, Typography } from "@mui/material"
import MKpi from "../molecules/m-kpi"
import { useEffect, useState } from "react"
import AButton from "../atoms/a-button"
import MInputText from "../molecules/m-input-text"
import theme from "../../theme"

const OResults = (props: { data: any }) => {

    const { data } = props

    const [averrageBasket, setAverrageBasket] = useState<number>(0)
    const [share, setShare] = useState<number>(0)
    const [opportunities, setOpportunities] = useState<number>(0)

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        if (data) {
            setAverrageBasket(Math.ceil(data.averrageBasket + (data.averrageBasket * (data.sell / 100))))
            setShare(Math.ceil(data.goal - data.wallet))
            if (averrageBasket !== 0) {
                setOpportunities(Math.ceil(share / averrageBasket))
            }
        }
    }, [data])

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

    return (
        <Stack spacing={8} alignItems="center">
            <Typography variant="h4">
                Résultats
            </Typography>

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

            <AButton variant="contained" onClick={() => setOpenModal(true)}>
                Générer le rapport
            </AButton>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Stack spacing={6} alignItems="center" justifyContent="center" maxWidth="720px" width="100%" sx={{ background: theme.palette.background.default }}>
                    <Typography variant="h4">
                        Vos coordonnées
                    </Typography>

                    <Typography variant="body2">
                        Une fois le formulaire rempli, vous pourrez: <br />
                        <br />
                        · Voir les graphiques en fonction de vos paramètres <br />
                        · Les modifier en temps réel pour ajuster les valeurs <br />
                        · Enregistrer vos résultats en PDF
                    </Typography>

                    <Stack spacing={6}>
                        {inputs.map((input) => <MInputText
                            type={input.type}
                            label={input.label}
                            value={input.value}
                            onChange={input.onChange}
                        />)}
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    )
}

export default OResults