import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCondition } from "../redux/conditionSlice";
import { useEffect } from "react";
import { setMember } from "../redux/memberSlice";

export default function ConditionManage() {
    const dispatch = useDispatch();
    const members = useSelector((state) => state.member.members);
    const condition = useSelector((state) => state.condition.conditions);

    const handleGetCondition = async () => {
        try {
            const response = await axios.get('/condition');
            dispatch(setCondition(response.data));
        } catch (error) {
            alert("조건 조회 실패");
        }
    };

    useEffect(() => {
        const handleGetMember = async () => {
            try {
                const response = await axios.get('/member');
                dispatch(setMember(response.data));
            } catch (error) {
                alert("멤버 조회 실패");
            }
        }

        handleGetCondition();
        handleGetMember();
    }, [dispatch]);

    return (
        <div>
            <div>
                {members.map((member) => {
                    <div>
                        {member.name};
                    </div>
                })}
            </div>
        </div>
    )
}