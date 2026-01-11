import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import { fetchAllBuyersFromApi, generateBuyerLedger } from '../../services/BuyerServices'
import { useAuth } from '../../context/AuthProvider'

class AutocompleteOption {
  id: string = ''
  label: string = ''

  constructor(id: string, label: string) {
    this.id = id
    this.label = label
  }
}

export const BuyerLedger: React.FC = () => {
  const auth = useAuth()
  const [buyers, setBuyers] = useState<AutocompleteOption[]>([])
  const [buyer, setBuyer] = useState<AutocompleteOption | null>(null)

  const loadBuyers = async () => {
    const buyers = await fetchAllBuyersFromApi(auth)
    if (buyers !== null) {
      setBuyers(buyers.map((it) => new AutocompleteOption(it.buyerId, it.buyerName)))
    }
  }

  const handleBuyerNameChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.preventDefault()
    setBuyer(newValue)
  }

  useEffect(() => {
    loadBuyers()
  }, [auth])

  return (
    <Box>
      <Autocomplete
        disablePortal
        id="buyers"
        options={buyers}
        value={buyer}
        onChange={handleBuyerNameChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} size="small" label="Buyer name" />}
      />
      <Button onClick={() => generateBuyerLedger(buyer?.id ?? '', auth)}>Generate Report</Button>
    </Box>
  )
}
