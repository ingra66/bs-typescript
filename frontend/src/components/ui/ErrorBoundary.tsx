import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Algo salió mal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
            >
              Reintentar
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
} 