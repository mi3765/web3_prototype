import React, { useState, useEffect } from 'react';
import "./RouteForm.scss";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import { ExhibitHeader } from "../../components/Header/ExhibitHeader";
import { UploadImageButton } from '../../components/Button/UploadImageButton';
import { RouteCreationEdit } from '../RouteCreationEdit/RouteCreationEdit';
import { SubmitRouteButton } from '../../components/Button/SubmitRouteButton';
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export const RouteForm: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [routeName, setRouteName] = useState<string>('');
    const [routeDescription, setRouteDescription] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [cid, setCid] = useState<string>('');
    const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState<string>('ETH');
    const [currencyValue, setCurrencyValue] = useState<string>('0.1');
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();
    const storage = getStorage();

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().userName);
                }
            }
        };

        fetchUserName();
    }, [auth]);

    const handleCidReceived = (receivedCid: string) => {
        setCid(receivedCid);
    }

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
    };

    const isFormComplete = () => {
        return (
            selectedFiles.length > 0 &&
            routeName.trim() !== '' &&
            routeDescription.trim() !== '' &&
            userName.trim() !== '' &&
            cid.trim() !== '' &&
            selectedCryptoCurrency.trim() !== '' &&
            currencyValue.trim() !== ''
        );
    };

    const handleUploadToFirebase = async () => {
        setIsUploading(true);

        const uploadedURLs = [];

        try {
            for (const file of selectedFiles) {
                const storageRef = ref(storage, 'some-path/' + file.name);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                uploadedURLs.push(downloadURL);
            }

            const routesCollection = collection(db, "routes");
            await addDoc(routesCollection, {
                createdBy: userName,
                currentBy: userName,
                selectedCryptoCurrency: selectedCryptoCurrency,
                currencyValue: currencyValue,
                cid: cid,
                imageUrls: uploadedURLs,
                routeName: routeName,
                routeDescription: routeDescription,
            });
            console.log("Document successfully written!");

            resetInputFields();
            navigate('/'); // 適切なパスに変更してください

        } catch (error) {
            console.error("Error uploading to Firebase:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const resetInputFields = () => {
        setSelectedFiles([]);
        setRouteName('');
        setRouteDescription('');
        setCid('');
        setSelectedCryptoCurrency('ETH');
        setCurrencyValue('0.001');
    };

    const cryptoCurrencies = [
        {
            value: 'ETH',
            label: 'Ethereum',
        },
        {
            value: 'ASTR',
            label: 'Astar',
        },
    ];

    const fixedPrices = ['0.001', '0.005', '0.01', '0.05', '0.1'];

    return (
        <>
            <ExhibitHeader />
            <div className="exhibit-container">
                <h2 className="title-text">ルートの出品</h2>
                <div className="setting-route">
                    <h5>ルートの設定</h5>
                    <h3>ピンの数は10個までです。</h3>
                    <div><RouteCreationEdit onCidGenerated={handleCidReceived} /></div>
                </div>
                <div className="route-in-images">
                    <h5>ルート中の画像</h5>
                    <UploadImageButton onFilesSelected={handleFilesSelected} />
                </div>
                <h5>タグ</h5>
                <div>
                    <h2 className="title-text">ルートの詳細</h2>
                    <h5>ルート名</h5>
                    <TextField
                        id="outlined-basic"
                        label="ルート名"
                        variant="outlined"
                        value={routeName}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRouteName(e.target.value)}
                    />

                    <h5>ルートの説明</h5>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="ルートの説明"
                        multiline
                        maxRows={8}
                        value={routeDescription}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRouteDescription(e.target.value)}
                    />

                    <h4>販売価格</h4>
                    <TextField
                        id="outlined-select-crypto"
                        select
                        label="仮想通貨"
                        value={selectedCryptoCurrency}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSelectedCryptoCurrency(e.target.value)}
                        helperText="支払いをする仮想通貨を選択してください。"
                    >
                        {cryptoCurrencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <br /><br />
                    <TextField
                        id="outlined-fixed-price"
                        select
                        label="値段"
                        value={currencyValue}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrencyValue(e.target.value)}
                        helperText="価格を選択してください。"
                    >
                        {fixedPrices.map((price) => (
                            <MenuItem key={price} value={price}>
                                {price}
                            </MenuItem>
                        ))}
                    </TextField>

                    <SubmitRouteButton onClick={handleUploadToFirebase} disabled={isUploading || !isFormComplete()} />
                </div>
            </div >
        </>
    );
}
