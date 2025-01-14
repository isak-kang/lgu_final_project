import React, { useState } from "react";
import axios from "axios";

const PasswordUpdate = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("id", id);
        formData.append("password", password);

        try {
            const response = await axios.put(`http://$${API_URL}/api/password_update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage(response.data.complete || "");
            setError("");
        } catch (err) {
            if (err.response) {
                setMessage("");
                setError(err.response.data.error || "입력된 정보가 정확하지 않습니다. 입력 정보를 확인해주세요.");
            } else {
                setMessage("");
                setError("서버에 연결할 수 없습니다. 나중에 다시 시도해주세요.");
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <a>재설정 비밀번호 입력</a>
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <input type="submit" value="입력" className="btn" />
            </form>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <a href="/login">뒤로가기</a>
        </div>
    );
};

export default PasswordUpdate;
