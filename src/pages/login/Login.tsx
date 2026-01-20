import type { ChangeEvent } from 'react'
import { useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import React from 'react'
import {
  Backdrop,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { LoginSharp } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

import { KonsignSpinner } from '../../components/KonsignSpinner'
import { useAuth } from '../../context/AuthContext'
import Config from '../../util/config'
import type KonsignResponse from '../../model/KonsignResponse'
import type User from '../../model/User'
import { ToastService } from '../../services/toast.service'

const Login: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isIncorrectCredential, setIncorrectCredential] = useState<boolean>(false)

  class Credential {
    username: String = ''
    password: String = ''
  }

  const [credential, setCredential] = useState<Credential>({
    username: '',
    password: '',
  })

  const handleClose = () => {
    setIncorrectCredential(false)
  }

  const handleCredentialChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setCredential({ ...credential, [e.target.name]: e.target.value })
  }

  const navigate = useNavigate()

  const handleSubmit = async (event: any) => {
    // Prevent page reload
    event.preventDefault()
    setIsLoading(true)
    const jsonified_credential = JSON.stringify(credential)
    console.log('sending message = ' + jsonified_credential)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: jsonified_credential,
    }
    const response: Response | null = await fetch(Config.LOGIN_URL, requestOptions).catch(() => {
      console.log('Error authenticating')
      setIsLoading(false)
      return null
    })
    setIsLoading(false)
    if (response === null || response?.status != 200) {
      setIncorrectCredential(true)
      return
    }
    console.log('response status is ' + response.status)
    const res: KonsignResponse<User> = await response.json()
    if (res.data == null) {
      ToastService.error('error while trying to login')
      return
    }
    ToastService.success('successfully logged in')
    auth.login(res.data)
    navigate('/dashboard', { replace: true })
  }

  const paperStyle = {
    height: '40vh',
    width: '45vh',
    margin: 'auto',
    textalign: 'center',
    background: theme.palette.secondary.main,
    display: 'flex',
    padding: '3vh',
    center: 1,
  }

  const renderForm = (
    <Grid
      style={{ minHeight: '100vh', display: 'flex', backgroundColor: theme.palette.primary.main }}
    >
      <Paper sx={paperStyle}>
        <FormControl fullWidth>
          <Stack spacing={3}>
            <TextField
              label="username"
              name="username"
              onChange={handleCredentialChange}
              variant="standard"
              required
              fullWidth
            />
            <TextField
              label="password"
              type="password"
              name="password"
              onChange={handleCredentialChange}
              variant="standard"
              required
              fullWidth
            />
            <Button
              onClick={handleSubmit}
              style={{
                color: theme.palette.secondary.main,
                background: theme.palette.primary.main,
              }}
              fullWidth
              startIcon={<LoginSharp />}
            >
              Login
            </Button>
          </Stack>
        </FormControl>
      </Paper>
      {!isLoading ? (
        <></>
      ) : (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={handleClose}
        >
          <KonsignSpinner />
        </Backdrop>
      )}
      {!isIncorrectCredential ? (
        <></>
      ) : (
        <Dialog
          open={isIncorrectCredential}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Incorrect username/password'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have either typed incorrect username or password. Please try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  )

  return renderForm
}

export default Login
