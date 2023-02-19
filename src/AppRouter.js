import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavLeft from './Components/NavLeft';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Student from './Pages/User/Student';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='page' element={<NavLeft />} >
                    <Route path='home' element={<Home />} />
                </Route>
                <Route path='user' element={<NavLeft />}>
                    <Route path='student' element={<Student />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
