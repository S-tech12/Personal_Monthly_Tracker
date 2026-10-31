import React, { useEffect } from 'react';
import '../../styles/components/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'wide';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'default' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === 'Escape' || (e.altKey && e.key.toLowerCase() === 'x'))) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal-content ${size === 'wide' ? 'wide' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="modal-body">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
