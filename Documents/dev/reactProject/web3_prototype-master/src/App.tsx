import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { RouteForm } from './pages/RouteForm/RouteForm';
import { RouteInfo } from './pages/RouteInfo/RouteInfo';
import { Mypage } from './pages/Mypage/Mypage';
import { News } from './pages/News/News';
import { Signin } from './pages/Sign/Signin';
import { Signup } from './pages/Sign/Signup';
import { EditProfile } from './pages/Mypage/EditProfile';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/route-form" element={<RouteForm />} />
          <Route path="/route-info" element={<RouteInfo />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/news" element={<News />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/route-info/:cid" element={<RouteInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
