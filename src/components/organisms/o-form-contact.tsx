import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Stack, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import theme from "../../theme"
import AButton from "../atoms/a-button"
import ACheck from "../atoms/a-check"
import MInputText from "../molecules/m-input-text"
import axios from "axios"
import { useEffect, useState } from "react"
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"

const OFormContact = (props: { setOpenModal: any, onSubmit: any }) => {

    const { setOpenModal, onSubmit } = props

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('commercial')
    const [dataStorage, setDataStorage] = useState<boolean>(false)
    const [marketingProposals, setMarketingProposals] = useState<boolean>(false)
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

    const schema = yup.object().shape({
        firstname: yup.string().required('Le champ prénom est requis'),
        lastname: yup.string().required('Le champ nom est requis'),
        phone: yup.string().required('Le champ numéro de téléphone est requis'),
        email: yup.string().email('L\'email est invalide').required('Le champ email est requis'),
        role: yup.string().required('Le champ fonction est requis'),
        dataStorage: yup.boolean().oneOf([true], 'Vous devez accepter le stockage des données'),
        marketingProposals: yup.boolean().oneOf([true], 'Vous devez accepter les propositions marketing'),
    })

    const { clearErrors, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

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

    const handleFormSubmit = async () => {
        try {
            clearErrors()

            const isValid = await schema.validate({
                firstname: firstName,
                lastname: lastName,
                phone: phone,
                email: email,
                role: role,
                dataStorage: dataStorage,
                marketingProposals: marketingProposals,
            }, { abortEarly: false })

            if (isValid) {
                setFormSubmitted(true)
                formv3(email, firstName, lastName, phone, role)
            }
        } catch (validationErrors: any) {
            validationErrors.inner.forEach((error: { path: any; message: string }) => {
                setError(error.path, { type: 'manual', message: error.message })
            })
        }
    }

    useEffect(() => {
        onSubmit({ formSubmitted, firstName, lastName, email })
        if (formSubmitted) {
            setOpenModal(false)
        }
    }, [formSubmitted])

    const inputs = [
        {
            type: "text",
            label: "Prénom",
            error: "firstname",
            value: firstName,
            onChange: (newFirstName: string) => setFirstName(newFirstName)
        },
        {
            type: "text",
            label: "Nom",
            error: "lastname",
            value: lastName,
            onChange: (newLastName: string) => setLastName(newLastName)
        },
        {
            type: "text",
            label: "Numéro de téléphone",
            error: "phone",
            value: phone,
            onChange: (newPhone: string) => setPhone(newPhone)
        },
        {
            type: "email",
            label: "Email",
            error: "email",
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
                    key={input.label}
                    type={input.type}
                    label={input.label}
                    value={input.value}
                    onChange={input.onChange}
                    error={(errors[input.error as keyof typeof errors] as any)?.message}
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
                <ACheck
                    label="J'accepte de recevoir des propositions marketing de YuzuCorp"
                    checked={dataStorage}
                    onChange={((checked) => setDataStorage(checked))}
                    error={errors['dataStorage']?.message}
                />

                <ACheck
                    label="J'accepte que YuzuCorp enregistre mes données"
                    checked={marketingProposals}
                    onChange={((checked) => setMarketingProposals(checked))}
                    error={errors['marketingProposals']?.message}
                />
            </Stack>

            <Stack>
                <AButton variant="contained" onClick={handleFormSubmit}>
                    Valider
                </AButton>
            </Stack>
        </Stack>
    )

}

export default OFormContact