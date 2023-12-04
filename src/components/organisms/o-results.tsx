import { Stack, Typography } from "@mui/material"
import MKpi from "../molecules/m-kpi"
import { useEffect, useState } from "react"
import AButton from "../atoms/a-button"

const OResults = (props: { data: any }) => {

    const { data } = props

    const [averrageBasket, setAverrageBasket] = useState<number>(0)
    const [share, setShare] = useState<number>(0)
    const [opportunities, setOpportunities] = useState<number>(0)

    useEffect(() => {
        if (data) {
            setAverrageBasket(Math.ceil(data.averrageBasket + (data.averrageBasket * (data.sell / 100))))
            setShare(Math.ceil(data.goal - data.wallet))
            if (averrageBasket !== 0) {
                setOpportunities(Math.ceil(share / averrageBasket))
            }
        }
    }, [data])

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

            <AButton variant="contained">
                Générer le rapport
            </AButton>
        </Stack>
    )
}

export default OResults