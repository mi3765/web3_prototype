import React from 'react'
import { Header } from "../../components/Header/Header";
import { RoutesListing } from '../RoutesListing/RoutesListing';
import { Footer } from "../../components/Footer/Footer";
import "./Home.scss";

export const Home = () => {
    return (
        <div>
            <Header />
            <p>おすすめルート</p>
            <RoutesListing />
            <Footer />
        </div >
    )
}
