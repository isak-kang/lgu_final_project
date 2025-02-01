# <div> 🧿 청약 정보 제공 챗봇 </div>
<div> 
  <p>LGU+ 2기 Final Project Team 1</p>
  <br>
  <h3>🎯 주제</h3>
  <p>상담 이력 기반 가상상담 시스템</p>
  <br>
  <h3>🎉 서비스 내용</h3>
  <p>청약 시장 진입을 준비하는 사회초년생을 대상으로 하는 청약 도우미 챗봇 서비스를 제공하고 있습니다!<br>
  청약에 관련된 다양한 부가 서버스인 청약캘린더, 경쟁률 분석, 다가올 청약 등의 정보도 제공하고 있습니다!</p>
  <br>
  <h3>🗓️ 프로젝트 수행 기간</h3>
  <p>2024.11.28 ~ 2025.01.25</p>
  <br>
</div>

# <div> 😎 내가 한 부분 </div>
<div> 

## 백엔드
1. 로그인 및 회원가입 / 아이디찾기, 비밀번호변경경
   - <details>
        <summary>jwt 토큰 발급을 활용한 인증</summary>
        1. 사용자가 로그인 시 서버에서 정보를 담은 토큰을 발급<br>
        2. 클라이언트는 받은 토큰을 로컬스토리지에 저장<br>
        3. 클라이언트는 요청이 있을 때 서버에 jwt토큰을 포함한 요청을 보냄.(OAuth2PasswordBearer)<br>
        4. jwt토큰이 유효하다면 요청 수락, 아니라면 거절.
        </details>
   - <details>
        <summary>bcrypt 라이브러리를 활용한 비밀번호 암호화</summary>
        1. 비밀번호 암호화<br> 
        
        ```
        bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        ```
        <br>
        2. MySQL에 저장<br>
        3. 로그인 시 비밀번호 확인 (복호화) -> <br>
        
        ```
        hashed_password = matched_user["password"].iloc[0]
        <br>if not bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
        ```

        </details>
   - <details>
        <summary>예외 처리</summary>
        - 서버오류, 네트워크오류 (서버 오류가 발생했습니다. 관리자에게 문의하세요.)<br>
        1. 회원가입 <br>
        - 중복 아이디 / 이메일 x<br>
        <!-- - 비밀번호 8글자 이상<br>
        - 이메일 (xxx@xxx)형식 고정 <br> -->
        2. 로그인 <br>
        <!-- - 비밀번호 8글자 이상<br> -->
        - 유효한 아이디인가? (DB와 대조)<br>
        - 아이디에 맞는 비밀번호인가? (DB와 대조)<br>
        3. 아이디 찾기<br>
        - 유효한 아이디인가?<br>
        4. 비밀번호 변경<br>
        - 정보가 맞는 정보인가?<br>
        </details>
2. 청약 캘린더
   - <details>
        <summary>일정 가져오기</summary>
        1. 클라이언트에서 요청한 시작과 끝 날짜를 기반으로 그에 맞는 정보를 DB에서 찾아 정보 제공<br>
        2. 클라이언트에서 필터링(1순위,2순위,특별공급,무주택) 요청 시 그에 맞게 정보제공 <br>
        3. 쿼리문 <br>

        ```
        query = f"""
        SELECT 
            apartment_name, 
            application_period_start, 
            subscription_type
        FROM apt_schedule
        WHERE application_period_start >= :start 
            AND application_period_start <= :end
            {filters1}

        UNION

        SELECT
            apartment_name,
            application_period_start,
            subscription_type
        FROM unranked_housing_application_basic_info
        WHERE application_period_start >= :start 
            AND application_period_start <= :end
            {filters2}
        """ 
        ```
        
        </details>
   - <details>
        <summary>디테일 정보 가져오기</summary>
        일정 클릭 시 디테일 정보 가져옴<br>
        1. 청약 이름을 활용하여 DB에서 디테일한 정보 검색<br>
        2. 없을 시 반환 x<br>
        </details>
3. 메인페이지 <br>
    - 크롤링 뉴스데이터 가져오기 (링크,사진링크,제목, 내용, 날짜) <br>
    - <details>
        <summary>다가올 청약 정보  </summary>
        <br>
        1. 현재 날짜보다 청약시작날짜가 미래인 청약의 데이터를 가져옴

        ```
        query = f"""
        SELECT *
        FROM {table}
        WHERE application_period_start >= NOW();
            """  
        ```      
        <br>
        2. 청약 클릭 시 디테일한 정보 들고오기 (시작날짜, 끝날짜, 시공사, 전화번호 등등등)
    - <details>
        <summary>가까운 청약 경쟁률 정보 </summary>
        일정 클릭 시 디테일 정보 가져옴<br>
        1. application_result != '청약 접수일 미도래' 조건의 맞는 경쟁률 정보를 현재로부터 가까운 것들로 15개를 들고온다.

        ```
        query = """
        WITH ranked_apartments AS (
            SELECT apartment_name, MAX(announcement_date) AS latest_announcement_date
            FROM lgu.apt_housing_application_basic_info
            GROUP BY apartment_name
            ORDER BY COUNT(*) DESC
            LIMIT 15
        )
        SELECT b.apartment_name	, a.application_period_start ,b.house_type ,b.supply_units ,b.rank ,b.rank_region ,b.application_count ,b.competition_rate ,b.application_result 
        FROM lgu.apt_housing_application_basic_info a
        LEFT JOIN lgu.apt_housing_competition_rate b
            ON a.apartment_name = b.apartment_name
        WHERE a.apartment_name IN (SELECT apartment_name FROM ranked_apartments)
        AND a.announcement_date = (
            SELECT latest_announcement_date
            FROM ranked_apartments
            WHERE apartment_name = a.apartment_name
        )
        AND (b.application_result IS NULL OR b.application_result != '청약 접수일 미도래')
        order by a.application_period_start desc;"""
        ```      
        <br>
        2. 청약 클릭 시 디테일한 정보 들고오기 (시작날짜, 끝날짜, 시공사, 전화번호, 상세경쟁률 등등등)
    </details>

4. etc <br>
   - <details>
        <summary>청약 경쟁률</summary>
        - 연도 / 월 / 청약타입(특별공급,일반공급) 정보 입력 시 그에 맞는 청약 경쟁률 정보 제공
        </details>
   - <details>
        <summary>faq</summary>
        - MongoDB에 저장된 FAQ 정보제공 (Q , A)
        </details>
   - <details>
        <summary>청약 용어</summary> 
        - MongoDB에 저장된 용어 정보제공 (용어, 설명 )
        </details>
## 프론트엔드

## CI/CD 구축

## 크롤링 및 크롤링 자동화

## 배포

## DB 구축 및 관리

</div>

# <div> 기능 </div>
