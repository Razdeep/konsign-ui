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

import { KonsignSpinner } from '../../components/KonsignSpinner'
import { useAuth } from '../../context/AuthProvider'
import type Supplier from '../../model/Supplier'
import { deleteSupplierFromApi, fetchAllSuppliersFromApi } from '../../services/SupplierServices'
import SupplierMasterInput from './SupplierMasterInput'

const SupplierMaster: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const auth = useAuth()

  const syncSuppliers = useCallback(async () => {
    setIsLoading(true)
    const fetchedSuppliers = await fetchAllSuppliersFromApi(auth)

    if (fetchedSuppliers === null) {
      return
    }

    setSuppliers(fetchedSuppliers)
    setIsLoading(false)
  }, [auth])

  const deleteSupplier = async (supplierId: string) => {
    await deleteSupplierFromApi(supplierId, auth)
  }

  useEffect(() => {
    ;(async () => {
      await syncSuppliers()
    })()
  }, [syncSuppliers])

  return (
    <Stack spacing={2}>
      <SupplierMasterInput syncSuppliers={syncSuppliers}></SupplierMasterInput>
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
                Supplier ID
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.secondary.main,
                }}
                variant="head"
                align="center"
              >
                Supplier name
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
          {suppliers?.map((supplier: Supplier) => (
            <TableRow>
              <TableCell>{supplier.supplierId}</TableCell>
              <TableCell>{supplier.supplierName}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button>
                    <Edit></Edit>
                  </Button>
                  <Button
                    color={'error'}
                    onClick={() => {
                      deleteSupplier(supplier.supplierId)
                    }}
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

export default SupplierMaster
