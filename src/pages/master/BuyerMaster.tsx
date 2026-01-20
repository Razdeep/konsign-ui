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

import { useAuth } from '../../context/AuthProvider'
import type Buyer from '../../model/Buyer'
import { deleteBuyerFromApi, fetchAllBuyersFromApi } from '../../services/BuyerServices'
import BuyerMasterInput from './BuyerMasterInput'
import { KonsignSpinner } from '../../components/KonsignSpinner'

const BuyerMaster: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const auth = useAuth()

  const syncBuyers = useCallback(async () => {
    setIsLoading(true)
    const fetchedBuyers = await fetchAllBuyersFromApi(auth)
    setIsLoading(false)
    if (fetchedBuyers === null) {
      return
    }
    setBuyers(fetchedBuyers)
  }, [auth])

  const deleteBuyer = async (buyerId: string) => {
    await deleteBuyerFromApi(buyerId, auth)
  }

  useEffect(() => {
    ;(async () => {
      await syncBuyers()
    })()
  }, [syncBuyers])

  return (
    <Stack spacing={2}>
      <BuyerMasterInput syncBuyers={syncBuyers}></BuyerMasterInput>
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
                Buyer ID
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                }}
                variant="head"
                align="center"
              >
                Buyer name
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
          {buyers?.map((buyer: Buyer) => (
            <TableRow key={buyer.buyerId}>
              <TableCell>{buyer.buyerId}</TableCell>
              <TableCell>{buyer.buyerName}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button>
                    <Edit></Edit>
                  </Button>
                  <Button
                    onClick={() => {
                      deleteBuyer(buyer.buyerId)
                    }}
                    color={'error'}
                  >
                    <Delete />
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

export default BuyerMaster
