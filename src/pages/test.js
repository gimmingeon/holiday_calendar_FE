import Modal from "react-modal";
import { useState } from "react";

Modal.setAppElement("#root");

export default function TestModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>모달 열기</button>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                <h2>테스트 모달입니다!</h2>
                <button onClick={() => setIsOpen(false)}>닫기</button>
            </Modal>
        </div>
    );
}
