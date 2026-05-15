import React from 'react';
import Navbar from '../../components/shared/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/shared/footer/Footer';

const AuthLayout = () => {
    return (
        <div>

            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            
        </div>
    );
};

export default AuthLayout;