import React, { useState } from "react";

const IdSearch = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/id_search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ name, email }),
            });

            if (response.ok) {
                const data = await response.json();
                setId(data.id);
                setError(null);
            } else {
                const errorData = await response.json();
                setId(null);
                setError(errorData.error || "ID를 찾을 수 없습니다. 입력 정보를 확인해주세요.");
            }
        } catch (err) {
            setId(null);
            setError("서버에 연결할 수 없습니다. 나중에 다시 시도해주세요.");
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
