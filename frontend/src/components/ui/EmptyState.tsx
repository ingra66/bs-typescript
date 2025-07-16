import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon 
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
} 