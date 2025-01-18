import React, { useState } from "react";
import axios from "axios"; 

function Analysis() {
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [home, setHome] = useState("");
  const [graph, setGraph] = useState(null);
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("region", region);
      formData.append("year", year);
      formData.append("home", home);

      const response = await axios.post(`http://${API_URL}/api/analysis`, formData);
      const { graph } = response.data;

      setGraph(graph);
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("그래프 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>지역 및 년도별 경쟁률 분석</h1>
      <form onSubmit={handleSubmit}>
        {/* 지역 선택 */}
        <label>
          지역 선택:
          <select value={region} style={styles.select} onChange={(e) => setRegion(e.target.value)} required >
            <option value="" disabled>지역 선택</option>
            <option value="강원">강원</option>
            <option value="경기">경기</option>
            <option value="경남">경남</option>
            <option value="경북">경북</option>
            <option value="광주">광주</option>
            <option value="대구">대구</option>
            <option value="대전">대전</option>
            <option value="부산">부산</option>
            <option value="서울">서울</option>
            <option value="세종">세종</option>
            <option value="울산">울산</option>
            <option value="인천">인천</option>
            <option value="전남">전남</option>
            <option value="전북">전북</option>
            <option value="제주">제주</option>
            <option value="충남">충남</option>
          </select>
        </label>

        {/* 년도 선택 */}
        <label>
          년도 선택:
          <select value={year} style={styles.select} onChange={(e) => setYear(e.target.value)} required>
            <option value="" disabled>년도 선택</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </label>

        {/* 청약 선택 */}
        <label>
          청약 선택:
          <select value={home} style={styles.select} onChange={(e) => setHome(e.target.value)} required>
            <option value="" disabled>청약 선택</option>
            <option value="general">일반 공급</option>
            <option value="special">특별 공급</option>
          </select>
        </label>

        <button type="submit">분석</button>
      </form>

      {/* 그래프 결과 */}
      {graph && (
        <div>
          <h2>그래프 결과</h2>
          <img src={`data:image/png;base64,${graph}`} alt="Competition Graph" />
        </div>
      )}
    </div>
  );
}
const styles = {
  select: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "18px", // 글씨 크기 조정
    fontFamily: "'Arial', sans-serif", // 기본 폰트 적용
    lineHeight: "1.5", // 줄 간격을 적당히 조정하여 가독성 향상
    color: "#333",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ced4da",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
    height: "auto", // 높이 자동으로 조정
  },
  selectFocus: {
    borderColor: "#80bdff",
    outline: "none",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
  },
  option: {
    padding: "10px",
    fontSize: "16px", // 옵션 글씨 크기 조정
    fontFamily: "'Arial', sans-serif", // 옵션에 폰트 적용
  },
  selectDisabled: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
};

export default Analysis;
