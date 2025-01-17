import React, { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

function MyInfo() {
  const { user } = useContext(UserContext);

  if (!user) {
    alert("로그인 정보가 없습니다. 로그인 페이지로 갑니다.");
    window.location.href = "/login";
  }

  return <UserInfoView user={user} />;
}

const UserInfoView = ({ user }) => (
  <div>
    <h1>어서오세요, {user?.name || "사용자"}님</h1>
    <br />
    <h2>기본 정보</h2>
    <p>이름: {user?.name || "정보 없음"}</p>
    <p>생년월일: {user?.resident_number || "정보 없음"}</p>
    <p>주소지: {user?.address || "정보 없음"}</p>
    <br />
    <h2>연락처 정보</h2>
    <p>이메일: {user?.email || "정보 없음"}</p>
    <p>휴대전화: {user?.phone_number || "정보 없음"}</p>
  </div>
);

export default MyInfo;