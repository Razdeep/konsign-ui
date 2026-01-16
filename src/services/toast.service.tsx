import { toast } from 'react-toastify'

import ThemeToast from '../components/ThemeToast'

export const ToastService = {
  success(message: string) {
    toast(<ThemeToast title="success" message={message} variant="success" />, {
      hideProgressBar: true,
    })
  },

  error(message: string) {
    toast(<ThemeToast title="error" message={message} variant="error" />, { autoClose: false })
  },

  info(message: string) {
    toast(<ThemeToast title="info" message={message} variant="info" />)
  },
}
