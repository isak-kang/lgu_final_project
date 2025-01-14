from typing import Dict, List, TypedDict, Optional
import re
import numpy as np

### 세대구성원 수 + 소득으로 도시근로자 기준 월평균 소득 계산
def determine_income_level(income_list, num_family):
  
  income_series = np.array([3482964,
                          5415712,
                          7198649,
                          8248467,
                          8775071,
                          9563282,
                          10351493,
                          11139704])
  income_avg = int(round(np.array(income_list).sum(),0))
  print(income_avg)
  scaling_factors = [1.0,1.2,1.3,1.4,1.6]
  scaled_incomes = list(map(lambda factor: int(round(income_series[num_family - 1] * factor, 0)), scaling_factors))

  for i, standard in enumerate(scaled_incomes):
    if standard >= income_avg:
      income_level = i+1
      break
    elif scaled_incomes[-1] < income_avg:
      income_level = len(scaling_factors) + 1
      break
  return income_level


mapping_question = {
    "L5_0" : "추가 정보 입력하러 가기",
    "L5_1" : "네, 주택을 소유하지 않고 있어요",
    "L5_2" : "주택을 소유하고 있어요",

    "L5_3" : "7년 이내 신혼 부부예요",
    "L5_4" : "7년 초과 기혼자예요",
    "L5_5" : "미혼이에요" ,

    "L5_6" : "신생아를 양육 중이거나 현재 임신 중이에요" ,
    "L5_7" : "만 2세를 초과한 미성년 자녀를 양육 중이에요",
    "L5_8" : "자녀가 없어요" ,

    "L5_9" : "맞벌이에요" ,
    "L5_10" : "외벌이에요" ,

    "L5_12" : "네, 부동산가액 기준을 충족해요",
    "L5_13" : "아니요, 부동산가액 기준을 충족하지 못해요",

    "L5_15" : "네, 소득세 기준을 충족해요" ,
    "L5_16" : "아니요, 소득세 기준을 충족하지 못해요"
}


class Button(TypedDict):
    text: str            # 버튼에 표시될 텍스트
    nextQuestion: str    # 버튼 클릭시 이동할 다음 질문 : 사용자가 입력하는 것으로 보여지는 텍스트

class FlowResponse(TypedDict):
    text: str                           # 시나리오 응답 텍스트
    buttons: Optional[List[Button]]     # 선택적으로 표시될 버튼들


class UserState:
    def __init__(self, scenario_logs=["L5_0"], income_list=[], num_family=0, income_tax_status=0):
        # self.session_id = session_id 로그인 기능 적용 시 사용
        self.scenario_logs = scenario_logs
        self.income_list = income_list
        self.num_family = num_family
        self.current_scenario = scenario_logs[-1]
      
    def update_scenario(self, new_scenario):
        self.scenario_logs.append(new_scenario)
        self.current_scenario = self.scenario_logs[-1]
    
# 사용자 상태 저장 dict
try:
   user_state 
except:
  user_state = UserState()


# 시나리오 데이터
SCENARIOS: Dict[str, FlowResponse] = {
  "L5_0" : {
      "text" : """무주택세대구성원이신가요?
      * 무주택세대구성원이란 세대에 속한 자(본인, 배우자, 본인의 직계존속인 부모와 조부모, 배우자의 직계존속, 본인의 자녀와 손자)
      전원이 주택이나 분양권을 소유하고 있지 않은 세대의 구성원을 뜻합니다.
      """,
      "buttons" : [
          {"text" : "예", "nextQuestion" : mapping_question.get("L5_1")},
          {"text" : "아니요", "nextQuestion" : mapping_question.get("L5_2")}
      ]
  },

  "L5_1" : {
      "text" : """신혼부부이신가요?

      * 신혼부부란 혼인 예정이거나 혼인신고일 기준 7년 이내인 경우를 뜻합니다.""",
      "buttons" : [
          {"text" : "7년 이내의 신혼부부", "nextQuestion" : mapping_question.get("L5_3")},
          {"text" : "7년 초과의 기혼자", "nextQuestion" : mapping_question.get("L5_4")},
          {"text" : "미혼", "nextQuestion" : mapping_question.get("L5_5")}
      ]
  },
  "L5_2" : {
      "text" : """무주택세대구성원이 아니시군요! 무순위 청약을 안내해드릴게요.""",
      "buttons" : []
  },

  "L5_3" : {
      "text" : """출생일로부터 2년 이내인 자녀가 있으신가요?(임신 중인 태아 포함)""",
      "buttons" : [
          {"text" : "태아 포함 신생아", "nextQuestion" :  mapping_question.get("L5_6")},
          {"text" : "2세 초과 미성년 자녀", "nextQuestion" : mapping_question.get("L5_7")},
          {"text" : "자녀 없음", "nextQuestion" : mapping_question.get("L5_8")}
      ]
  },
  "L5_4" : {
      "text" : """출생일로부터 2년 이내인 자녀가 있으신가요?(임신 중인 태아 포함)""",
      "buttons" : [
          {"text" : "태아 포함 신생아", "nextQuestion" :  mapping_question.get("L5_6")},
          {"text" : "2세 초과 미성년 자녀", "nextQuestion" : mapping_question.get("L5_7")},
          {"text" : "자녀 없음", "nextQuestion" : mapping_question.get("L5_8")}
      ]
  },
  # 미혼
  "L5_5" : {
      "text" : """전년도 기준 본인의 월소득을 만원 단위로 입력해주세요. (예: 100만원)

      * 전년도 소득 확인 방법
      ① 직장인(상시근로자) : 국민건강보험(https://www.nhis.or.kr/)에서 평균보수월액 확인
      ② 사업자 또는 프리랜서 : 국세청 홈택스(https://hometax.go.kr/)에서 소득금액증명의 값÷12
      """,
      "buttons" : [],
      "requiresInput" : "int"
  },

  "L5_6" : {
      "text" : """부부의 소득활동 형태가 어떻게 되시나요?""",
      "buttons" : [
          {"text" : "맞벌이", "nextQuestion" : mapping_question.get("L5_9")},
          {"text" : "외벌이", "nextQuestion" : mapping_question.get("L5_10")},
      ]
  },
  "L5_7" : {
      "text" : """부부의 소득활동 형태가 어떻게 되시나요?""",
      "buttons" : [
          {"text" : "맞벌이", "nextQuestion" : mapping_question.get("L5_9")},
          {"text" : "외벌이", "nextQuestion" : mapping_question.get("L5_10")},
      ]
  },
  "L5_8" : {
      "text" : """부부의 소득활동 형태가 어떻게 되시나요?""",
      "buttons" : [
          {"text" : "맞벌이", "nextQuestion" : mapping_question.get("L5_9")},
          {"text" : "외벌이", "nextQuestion" : mapping_question.get("L5_10")},
      ]
  },

  # 맞벌이
  "L5_9" : {
      "text" : """전년도 기준 본인의 월소득을 만원 단위로 입력해주세요. (예: 100만원)

      * 전년도 소득 확인 방법
      ① 직장인(상시근로자) : 국민건강보험(https://www.nhis.or.kr/)에서 평균보수월액 확인
      ② 사업자 또는 프리랜서 : 국세청 홈택스(https://hometax.go.kr/)에서 소득금액증명의 값÷12
      """,
      "buttons" : [],
      "requiresInput" : "int"
  },

  "L5_9_1" : {
      "text" : """전년도 기준 배우자의 월소득을 만원 단위로 입력해주세요.

      (예: 100만원)
      """,
      "buttons" : [],
      "requiresInput" : "int"

  },

  # 외벌이
  "L5_10" : {
      "text" : """전년도 기준 본인 혹은 배우자 중 소득이 있는 분의 월소득을 만원 단위로 입력해주세요. (예: 100만원)
      """,
      "buttons" : [],
      "requiresInput" : "int"

  },

  # 부동산가액 확인 
  "L5_11" : {
      "text" : """부동산가액이 3억 3100만원 이하인가요?

      * 부동산가액이란 세대가 소유하고 있는 모든 토지와 건축물의 공시가격의 총합을 뜻합니다.
      자세한 사항은 부동산공시가격 알리미(https://www.realtyprice.k)와 위택스(https://www.wetax.go.kr/main.do)를 확인해주세요.
      """,
      "buttons" : [
          {"text" : "예", "nextQuestion" : mapping_question.get("L5_12")}, ## 충족
          {"text" : "아니요", "nextQuestion" : mapping_question.get("L5_13")}, ## 미충족
      ],
  },
  
  # 세대구성원 수 확인
  "L5_12" : {
      "text" : """세대구성원 수는 본인을 포함하여 총 몇 명으로 구성되었나요? (예: 3명)

      ※ 주의사항
      - 본인 또는 배우자와 주민등록으로 연결되어 있는 모든 사람은 세대원에 속합니다.
      - 배우자는 주민등록과 관계없이 무조건 세대구성원에 포함됩니다.
      - 배우자와 주민등록이 분리된 경우 배우자의 등본상 구성원도 고려해야 합니다.
      """,
      "buttons" : [],
      "requiresInput" : "int"

  },

  "L5_13" : {
      "text" : """세대구성원 수는 본인을 포함하여 총 몇 명으로 구성되었나요? (예: 3명)

      ※ 주의사항
      - 본인 또는 배우자와 주민등록으로 연결되어 있는 모든 사람은 세대원에 속합니다.
      - 배우자는 주민등록과 관계없이 무조건 세대구성원에 포함됩니다.
      - 배우자와 주민등록이 분리된 경우 배우자의 등본상 구성원도 고려해야 합니다.
      """,
      "buttons" : [],
      "requiresInput" : "int"

  },

  # 세대구성원의 소득 묻기
  "L5_14" : {
      "text" : """본인과 배우자를 제외한 세대구성원 중 유소득자의 소득을 입력해주세요.

      (예 : 100만원, 200만원, 300만원, ...)
      """,
      "buttons" : [],
      "requiresInput" : "int"

  },

  # 소득세 납부 여부
  "L5_16" : {
      "text" : """5년 이상 소득세를 납부하셨나요?

      * 해당 내용은 국세청 홈택스(https://hometax.go.kr)에서 소득금액증명을 발급받아 확인이 가능합니다.
      * 기간이 연속되지 않고 통산 5년 이상일 시 가능합니다.
      * 세액공제, 소득공제 등으로 실제 결정세액이 0원인 경우도 가능합니다.
      """,
      "buttons" : [
          {"text" : "예", "nextQuestion" : mapping_question.get("L5_15")}, ## 충족
          {"text" : "아니요", "nextQuestion" : mapping_question.get("L5_16")}, ## 미충족
      ],
  },
}

def get_personalized_response(question: str) -> Optional[FlowResponse]:
  # mapping table
  key_mapping = {
      "추가 정보 입력하러 가기" : "L5_0",
      "네, 주택을 소유하지 않고 있어요" : "L5_1",
      "주택을 소유하고 있어요" : "L5_2",

      "7년 이내 신혼 부부예요" : "L5_3",
      "7년 초과 기혼자예요" : "L5_4",
      "미혼이에요": "L5_5",

      "신생아를 양육 중이거나 현재 임신 중이에요": "L5_6",
      "만 2세를 초과한 미성년 자녀를 양육 중이에요": "L5_7",
      "자녀가 없어요": "L5_8",

      "맞벌이에요": "L5_9",
      "외벌이에요": "L5_10",

      "네, 부동산가액 기준을 충족해요": "L5_12",
      "아니요, 부동산가액 기준을 충족하지 못해요": "L5_13",

      "네, 소득세 기준을 충족해요": "L5_15",
      "아니요, 소득세 기준을 충족하지 못해요": "L5_16"
  }

  global user_state
  mapped_key = key_mapping.get(question)
  
  if SCENARIOS.get(mapped_key):
    user_state.update_scenario(mapped_key)
    # print(user_state.scenario_logs)
    return SCENARIOS.get(mapped_key)
  
  current_state = user_state.current_scenario
  income_digit = re.compile(r"\d{1,5}")
  match_digit = income_digit.search(question)

  if match_digit:
    # 본인 / 배우자의 소득 묻기
    if current_state == "L5_5": # 미혼
      income_indiv = int(match_digit.group())
      user_state.income_list.append(income_indiv)
      user_state.update_scenario("L5_11")
      return SCENARIOS.get("L5_11")

    elif current_state == "L5_9": # 맞벌이 : 본인 
      income_indiv = int(match_digit.group())
      user_state.income_list.append(income_indiv)
      user_state.update_scenario("L5_9_1")
      return SCENARIOS.get("L5_9_1")
    
    elif current_state == "L5_9_1": # 맞벌이 : 본인 -> 배우자 
      income_partner = int(match_digit.group())
      user_state.income_list.append(income_partner)
      user_state.update_scenario("L5_10")
      return SCENARIOS.get("L5_11")

    elif current_state == "L5_10": # 외벌이 : 본인 혹은 배우자 
      income_partner = int(income_digit.search(mess).group())
      user_state.income_list.append(income_partner)
      user_state.update_scenario("L5_11")
      return SCENARIOS.get("L5_11")

    # 세대구성원 수 묻기 
    elif current_state == "L5_12": 
      num_of_family = int(match_digit.group())
      user_state.num_family = num_of_family
      user_state.update_scenario("L5_12")
      return SCENARIOS.get("L5_14")

    elif current_state == "L5_13":
      num_of_family = int(match_digit.group())
      user_state.num_family = num_of_family
      user_state.update_scenario("L5_13")
      return SCENARIOS.get("L5_14")

    # 세대구성원의 소득 묻기
    elif current_state == "L5_12": 
      incomestr = income_digit.findall(question)
      for i in incomestr:
        user_state.income_list.append(i)

      income_level = determine_income_level(user_state.income_list, user_state.num_family)
      user_state.update_scenario("L5_15")
      return SCENARIOS.get("L5_15")
    else:
      return FlowResponse({"text" : "올바른 형태로 입력해주세요.", "buttons" : []})
    




