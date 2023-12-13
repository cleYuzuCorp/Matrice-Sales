import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Stack, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText } from "@mui/material"
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
    const [role, setRole] = useState<string>('')
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
        formSubmission: yup.string()
    })

    const { clearErrors, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    const handleDependingChange = (event: SelectChangeEvent) => {
        setRole(event.target.value)
        clearErrors('role')
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
                        "objectTypeId": "0-1",
                        "name": "firstname",
                        "value": firstname
                    },
                    {
                        "objectTypeId": "0-1",
                        "name": "lastname",
                        "value": lastname
                    },
                    {
                        "objectTypeId": "0-1",
                        "name": "phone",
                        "value": phoneNumber
                    },
                    {
                        "objectTypeId": "0-1",
                        "name": "email",
                        "value": email
                    },
                    {
                        objectTypeId: "0-1",
                        name: "hs_persona",
                        value: persona
                    }
                ],
                context: {
                    hutk: hutk,
                    pageUri: "https://orange-plant-081f37110.2.azurestaticapps.net/",
                    pageName: "Activité",
                },
                legalConsentOptions: {
                    "consent": {
                        "consentToProcess": true,
                        "text": "I agree to allow Example Company to store and process my personal data.",
                        "communications": [
                            {
                                "value": true,
                                "subscriptionTypeId": 999,
                                "text": "I agree to receive marketing communications from Example Company."
                            }
                        ]
                    },
                }
            }

            if (process.env.REACT_APP_API_URL) {
                const response = await axios.post(process.env.REACT_APP_API_URL, JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                console.log('Form submission successful:', response.data)
                return response
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            return error
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
                const response = await formv3(email, firstName, lastName, phone, role)

                if (response && response.status === 200) {
                    setFormSubmitted(true)
                } else {
                    setError('formSubmission', { type: 'manual', message: 'Erreur lors de la soumission du formulaire, Vérifiez vos informations ou réessayez plus tard.' })
                }
            }
        } catch (validationErrors: any) {
            validationErrors.inner.forEach((error: { path: any; message: string }) => {
                setError(error.path, { type: 'manual', message: error.message })
            })
        }
    }

    useEffect(() => {
        if (formSubmitted) {
            onSubmit({ formSubmitted, firstName, lastName, email })
            setOpenModal(false)
        }
    }, [formSubmitted])

    const inputs = [
        {
            type: "text",
            label: "Prénom",
            error: "firstname",
            value: firstName,
            onChange: (newFirstName: string) => {
                setFirstName(newFirstName)
                clearErrors('firstname')
            }
        },
        {
            type: "text",
            label: "Nom",
            error: "lastname",
            value: lastName,
            onChange: (newLastName: string) => {
                setLastName(newLastName)
                clearErrors('lastname')
            }
        },
        {
            type: "text",
            label: "Numéro de téléphone",
            error: "phone",
            value: phone,
            onChange: (newPhone: string) => {
                setPhone(newPhone)
                clearErrors('phone')
            }
        },
        {
            type: "email",
            label: "Email",
            error: "email",
            value: email,
            onChange: (newEmail: string) => {
                setEmail(newEmail)
                clearErrors('email')
                try {
                    schema.validateSyncAt('email', { email: newEmail })
                    clearErrors('email')
                } catch (error) {
                    setError('email', { type: 'manual', message: (error as Error).message })
                }
            }
        }
    ]

    const options = [
        {
            label: "Commercial",
            value: "persona_8"
        },
        {
            label: "Directeur des ventes",
            value: "persona_1"
        },
        {
            label: "Directeur Marketing",
            value: "persona_6"
        },
        {
            label: "Dirigeant d'une entreprise",
            value: "persona_2"
        },
        {
            label: "Sales Ops",
            value: "persona_7"
        },
        {
            label: "Chef RH",
            value: "persona_5"
        },
        {
            label: "Autre",
            value: "persona_9"
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

                <FormControl
                    error={errors['role']?.message ? true : false}
                    sx={{
                        boxShadow: errors['role']?.message ? 'none' : '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    <InputLabel>Fonction*</InputLabel>
                    <Select
                        label="Fonction"
                        value={role}
                        onChange={handleDependingChange}
                        sx={{ boxShadow: 'none' }}
                    >
                        {options.map((option, index) => <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>)}
                    </Select>
                    {errors['role']?.message ? <FormHelperText>
                        {errors['role']?.message}
                    </FormHelperText> : null}
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

            {errors['formSubmission']?.message ? <Typography variant="body1" color={theme.palette.error.main}>
                {errors['formSubmission'].message}
            </Typography> : null}

            <Stack>
                <AButton variant="contained" onClick={handleFormSubmit}>
                    Valider
                </AButton>
            </Stack>
        </Stack>
    )

}

export default OFormContact