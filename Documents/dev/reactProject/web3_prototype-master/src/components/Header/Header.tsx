import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SearchIcon from '@mui/icons-material/Search';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import './Header.scss';
import { Button } from '../Button/Button';
import { SearchModal } from '../Modal/SearchModal';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


export const Header = ({ isApplicablePage = false }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // ユーザーのログイン状態

  const handleButtonClick = () => {
    navigate("/");
  };


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const openModal = () => {
    setIsModalOpen(true); // モーダルを開く
  };

  const closeModal = () => {
    setIsModalOpen(false); // モーダルを閉じる
  };

  const handleMyPageClick = () => {
    navigate('/mypage'); // マイページに遷移
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        {window.location.pathname !== "/" && (
          <ArrowBackIosIcon className="arrow-icon" onClick={handleButtonClick} />
        )}
        <h1 className="logo" onClick={handleLogoClick}>TravelChain</h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
          <button className="search-icon-c">
            <SearchIcon />
          </button>
        </div>
        <button className="mobile-search-icon">
          <SearchIcon onClick={openModal} />
          <DoneOutlineIcon />
        </button>
        {/* モーダルの表示 */}
        {isModalOpen && <SearchModal onClose={closeModal} />}
      </div>

      <div className="nav-items">
        <div><a href="news">お知らせ</a></div>
        {!isUserLoggedIn && !isApplicablePage && <div><a href="signup">会員登録</a></div>}
        {!isUserLoggedIn && !isApplicablePage && <div><a href="signin">ログイン</a></div>}
        {isUserLoggedIn && <div onClick={handleMyPageClick}>マイページ</div>}
        <Button />
      </div>
    </div>
  );
}
