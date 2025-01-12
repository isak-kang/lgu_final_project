import React, { useState, useEffect } from "react";
import axios from "axios";

function MyInfo() {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Authorization failed:", error);
          if (error.response?.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("access_token");
            setUser(null);
          }
        });
    } else {
      // 토큰이 없으면 알림 메시지를 표시하고 로그인 페이지로 리다이렉트
      alert("로그인 정보가 없습니다. 로그인 페이지로 갑니다.");
      window.location.href = "/login";
    }
  }, []);

  if (!user) {
    return null; // 사용자 정보가 로드되기 전에는 아무것도 표시하지 않음
  }

  return (
    <div>
      <h1>어서오세요, {user.name}님</h1>
      <br />
      <h2>기본 정보</h2>
      <p>이름: {user.name}</p>
      <p>생년월일: {user.resident_number}</p>
      <p>주소지: {user.address}</p>
      <br />
      <h2>연락처 정보</h2>
      <p>이메일: {user.email}</p>
      <p>휴대전화: {user.phone_number}</p>
    </div>
  );
}

export default MyInfo;
