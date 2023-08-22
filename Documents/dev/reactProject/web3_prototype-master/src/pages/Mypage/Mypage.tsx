import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import "./Mypage.scss";
import { Header } from '../../components/Header/Header';
import { RoutesListing } from '../RoutesListing/RoutesListing';
import { StarRating } from '../../components/Rating/StarRating';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";

export const Mypage = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string | null>(null);
    const [ethereumAddress, setEthereumAddress] = useState<string>("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().userName || "Unknown User");
                        setEthereumAddress(userDoc.data().ethereumAddress || "");
                    } else {
                        console.error("User document doesn't exist.");
                        setUserName("Unknown User"); // ドキュメントが存在しない場合のデフォルト値
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("User is not authenticated.");
                setUserName("Unknown User"); // 認証されていない場合のデフォルト値
            }
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [auth, db]);

    if (userName === null) {
        return <div>Loading...</div>;
    }


    const handleEthereumAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEthereumAddress(event.target.value);
    };

    const saveEthereumAddress = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(userDocRef, { ethereumAddress: ethereumAddress }, { merge: true });
            alert("Ethereumアドレスを保存しました。");
        }
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("Successfully signed out");
            navigate('/'); // ログアウト後にホームページにリダイレクト
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    };

    const editProfile = () => {
        navigate('/editprofile');
    };

    return (
        <div className="mypage-container">
            <Header isApplicablePage={true}></Header>
            <div className="user-profile-container">
                <AccountCircleIcon sx={{ fontSize: 60 }} color='disabled' />
                <h3>{userName}</h3>
                <StarRating />
                <Button variant="outlined" className='profile-button' onClick={editProfile}>プロフィールを編集</Button>
            </div>
            <div className="ethereum-address-container">
                <label>Ethereumアドレス:</label>
                <input
                    type="text"
                    value={ethereumAddress}
                    onChange={handleEthereumAddressChange}
                    placeholder="Ethereumアドレスを入力"
                />
                <Button variant="outlined" onClick={saveEthereumAddress}>保存</Button>
            </div>
            <div className='earning-container'>
                <h3>売上金</h3>
                <h3>1000</h3>
            </div>
            {userName && <RoutesListing userName={userName} />}
            <Button variant="contained" color="error" onClick={handleSignOut} className='signout-button'>
                Sign Out
            </Button>
        </div>
    )
};
