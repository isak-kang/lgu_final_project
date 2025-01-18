import React, { useEffect, useState } from "react";
import axios from "axios";

const Terms = () => {
  const [terms, setTerms] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;

  // API 호출
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(`http://${API_URL}/api/term`); // FastAPI 엔드포인트
        setTerms(response.data.terms); // terms 데이터를 상태로 설정
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchTerms();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>용어 설명</h1>
      {error && <p style={styles.errorMessage}>{error}</p>} {/* 에러 메시지 */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.tableHeader, width: "60%" }}>용어</th> {/* 용어 컬럼 확장 */}
            <th style={{ ...styles.tableHeader, width: "40%" }}>개념</th>
          </tr>
        </thead>
        <tbody>
          {terms.length > 0 ? (
            terms.map(([term, definition], index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{term}</td>
                <td style={styles.tableCell}>{definition}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={styles.loadingCell}>
                용어 데이터를 불러오는 중입니다...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// 스타일링 객체
const styles = {
  container: {
    margin: "30px auto",
    padding: "20px",
    maxWidth: "900px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "2.5rem",
    marginBottom: "20px",
    borderBottom: "2px solid #3f51b5",
    paddingBottom: "10px",
  },
  errorMessage: {
    color: "#e74c3c",
    textAlign: "center",
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "14px",
    backgroundColor: "#3f51b5",
    color: "white",
    textAlign: "left",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "1rem",
    backgroundColor: "#f9f9f9",
    transition: "background-color 0.3s ease",
  },
  loadingCell: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: "1rem",
    backgroundColor: "#f0f0f0",
  },
  // 테이블 Hover 효과 추가
  tableRowHover: {
    ":hover": {
      backgroundColor: "#e3f2fd",
    },
  },
};

export default Terms;
