import React, { useState } from "react";
import axios from "axios";

function Analysis() {
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [home, setHome] = useState("");
  const [data, setData] = useState(null); // 데이터를 저장할 상태
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("region", region);
      formData.append("year", year);
      formData.append("home", home);

      const response = await axios.post(`http://${API_URL}/api/analysis`, formData);
      const { data } = response.data; // 서버에서 반환된 데이터 추출

      setData(data); // 데이터 상태 업데이트
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <br />
      <h2>지역 및 연도별 경쟁률 분석</h2>
      <form onSubmit={handleSubmit}>
        {/* 지역 선택 */}
        <label>
          <select value={region} style={styles.select} onChange={(e) => setRegion(e.target.value)} required>
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
          <select value={home} style={styles.select} onChange={(e) => setHome(e.target.value)} required>
            <option value="" disabled>청약 선택</option>
            <option value="general">일반 공급</option>
            <option value="special">특별 공급</option>
          </select>
        </label>

        <button type="submit">분석</button>
      </form>

      {/* 데이터 결과 */}
      {data && (
        <div>
          <h2>결과 데이터</h2>
          <ul style={styles.dataList}>
            {data.map((item, index) => (
              <li key={index}>
                {item["month(`year_month`)"]}월에 경쟁률 {item["general_supply_competition_rate"]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  select: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "18px",
    fontFamily: "'Arial', sans-serif",
    lineHeight: "1.5",
    color: "#333",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ced4da",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
    height: "auto",
  },
  dataList: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "'Arial', sans-serif",
    listStyleType: "disc",
    margin: "20px 0",
    lineHeight: "1.6",
  },
};

export default Analysis;
