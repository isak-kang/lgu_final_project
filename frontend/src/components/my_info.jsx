import React, { useState, useEffect } from "react";
import axios from "axios";


function MyInfo() {
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`http://${API_URL}/api/protected`, {
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
            window.location.href = "/login";
          }
        });
    } else {
      setUser(null);
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