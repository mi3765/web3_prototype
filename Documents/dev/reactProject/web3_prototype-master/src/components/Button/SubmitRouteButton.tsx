import React from 'react';
import "./SubmitRouteButton.scss";

interface SubmitRouteButtonProps {
    onClick: () => void;
    disabled?: boolean; // この行を追加
}

export const SubmitRouteButton: React.FC<SubmitRouteButtonProps> = ({ onClick, disabled }) => {
    return (
        <button className="submit-route-btn" onClick={onClick} disabled={disabled}>
            ルートの出品
        </button>
    );
}
