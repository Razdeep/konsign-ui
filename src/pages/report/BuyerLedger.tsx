import { Autocomplete, Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchAllBuyersFromApi, generateBuyerLedger } from "../../services/BuyerServices"
import { useAuth } from "../../context/AuthProvider"


export const BuyerLedger: React.FC = () => {

    const auth = useAuth()
    const [buyers, setBuyers] = useState<String[]>([])
    const [buyer, setBuyer] = useState<String>("")

    const loadBuyers = async () => {
        const buyers = await fetchAllBuyersFromApi(auth)
        if (buyers !== null) {
            setBuyers(buyers.map((it) => it.buyerId))
        }
    }

    const handleBuyerNameChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        event.preventDefault()
        setBuyer(newValue)
    }

    useEffect(() => {
        loadBuyers()
    })

    return <Box>
        <Autocomplete
            disablePortal
            id="buyers"
            options={buyers}
            value={buyer}
            onChange={handleBuyerNameChange}
            renderInput={(params) => <TextField {...params} name="buyerName" size="small" label="Buyer name" />}
        />
        <Button onClick={() => generateBuyerLedger(buyer, auth)}>Generate Report</Button>
    </Box>

}