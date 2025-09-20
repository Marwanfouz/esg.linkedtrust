import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ApiError } from '../../types';
import { errorUtils } from '../../services/utils';

interface ErrorMessageProps {
  error: ApiError | Error | string;
  onRetry?: () => void;
  title?: string;
  fullWidth?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  title = 'Error',
  fullWidth = true,
}) => {
  const getErrorMessage = () => {
    if (typeof error === 'string') {
      return error;
    }
    
    if ('message' in error) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  };

  const getFriendlyMessage = () => {
    if (typeof error === 'object' && 'status' in error) {
      return errorUtils.getFriendlyErrorMessage(error as ApiError);
    }
    return getErrorMessage();
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        <Typography variant="body2" sx={{ mb: onRetry ? 2 : 0 }}>
          {getFriendlyMessage()}
        </Typography>
        
        {onRetry && (
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
              sx={{
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  backgroundColor: 'error.light',
                  color: 'error.dark',
                },
              }}
            >
              Try Again
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
