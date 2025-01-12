import React, { useEffect, useState } from "react";
import axios from "axios";

const Terms = () => {
  const [terms, setTerms] = useState([]);
  const [error, setError] = useState("");

  // API 호출
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/term"); // FastAPI 엔드포인트
        setTerms(response.data.terms); // terms 데이터를 상태로 설정
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchTerms();
  }, []);

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>용어 설명</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* 에러 메시지 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Term</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Definition</th>
          </tr>
        </thead>
        <tbody>
          {terms.length > 0 ? (
            terms.map(([term, definition], index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{term}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{definition}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                용어 데이터를 불러오는 중입니다...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Terms;