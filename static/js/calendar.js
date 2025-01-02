document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var filterState = {
        special: true,
        priority1: true,
        priority2: true,
        unranked: true,
    };

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        locale: 'ko',
        events: function (info, successCallback, failureCallback) {
            // 서버에서 필터링된 데이터를 가져옴
            fetch(`/api/schedule?start=${info.startStr}&end=${info.endStr}&special=${filterState.special}&priority1=${filterState.priority1}&priority2=${filterState.priority2}&unranked=${filterState.unranked}`)
                .then(response => response.json())
                .then(data => {
                    successCallback(data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    failureCallback(error);
                });
        },
        eventClick: function (info) {
            info.jsEvent.preventDefault();

            fetch(`/api/schedule/${encodeURIComponent(info.event.title)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Event details not found.');
                        return;
                    }

                    var content = `
                        <h3>${data.apartment_name}</h3>
                        <p><strong>Start Date:</strong> ${data.application_period_start || 'N/A'}</p>
                        <p><strong>End Date:</strong> ${data.application_period_end || 'N/A'}</p>
                        <p><strong>Region:</strong> ${data.region || 'N/A'}</p>
                        <p><strong>Housing Type:</strong> ${data.housing_type || 'N/A'}</p>
                        <p><strong>Sale Or Lease:</strong> ${data.sale_or_lease || 'N/A'}</p>
                        <p><strong>Construction Company:</strong> ${data.construction_company || 'N/A'}</p>
                        <p><strong>Contact:</strong> ${data.contact || 'N/A'}</p>
                        <p><strong>Result Announcement:</strong> ${data.result_announcement || 'N/A'}</p>
                    `;
                    document.getElementById('popup-content').innerHTML = content;

                    document.getElementById('popup-overlay').style.display = 'block';
                    document.getElementById('popup').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error fetching event details:', error);
                });
        }
    });

    calendar.render();

    // Close popup logic
    document.getElementById('popup-close').addEventListener('click', function () {
        document.getElementById('popup-overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });

    document.getElementById('popup-overlay').addEventListener('click', function () {
        document.getElementById('popup-overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });

    // 필터링 로직
    document.getElementById('special').addEventListener('change', updateFilters);
    document.getElementById('priority1').addEventListener('change', updateFilters);
    document.getElementById('priority2').addEventListener('change', updateFilters);
    document.getElementById('unranked').addEventListener('change', updateFilters);

    function updateFilters() {
        // 체크박스 상태 업데이트
        filterState.special = document.getElementById('special').checked;
        filterState.priority1 = document.getElementById('priority1').checked;
        filterState.priority2 = document.getElementById('priority2').checked;
        filterState.unranked = document.getElementById('unranked').checked;

        // 서버에서 새로 필터링된 데이터를 가져옴
        calendar.refetchEvents();
    }
});
