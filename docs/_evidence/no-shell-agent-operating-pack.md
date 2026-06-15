# No-Shell Agent Operating Pack Evidence

## 1. Customer Dossier
### 핵심 고객
AI 에이전트를 이미 접한 사람이다. 완전 초보가 아니라 "ChatGPT/Claude/Codex/Gemini가 뭔가 해주는 건 안다" 단계다. 막히는 지점은 코딩 문법이 아니라 업무를 자동화 가능한 구조로 말하는 법, 어떤 플러그인/스킬을 써야 하는지, 결과물이 진짜 쓸 수 있는지 검증하는 법이다.

### 실제 고통
- "자동화해줘"라고 시키면 파일이나 UI는 생기지만 실제 업무 흐름이 비어 있다.
- 플러그인/스킬/도구 이름은 많지만 무엇을 언제 써야 할지 모른다.
- 결과가 맞는지 확인할 기준이 없어 AI가 만든 것을 그대로 믿거나 버린다.
- 설치/계정/권한/비밀키/결제 경계가 헷갈려 실행을 못 한다.

### 고객 언어
"코딩은 모르겠고, 내가 하는 일을 대신 굴러가게 하고 싶다."  
"어떤 앱을 깔고 어떤 명령어로 시작해야 하는지 모르겠다."  
"AI가 만든 게 진짜 되는 건지 확인하는 방법이 필요하다."

## 2. Competitor Teardown
### n8n
n8n은 AI 자동화 워크플로 카테고리에서 수천 개 템플릿을 보여주고, AI·Gmail·Sheets·Telegram·Notion 같은 연결을 전면에 둔다. 강점은 실제 워크플로와 앱 연결이다. 약점은 비전공자에게는 여전히 "무슨 템플릿을 내 업무에 어떻게 고치지?"가 남는다.  
Source: https://n8n.io/workflows/categories/ai/

### Zapier Templates / Agents
Zapier는 "no code" 템플릿과 Agents를 내세우며 9,000개 이상 앱 연결, 업무별 에이전트, 모니터링/채팅/웹 작업 흐름을 보여준다. 강점은 쉬운 표면과 대규모 앱 연결이다. 약점은 사용자가 이미 자기 업무를 명확히 구조화해야 제대로 위임된다.  
Source: https://zapier.com/templates  
Source: https://zapier.com/agents

### Anthropic Skills / OpenAI Plugins
Agent Skills는 `SKILL.md` 기반의 반복 가능한 지시·스크립트·리소스 단위이고, Codex Plugins는 `.codex-plugin/plugin.json`과 skills/MCP/app 등을 포함하는 확장 구조다. 강점은 에이전트가 재사용 가능한 능력을 얻는 공식 방향이다. 약점은 일반 사용자는 스킬/플러그인을 직접 설계하거나 검증하기 어렵다.  
Source: https://github.com/anthropics/skills  
Source: https://github.com/openai/plugins

## 3. Willingness-To-Pay Evidence
증거 수준은 아직 시장 실판매 전이라 가설이다. 단, 자동화 템플릿과 에이전트형 도구는 이미 n8n/Zapier/Skills/Plugins 생태계에서 사용자 기대가 형성되어 있다. 돈을 받을 포인트는 "툴 자체"가 아니라 "내 업무에 맞게 바로 시작하는 명령어, 검증표, 실패복구, 도구선택"이다.

### 가격 가설
현재 공개 모드는 무료 베타다. 가격은 지금 묻지 않고, GitHub star/issue/share와 실제 workflow feedback이 쌓인 뒤에만 검토한다.
- Free beta: MCP/API, "내 업무 자동화 10분 진단 카드", starter workflow pack.
- Future starter hypothesis: $19-$49, 한 업무용 운영팩.
- Future pro bundle hypothesis: $79-$199, 업무 5개 + 검증표 + 복구 플레이북.
- Future custom audit hypothesis: $300-$500, 고객 업무 1개를 실제 자동화 설계서로 바꿔주는 건별 리포트.

## 4. Category-#1 Thesis
"비전공자가 AI 에이전트에게 업무 자동화를 맡길 때, 빈껍데기 결과를 막는 자연어 운영팩" 카테리에서 1등을 노린다.

이건 n8n 템플릿 경쟁이 아니고, 프롬프트팩 경쟁도 아니다. 고객이 이미 쓰는 ChatGPT/Claude/Codex/Gemini/Hermes 위에 얹는 운영체계다.

## 5. GTM
### 첫 채널
- Reddit/Discord/커뮤니티: AI 자동화는 써봤지만 실패한 사람 대상.
- GitHub/MCP Registry/directory/public beta 공유 표면.
- Gumroad/Lemon Squeezy/Ko-fi 같은 디지털 파일 판매 표면은 공개 사용 신호 뒤에만 검토.
- YouTube/블로그: "AI가 만든 자동화가 왜 빈껍데기인지"를 자연어로 보여주는 짧은 데모.

### 첫 후킹 문장
"AI한테 자동화 시켰는데 버튼만 있고 실제로 안 돌아간 적 있으면, 이 팩은 그걸 막는 운영표다."

### 첫 실험
20명에게 무료 베타 MCP와 무료 진단 카드를 보여주고, 5명 이상이 실제 workflow를 넣어보거나 구체 피드백을 남기면 유지한다.

## 6. Price Ladder
1. Free public beta: MCP/API, 자동화 실패 진단 카드, starter workflow pack.
2. Future Starter $29: 한 업무 운영팩.
3. Future Bundle $99: 이메일/문서/SNS/리서치/보고서 5팩.
4. Future Custom $300: 업무 1개 심화 설계 리포트.
5. Retainer는 금지: 솔로 운영자에게 컨설팅 노동이 과해진다.

## 7. Kill Criteria
- 20명 중 실제 workflow 시도나 공개 피드백이 거의 없음.
- 사용자가 "무슨 말인지 모르겠다"를 반복하고, 첫 10분 실행을 못 한다.
- 무료 n8n/Zapier 템플릿과 차이를 설명해도 납득하지 못한다.
- 판매자가 계속 직접 컨설팅해야만 고객이 쓸 수 있다.

## Strongest Counterargument
이미 n8n/Zapier 템플릿과 수많은 프롬프트팩이 있다. 그래서 이 팩이 단순 템플릿이면 진다. 살아남는 조건은 "도구를 대신해주는 것"이 아니라, 고객이 자기 업무를 AI에게 맡길 수 있게 만드는 자연어 운영 구조와 검증/복구 체계를 실제로 제공하는 것이다.
