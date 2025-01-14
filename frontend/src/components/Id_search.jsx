
import React, { useState } from "react";
import axios from "axios";

const IdSearch = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);

        try {
            const response = await axios.post(`http://${API_URL}/api/id_search`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setId(response.data.id);
            setError(null);
        } catch (err) {
            if (err.response) {
                setId(null);
                setError(err.response.data.error || "ID를 찾을 수 없습니다. 입력 정보를 확인해주세요.");
            } else {
                setId(null);
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
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input type="submit" value="입력" className="btn" />
            </form>

            {id && <p>Your ID: {id}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <a href="/login">뒤로가기</a>
        </div>
    );
};

export default IdSearch;
