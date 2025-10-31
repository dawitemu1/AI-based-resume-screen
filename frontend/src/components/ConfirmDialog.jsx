import React from 'react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null

  const variantClasses = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    warning: 'btn-warning',
    success: 'btn-success'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={variantClasses[confirmVariant]} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog