// Card.tsx
import React from 'react'
import './Card.scss';

interface CardProps {
    imageUrl: string;
    price: string;
    routeName: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ imageUrl, price, routeName, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <img src={imageUrl} alt={routeName} />
            <h3>{routeName}</h3>
            <p>{price}</p>
        </div>
    )
}
