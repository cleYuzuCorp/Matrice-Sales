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

    const [active, setActive] = useState<string>('Activité commerciale')
    const [hovered, setHovered] = useState<number | null>()

    return (
        <Stack
            maxWidth="200px"
            minWidth="200px"
            width="100%"
            overflow="hidden"
            flex='1 1 100%'
            borderRadius={{ xs: '0px 0px 0px 0px', md: '0px 30px 0px 0px' }}
            sx={{
                boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)'
            }}
        >
            <Stack spacing={8} alignItems="center" height="100%" minHeight="100vh" paddingTop="150px" paddingBottom="150px">
                <Stack>
                    <img
                        src="images/logo/logo_yuzu.png"
                        alt="Logo"
                        style={{
                            width: '100px',
                            position: 'absolute',
                            top: '5px',
                            left: '5px'
                        }}
                    />

                    <Typography variant="h4">
                        Matrices
                    </Typography>
                </Stack>

                <Stack spacing={6} width="100%">
                    {matrices.map((matrice, index) =>
                        <Stack
                            key={index}
                            spacing={2}
                            direction="row"
                            alignItems="center"
                            padding='15px 30px 15px 30px'
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
                            <FontAwesomeIcon icon={matrice.icone} color={theme.palette.text.primary} />
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