import { Box, Typography, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'

type ToastVariant = 'success' | 'error' | 'info'

type Props = {
  title: string
  message?: string
  variant: ToastVariant
}

export default function ThemeToast({ title, message, variant }: Props) {
  const theme = useTheme()

  const iconMap = {
    success: <CheckCircleIcon color="success" />,
    error: <ErrorIcon color="error" />,
    info: <InfoIcon color="info" />,
  }

  const bgColorMap = {
    success: theme.palette.success.light,
    error: theme.palette.error.light,
    info: theme.palette.info.light,
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        backgroundColor: bgColorMap[variant],
        color: theme.palette.text.primary,
        borderRadius: 2,
        padding: '12px 16px',
        minWidth: 280,
      }}
    >
      {iconMap[variant]}

      <Box>
        <Typography fontWeight={600}>{title}</Typography>

        {message && (
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
