import { Add, Refresh } from '@mui/icons-material'
import { Button, ButtonGroup, Stack, TextField } from '@mui/material'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import React from 'react'

import type Buyer from '../../model/Buyer'
import { useAuth } from '../../context/AuthContext'
import { addBuyer } from '../../services/BuyerServices'

interface ParentProps {
  syncBuyers: () => void
}

const BuyerMasterInput: React.FC<ParentProps> = ({ syncBuyers }: any) => {
  const auth = useAuth()
  const [buyer, setBuyer] = useState<Buyer>({
    buyerId: '',
    buyerName: '',
  })

  const handleBuyerMasterInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setBuyer({ ...buyer, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <TextField
          value={buyer.buyerId}
          type="text"
          name="buyerId"
          label="Buyer ID"
          size="small"
          onChange={handleBuyerMasterInputChange}
        ></TextField>
        <TextField
          value={buyer.buyerName}
          type="text"
          name="buyerName"
          label="Buyer Name"
          size="small"
          onChange={handleBuyerMasterInputChange}
        ></TextField>
        <ButtonGroup>
          <Button
            color={'success'}
            variant={'contained'}
            onClick={() => addBuyer(buyer, auth)}
            startIcon={<Add />}
          >
            Add Buyer
          </Button>
          <Button color={'info'} variant={'contained'} onClick={syncBuyers} startIcon={<Refresh />}>
            Sync
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  )
}

export default BuyerMasterInput
