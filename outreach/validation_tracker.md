# 20명 테스트 기록표

## 사용법
한 사람에게 무료 진단 카드와 Before/After 데모를 보여준 뒤 아래 표에 기록한다. 느낌이 아니라 `돈 낼 의향`, `이해 여부`, `반대 이유`를 기록한다.

## CSV 필드 기준
- `response`: 처음 본 사람이 한 말 그대로 요약한다.
- `starter_interest`: $29 Starter Pack을 살 의향이 있는지 `yes/no/maybe`로 적는다.
- `custom_audit_interest`: $300 Custom Audit을 맡길 의향이 있는지 `yes/no/maybe`로 적는다.
- `price_reaction`: 가격을 싸다/적당하다/비싸다/이해 안 된다 중 무엇으로 받아들였는지 적는다.
- `main_objection`: 안 사는 이유를 하나만 고른다. 예: 너무 추상적, 이미 안다, 내 업무와 안 맞음, 가격, 신뢰 부족.
- `status`: `not_contacted`, `contacted`, `responded`, `interested`, `rejected`, `paid` 중 하나로 둔다.

| 날짜 | 이름/핸들 | 채널 | 세그먼트 | 보여준 자료 | 반응 | $29 관심 | $300 관심 | 가격 반응 | 반대 이유 | 다음 행동 | 상태 |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 판정
- PASS: 20명 중 3명 이상 $29 Starter 의향 또는 5명 이상 Custom Audit 요청.
- WARN: 이해는 하지만 가격 저항이 크다. 샘플을 더 구체화한다.
- FAIL: "그냥 프롬프트팩"으로 보인다. 포지션을 다시 좁힌다.
