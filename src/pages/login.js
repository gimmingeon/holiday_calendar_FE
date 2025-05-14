import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/user/login', {
                email,
                password
            });
            setEmail("");
            setPassword("");
            alert(response.data.message)
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "로그인에 실패했습니다.")
        }
    }

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="id">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">로그인</button>
            </form>
        </div>
    )
}