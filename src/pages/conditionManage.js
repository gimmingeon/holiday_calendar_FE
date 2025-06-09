import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCondition } from "../redux/conditionSlice";
import { useEffect, useState } from "react";
import { mergeMeberWithCondition, setMember } from "../redux/memberSlice";
import "../css/conditionManage.css"
import Modal from "react-modal";

export default function ConditionManage() {
    const dispatch = useDispatch();
    const members = useSelector((state) => state.member.members);
    const [memberId, setMemberId] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [memberConditionInfo, setMemberConditionInfo] = useState({});


    useEffect(() => {
        const handleGetMember = async () => {
            try {
                const memberRes = await axios.get('/member');
                const conditionRes = await axios.get('/condition');

                dispatch(mergeMeberWithCondition({ members: memberRes.data, conditions: conditionRes.data }));
            } catch (error) {
                alert(error.response?.data?.message || "멤버 조회에 실패했습니다.")
            }
        }

        handleGetMember();
    }, [dispatch]);

    const weekMap = ["일", "월", "화", "수", "목", "금", "토"];

    const handleOpenModal = (member) => {
        setMemberId(member.id);
        setMemberConditionInfo(member.condition);
        setModalIsOpen(true);
        console.log(memberConditionInfo)
    }

    return (
        <div className="condition-container">
            <div>
                {members.map((member) => {
                    return (
                        <div key={member.id} className="memberCondition-card" onClick={() => handleOpenModal(member)}>
                            <div className="member-name">이름: {member.name}</div>
                            {member.condition ? (
                                <div className="member-condition">
                                    <div><strong>휴일 금지:</strong> {member.condition.notHoliday.map(num => weekMap[+num]).join(', ')}</div>
                                    <div><strong>휴일 금지 권장:</strong> {member.condition.avoidHoliday.map(num => weekMap[+num]).join(', ')}</div>
                                    <div><strong>휴일 연속 금지:</strong> {member.condition.connectNotHoliday}</div>
                                    <div><strong>휴일 연속 금지 권장:</strong> {member.condition.connectAvoidHoliday}</div>
                                </div>
                            ) : (
                                <div className="no-condition">조건 없음</div>
                            )}
                        </div>
                    )
                })}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="조건 넣기"
                overlayClassName="modal-overlay"
                className="modal-content"
            >
                <p>{memberConditionInfo.name}</p>
            </Modal>
        </div>
    )

}