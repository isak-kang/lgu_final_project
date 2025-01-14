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
      <p>{API_URL}</p>
      <h1>지역 및 년도별 경쟁률 분석</h1>
      <form onSubmit={handleSubmit}>
        {/* 지역 선택 */}
        <label>
          지역 선택:
          <select value={region} onChange={(e) => setRegion(e.target.value)} required>
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
          <select value={year} onChange={(e) => setYear(e.target.value)} required>
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
          <select value={home} onChange={(e) => setHome(e.target.value)} required>
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

export default Analysis;
