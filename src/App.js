
import { Route, Router, Routes, Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Calendar from './pages/calendar';
import './css/sidebar.css'
import MemberManage from './pages/memberManage';
import Modal from "react-modal";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Login from './pages/login';
import SignUp from './pages/signUp';
import "./css/app.css"
import { CheckoutPage } from './pages/checkout';
import { SuccessPage } from './pages/paymentSuccess';
import { FailPage } from './pages/paymentFail';
import MateManage from './pages/mateManage';

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
      <Navbar className='navbar'>
        <Container>
          <Navbar.Brand href='/' className='nav-button'>휴일 자동 배정</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/" className='nav-button'>홈</Nav.Link>
            <Nav.Link href="/member" className='nav-button'>멤버 관리</Nav.Link>
            <Nav.Link href="/checkout" className='nav-button'>결제</Nav.Link>
          </Nav>
          <Nav>
            {isLogin ? (
              <button className="auth-button" onClick={handleLogOut}>로그아웃</button>
            ) : (
              <>
                <button className="auth-button" onClick={() => navigate('/login')}>로그인</button>
                <button className="auth-button" onClick={() => navigate('/signUp')}>회원가입</button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>


      <Routes>
        <Route path='/' element={<Calendar />} />
        <Route path='/login' element={<Login />} />
        <Route path='/member' element={<MemberManage />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/checkout' element={<CheckoutPage />}></Route>
        <Route path='/success' element={<SuccessPage />} />
        <Route path='/fail' element={<FailPage />} />
        <Route path='/mate' element={<MateManage />} />
      </Routes>
    </div>
  );
}

export default App;
