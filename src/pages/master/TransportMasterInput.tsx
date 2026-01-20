import { Add, Refresh } from '@mui/icons-material'
import { Button, ButtonGroup, Stack, TextField } from '@mui/material'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import React from 'react'

import type Transport from '../../model/Transport'
import { useAuth } from '../../context/AuthContext'
import { addTransport } from '../../services/TransportServices'

interface ParentProps {
  syncTransports: () => void
}

const TransportMasterInput: React.FC<ParentProps> = ({ syncTransports }: any) => {
  const auth = useAuth()
  const [transport, setTransport] = useState<Transport>({
    transportId: '',
    transportName: '',
  })

  const handleTransportMasterInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault()
    setTransport({ ...transport, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <TextField
          value={transport.transportId}
          type="text"
          name="transportId"
          label="Transport ID"
          size="small"
          onChange={handleTransportMasterInputChange}
        ></TextField>
        <TextField
          value={transport.transportName}
          type="text"
          name="transportName"
          label="Transport Name"
          size="small"
          onChange={handleTransportMasterInputChange}
        ></TextField>
        <ButtonGroup>
          <Button
            variant={'contained'}
            onClick={() => addTransport(transport, auth)}
            startIcon={<Add />}
            color={'success'}
          >
            Add Transport
          </Button>
          <Button
            color={'info'}
            variant={'contained'}
            onClick={syncTransports}
            startIcon={<Refresh />}
          >
            Sync
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  )
}

export default TransportMasterInput
