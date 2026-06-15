# 20명 테스트 기록표

## 사용법
한 사람에게 무료 진단 카드와 Before/After 데모 또는 live MCP를 보여준 뒤 아래 표에 기록한다. 지금은 돈을 받지 않는 공개 베타이므로 `다시 쓸 의향`, `이해 여부`, `반대 이유`를 먼저 기록한다.

## CSV 필드 기준
- `response`: 처음 본 사람이 한 말 그대로 요약한다.
- `starter_interest`: 무료 베타 MCP나 starter pack을 다시 쓸 의향이 있는지 `yes/no/maybe`로 적는다.
- `custom_audit_interest`: 나중에 자기 업무 버전이나 도메인 pack이 있으면 관심 있는지 `yes/no/maybe`로 적는다.
- `price_reaction`: 지금은 `not_asked`로 둔다. 유료화는 충분한 공개 사용 신호 뒤에만 묻는다.
- `main_objection`: 안 사는 이유를 하나만 고른다. 예: 너무 추상적, 이미 안다, 내 업무와 안 맞음, 가격, 신뢰 부족.
- `status`: `not_contacted`, `contacted`, `responded`, `tried_beta`, `opened_issue`, `rejected` 중 하나로 둔다.

| 날짜 | 이름/핸들 | 채널 | 세그먼트 | 보여준 자료 | 반응 | 재사용 의향 | 미래 유료 관심 | 가격 반응 | 반대 이유 | 다음 행동 | 상태 |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 판정
- PASS: 20명 중 5명 이상이 실제 workflow를 넣어보거나 GitHub issue/feedback을 남긴다.
- WARN: 이해는 하지만 직접 써보지 않는다. 예시와 연결 안내를 더 구체화한다.
- FAIL: "그냥 프롬프트팩"으로 보인다. 포지션을 다시 좁힌다.
