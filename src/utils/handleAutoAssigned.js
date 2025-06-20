import dayjs from "dayjs";
import { addMember } from "../redux/calendarSlice";

export default function handleAutoAssign({
    autoReadyMember, excludeWeekdays, weekMap, weeks, dispatch
}) {
    const excludeWeekIndexes = excludeWeekdays.map(w => weekMap.indexOf(w));
    let dayNum = 0;
    let attempts = 0;
    let notHoliday = [];
    let connectNotHoliday = 0;

    const weekMapNumber = weeks
        .map((obj, index) => {
            // 객체에서 값만 꺼냄 -> '2025-05-01' 같은 문자열
            const dateStr = Object.values(obj)[0];
            // 날짜의 요일을 숫자로 반환 (일요일: 0, 월요일: 1, ..., 토요일: 6)
            const weekday = dayjs(dateStr).day();
            return { index, weekday };
        });

    const fullExcluded = weekMapNumber
        // 제외인 요일 필터링 (요일이 6또는 0인 경우만 필터링)
        .filter(({ weekday }) => excludeWeekIndexes.includes(weekday))
        // index만 추출
        .map(({ index }) => index)

    const shuffleDays = [...weeks].sort(() => Math.random() - 0.5);

    const moveNextDay = () => {
        dayNum++;
        if (dayNum === shuffleDays.length) {
            dayNum = 0;
            shuffleDays.sort(() => Math.random() - 0.5);
        }
    };

    for (let i = 0; i < autoReadyMember.length; i++) {

        if (autoReadyMember[i].condition?.notHoliday) {
            notHoliday = autoReadyMember[i].condition.notHoliday.map(Number);
        }

        if (autoReadyMember[i].condition?.connectNotHoliday) {
            connectNotHoliday = autoReadyMember[i].condition?.connectNotHoliday;
        }

        for (let j = 0; j < autoReadyMember[i].holiday_count; j++) {

            attempts++;

            if (attempts > 10000) {
                alert("자동 배정 중단: 조건을 만족할 수 없습니다.");
                return;
            }

            const currentDay = shuffleDays[dayNum];
            const currentDateStr = Object.values(currentDay)[0];
            const currentIndex = weeks.indexOf(currentDay);
            const currentDate = dayjs(currentDateStr);
            const assignedMembers = currentDay.member || [];
            const memberName = autoReadyMember[i].name;

            if (connectNotHoliday > 0 && attempts <= 5000) {
                const assignedDatesForMember = shuffleDays
                    .filter(day => (day.member || []).includes(memberName))
                    .map(day => dayjs(Object.values(day)[0]));

                const hasConnectConflict = assignedDatesForMember.some(date =>
                    Math.abs(currentDate.diff(date, 'day')) <= connectNotHoliday - 1
                );

                // 연속 휴일 금지
                if (hasConnectConflict) {
                    moveNextDay();
                    j--; // 같은 멤버 반복
                    continue;
                }

                // 개인 휴일 금지
                if (notHoliday.includes(currentIndex)) {
                    moveNextDay();
                    j--; // 같은 멤버 반복
                    continue;
                }
            }

            if (connectNotHoliday > 0 && attempts > 5000 && attempts <= 5001) {
                alert("휴일 지양 모드 변경")
            }

            // 제외 요일
            if (fullExcluded.includes(currentIndex)) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }

            const mates = autoReadyMember[i].mate || [];

            // some 함수 : 하나라도 만족하면 true를 반환한다
            const hasMateConflict = mates.some(mateName =>
                assignedMembers.includes(mateName)
            );

            if (hasMateConflict) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }

            if (currentDay.member?.includes(autoReadyMember[i].name)) {
                moveNextDay();
                j--; // 같은 멤버 반복
                continue;
            }

            const dayKey = Object.keys(currentDay).find(key => key.startsWith("day"));
            const dayIndex = Number(dayKey.replace("day", ""));

            if (!shuffleDays[dayNum.s]) {
                currentDay.member = [];
            }
            currentDay.member.push(memberName);

            dispatch(addMember({ index: dayIndex, memberName }));

            dayNum++;

            if (dayNum === shuffleDays.length) {
                dayNum = 0;
                shuffleDays.sort(() => Math.random() - 0.5);
            }
        }
    }


}