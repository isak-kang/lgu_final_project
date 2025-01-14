import React, { useState } from "react";
import axios from "axios";

const IdSearch = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/api/id_search",
                new URLSearchParams({ name, email }).toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            setId(response.data.id);
            setError(null);
        } catch (err) {
            if (err.response) {
                // 서버에서 반환한 에러 응답 처리
                setId(null);
                setError(err.response.data.error || "ID를 찾을 수 없습니다. 입력 정보를 확인해주세요.");
            } else {
                // 네트워크 오류 등 처리
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

            <a href="/">뒤로가기</a>
        </div>
    );
};

export default IdSearch;