import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Route, Routes } from 'react-router-dom';
import history from './Config/history';
import NavLeft from './Components/NavLeft';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Operate from './Pages/User/Operate';
import Student from './Pages/User/Student';
import Classes from './Pages/User/Classes';
import Teacher from './Pages/User/Teacher';
import NoAllow from './Pages/NoAllow';
import GoodsAdd from './Pages/Goods/GoodsAdd';
import ContentLayout from './Components/ContentLayout';
import GoodsList from './Pages/Goods/GoodsList';

export default function AppRouter() {
    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='page' element={<ContentLayout />} >
                    <Route path='home' element={<Home />} />
                </Route>
                <Route path='user' element={<ContentLayout />}>
                    <Route path='student' element={<Student />} />
                    <Route path='operate' element={<Operate />} />
                    <Route path='classes' element={<Classes />} />
                    <Route path='teacher' element={<Teacher />} />
                </Route>
                <Route path='noAllow' element={<ContentLayout />} >
                    <Route path="not" element={<NoAllow />} />
                </Route>
                <Route path='goods' element={<ContentLayout />} >
                    <Route path='edit' element={<GoodsAdd />} />
                    <Route path='list' element={<GoodsList />} />
                </Route>
            </Routes>
        </HistoryRouter>
    )
}
