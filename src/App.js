
import { Route, Router, Routes, Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Calendar from './pages/calendar';
import './css/sidebar.css'
import MemberManage from './pages/memberManage';
import TestModal from './pages/test';
import Modal from "react-modal";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Login from './pages/login';
import SignUp from './pages/signUp';
import "./css/app.css"

Modal.setAppElement("#root");

function App() {

  let navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['Authorization']);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (cookies.Authorization) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [cookies.Authorization]);

  const handleLogOut = () => {
    removeCookie('Authorization');
    setIsLogin(false);
  }

  return (
    <div className="App">
      <div className="auth-buttons">
        {isLogin ? (
          <button className="auth-button" onClick={handleLogOut}>로그아웃</button>
        ) : (
          <>
            <button className="auth-button" onClick={() => navigate('/login')}>로그인</button>
            <button className="auth-button" onClick={() => navigate('/signUp')}>회원가입</button>
          </>
        )}
      </div>


      <Routes>
        <Route path='/' element={<Calendar />} />
        <Route path='/login' element={<Login />} />
        <Route path='/member' element={<MemberManage />} />
        <Route path='/test' element={<TestModal />} />
        <Route path='/signUp' element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
