import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import "./RoutesListing.scss";
import defaultImage from "../../assets/images/GoogleMap.png";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../firebase/firebase';

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

interface RoutesListingProps {
    userName?: string;
}

export const RoutesListing: React.FC<RoutesListingProps> = ({ userName }) => {
    // TODO:後で消す確認用
    console.log("RoutesListing is re-rendering with userName:", userName);

    const [routesData, setRoutesData] = useState<RouteData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            let routesQuery;
            if (userName) {
                routesQuery = query(collection(db, "routes"), where("currentBy", "==", userName));
            } else {
                routesQuery = collection(db, "routes");
            }
            const querySnapshot = await getDocs(routesQuery);
            const routes: RouteData[] = querySnapshot.docs.map(doc => doc.data() as RouteData);
            setRoutesData(routes);
        };

        fetchData();
    }, [userName]);


    const handleButtonClick = (cid: string) => {
        navigate(`/route-info/${cid}`);
    }

    const defaultImageUrl = defaultImage; // ここにデフォルトの画像のパスを設定してください

    return (
        <div className="routes-listing">
            {routesData.map((route, index) => (
                <Card
                    key={index}
                    imageUrl={route.imageUrls && route.imageUrls.length > 0 ? route.imageUrls[0] : defaultImageUrl}
                    price={`${route.currencyValue} ${route.selectedCryptoCurrency}`}
                    routeName={route.routeName}
                    onClick={() => handleButtonClick(route.cid)}
                />
            ))}
        </div>
    );
}
