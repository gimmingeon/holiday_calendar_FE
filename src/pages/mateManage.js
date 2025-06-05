import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMate } from "../redux/mateSlice";
import { setMember } from "../redux/memberSlice"
import "../css/mateManage.css"

export default function MateManage() {

    const dispatch = useDispatch();
    const mates = useSelector((state) => state.mate.mates);
    const members = useSelector((state) => state.member.members)
    const [registeMate, setRegisteMate] = useState([]);

    const handleGetMate = async () => {
        try {
            const response = await axios.get('/mate');
            dispatch(setMate(response.data));
        } catch (error) {
            alert("짝 조회 실패");
        }
    };

    // 멤버, 짝 데이터 불러오기
    useEffect(() => {

        const handleGetMember = async () => {
            try {
                const response = await axios.get('/member');
                dispatch(setMember(response.data));
            } catch (error) {
                alert("멤버 조회 실패");
            }
        }

        handleGetMate();
        handleGetMember();
    }, [dispatch]);

    // 짝 만들기
    const handleRegisterMate = async () => {

        if (!(registeMate.length == 2)) {
            alert("등록할 짝은 2명이야 합니다.");
            return;
        }
        try {
            await axios.post('/mate', {
                memberAId: registeMate[0],
                memberBId: registeMate[1]
            }, { withCredentials: true }
            );

            alert("짝이 등록되었습니다!");
            setRegisteMate([]); // 등록 후 상태 초기화
            handleGetMate();
        } catch (error) {
            alert("짝 등록에 실패했습니다.");
        }

    }

    // 짝 지정하기
    const handlePlusRegisteMate = (member) => {
        if (registeMate.includes(member.id)) {
            setRegisteMate(registeMate.filter(id => id !== member.id));
        } else if (registeMate.length >= 2) {
            alert("짝은 2명씩 가능합니다.")
            return;
        } else {
            setRegisteMate([...registeMate, member.id])
        }
    }

    const handleDeleteMate = async (mate) => {
        console.log(mate)
        try {
            const response = await axios.delete('/mate', {
                data: { id: mate }
            });
            alert(response.data.message);
            handleGetMate();
        } catch (error) {
            alert("짝 삭제에 실패했습니다.");
        }
    }

    return (
        <div className="mate-container">
            <h2 className="section-title">짝 만들기</h2>

            <div className="selected-mates">
                {registeMate.map((mateId) => {
                    const member = members.find((m) => m.id === mateId);
                    return (
                        <div key={mateId} className="selected-mate-card">
                            {member?.name || mateId}
                        </div>
                    );
                })}

            </div>

            <button className="register-button" onClick={handleRegisterMate}>
                짝 등록하기
            </button>

            <h3 className="section-title">멤버 목록</h3>

            <div className="member-list">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className={`member-card ${registeMate.includes(member.id) ? "selected" : ""}`}
                        onClick={() => handlePlusRegisteMate(member)}
                    >
                        {member.name}
                    </div>
                ))}
            </div>


            <h3 className="section-title">등록된 짝</h3>
            <div className="mate-list">
                {mates.map((mate) => (
                    <div key={mate.id} className="mate-card">

                        <div>멤버 1: {mate.member1Name}</div>
                        <div>멤버 2: {mate.member2Name}</div>
                        <div onClick={() => handleDeleteMate(mate.id)}>짝 삭제</div>
                    </div>
                ))}
            </div>

        </div>
    )
}