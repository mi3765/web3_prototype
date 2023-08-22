import React, { useState, useEffect } from 'react';
import "./RouteInfo.scss";
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useParams, useNavigate } from 'react-router-dom';
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { ExhibitHeader } from '../../components/Header/ExhibitHeader';
import { RouteDisplay } from '../RouteDisplay/RouteDisplay';
import { StarRating } from '../../components/Rating/StarRating';
import { getAuth } from "firebase/auth";
import {
  connectMetaMask,
  sendTransaction,
  fetchEthereumAddress,
  updateCurrentBy,
  getUserNameFromFirestore
} from './RouteUtils';

type RouteData = {
  createdBy: string;
  currentBy: string;
  selectedCryptoCurrency: string;
  currencyValue: string;
  cid: string;
  imageUrls: string[];
  routeName: string;
  routeDescription: string;
};

export const RouteInfo = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { cid } = useParams<{ cid: string }>();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "routes"), where("cid", "==", cid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const routeData = querySnapshot.docs[0].data() as RouteData;
        setRouteData(routeData);
      } else {
        setError("指定されたルートが見つかりませんでした。");
      }
    };

    fetchData();
  }, [cid]);

  const handlePurchase = async () => {
    if (!routeData) return;

    try {
      const receiver = await fetchEthereumAddress(routeData.createdBy);
      if (!receiver) {
        alert('受取人のアドレスが見つかりませんでした。');
        return;
      }

      const amount = routeData.currencyValue;
      await sendTransaction(receiver, amount);

      const currentUser = auth.currentUser;
      if (currentUser && routeData.cid) {
        const userName = await getUserNameFromFirestore(currentUser.uid);
        if (userName) {
          await updateCurrentBy(routeData.cid, userName);
        } else {
          console.error('Failed to fetch userName from Firestore.');
          alert('Purchase failed. Could not update route owner.');
          return;
        }
      }
      alert('Purchase successful!');
      navigate('/mypage');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error during purchase:', error);
        alert('Purchase failed. Reason: ' + error.message);
      } else {
        console.error('An unknown error occurred:', error);
        alert('Purchase failed. Please try again.');
      }
    }
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % routeData!.imageUrls.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + routeData!.imageUrls.length) % routeData!.imageUrls.length
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!routeData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ExhibitHeader />
      {cid && <RouteDisplay cid={cid} />}
      <div className="route-info-container">
        <div className="product-container">
          <div className="img-container">
            <img
              src={routeData.imageUrls[currentImageIndex]}
              alt={routeData.routeName}
              className="product-image"
            />
            <div className="slide-controls">
              <Button onClick={goToPreviousImage}>前へ</Button>
              <Button onClick={goToNextImage}>次へ</Button>
            </div>
          </div>
          <div className="product-details">
            <h2 className="product-title">{routeData.routeName}</h2>
            <h3 className="product-price">{`${routeData.currencyValue} ${routeData.selectedCryptoCurrency}`}</h3>
            <h2 className="description-title">商品の説明</h2>
            <p className="product-description">{routeData.routeDescription}</p>
            <Button variant="outlined" className='profile-button' size={"large"} onClick={handlePurchase}>購入する</Button>
            <h2>出品者</h2>
            <div className="partnar-container">
              <AccountCircleIcon sx={{ fontSize: 60 }} color='disabled' />
              <h3>{routeData.createdBy}</h3>
              <StarRating />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
