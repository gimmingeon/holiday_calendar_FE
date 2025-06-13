import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "../css/memberAutoInput.css"
import { addMember } from "../redux/calendarSlice";
import dayjs from "dayjs";
import handleAutoAssign from "../utils/handleAutoAssign";
import axios from "axios";
import { mergeMemberWithConditionMate } from "../redux/memberSlice";
import { splitMonth } from "../utils/splitMonth";

export default function MemberAutoManage({ days }) {

    const dispatch = useDispatch();
    const members = useSelector((state) => state.member.members);

    const [autoReadyMember, setAutoReadyMember] = useState(members);
    const [searchTerm, setSearchTerm] = useState('');
    const [excludeWeekdays, setExcludeWeekdays] = useState([]);
    const weekMap = ['일', '월', '화', '수', '목', '금', '토'];

    useEffect(() => {
        const handleGetMember = async () => {
            try {
                const memberRes = await axios.get('/member');
                const conditionRes = await axios.get('/condition');
                const mateRes = await axios.get('/mate');

                dispatch(mergeMemberWithConditionMate({
                    members: memberRes.data,
                    conditions: conditionRes.data,
                    mates: mateRes.data
                }));
            } catch (error) {
                alert(error.response?.data?.message || "멤버 조회에 실패했습니다.")
            }
        }

        handleGetMember();
    }, [dispatch])

    if (!members || members.length === 0) {
        return <div>멤버가 없습니다.</div>
    }

    const splitweek = splitMonth(days);

    // 멤버 검색
    const handleFindMember = (e) => {
        const target = members.filter(member =>
            member.name.includes(e) || member.role.includes(e)
        );

        if (target) {
            setAutoReadyMember(target)
        } else {
            // setMessage("존재하지 않는 멤버 또는 직책입니다.");
        }
    }

    // 휴일 추가
    const handlePlusHoliday = (memberId) => {
        // 여기서 prev는 기존의 배열을 의미함 여기서는 기존의 배열을 순회하면서 해당 배열을 수정함
        setAutoReadyMember(prev =>
            prev.map((member) =>
                member.id === memberId
                    ? { ...member, holiday_count: member.holiday_count + 1 }
                    : member
            )
        );
    }

    // 휴일 삭제 
    const handleMinusHoliday = (memberId) => {
        setAutoReadyMember(prev =>
            prev.map((member) =>
                member.id === memberId && member.holiday_count > 0
                    ? { ...member, holiday_count: member.holiday_count - 1 }
                    : member
            )
        );
    }

    // 휴일 전체 추가
    const handleAllPlusHoliday = () => {
        setAutoReadyMember(prev =>
            prev.map((member) => ({
                ...member, holiday_count: member.holiday_count + 1
            }))
        )
    }

    // 휴일 전체 빼기
    const handleAllMinusHoliday = () => {
        setAutoReadyMember(prev =>
            prev.map((member) =>
                member.holiday_count > 0
                    ? { ...member, holiday_count: member.holiday_count - 1 }
                    : member
            )
        )
    }

    // 요일 제외
    const handleExcludeWeek = (week) => {

        const isAlreadyExclude = excludeWeekdays.includes(week);

        if (!isAlreadyExclude && excludeWeekdays.length === 6) {
            alert("모든 요일를 제외할 수 없습니다.");
            return;
        }

        if (!isAlreadyExclude) {
            setExcludeWeekdays([...excludeWeekdays, week]);

        } else {
            setExcludeWeekdays(excludeWeekdays.filter(weeks => weeks !== week))
        }
    }

    return (
        <div className="member-auto-container">
            <h2>자동배정</h2>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="멤버 이름 또는 직책 검색"
            />
            <button onClick={() => handleFindMember(searchTerm)}>검색</button>
            <div>

                <div className="member-auto-controls">
                    휴일 전체 수정
                    <button onClick={() => handleAllPlusHoliday()}>🔺</button>
                    <button onClick={() => handleAllMinusHoliday()}>🔻</button>
                </div>
                <div>제외 요일</div>
                {/* 요일 제외 */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>

                    {weekMap.map((week) => (
                        <button
                            key={week}
                            onClick={() => handleExcludeWeek(week)}
                            className={`weekday-button ${excludeWeekdays.includes(week) ? 'selected' : ''}`}
                        >
                            {week} {excludeWeekdays.includes(week)}
                        </button>
                    ))}
                </div>

                {/* <button onClick={() =>
                    handleAutoAssign({
                        autoReadyMember,
                        excludeWeekdays,
                        weekMap,
                        days,
                        dispatch
                    })}>휴일 자동 배정</button> */}

                {splitweek.map((weeks, index) => {
                    return (
                        <div key={index}>
                            <div button onClick={() =>
                                handleAutoAssign({
                                    autoReadyMember,
                                    excludeWeekdays,
                                    weekMap,
                                    weeks,
                                    dispatch
                                })}>{index + 1}번째 주</div>
                        </div>
                    )
                })}
                {autoReadyMember.map((members, index) => {
                    return (
                        <div
                            key={members.id} className="member-card"
                        >
                            <div>이름 : {members.name}</div>
                            <div>직책 : {members.role}</div>
                            <div>
                                휴일 : {members.holiday_count}
                                <button onClick={() => handlePlusHoliday(members.id)}>🔺</button>
                                <button onClick={() => handleMinusHoliday(members.id)}>🔻</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}