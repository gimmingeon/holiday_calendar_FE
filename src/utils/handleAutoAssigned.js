import dayjs from "dayjs";
import { addMember } from "../redux/calendarSlice";

export default function handleAutoAssign({
    autoReadyMember, excludeWeekdays, weekMap, weeks, dispatch
}) {
    const excludeWeekIndexes = excludeWeekdays.map(w => weekMap.indexOf(w));
    let dayNum = 0;
    const MAX_ATTEMPTS = 5000;
    let attempts = 0;

    const fullExcluded = weeks
        .map((obj, index) => {
            // 객체에서 값만 꺼냄 -> '2025-05-01' 같은 문자열
            const dateStr = Object.values(obj)[0];
            // 날짜의 요일을 숫자로 반환 (일요일: 0, 월요일: 1, ..., 토요일: 6)
            const weekday = dayjs(dateStr).day();
            return { index, weekday };
        })
        // 제외인 요일 필터링 (요일이 6또는 0인 경우만 필터링)
        .filter(({ weekday }) => excludeWeekIndexes.includes(weekday))
        // index만 추출
        .map(({ index }) => index)

    const shuffleDays = [...weeks].sort(() => Math.random() - 0.5);

    for (let i = 0; i < autoReadyMember.length; i++) {
        for (let j = 0; j < autoReadyMember[i].holiday_count; j++) {

            if (attempts++ > MAX_ATTEMPTS) {
                alert("자동 배정 중단: 조건을 만족할 수 없습니다.");
                return;
            }

            const currentIndex = weeks.indexOf(shuffleDays[dayNum]);

            if (fullExcluded.includes(currentIndex)) {
                dayNum++;
                if (dayNum === shuffleDays.length) {
                    dayNum = 0;
                    shuffleDays.sort(() => Math.random() - 0.5);
                }
                j--; // 같은 멤버 반복
                continue;
            }

            const mates = autoReadyMember[i].mate || [];
            const assignedMembers = shuffleDays[dayNum].member || [];

            // some 함수 : 하나라도 만족하면 true를 반환한다
            const hasMateConflict = mates.some(mateName =>
                assignedMembers.includes(mateName)
            );

            if (hasMateConflict) {
                dayNum++;
                if (dayNum === shuffleDays.length) {
                    dayNum = 0;
                    shuffleDays.sort(() => Math.random() - 0.5);
                }
                j--; // 같은 멤버 반복
                continue;
            }

            if (shuffleDays[dayNum].member?.includes(autoReadyMember[i].name)) {
                dayNum++;
                if (dayNum === shuffleDays.length) {
                    dayNum = 0;
                    shuffleDays.sort(() => Math.random() - 0.5);
                }
                j--; // 같은 멤버 반복
                continue;
            }

            const dayKey = Object.keys(shuffleDays[dayNum]).find(key => key.startsWith("day"));
            const dayIndex = Number(dayKey.replace("day", ""));

            const memberName = autoReadyMember[i].name;


            if (!shuffleDays[dayNum.member]) {
                shuffleDays[dayNum].member = [];
            }
            shuffleDays[dayNum].member.push(memberName);

            dispatch(addMember({ index: dayIndex, memberName }));

            dayNum++;

            if (dayNum === shuffleDays.length) {
                dayNum = 0;
                shuffleDays.sort(() => Math.random() - 0.5);
            }
        }
    }


}