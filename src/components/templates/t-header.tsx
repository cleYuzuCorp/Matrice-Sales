import { Button, Stack, Typography } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import theme from "../../theme"
import AButton from "../atoms/a-button"

const THeader = () => {
    const [active, setActive] = useState<number>(0)
    const [hovered, setHovered] = useState<number | null>()

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

    return (
        <Stack maxWidth="300px" width="100%" sx={{ boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)' }}>
            <Stack spacing={8} alignItems="center" marginTop="200px" marginBottom="150px">
                <Typography variant="h4">
                    Matrices
                </Typography>

                <Stack spacing={6} width="100%">
                    {matrices.map((matrice, index) =>
                        <Stack
                            spacing={2}
                            direction="row"
                            padding="15px 15px 15px 50px"
                            onClick={() => setActive(index)}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            sx={{
                                cursor: 'pointer',
                                background: active === index ? theme.palette.secondary.main :
                                    hovered === index ? theme.palette.primary.main :
                                        'transparent'
                            }}
                        >
                            <FontAwesomeIcon icon={matrice.icone} />
                            <Typography variant="body1">
                                {matrice.label}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <AButton variant="contained">
                    Générer le rapport
                </AButton>
            </Stack>
        </Stack>
    )
}

export default THeader