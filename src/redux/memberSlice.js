import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
    name: 'member',

    initialState: {
        members: [],
        form: {
            name: '',
            role: '',
        }
    },

    reducers: {
        // setMember(state, action) {
        //     // 여기서 payload는 배열임 [{ name: "...", role: "..." }, ...]
        //     state.member = action.payload
        // },
        // addMember(state, action) {
        //     state.member.push(action.payload)
        // },

        // 서버에서 전체 멤버 불러오기기
        setMember: (state, action) => {
            state.members = action.payload;
        },

        // form 입력 값 업데이트
        updateForm(state, action) {
            const { field, value } = action.payload;
            state.form[field] = value;
        },

        // 멤버 하나 추가
        // addMember: (state, action) => {
        //     const { index, memberName } = action.payload;
        //     const targetDay = state.days[index];

        //     if (!targetDay.member.includes(memberName)) {
        //         targetDay.member.push(memberName);
        //     }
        // },
        // 새로 추가
        addMember: (state, action) => {
            state.members.push(action.payload); // 그냥 멤버 리스트에 추가
        },

        // form 초기화
        resetForm(state) {
            state.form = { name: '', role: '' };
        },

        mergeMeberWithCondition: (state, action) => {
            const { members, conditions } = action.payload;

            state.members = members.map(member => {
                const condition = conditions.find(c => c.memberId === member.id);

                return {
                    ...member,
                    condition: condition || null
                };
            });
        }
    }
});

export const { setMember, updateForm, addMember, resetForm, mergeMeberWithCondition } = memberSlice.actions;
export default memberSlice.reducer;