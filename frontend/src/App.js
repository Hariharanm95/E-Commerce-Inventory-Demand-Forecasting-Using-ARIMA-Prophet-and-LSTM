import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useAuth from './hooks/useAuth';


const App = () => {
    const { isLoggedIn, user } = useAuth();

    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Navbar/>
                    <main className="container mx-auto py-8">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/products" element={<ProductsPage/>}/>
                            <Route path="/products/:id" element={<ProductPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/signup" element={<SignupPage/>}/>
                            <Route path="/profile" element={isLoggedIn ? <ProfilePage/> : <LoginPage/>}/>
                            {user && user.isAdmin && <Route path="/admin" element={<AdminDashboard/>}/>}
                        </Routes>
                    </main>
                    <Footer/>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;