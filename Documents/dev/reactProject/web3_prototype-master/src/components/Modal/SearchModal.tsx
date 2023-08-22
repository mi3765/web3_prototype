import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import "./SearchModal.scss";

// アプリケーションのルートコンポーネント内で設定
Modal.setAppElement('#root');

interface SearchModalProps {
  onClose: (event: React.MouseEvent) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  return (
    <Modal isOpen={true}>
      <div className="modal-container">
      <CloseIcon onClick={onClose} className='close-icon' />
        <div className="input-container">
          <input type="text" placeholder="何をお探しですか" className="search-bar" />
          <SearchIcon className='search-icon' />
        </div>
      </div>
    </Modal>
  );
};
