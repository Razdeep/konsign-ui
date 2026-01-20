import { Delete, Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import type Transport from '../../model/Transport'
import { deleteTransportFromApi, fetchAllTransportsFromApi } from '../../services/TransportServices'
import TransportMasterInput from './TransportMasterInput'
import { KonsignSpinner } from '../../components/KonsignSpinner'

const TransportMaster: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transports, setTransports] = useState<Transport[]>([])
  const auth = useAuth()

  const syncTransports = useCallback(async () => {
    setIsLoading(true)
    const fetchedTransports = await fetchAllTransportsFromApi(auth)
    setIsLoading(false)

    if (fetchedTransports === null) {
      return
    }

    setTransports(fetchedTransports)
  }, [auth])

  const deleteTransport = async (transportId: string) => {
    await deleteTransportFromApi(transportId, auth)
  }

  useEffect(() => {
    ;(async () => {
      await syncTransports()
    })()
  }, [syncTransports])

  return (
    <Stack spacing={2}>
      <TransportMasterInput syncTransports={syncTransports}></TransportMasterInput>
      {isLoading ? (
        <Box justifyContent="center" alignItems="center" sx={{ display: 'flex' }}>
          <KonsignSpinner />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                }}
                variant="head"
                align="center"
              >
                Transport ID
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                }}
                variant="head"
                align="center"
              >
                Transport name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                }}
                variant="head"
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {transports?.map((transport: Transport) => (
            <TableRow key={transport.transportId}>
              <TableCell>{transport.transportId}</TableCell>
              <TableCell>{transport.transportName}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button>
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => {
                      deleteTransport(transport.transportId)
                    }}
                    color={'error'}
                  >
                    <Delete></Delete>
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </Stack>
  )
}

export default TransportMaster
