import React, { useEffect, useState } from "react";
import axios from "axios";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]); // FAQ 데이터 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // FAQ 데이터를 가져오는 함수
    const fetchFAQs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/faq");
        setFaqs(response.data.terms); // API의 'terms' 배열을 상태에 저장
      } catch (err) {
        setError("FAQ 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchFAQs();
  }, []);

  // 클릭 시 답변을 토글하는 함수
  const toggleAnswer = (index) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq, i) =>
        i === index ? { ...faq, isOpen: !faq.isOpen } : faq
      )
    );
  };

  return (
    <div className="faq-container">
      <h1>FAQ</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="question"
              onClick={() => toggleAnswer(index)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Q: {faq[0]} {/* question */}
            </div>
            {faq.isOpen && (
              <div className="answer" style={{ color: "#555", marginTop: "5px" }}>
                A: {faq[1]} {/* answer */}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FAQ;
