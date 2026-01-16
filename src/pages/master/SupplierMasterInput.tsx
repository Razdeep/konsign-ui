import { Add, Refresh } from '@mui/icons-material'
import { Button, ButtonGroup, Stack, TextField } from '@mui/material'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'

import { useAuth } from '../../context/AuthProvider'
import type Supplier from '../../model/Supplier'
import { addSupplierToApi } from '../../services/SupplierServices'

interface ParentProps {
  syncSuppliers: () => void
}

const SupplierMasterInput: React.FC<ParentProps> = ({ syncSuppliers }: any) => {
  const auth = useAuth()
  const [supplier, setSupplier] = useState<Supplier>({
    supplierId: '',
    supplierName: '',
  })

  const handleSupplierMasterInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault()
    setSupplier({ ...supplier, [e.target.name]: e.target.value })
  }

  const addSupplier = async () => {
    await addSupplierToApi(supplier, auth)
  }

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <TextField
          value={supplier.supplierId}
          type="text"
          name="supplierId"
          label="Supplier ID"
          size="small"
          onChange={handleSupplierMasterInputChange}
        ></TextField>
        <TextField
          value={supplier.supplierName}
          type="text"
          name="supplierName"
          label="Supplier Name"
          size="small"
          onChange={handleSupplierMasterInputChange}
        ></TextField>
        <ButtonGroup>
          <Button color={'success'} variant={'contained'} onClick={addSupplier} startIcon={<Add />}>
            Add Supplier
          </Button>
          <Button
            color={'info'}
            variant={'contained'}
            onClick={syncSuppliers}
            startIcon={<Refresh />}
          >
            Sync
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  )
}

export default SupplierMasterInput
