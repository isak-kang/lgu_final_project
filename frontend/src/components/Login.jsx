import React, { useState } from "react";
import axios from "axios"; // Axios import
import { Link } from 'react-router-dom';


const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 에러 메시지 초기화
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", password);

    try {
      const response = await axios.post(`http://${API_URL}/api/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData를 보내는 경우 설정
        },
      });
    
      if (response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem("access_token", token); // 로컬 스토리지에 저장
        window.location.href = "/"; // 로그인 성공 후 페이지 이동
      } else if (response.data.error) {
        setError(response.data.error); // 서버에서 반환된 에러 메시지
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again later." // 일반 오류 메시지
      );
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }};

    return (
      
      <div style={styles.centeredContainer}>
        <div className="login-container" style={styles.formContainer}>
          <form onSubmit={handleLogin} >
            <table>
              <tbody>
                <tr>
                  <td>
                    <h2>로그인</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="ID"
                      name="id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="login-input"
                  />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" /> 로그인 정보 저장
                  </td>
                </tr>
                {error && (
                  <tr>
                    <td>
                      <p style={{ color: "red" }}>{error}</p>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <button type="submit" className="btn" disabled={isLoading}>
                      {isLoading ? "Loading..." : "Sign in"}
                    </button>
                  </td>
                </tr>
                <tr>
                <td className="join" > 
                  <Link to="/join" className="btn btn-primary" style={{ backgroundColor: "#57b6fe", border: "none" }}>
                    회원가입
                  </Link>
                </td>
                <td className="id_search">
                  <Link to="/id_search" className="btn btn-primary" style={{ backgroundColor: "#57b6fe", border: "none" }}>
                    아이디<br />찾기
                  </Link>
                </td>  
                <td className="password_change">
                  <Link to="/password_update" className="btn btn-primary" style={{ backgroundColor: "#57b6fe", border: "none" }}>
                  비밀번호<br />재설정
                  </Link>
                </td>                    
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  };
  
  // 스타일 정의
  const styles = {
    centeredContainer: {
      display: "flex",
      justifyContent: "center", // 가로 중앙 정렬
      alignItems: "center", // 세로 중앙 정렬
      height: "100vh", // 화면 전체 높이
    },
    formContainer: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      minWidth: "300px", // 최소 너비 설정
      maxWidth: "400px", // 최대 너비 설정
      width: "100%",
    },
  };

export default Login;
