<div>

# <a href="https://github.com/whynotsw-camp/wh02-3rd-1team-CHEONGYAGI">Project Main Git</a>

</div>
🔝🔝🔝🔝🔝🔝🔝🔝🔝🔝
<br>
프로젝트 메인 깃 주소
<br>
<br>

<div>

# 🎥시연영상

  <a href="https://www.youtube.com/watch?v=F4uLerXovjk" target="_blank">
    <img src="https://img.youtube.com/vi/F4uLerXovjk/0.jpg" alt="시연영상">
  </a>

</div>
<br>


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


## 백엔드 (각 부분을 클릭하시면 자세한 내용이 나옵니다)
1. 로그인 및 회원가입 / 아이디찾기, 비밀번호변경
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
## 프론트엔드(각 부분을 클릭하시면 자세한 내용이 나옵니다)
1. 사용 기술 설명<br>
   - <details>
        <summary>vite</summary> 
        - 빌드와 서버 구동 시간이 매우 빨라 사용
        </details>
   - <details>
        <summary>axios</summary> 
        - fetch를 사용할 시 요청 설정 객체에 더 많은 구성 주어야하고 .json()을 메서드를 호출하여 데이터를 파싱해야함.
        - 이로 인해 axios는 코드를 간결하고 직관적으로 하는데 유리함.
        </details>
2. 느낌점 <br>
    - <details>
        <summary>SSR과 CSR</summary> 
        - 청약캘린더를 만들 때 필터링 기능을 만든적이 있다. 이 때는 서버와 클라이언트의 개념이 제대로 잡히지 않았을 시점이었는데 나는 아무것도 모르고 js에서 필터링 데이터도 받아오고 캘린더 정보도 받아오고 디테일한 청약정보도 가져왔다. 그 결과 처음 화면에 띄우는 과정은 빨랐지만 클라이언트에서 부담할 일이 커지다보니 필터링하는 버튼을 누르면 렉이 엄청 걸렸다. 그래서 어떻게 해결할지 모를 시점에 같이 학원다니는 분이 SSR과 CSR에 대해 공부를 해봐라 라고 해서 공부를 했고 서버에서 data를 api로 쏴주는 방식으로 바꾸니 해결이 렉이 걸리는 문제가 해결이 되었다.       </details>
   - <details>
        <summary>Html,js -> react</summary> 
        - 사실 나는 react를 할 생각이 없었다. 그런데 팀원 중 한분이 챗봇UI를 react로 만들어왔는데 너무 괜찮았다. 나는 메인페이지를 html, js, 부트스트랩 탬플릿을 통해 만들었는데 이것을 react로 바꿔야겠다고 마음 먹었다. 처음에는 쉬울 줄 알았는데 그 과정은 쉽지 않았다.<br>
        react를 처음 만져보는거다보니 components는 무엇이고 index.jsx와 index.html은 어떻게 연결되는건지, 페이지 간의 이동은 어떻게 하는건지에 대한 개념도 제대로 잡히지 않았다. 또한 api를 연결하는 것도 쉽지 않았다... <br>
        그래도 하나하나 차근차근해보기로 마음먹었다.<br>
        컴포넌트에 대한 개념을 공부했고 index.html과의 관계 또한 처음부터 다시 공부했다.
        유튜브(https://www.youtube.com/watch?v=ZU-drSVodBw&t=337s)를 통해 처음부터 어떻게 UI를 만들어보았고 BrowserRouter, Routes, Route, Link를 통해 페이지 간의 연결을 했다. 이렇게 하나하나하다보니 결국 모든 페이지를 react로 구성하는데 성공했다.
        </details>    
   - <details>
        <summary>아쉬운점</summary> 
        1. 아쉬운점이 여러가지 있는데 그 중 하나는 페이지를 구성할 때 여러 컴포넌트로 나눠 재사용성을 높히고 수정할 때 용이하게 했어야했는데 급하게 코딩을 하다보니 그냥 한 페이지에 모든것을 다 때려박는 식으로 구성해버렸다. (후에 조금 나누긴 했지만 더 이상 건들기가 힘들었다.)
        2. 로그인 기능을 만들었지만 사용못한점... 이건 마지막에 총 후기에서 다시 설명하겠다.
        </details>

## DB 구축 및 관리(추가예정)

## CI/CD 구축(각 부분을 클릭하시면 자세한 내용이 나옵니다)
원래는 학원에서 이 부분에 대해 배우고 싶었는데 그러질 못했다.<br>
그래서 나는 스스로 구글링과 유튜브 강의를 통해 학습하였고 이번 프로젝트에서 CI/CD를 한번 구축해 보았다. <br>

1. 크롤링 자동화<br>
    - <details>
        <summary>구성(아키텍처)</summary> 

        ![image](https://github.com/user-attachments/assets/26cbdbdb-3b7a-4f4e-a7d5-79baf86b9392)
    </details>

    - <details>
        <summary>크롤링 데이터와 장소</summary> 
         - MySQL : 청약명, 일정, 시공사 등의 기본정보와 경쟁률, 모집현황의 정형화된 데이터들을 MySQL에 적재한다.
         <br>
         - S3 : PDF로 돼있는 모집공고문을 S3에 적재한다.
        </details>
    
    - <details>
        <summary>자동화 방법</summary> 
         1. 크롤링 코드 작성<br>
         알고리즘 : <br>
         -> 기본정보는 db에 있는 데이터와 대조하여 있는 데이터 발견 시 크롤링 중지<br>
         -> 경쟁률, 모집현황 같은 경우에는 new아이콘이 떠있는 것만 크롤링하여 업데이트.(5page에서 stop)<br>
         -> 모집공고문 같은 경우에는 오늘을 기준으로 앞뒤로 30일 이내에 것만 크롤링 하므로 S3에 있는 모집공고문은 모두 삭제하고 다시 크롤링 진행.<br>
         2. GitHub Action에서 crontab을 활용하여 매일 일정시간(0시)에 크롤링 작업수행
         <br>
         - on : cron : "0 0 * * *"<br>
         - run : 크롤링에 필요한 모듈설치<br>
         - run : .env파일 설정 (setting -> Actions secrets and variables - > Actions에서 Repository secrets 설정 (비밀키, id, passwd, host설정))<br>
         - run : Chrome 설치 <br>
         - run : chrome 버전에 맞는 chromedriver 설치 (-> 이것까지 자동화 못함. -> ubuntu에서는 버전에 맞는 chromedriver를 직접 설치해야함....) <br>
         - run : 파이썬 script파일 실행.
         <br>
         3. 이 과정은 다해서 6분 내외로 걸리고 그 후 DB에 반영된다.
        </details>

2. 자동 배포<br>
    - <details>
        <summary>구성(아키텍처)</summary> 

        ![image](https://github.com/user-attachments/assets/b131e974-e552-42ea-9756-bf2c9d8efbdc)
    </details>

    - <details>
        <summary>AWS IAM</summary> 
        1. ec2에서 s3, CodeDelpoy에 배포하기 위한 역할 생성 및 권한 설정
        2. CodeDelpoy에서 ec에 s3데이터를 저장하기 위한 역할 생성 및 권한 설정
        3. github에서 S3에 저장하고 Codedeploy 하기위한 역할 생성 및 권한 설정
        4. 액세스 키 만들기.
    </details>

    - <details>
        <summary>ec2 및 역할, IAM 환경 구성</summary> 
        1. 코드를 배포할 최상위 디렉토리에 가상환경과 .env파일을 설정하기.<br>
        2. nginx 설치 및 파일 구성<br>
        
        ```
        vi /etc/nginx/sites-available/default
        ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
        ```
        
        ```
        server {
            listen 80;
            server_name 12.34.56.789;  # 또는 도메인 이름으로 변경

            # React 앱 서비스
            location / {
                root /home/ubuntu/lgu_final_project/lgu_final/frontend/dist;
                index index.html;
                try_files $uri $uri/ /index.html;
            }

            # FastAPI 애플리케이션 서비스
            location /fastapi/ {
                proxy_pass http://127.0.0.1:8000;  # FastAPI 서버 주소
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
        ```
        3. CodeDeploy 설치 및 설정.
     </details>
     
    - <details>
        <summary>CI/CD</summary> 
         1. GitHub Action을 통해 main브랜치로 push 시 배포할 수 있게 구성.<br>
         - run : push 파일 압축 -> (tar cvfz ./lgu-final.tar.gz *)<br>
         - run :AWS configure credentials (IAM 인증)<br>
         - run :S3에 압축파일 업로드<br>
         - run :AWS CodeDeploy 실행<br>
         2. AWS CodeDeploy<br>
         - appspec.yml파일 생성 및 scripts생성.<br>
         -> stop servers (uvicorn stop)<br>
         -> code파일 전부 삭제<br>
         -> 가상환경 활성화 및 requirments.txt로 업데이트된 라이브러리 다운로드<br>
         -> 프론트 단에 .env파일 복사생성<br>
         -> start servers(build 후 nginx restart 및 uvicorn start)<br>
        </details>


</div>

<br>

# <div> 😭후기... </div>

