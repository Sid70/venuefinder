import React from 'react';
import { Button } from '../ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
        <span className='mx-2'></span>
        <Button onClick={onClose} className='bg-red-500 text-white hover:bg-red-600'>
          Close
        </Button>
      </div>
    </div>
  );
};

export default Modal;
