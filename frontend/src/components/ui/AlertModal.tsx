import React from 'react';
import { Button } from './Button';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: '#000000',
          border: '1px solid #333333',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          animation: 'modalFadeIn 0.3s ease-out'
        }}
      >
        <h2 
          className="modal-title"
          style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          {title}
        </h2>
        
        <p 
          className="modal-message"
          style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.5',
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: '20px'
          }}
        >
          {message}
        </p>

        <div 
          className="modal-actions"
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}
        >
          <Button
            onClick={onCancel}
            variant="secondary"
            size="sm"
            text={cancelText}
          />
          
          <Button
            onClick={onConfirm}
            variant="primary"
            size="sm"
            text={confirmText}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertModal; 