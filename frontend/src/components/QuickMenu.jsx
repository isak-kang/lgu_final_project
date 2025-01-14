// components/QuickMenu.jsx
import { useState } from 'react';
import whatIsImage from '../assets/whatIsImage.png';
import bankImage from '../assets/bankImage.png';
import possibleImage from '../assets/possibleImage.png';
import practiceImage from '../assets/practiceImage.png';


const QuickMenu = ({ setChatHistory }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleQuickMenu = (buttonText) => {
        // 사용자가 선택한 버튼의 텍스트를 user-message로 추가
        setChatHistory(prevHistory => [...prevHistory, { 
            role: "user", 
            text: buttonText,
            timestamp: Date.now()
        }]);

        // 선택된 메뉴에 따른 동작
        switch(buttonText) {
            case "다른질문하기":
                setTimeout(() => {
                    setChatHistory(prevHistory => [...prevHistory, {
                        role: "model",
                        type: "card_button",
                        text: "안녕하세요, 청약 도우미 청약이입니다. 무엇을 도와드릴까요?",
                        timestamp: Date.now(),
                        buttons: [
                            { text: "청약이란?", image: whatIsImage },
                            { text: "청약 통장이란?", image: bankImage },
                            { text: "나에게 가능한 청약은?", image: possibleImage },
                            { text: "청약체험 및 연습", image: practiceImage }
                        ]
                    }]);
                }, 600);
                break;
            
            case "자주묻는질문(FAQ)":
            case "청약 용어집":
            case "청약일정":
                setTimeout(() => {
                    setChatHistory(prevHistory => [...prevHistory, { 
                        role: "model", 
                        text: "아직 준비중인 서비스 입니다. 좌측 화면에서 이용해주세요 *^^*",
                        timestamp: Date.now()
                    }]);

                    // 종료 메시지 출력
                    setTimeout(() => {
                        setChatHistory(prev => [...prev, {
                            role: "model",
                            type: "card_button",
                            text: "청약이와의 대화가 도움이 되었나요? 추가 질문이 있다면 언제든지 저에게 질문해주세요.",
                            timestamp: Date.now(),
                            buttons: [
                                { 
                                text: "청약이란?",
                                image: whatIsImage
                                },
                                { 
                                text: "청약 통장이란?",
                                image: bankImage
                                },
                                { 
                                text: "나에게 가능한 청약은?",
                                image: possibleImage
                                },
                                { 
                                text: "청약체험 및 연습",
                                image: practiceImage
                                }
                            ] 
                        }]);                    
                    }, 1000);
                }, 600);
                break;
        }
    };

    const buttons = [
        { id: 1, label: "다른질문하기" },
        { id: 2, label: "자주묻는질문(FAQ)" },
        { id: 3, label: "청약 용어집" },
        { id: 4, label: "청약일정" }
    ];

    return (
        <div className="quick-menu">
            {isOpen && (
                <div className="menu-buttons">
                    {buttons.map((button) => (
                        <button 
                            key={button.id} 
                            className="menu-button"
                            onClick={() => handleQuickMenu(button.label)}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            )}
            
            <button 
                className="toggle-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                메뉴 {isOpen ? '▼' : '▲'}
            </button>
        </div>
    );
};

export default QuickMenu;