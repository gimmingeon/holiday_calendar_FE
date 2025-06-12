import axios from "axios";
import { useState } from "react";
import "../css/conditionAssign.css"

export default function ConditionInput({ member }) {

    const [notHoliday, setNotHoliday] = useState([]);
    const [avoidHoliday, setAvoidHoliday] = useState([]);
    const [connectNotHoliday, setConnectNotHoliday] = useState(0);
    const [connectAvoidHoliday, setConnectAvoidHoliday] = useState(0);

    const handleRegisterCondition = async () => {

        if (connectAvoidHoliday < connectNotHoliday) {
            alert("휴일 연속 금지는 권장보다 적을수 없습니다.");
            return;
        }

        try {
            const response = await axios.post("/condition", {
                memberId: member.id,
                notHoliday: notHoliday,
                avoidHoliday: avoidHoliday,
                connectNotHoliday: connectNotHoliday,
                connectAvoidHoliday: connectAvoidHoliday
            });
            alert(response.data.message || "조건 등록");

            setNotHoliday([]);
            setAvoidHoliday([]);
            setConnectNotHoliday(0);
            setConnectAvoidHoliday(0);

            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "조건 등록 실패");
        }
    }

    const weekMap = ["일", "월", "화", "수", "목", "금", "토"]

    const handleNotHolidayWeek = (week) => {

        const weekIndex = weekMap.indexOf(week)

        if (notHoliday.includes(weekIndex)) {
            setNotHoliday(notHoliday.filter(x => x !== weekIndex))
        } else {
            setNotHoliday([...notHoliday, weekIndex])
        }
    }

    const handleAvoidHolidayWeek = (week) => {

        const weekIndex = weekMap.indexOf(week)

        if (avoidHoliday.includes(weekIndex)) {
            setAvoidHoliday(avoidHoliday.filter(x => x !== weekIndex))
        } else {
            setAvoidHoliday([...avoidHoliday, weekIndex])
        }
    }

    return (
        <div className="conditionAssign-form">
            <div className="conditionAssign-member-name">이름 : {member.name}</div>


            <label>휴일 금지</label>
            <div className="conditionAssign-weekday-group">
                {weekMap.map((week, idx) => {
                    const weekIndex = weekMap.indexOf(week);
                    const isSelected = notHoliday.includes(weekIndex);

                    return (
                        <div
                            key={`not-${idx}`}
                            className={`conditionAssign-weekday-button ${isSelected ? "selected" : ""}`}
                            onClick={() => handleNotHolidayWeek(week)}
                        >
                            {week}
                        </div>
                    );
                })}
            </div>

            <label>휴일 금지 권장</label>
            <div className="conditionAssign-weekday-group">
                {weekMap.map((week, idx) => {
                    const weekIndex = weekMap.indexOf(week);
                    const isSelected = avoidHoliday.includes(weekIndex);
                    return (
                        <div
                            key={`avoid-${idx}`}
                            className={`conditionAssign-weekday-button ${isSelected ? "selected" : ""}`}
                            onClick={() => handleAvoidHolidayWeek(week)}
                        >
                            {week}
                        </div>
                    );
                })}

            </div>


            <label>휴일 연속 금지</label>
            <input
                type="number"
                min={0}
                max={6}
                value={connectNotHoliday}
                onChange={(e) => setConnectNotHoliday(Number(e.target.value))}
            />

            <label>휴일 연속 금지 권장</label>
            <input
                type="number"
                min={0}
                max={6}
                value={connectAvoidHoliday}
                onChange={(e) => setConnectAvoidHoliday(Number(e.target.value))}
            />

            <button onClick={handleRegisterCondition}>등록</button>
        </div>

    )
}