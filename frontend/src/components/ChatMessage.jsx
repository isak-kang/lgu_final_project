import ChatbotIcon from "./ChatbotIcon"

const ChatMessage = ({ chat, setChatHistory, generateBotResponse }) => {
  // 현재 시간을 포맷팅하는 함수
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 버튼 클릭 핸들러 추가
  const handleButtonClick = async (buttonText) => {
    // 사용자 메시지 추가
    setChatHistory(prevHistory => [...prevHistory, { 
      role: "user", 
      text: buttonText,
      timestamp: Date.now()
    }]);

    // 생각중... 메시지 추가
    setTimeout(() => {
      setChatHistory(prevHistory => [...prevHistory, { 
        role: "model", 
        text: "생각중...",
        timestamp: Date.now()
      }]);
  
      // 봇 응답 생성 - 직접 배열 생성
      generateBotResponse([{ role: "user", text: buttonText }]);
    }, 600);
  };
  
  // 시나리오 버튼 클릭 핸들러 추가
  const handleScenarioButtonClick = async (nextQuestion) => {
    // 사용자 메시지 추가
    setChatHistory(prevHistory => [...prevHistory, {
      role: "user", 
      text: nextQuestion,
      timestamp: Date.now()
    }]);
  
  
    // 생각중... 메시지 추가
    setTimeout(() => {
      setChatHistory(prevHistory => [...prevHistory, { 
        role: "model", 
        text: "생각중...",
        timestamp: Date.now()
      }]);
  
      // 봇 응답 생성 - 직접 배열 생성
      generateBotResponse([{ role: "user", text: nextQuestion }]);
    }, 600);
  };

  // 메시지 타입에 따른 렌더링
  const renderMessageContent = () => {
    switch(chat.type) {
      case 'card_button':
        return (
          <div className="button-message">
            <p className="message-text">{chat.text}</p>
            <div className="button-container">
              {chat.buttons.map((button, index) => (
                <button key={index} className="message-button" onClick={() => handleButtonClick(button.text)}>
                  {button.image && (
                    <img
                    src={button.image}
                    alt={button.text}
                    className="button-image"
                    />
                  )}
                  <span>{button.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'scenario_button': // 시나리오 버튼 타입
        return (
          <div className="scenario-message">
            <div className="message-content">
              <p className="message-text">{chat.text}</p>
              <div className="scenario-button-container">
                {chat.buttons.map((button, index) => (
                  <button key={index} className="scenario-button" onClick={() => handleScenarioButtonClick(button.nextQuestion)}>
                    {button.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default: //text type
        return <p className="message-text">{chat.text}</p>;
    }
  };

  return (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>
        {chat.role === "model" && <ChatbotIcon />}
        <div className="message-wrapper">
          {renderMessageContent()}
          {chat.role === "model" && <span className="message-time">{formatTime(chat.timestamp)}</span>}
        </div> 
    </div>
  );
};

export default ChatMessage
