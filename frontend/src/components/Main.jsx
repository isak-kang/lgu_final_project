import { useRef, useState, useEffect } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm"
import ChatMessage from "./ChatMessage"
import QuickMenu from "./QuickMenu";
import { Link } from 'react-router-dom';


// import whatIsImage from './assets/whatIsImage.png';
// import bankImage from './assets/bankImage.png';
// import possibleImage from './assets/possibleImage.png';
// import practiceImage from './assets/practiceImage.png';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
// 


const Main = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [noResponseCount, setNoResponseCount] = useState(0);
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const chatBodyRef = useRef();
  const [apt_upcoming_data, setAptUpcoming] = useState(null);
  const [unranked_upcoming_data, setUnrankedUpcoming] = useState(null);
  const [apt_grouped_data, setAptCompetition] = useState(null);
  const [unranked_grouped_data, setUnrankedCompetition] = useState(null);
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;

  // Reset activity timer
  const resetActivityTimer = () => {
    setLastActivityTime(Date.now());
    setNoResponseCount(0);
  };


  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalData, setModalData] = useState(null); // 모달에 표시할 데이터

  // API 호출 및 모달 열기
  const handleButtonClick = async (apartmentName) => {
    try {
      const response = await fetch(`http://${API_URL}/api/detail/${encodeURIComponent(apartmentName)}`);
      const data = await response.json();

      if (response.ok) {
        setModalData(data.grouped_data); // grouped_data가 리스트 형태여야 함
        setIsModalOpen(true);
      } else {
        alert(data.error || "정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching competition data:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };



  // Welcome message for chatbot
  useEffect(() => {
    if (showChatbot) {
      setTimeout(() => {
        setChatHistory([
          {
            role: "model",
            text: "안녕하세요, 청약 도우미 청약이입니다. 현재 청약 관련 FAQ와 최근 1년간의 청약 정보를 제공해드리고 있습니다. 특히 신혼부부 및 생애최초 특별공급 관련 상세 정보를 확인하실 수 있습니다.",
          },
          {
            role: "model",
            type: "card_button",
            text: "안녕하세요, 청약 도우미 청약이입니다. 무엇을 도와드릴까요?",
            buttons: [
              { text: "청약이란?", image: "path_to_image" },
              { text: "청약 통장이란?", image: "path_to_image" },
              { text: "나에게 가능한 청약은?", image: "path_to_image" },
              { text: "청약체험 및 연습", image: "path_to_image" },
            ],
            timestamp: Date.now(),
          },
        ]);
      }, 500);
    }
  }, [showChatbot]);

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



  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await axios.post(`http://${API_URL}/api/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to log out from the server:", error);
      }
    }

    // 토큰 삭제 및 페이지 리디렉션
    localStorage.removeItem("access_token");
    
    window.location.href = "/";
  };


  // Handle inactivity timer
  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime - lastActivityTime > 180000) {
        if (noResponseCount === 0) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: "model",
              text: "청약이가 답변을 기다리고 있어요. 더 이어나가길 원하는 경우 질문을 입력해주세요.",
              timestamp: Date.now(),
            },
          ]);
          setNoResponseCount(1);
          setLastActivityTime(Date.now());
        } else if (noResponseCount === 1 && currentTime - lastActivityTime > 60000) {
          setChatHistory((prev) => [
            ...prev,
            {
              role: "model",
              type: "card_button",
              text: "청약이와의 대화가 도움이 되었나요? 추가 질문이 있다면 언제든지 저에게 질문해주세요.",
              buttons: [
                { text: "청약이란?", image: "path_to_image" },
                { text: "청약 통장이란?", image: "path_to_image" },
                { text: "나에게 가능한 청약은?", image: "path_to_image" },
                { text: "청약체험 및 연습", image: "path_to_image" },
              ],
              timestamp: Date.now(),
            },
          ]);
          clearInterval(inactivityTimer);
          setNoResponseCount(2);
        }
      }
    }, 10000);

    return () => clearInterval(inactivityTimer);
  }, [lastActivityTime, noResponseCount]);

  // Fetch news data
  useEffect(() => {
    axios
      .get(`http://${API_URL}/api/news`)
      .then((response) => {
        const { news } = response.data;
        setNews(news);
      })
      .catch((error) => console.error("데이터를 가져오는 중 오류 발생:", error));
  }, []);


  // Fetch news data
  useEffect(() => {
    axios
      .get(`http://${API_URL}/api/upcoming`)
      .then((response) => {
        const { apt_upcoming_data,unranked_upcoming_data } = response.data;
        setAptUpcoming(apt_upcoming_data);
        setUnrankedUpcoming(unranked_upcoming_data);
      })
      .catch((error) => console.error("데이터를 가져오는 중 오류 발생:", error));
  }, []);

  // Fetch user data
  useEffect(() => {
    axios
      .get(`http://${API_URL}/api/competition`)
      .then((response) => {
        const { apt_grouped_data,unranked_grouped_data } = response.data;
        setAptCompetition(apt_grouped_data);
        setUnrankedCompetition(unranked_grouped_data);
      })
      .catch((error) => console.error("데이터를 가져오는 중 오류 발생:", error));
  }, []);  

  // Auto-scroll when chat history updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) =>
        [...prev.filter((msg) => msg.text !== "생각중..."),
        { role: "model", text, isError, timestamp: Date.now() }]
      );
    };

    try {
      const response = await fetch(`http://${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: history[history.length - 1].text }),
      });

      if (!response.ok) throw new Error("서버 응답 오류");
      const data = await response.json();
      updateHistory(data.response);
    } catch (error) {
      updateHistory("죄송합니다. 오류가 발생했습니다.", true);
    }
  };

  return (
    <div>

   <br /><br /><br /><br />

   <div className="d-flex justify-content-between align-items-start" style={{ maxWidth: "1600px", margin: "auto", gap: "20px" }}>
     {/* News Carousel */}
     <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel" style={{ flex: 2, maxWidth: "1050px" }}>
       <div className="carousel-inner">
         {news.map((item, index) => (
           <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
             <div
               className="card d-flex flex-row align-items-center"
               style={{
                 width: "100%",
                 margin: "auto",
                 position: "relative",
                 padding: "15px",
               }}
             >
               <a
                 href={item.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ flex: 1, textDecoration: "none" }}
               >
                 <img
                   src={item.image}
                   className="card-img-left"
                   alt={item.title}
                   style={{
                     width: "350px",
                     height: "350px",
                     objectFit: "cover",
                     borderRadius: "5px",
                   }}
                 />
               </a>
               <div className="card-body" style={{ flex: 2, paddingLeft: "20px" }}>
                 <a
                   href={item.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="card-title"
                   style={{
                     fontWeight: "bold",
                     fontSize: "1.5rem",
                     textDecoration: "none",
                     color: "#333",
                   }}
                 >
                   {item.title}
                 </a>
                 <p
                   className="card-text"
                   style={{
                     fontSize: "1rem",
                     color: "#555",
                     marginTop: "10px",
                   }}
                 >
                   {item.description}
                 </p>
               </div>
             </div>
           </div>
         ))}
       </div>

       <button
         className="carousel-control-prev"
         type="button"
         data-bs-target="#carouselExampleAutoplaying"
         data-bs-slide="prev"
         style={{
           position: "absolute",
           top: "150px",
           padding: "4px 6px",
           width: "40px",
           height: "40px",
           backgroundColor: "#6a75ca",
           color: "white",
           borderRadius: "50%",
           fontSize: "14px",
         }}
       >
         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
         <span className="visually-hidden">Previous</span>
       </button>

       <button
         className="carousel-control-next"
         type="button"
         data-bs-target="#carouselExampleAutoplaying"
         data-bs-slide="next"
         style={{
           position: "absolute",
           top: "150px",
           padding: "4px 6px",
           width: "40px",
           height: "40px",
           backgroundColor: "#6a75ca",
           color: "white",
           borderRadius: "50%",
           fontSize: "14px",
         }}
       >
         <span className="carousel-control-next-icon" aria-hidden="true"></span>
         <span className="visually-hidden">Next</span>
       </button>
     </div>

     {/* Login/User Card */}
     <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, maxWidth: "450px", height: "40vh", textAlign: "center" }}>
       <div className="card" style={{ width: "100%" }}>
         <div className="card-body">
           {user ? (
             <>
               <h5 className="card-title">어서오세요. {user.name}님</h5>
               <p className="card-text">많은 청약 정보를 탐색해 보세요!!</p>
               <a href="#" className="btn btn-primary" onClick={handleLogout}>
                로그아웃
              </a>
             </>
           ) : (
             <>
               <h5 className="card-title">로그인이 필요합니다</h5>
               <p className="card-text">내게 필요한 청약을 알아보세요</p>
               <Link to="/login">로그인</Link>

             </>
           )}
         </div>
       </div>
     </div>
   </div>

   <div 
  className="d-flex flex-wrap justify-content-around" 
  style={{ 
    maxWidth: "1600px", margin: "40px auto", gap: "20px", display: "flex", justifyContent: "center", alignItems: "center",  }}>

  <div className="container" style={{ maxWidth: "750px", margin: "auto", border: "2px solid #6a75ca", borderRadius: "10px", padding: "15px", backgroundColor: "#f9f9f9" }}>
  <h3 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.5rem" }}>최신 경쟁률</h3>
  <div className="d-flex justify-content-around flex-wrap" style={{ gap: "15px" }}>
  <div id="apt_competiton" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "250" }}>
    <h4 style={{ textAlign: "center", marginBottom: "8px", fontWeight: "bold", color: "#6a75ca", fontSize: "1.2rem" }}>아파트</h4>
    <div className="carousel-inner">
      {apt_grouped_data && apt_grouped_data.map((group, index) => (
        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
          <div className="card" style={{ width: "14rem", margin: "auto" }}>
            <div className="card-body">
              <a
                style={{ textDecoration: "none", color: "inherit", fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {group.apartment_name}
              </a>
              <br /><br />
              <div><p style={{ fontSize: "0.9rem" }}>경쟁률: {group.total_competition_rate}</p></div>
              <div><p style={{ fontSize: "0.9rem" }}>상태: {group.application_result}</p></div>
              <button
                onClick={() => handleButtonClick(group.apartment_name)}
                style={{
                  backgroundColor: "#6a75ca",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                더보기
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
{isModalOpen && (
  <div className="modal" style={modalStyles.modal}>
    <div style={modalStyles.modalContent}>
      <button onClick={closeModal} style={modalStyles.closeButton}>
        &times;
      </button>
      <h2>{modalData?.apartment_name}</h2>
      <div style={{ width: "100%", overflowX: "auto", marginTop: "20px" }}>
        {/* modalData에 HTML 테이블이 포함된 경우 */}
        <div dangerouslySetInnerHTML={{ __html: modalData }} />
      </div>
    </div>
  </div>
)}
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#apt_competiton"
      data-bs-slide="prev"
      style={{
        position: "absolute",
        top: "60px",
        padding: "4px 6px",
        width: "25px",
        height: "25px",
        backgroundColor: "#6a75ca",
        color: "white",
        borderRadius: "50%",
        fontSize: "10px",
      }}
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#apt_competiton"
      data-bs-slide="next"
      style={{
        position: "absolute",
        top: "60px",
        padding: "4px 6px",
        width: "25px",
        height: "25px",
        backgroundColor: "#6a75ca",
        color: "white",
        borderRadius: "50%",
        fontSize: "10px",
      }}
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>


<div className="d-flex justify-content-around flex-wrap" style={{ gap: "20px" }}>
<div id="unranked_competiton" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "300px" }}>
  <h4 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold", color: "#6a75ca" }}>무순위</h4>
  <div className="carousel-inner">
    {unranked_grouped_data && unranked_grouped_data.map((group, index) => (
      <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
        <div className="card" style={{ width: "14rem", margin: "auto" }}>
          <div className="card-body">
            <a
              style={{ textDecoration: "none", color: "inherit", fontSize: "1.2rem", fontWeight: "bold" }}
            >
              {group.apartment_name}
            </a>
            <br /><br />
            <div><p style={{ fontSize: "0.9rem" }}>경쟁률: {group.total_competition_rate}</p></div>
            <div><p style={{ fontSize: "0.9rem" }}>상태: {group.application_result}</p></div>
            <button
              onClick={() => handleButtonClick(group.apartment_name)}
              style={{
                backgroundColor: "#6a75ca",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "5px",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              더보기
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
{/* 모달 */}
{isModalOpen && (
  <div className="modal" style={modalStyles.modal}>
    <div style={modalStyles.modalContent}>
      <button onClick={closeModal} style={modalStyles.closeButton}>
        &times;
      </button>
      <h2>{modalData?.apartment_name}</h2>
      <div style={{ width: "100%", overflowX: "auto", marginTop: "20px" }}>
        {/* modalData에 HTML 테이블이 포함된 경우 */}
        <div dangerouslySetInnerHTML={{ __html: modalData }} />
      </div>
    </div>
  </div>
)}
  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#unranked_competiton"
    data-bs-slide="prev"
    style={{
      position: "absolute",
      top: "60px",
      padding: "4px 6px",
      width: "25px",
      height: "25px",
      backgroundColor: "#6a75ca",
      color: "white",
      borderRadius: "50%",
      fontSize: "10px",
    }}
  >
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#unranked_competiton"
    data-bs-slide="next"
    style={{
      position: "absolute",
      top: "60px",
      padding: "4px 6px",
      width: "25px",
      height: "25px",
      backgroundColor: "#6a75ca",
      color: "white",
      borderRadius: "50%",
      fontSize: "10px",
    }}
  >
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
</div>
</div>
</div>

<div className="container" style={{ maxWidth: "750px", margin: "auto", border: "2px solid #6a75ca", borderRadius: "10px", padding: "15px", backgroundColor: "#f9f9f9" }}>
    <h3 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.5rem" }}>다가올 청약</h3>
    <div className="d-flex justify-content-around flex-wrap" style={{ gap: "15px" }}>
      <div id="apt_upcoming_applications" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "250px" }}>
        <h4 style={{ textAlign: "center", marginBottom: "8px", fontSize: "1.2rem", fontWeight: "bold", color: "#6a75ca" }}>아파트</h4>
        <div className="carousel-inner">
        {apt_upcoming_data && apt_upcoming_data.map((group, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <div className="card" style={{ width: "14rem", margin: "auto" }}>
              <div className="card-body" style={{ padding: "10px" }}>
                <a 
                  style={{ textDecoration: "none", color: "inherit", fontSize: "1.2rem", fontWeight: "bold" }}>
                  { group.apartment_name }
                </a>
                <br /><br />
                <div><p style={{ fontSize: "0.9rem", margin: "0" }}>청약 접수 시작일 : { group.application_period_start }</p></div>
                <div><p style={{ fontSize: "0.9rem", margin: "0" }}>지역 : { group.region }</p></div>
                <button 
                  onClick={() => handleButtonClick(group.apartment_name)}
                  style={{ backgroundColor: "#6a75ca", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", fontSize: "0.9rem", cursor: "pointer", marginTop: "10px" }}>
                  더보기
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
        {isModalOpen && (
  <div className="modal" style={modalStyles.modal}>
    <div style={modalStyles.modalContent}>
      <button onClick={closeModal} style={modalStyles.closeButton}>
        &times;
      </button>
      <h2>{modalData?.apartment_name}</h2>
      <div style={{ width: "100%", overflowX: "auto", marginTop: "20px" }}>
        {/* modalData에 HTML 테이블이 포함된 경우 */}
        <div dangerouslySetInnerHTML={{ __html: modalData }} />
      </div>
    </div>
  </div>
)}
        <button className="carousel-control-prev" type="button" data-bs-target="#apt_upcoming_applications" data-bs-slide="prev" 
          style={{ position: "absolute", top: "50px", padding: "3px 5px", width: "25px", height: "25px", backgroundColor: "#6a75ca", color: "white", borderRadius: "50%", fontSize: "10px" }}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#apt_upcoming_applications" data-bs-slide="next" 
          style={{ position: "absolute", top: "50px", padding: "3px 5px", width: "25px", height: "25px", backgroundColor: "#6a75ca", color: "white", borderRadius: "50%", fontSize: "10px" }}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="d-flex justify-content-around flex-wrap" style={{ gap: "15px" }}>
      <div id="unranked_upcoming_data" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "250px" }}>
        <h4 style={{ textAlign: "center", marginBottom: "8px", fontSize: "1.2rem", fontWeight: "bold", color: "#6a75ca" }}>무순위</h4>
        <div className="carousel-inner">
        {unranked_upcoming_data && unranked_upcoming_data.map((group, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <div className="card" style={{ width: "14rem", margin: "auto" }}>
              <div className="card-body" style={{ padding: "10px" }}>
                <a
                  style={{ textDecoration: "none", color: "inherit", fontSize: "1.2rem", fontWeight: "bold" }}>
                  { group.apartment_name }
                </a>
                <br /><br />
                <div><p style={{ fontSize: "0.9rem", margin: "0" }}>청약 접수 시작일 : { group.application_period_start }</p></div>
                <div><p style={{ fontSize: "0.9rem", margin: "0" }}>지역 : { group.region }</p></div>
                <button 
                  onClick={() => handleButtonClick(group.apartment_name)}
                  style={{ backgroundColor: "#6a75ca", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", fontSize: "0.9rem", cursor: "pointer", marginTop: "10px" }}>
                  더보기
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
        {isModalOpen && (
          <div className="modal" style={modalStyles.modal}>
            <div style={modalStyles.modalContent}>
              <button onClick={closeModal} style={modalStyles.closeButton}>
                &times;
              </button>
              <h2>{modalData?.apartment_name}</h2>
              <div style={{ width: "100%", overflowX: "auto", marginTop: "20px" }}>
                {/* modalData에 HTML 테이블이 포함된 경우 */}
                <div dangerouslySetInnerHTML={{ __html: modalData }} />
              </div>
            </div>
          </div>
        )}
        <button className="carousel-control-prev" type="button" data-bs-target="#unranked_upcoming_data" data-bs-slide="prev" 
          style={{ position: "absolute", top: "50px", padding: "3px 5px", width: "25px", height: "25px", backgroundColor: "#6a75ca", color: "white", borderRadius: "50%", fontSize: "10px" }}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#unranked_upcoming_data" data-bs-slide="next" 
          style={{ position: "absolute", top: "50px", padding: "3px 5px", width: "25px", height: "25px", backgroundColor: "#6a75ca", color: "white", borderRadius: "50%", fontSize: "10px" }}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
  </div>

</div>






   <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
       <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
         <span className="material-symbols-rounded">mode_comment</span>
         <span className="material-symbols-rounded">close</span>
       </button>

       <div className="chatbot-popup">
         {/* Chatbot Header */}
         <div className="chat-header">
           <div className="header-info">
             <ChatbotIcon />
             <h2 className="logo-text">Chatbot</h2>
           </div>
           <div className="service-notice">
             청약이도 실수할 수 있어요. *^^*
           </div>
           <button onClick={() => setShowChatbot(prev => !prev)}className="material-symbols-rounded">
             keyboard_arrow_down</button>
         </div>

         <div className="chat-date">
           {new Date().getFullYear()}.
           {(new Date().getMonth() + 1).toString().padStart(2, '0')}.
           {new Date().getDate().toString().padStart(2, '0')}
         </div>

         {/* Chatbot Body */}
         <div ref={chatBodyRef} className="chat-body">
          

           {/* Render the chat history dynamically */}
           {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
          ))}
        </div>

        <QuickMenu setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} resetActivityTimer={resetActivityTimer} />
        </div>
      </div>
    </div>
 </div>



  );
};
const modalStyles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%", // 높이를 100%로 설정하여 화면 전체를 덮도록 수정
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "1100px",
    maxHeight: "90vh", // 모달 최대 높이 설정
    overflowY: "auto", // 세로 스크롤 활성화
    position: "relative", // 닫기 버튼을 위치시키기 위한 상대적 위치
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  },
};
export default Main;











