import dayjs from "dayjs";
import { addMember } from "../redux/calendarSlice";
import { useDispatch } from "react-redux";
// 휴일 자동 배정

export default function handleAutoAssign({
    autoReadyMember, excludeWeekdays, weekMap, days, dispatch
}) {

    const assignMember = [];
    let memberNum = 0;
    let dayNum = 0;

    // 휴일의 개수만큼 멤버 곱하기 
    for (let member of autoReadyMember) {
        for (let i = 0; i < member.holiday_count; i++) {
            assignMember.push({ ...member })
        }
    }
    const excludeWeekIndexes = excludeWeekdays.map(w => weekMap.indexOf(w));

    // 제외 요일 추출하기 
    const fullExcluded = days
        .map((obj, index) => {
            const dateStr = Object.values(obj)[0];
            const weekday = dayjs(dateStr).day();
            return { index: index + 1, weekday };
        })
        .filter(({ weekday }) => excludeWeekIndexes.includes(weekday))
        .map(({ index }) => index)

    const shuffleDays = [...Array(days.length).keys()].map(i => i + 1).sort(() => Math.random() - 0.5);

    // 요일 자동 배정
    while (memberNum < assignMember.length) {

        const dayIndex = shuffleDays[dayNum];
        const memberName = assignMember[memberNum].name;

        if (fullExcluded.includes(dayIndex)) {

            dayNum++;
            if (dayNum === shuffleDays.length) {
                dayNum = 0;
                shuffleDays.sort(() => Math.random() - 0.5);
            }
            continue;
        }

        dispatch(addMember({ index: dayIndex, memberName }));

        memberNum = memberNum + 1;
        dayNum = dayNum + 1;

        if (dayNum === shuffleDays.length) {
            dayNum = 0;
            shuffleDays.sort(() => Math.random() - 0.5);
        }

    }
}