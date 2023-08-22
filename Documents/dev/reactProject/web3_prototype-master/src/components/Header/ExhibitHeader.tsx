import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './ExhibitHeader.scss';

export const ExhibitHeader = () => {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/");
    };

    return (
        <div className="header-container">
            <div className="logo-container">
                <ArrowBackIosIcon className="arrow-icon" onClick={handleButtonClick} />
                <h1 className="logo" onClick={handleButtonClick}>TravelChain</h1>
            </div>
        </div>
    )
}