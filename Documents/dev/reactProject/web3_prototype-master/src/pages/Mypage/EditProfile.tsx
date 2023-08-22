import React from 'react';
import { Header } from "../../components/Header/Header";
import { getAuth, signOut } from "firebase/auth";
import { Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import "./EditProfile.scss";


export const EditProfile = () => {
    return (
        <div>
            <div className="mypage-container">
                <Header isApplicablePage={true}></Header>
                <div className="user-profile-container">
                    <h3 className="edit-profile-title">プロフィール設定</h3>
                    <AccountCircleIcon sx={{ fontSize: 60 }} color='disabled' className='user-img' />
                    <TextField id="outlined-basic" label="ユーザーネーム" variant="outlined" className='user-name-text' />
                    <TextField
                        id="outlined-multiline-flexible"
                        label="自己紹介"
                        multiline
                        maxRows={8}
                        className="user-text-line"
                    />
                    <Button variant="outlined" className='update-button'>更新する</Button>
                </div>
            </div>
        </div>
    );
};
