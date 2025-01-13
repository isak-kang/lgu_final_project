import React, { useState, useEffect } from "react"; 
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid"; // 주간 및 일간 보기 플러그인
import axios from "axios"; // Axios 추가
import "../index.css"; // 스타일 추가

const Calendar = () => {
  const API_URL = import.meta.env.VITE_EC2_PUBLIC_IP;
  const [events, setEvents] = useState([]);
  const [filterState, setFilterState] = useState({
    special: true,
    priority1: true,
    priority2: true,
    unranked: true,
  });
  const [popup, setPopup] = useState({ visible: false, content: null });
  const [calendarRange, setCalendarRange] = useState({ start: null, end: null });

  // 일정 가져오기
  const fetchEvents = async (start, end) => {
    try {
      const query = new URLSearchParams({
        start,
        end,
        special: filterState.special,
        priority1: filterState.priority1,
        priority2: filterState.priority2,
        unranked: filterState.unranked,
      });
      console.log(`http://${API_URL}/api/schedule?${query.toString()}`);
      const response = await axios.get(`http://${API_URL}/api/schedule?${query.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // 상세 정보 가져오기
  const fetchEventDetails = async (apartmentName) => {
    try {
      const response = await axios.get(`http://${API_URL}/api/schedule/${encodeURIComponent(apartmentName)}`);
      const data = response.data;
      if (data.error) {
        alert("Event details not found.");
        return;
      }
      setPopup({
        visible: true,
        content: (
          <div>
            <h3>{data.apartment_name}</h3>
            <p><strong>Start Date:</strong> {data.application_period_start || "N/A"}</p>
            <p><strong>End Date:</strong> {data.application_period_end || "N/A"}</p>
            <p><strong>Region:</strong> {data.region || "N/A"}</p>
            <p><strong>Housing Type:</strong> {data.housing_type || "N/A"}</p>
            <p><strong>Sale Or Lease:</strong> {data.sale_or_lease || "N/A"}</p>
            <p><strong>Construction Company:</strong> {data.construction_company || "N/A"}</p>
            <p><strong>Contact:</strong> {data.contact || "N/A"}</p>
            <p><strong>Result Announcement:</strong> {data.result_announcement || "N/A"}</p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // 필터 업데이트
  const updateFilters = (event) => {
    const { id, checked } = event.target;
    setFilterState((prev) => ({ ...prev, [id]: checked }));
  };

  // 달 변경 시 호출
  const handleDateChange = (dateInfo) => {
    const start = dateInfo.startStr;
    const end = dateInfo.endStr;
    setCalendarRange({ start, end });
  };

  // 날짜와 필터 상태가 변경될 때마다 일정 가져오기
  useEffect(() => {
    if (calendarRange.start && calendarRange.end) {
      fetchEvents(calendarRange.start, calendarRange.end);
    }
  }, [calendarRange, filterState]);

  useEffect(() => {
    // 초기 일정 로드
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    setCalendarRange({ start, end });
  }, []);

  return (
    <div>
      <div id="filters">
        <label>
          <input type="checkbox" id="special" checked={filterState.special} onChange={updateFilters} /> 특별공급
        </label>
        <label>
          <input type="checkbox" id="priority1" checked={filterState.priority1} onChange={updateFilters} /> 1순위
        </label>
        <label>
          <input type="checkbox" id="priority2" checked={filterState.priority2} onChange={updateFilters} /> 2순위
        </label>
        <label>
          <input type="checkbox" id="unranked" checked={filterState.unranked} onChange={updateFilters} /> 무순위
        </label>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]} // 시간 기반 뷰 플러그인 추가
        initialView="dayGridMonth" // 기본 보기 설정
        locale="ko"
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          fetchEventDetails(info.event.title);
        }}
        datesSet={handleDateChange} // 달 변경 시 날짜 범위 가져오기
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay", // 뷰 전환 버튼 추가
        }}
      />

      {popup.visible && (
        <div className="popup-overlay" onClick={() => setPopup({ visible: false, content: null })}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            {popup.content}
            <div className="popup-close" onClick={() => setPopup({ visible: false, content: null })}>
              Close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
