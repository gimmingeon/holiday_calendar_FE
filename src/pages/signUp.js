import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/signup.css"

export default function SignUp() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user', {
                email,
                password,
                name,
                phoneNumber
            });
            alert(response.data.message)
            setEmail("");
            setPassword("");
            setName("");
            setPhoneNumber('');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "회원가입에 실패했습니다.");
        }
    }

    return (
        <div className="signup-container">
            <h1>회원가입</h1>

            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="id">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>이름</label>
                    <input
                        id="name"
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>핸드폰 번호</label>
                    <input
                        id="phoneNumber"
                        type="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}