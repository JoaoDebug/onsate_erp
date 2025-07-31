import React from 'react';
import styles from './ModalAction.module.css'

interface ModalActionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  text: string;
}

const ModalAction: React.FC<ModalActionProps> = ({ isOpen, onClose, onConfirm, onCancel, text }) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modal_overlay}
      onClick={onCancel} // Fechar ao clicar fora
    >
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do modal
      >
        {/* Ícone de Close */}
        <button
          onClick={onClose}
          className={styles.modal_close}
        >
        </button>

        <h3>{text}</h3>
        <div className={styles.modal_buttons}>
          <button
            onClick={onConfirm}
            className={`${styles.modal_button} ${styles.modal_button_confirm}`}
          >
            Sim
          </button>
          <button
            onClick={onCancel}
            className={`${styles.modal_button} ${styles.modal_button_cancel}`}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAction;
