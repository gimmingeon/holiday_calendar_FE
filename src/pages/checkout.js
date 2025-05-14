import { useEffect, useState } from "react";

// 토스 페이먼트에서 제공하는 결제 위젯 sdk에서 결제 ui를 로드하는 함수수
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useDispatch, useSelector } from "react-redux";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 토스에서 발급받은 클라이언트 키
const customerKey = "user_1234"; // 유저 고유값, 회원가입된 사용자라면 DB의 userId 등

export function CheckoutPage() {

    // 결제 ui를 관리하는 객체, 위젯 로딩 후 이 상태에 저장됨됨
    const [paymentWidget, setPaymentWidget] = useState(null);
    // 결제 금액 (초기값 만원)
    const [price, setPrice] = useState(10000);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.member.user);

    useEffect(() => {

        const handleMyInfo = async () => {
            try {

            } catch (error) {

            }
        }
        async function setupWidget() {

            // 토스 결제 위젯을 로드해서 반환
            const widget = await loadPaymentWidget(clientKey, customerKey);

            // 결제 수단을 선택하는 ui를 #payment-method에 렌더링
            widget.renderPaymentMethods("#payment-method", {
                value: price,
                currency: "KRW",
            });

            // 이용약관 동의 ui를 #agreement에 렌더링
            widget.renderAgreement("#agreement");

            // 위젯을 paymentWidget 상태로 저장
            setPaymentWidget(widget);
        }

        setupWidget();
    }, []);

    // 결제 버튼 클릭시 실행행
    const handlePayment = async () => {
        if (!paymentWidget) return;

        try {
            // 실제 결제 창을 띄우는 함수
            // 페이먼트 키는 토스가 만드는 거임 내가 만드는게 아니라
            // /success?paymentKey=xxx&orderId=xxx&amount=xxx 이런 식으로 토스에서 만들어서 붙임
            await paymentWidget.requestPayment({
                // 고유한 주문 id (무작위 문자열 생성)
                orderId: "order_" + Math.random().toString(36).slice(2),
                orderName: "자동 휴일 배정 월정액",
                // 결제 성공/실패 후 돌아갈 페이지
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",

                customerEmail: "user@example.com",
                customerName: "홍길동",
                customerMobilePhone: "01012345678",
            });
        } catch (err) {
            console.error(err);
            alert("결제 실패 또는 취소됨");
        }
    };

    return (
        <div className="checkout">
            <h1>결제 페이지</h1>

            {/* 결제 UI */}
            {/* 위에서 렌더링한 결제 ui 영역 */}
            <div id="payment-method" style={{ marginBottom: "20px" }} />
            {/* 이용약관 */}
            <div id="agreement" style={{ marginBottom: "20px" }} />

            <button onClick={handlePayment}>결제하기</button>
        </div>
    );
}
