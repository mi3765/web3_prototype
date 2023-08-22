import React from 'react'
import './Button.scss';
import { useNavigate } from 'react-router-dom';

export const Button = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/route-form");
    }

    return (
        <>
            <button className="post-button" onClick={handleButtonClick}>ルート出品</button>
        </>
    )
}
