import { Stack, Typography } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import theme from "../../theme"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface Matrices {
    label: string
    icone: IconDefinition
}

const THeader = (props: { matrices: Matrices[] }) => {

    const { matrices } = props

    const [active, setActive] = useState<string>('')
    const [hovered, setHovered] = useState<number | null>()

    return (
        <Stack maxWidth="300px" width="100%" height="100%" sx={{ borderRadius: {xs: '0px 0px 0px 0px', md: '0px 30px 0px 0px'}, boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)' }}>
            <Stack spacing={8} alignItems="center" paddingTop="200px" paddingBottom="150px">
                <Typography variant="h4">
                    Matrices
                </Typography>

                <Stack spacing={6} width="100%">
                    {matrices.map((matrice, index) =>
                        <Stack
                            spacing={2}
                            direction="row"
                            padding="15px 15px 15px 50px"
                            onClick={() => setActive(matrice.label)}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            sx={{
                                cursor: 'pointer',
                                background: active === matrice.label ? theme.palette.secondary.main :
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
            </Stack>
        </Stack>
    )
}

export default THeader