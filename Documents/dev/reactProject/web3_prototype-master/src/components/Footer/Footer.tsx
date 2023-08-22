import React from 'react'
import { useNavigate } from "react-router-dom";
import './Footer.scss';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonIcon from '@mui/icons-material/Person';

export const Footer: React.FC = () => {
    const arry = [1, 2, 3, 4];
    const navigate = useNavigate();

    const handleButtonClick = (e: number) => {
        if(e === 1) {
            navigate("/");
        } else if(e === 2) {
            navigate("/news");
        } else if(e === 3) {
            navigate("/route-form");
        } else {
            navigate("/mypage");
        }
    }

    return (
        <div className="footer-container">
            <div onClick={() => handleButtonClick(arry[0])}>
                <HomeIcon />
                <p>ホーム</p>
            </div>
            <div onClick={() => handleButtonClick(arry[1])}>
                <NotificationsIcon />
                <p>お知らせ</p>
            </div>
            <div onClick={() => handleButtonClick(arry[2])}>
                <FmdGoodIcon />
                <p>ルート出品</p>
            </div>
            <div onClick={() => handleButtonClick(arry[3])}>
                <PersonIcon />
                <p>マイページ</p>
            </div>
        </div >
    )
}
