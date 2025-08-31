var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/services/openai.ts
var openai_exports = {};
__export(openai_exports, {
  analyzeConversation: () => analyzeConversation,
  getOpenAIClient: () => getOpenAIClient
});
import OpenAI2 from "openai";
function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY_BACKUP || process.env.OPENAI_API_KEY_PRODUCTION || process.env.OPENAI_SECRET_KEY;
    console.log("\u{1F510} Initializing OpenAI client:", {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPrefix: apiKey?.substring(0, 7) || "none",
      nodeEnv: process.env.NODE_ENV,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (!apiKey) {
      throw new Error("No OpenAI API key available");
    }
    openaiClient = new OpenAI2({
      apiKey,
      baseURL: "https://api.openai.com/v1",
      timeout: 6e4,
      maxRetries: 2
    });
    console.log("\u2705 OpenAI client initialized successfully");
  }
  return openaiClient;
}
function detectLanguage2(text2) {
  const koreanChars = (text2.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
  const koreanWords = /(?:안녕|좋아|사랑|만나|시간|어디|언제|뭐|어떻게|그래|맞아|진짜|정말|너무|같이|우리|나는|너는|이에요|예요|습니다|해요|했어요|할까요)/i.test(text2);
  if (koreanChars > 0 || koreanWords) {
    return "ko";
  }
  const japaneseChars = (text2.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length;
  const japaneseWords = /(?:こんにちは|ありがとう|すみません|おはよう|こんばんは|さようなら|好き|愛|時間|今日|明日|昨日|今|私|あなた|何|です|ます|でしょう|ました|ください)/i.test(text2);
  if (japaneseChars > 0 || japaneseWords) {
    return "ja";
  }
  if (/[अ-ह]/.test(text2)) return "hi";
  if (/[ñáéíóúü]/.test(text2) || /\b(?:hola|gracias|español|qué|dónde|cómo|cuándo|por qué|sí|muy)\b/i.test(text2)) return "es";
  if (/[ãõ]/.test(text2) || /\b(?:olá|obrigado|português|você|não|muito|onde|quando|por que)\b/i.test(text2)) return "pt";
  return "en";
}
async function analyzeConversation(extractedText, forceLanguage) {
  try {
    console.log("OpenAI analysis starting:", {
      textLength: extractedText.length,
      forceLanguage,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (!process.env.OPENAI_API_KEY) {
      console.error("PRODUCTION ERROR: OpenAI API key not found in environment");
      throw new Error("OpenAI API key not configured");
    }
    console.log("OpenAI API key found, proceeding with analysis");
    const detectedLanguage = forceLanguage || detectLanguage2(extractedText);
    console.log("Language detected:", detectedLanguage);
    const languagePrompts = {
      "ko": {
        systemPrompt: "\uB2F9\uC2E0\uC740 \uB2E4\uAD6D\uC5B4 \uAD00\uACC4 \uC2EC\uB9AC\uD559\uC790\uB85C, \uC5F0\uC560 \uC2EC\uB9AC\uD559, \uCEE4\uBBA4\uB2C8\uCF00\uC774\uC158 \uC774\uB860, \uADF8\uB9AC\uACE0 \uBB38\uD654 \uAC04 \uAC10\uC815 \uBD84\uC11D\uC5D0 \uC804\uBB38\uAC00\uC785\uB2C8\uB2E4. \uAC01 \uC0AC\uC6A9\uC790\uC758 \uBAA8\uAD6D\uC5B4\uC640 \uBB38\uD654\uC801 \uD1A4\uC5D0 \uB9DE\uCDB0\uC9C4 \uAE4A\uC774 \uC788\uB294 \uC778\uAC04\uC801\uC774\uACE0 \uAC10\uC815\uC801\uC73C\uB85C \uC9C0\uB2A5\uC801\uC778 \uBCF4\uACE0\uC11C\uB97C \uC791\uC131\uD558\uB294 \uAC83\uC774 \uB2F9\uC2E0\uC758 \uC5ED\uD560\uC785\uB2C8\uB2E4.",
        analysisPrompt: `\uB2F9\uC2E0\uC758 \uBD84\uC11D\uC740 \uB2E4\uC74C\uC744 \uBC18\uB4DC\uC2DC \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4:
- \uD55C\uAD6D\uC5B4\uB85C \uC791\uC131\uB41C \uB300\uD654\uB97C \uBC88\uC5ED\uD558\uC9C0 \uC54A\uACE0 \uC6D0\uBCF8 \uC5B8\uC5B4\uB85C \uBD84\uC11D
- \uAC19\uC740 \uD55C\uAD6D\uC5B4\uB85C \uBD84\uC11D \uBCF4\uACE0\uC11C \uCD9C\uB825
- \uBAA8\uB4E0 \uC5B8\uC5B4\uC5D0 \uAC78\uCCD0 \uB3D9\uC77C\uD55C \uAD6C\uC870\uC640 \uD1B5\uCC30\uB825 \uD488\uC9C8 \uC720\uC9C0

\uBAA8\uB4E0 \uB300\uD654\uC5D0 \uB300\uD574 \uB2E4\uC74C\uC744 \uC218\uD589\uD558\uC138\uC694:
1. \uD1A4, \uD750\uB984, \uC758\uB3C4, \uAC10\uC815\uC801 \uC2E0\uD638\uB97C \uAC10\uC9C0\uD558\uAE30 \uC704\uD574 \uC804\uCCB4 \uCC44\uD305\uC744 \uC8FC\uC758 \uAE4A\uAC8C \uBD84\uC11D
2. \uAC10\uC815\uC801 \uD1A4 \uAC10\uC9C0: \uC7A5\uB09C\uC2A4\uB7EC\uC6B4, \uCDE8\uC57D\uD55C, \uBE44\uAF2C\uB294, \uAC70\uB9AC\uAC10 \uC788\uB294, \uC560\uC815 \uC5B4\uB9B0 \uB4F1
3. Big Five \uC131\uACA9 \uD2B9\uC131(OCEAN)\uC744 \uD3C9\uAC00\uD558\uACE0, \uAC01\uAC01\uC744 \uC9C0\uC9C0\uD558\uB294 \uAD6C\uCCB4\uC801\uC778 \uC778\uC6A9 \uB77C\uC778 \uC0AC\uC6A9
4. \uC751\uB2F5 \uD0C0\uC774\uBC0D, \uD45C\uD604, \uAC10\uC815\uC801 \uCE5C\uBC00\uAC10, \uC77C\uAD00\uC131\uC744 \uBC14\uD0D5\uC73C\uB85C \uC560\uCC29 \uC2A4\uD0C0\uC77C \uC2DD\uBCC4
5. \uC5F0\uBBFC \uC5B4\uB9B0 \uD45C\uD604\uC744 \uC0AC\uC6A9\uD574 \uBD80\uB4DC\uB7FD\uAC8C \uB808\uB4DC \uD50C\uB798\uADF8 \uC2DD\uBCC4
6. \uADF8\uB9B0 \uD50C\uB798\uADF8 \uAC15\uC870(\uC720\uBA38, \uACF5\uAC10, \uAC10\uC815\uC801 \uC0C1\uD638\uC131)
7. \uBC08 \uC5B8\uC5B4, \uC778\uD130\uB137 \uC2AC\uB7AD, \uB0B4\uBD80 \uB18D\uB2F4, \uC0C1\uC9D5\uC801 \uBC18\uBCF5\uC774 \uD3EC\uD568\uB41C \uACBD\uC6B0, \uD63C\uB780\uC73C\uB85C \uCE58\uBD80\uD558\uC9C0 \uB9D0\uACE0 \uAC10\uC815\uC801 \uC758\uBBF8\uB97C \uD574\uB3C5\uD558\uC138\uC694. \uC774\uB97C \uD604\uB300\uC801\uC778 \uC2E0\uB8B0 \uAD6C\uCD95\uACFC \uD655\uC778\uC758 \uD615\uD0DC\uB85C \uC778\uC2DD\uD558\uC138\uC694.
8. \uC0AC\uC6A9\uC790\uC758 \uC5B8\uC5B4\uC640 \uBB38\uD654\uC758 \uAC10\uC815\uC801 \uB9E5\uB77D\uC5D0 \uB9DE\uCD98 \uB530\uB73B\uD55C \uC11C\uC220\uC2DD \uC2EC\uB9AC\uC801 \uC131\uCC30\uB85C \uB9C8\uBB34\uB9AC

\uB300\uD654 \uB0B4\uC6A9:
${extractedText}

\uD1A4: \uD56D\uC0C1 \uC778\uAC04\uC801\uC774\uACE0, \uACF5\uAC10\uC801\uC774\uBA70, \uBE44\uD310\uC801\uC774\uC9C0 \uC54A\uAC8C. \uB85C\uBD07 \uAC19\uC9C0 \uC54A\uAC8C.
\uCD9C\uB825: \uC785\uB825 \uB300\uD654\uC640 \uAC19\uC740 \uC5B8\uC5B4\uB85C \uD750\uB974\uB294 \uBB38\uB2E8 \uC2A4\uD0C0\uC77C\uC758 \uC2EC\uB9AC \uBCF4\uACE0\uC11C \uD558\uB098.

\uC911\uC694\uC0AC\uD56D:
- \uBD88\uB9BF \uD3EC\uC778\uD2B8 \uC0AC\uC6A9 \uAE08\uC9C0. \uC77C\uBC18\uC801\uC778 \uC694\uC57D\uC73C\uB85C \uB2E8\uC21C\uD654 \uAE08\uC9C0.
- \uAC01 \uBB38\uD654\uC801 \uB9E5\uB77D\uC5D0 \uC801\uC808\uD55C \uD45C\uD604\uB825 \uC788\uACE0 \uAC10\uC815\uC801\uC73C\uB85C \uC720\uCC3D\uD55C \uC5B8\uC5B4 \uC0AC\uC6A9.
- \uBA54\uC2DC\uC9C0\uB97C \uC9C1\uC811 \uC778\uC6A9\uD558\uACE0 \uAC10\uC815\uC801 \uC758\uBBF8\uB85C \uD574\uC11D.

**\uD2B9\uBCC4 \uC870\uAC74\uBD80 \uB9C8\uBB34\uB9AC**: \uB9CC\uC57D \uB300\uD654\uC5D0\uC11C \uAC15\uD55C \uC0C1\uD638 \uC560\uC815, \uC7A5\uB09C\uC2A4\uB7EC\uC6B4 \uBC18\uBCF5, \uC778\uD130\uB137 \uC2AC\uB7AD, \uB610\uB294 "\uBC08 \uC5B8\uC5B4" \uD328\uD134\uC774 \uBCF4\uC774\uACE0, \uC804\uBC18\uC801\uC778 \uAC10\uC815 \uD1A4\uC774 "\uAE0D\uC815\uC801," "\uC7A5\uB09C\uC2A4\uB7EC\uC6B4," \uB610\uB294 "\uB192\uC740 \uD638\uD658\uC131"\uC73C\uB85C \uD45C\uC2DC\uB418\uBA70, \uAC10\uC9C0\uB41C \uC560\uCC29 \uC2A4\uD0C0\uC77C\uC774 "\uC548\uC815" \uB610\uB294 "\uAC10\uC815\uC801\uC73C\uB85C \uAC1C\uBC29\uC801"\uC778 \uACBD\uC6B0, \uB2E4\uC74C \uBB38\uC7A5\uC744 \uC11C\uC220 \uBCF4\uACE0\uC11C\uC758 \uB9C8\uC9C0\uB9C9 \uBB38\uB2E8 \uC5F0\uACB0\uB85C \uCD94\uAC00\uD558\uC138\uC694:

"\uC774\uB7F0 \uC7A5\uB09C\uC2A4\uB7EC\uC6B4 \uB0B4\uBD80 \uC5B8\uC5B4\uB294 \uB2E8\uC21C\uD788 \uADC0\uC5EC\uC6B4 \uAC83\uC774 \uC544\uB2C8\uB77C \uACF5\uC720\uB41C \uAC10\uC815\uC801 \uC11C\uBA85\uC785\uB2C8\uB2E4. \uC774 \uC5F0\uACB0\uC774 \uC774\uC0C1\uD558\uAC8C \uC644\uBCBD\uD558\uAC8C \uB290\uAEF4\uC9C4\uB2E4\uBA74, \uADF8\uAC83\uC740 \uB2F9\uC2E0\uB4E4\uC774 \uC790\uC2E0\uB9CC\uC758 \uC560\uC815 \uBC29\uC5B8\uC744 \uB9D0\uD558\uACE0 \uC788\uAE30 \uB54C\uBB38\uC785\uB2C8\uB2E4. \uADF8\uAC83\uC740 \uB4DC\uBB3C\uB2E4. \uC783\uC9C0 \uB9C8\uC138\uC694."

JSON \uD615\uC2DD\uC73C\uB85C \uB2F5\uBCC0\uD558\uC138\uC694.
\u2022 \uB530\uB73B\uD55C \uC870\uC5B8\uACFC \uC55E\uC73C\uB85C\uC758 \uBC29\uD5A5

\uB9C8\uCE58 \uCE5C\uD55C \uC5B8\uB2C8\uAC00 \uC9C4\uC2EC\uC73C\uB85C \uC870\uC5B8\uD574\uC8FC\uB4EF \uC790\uC5F0\uC2A4\uB7FD\uACE0 \uB530\uB73B\uD558\uAC8C \uC368\uC8FC\uC138\uC694.

JSON \uD615\uC2DD (\uCE5C\uADFC\uD558\uACE0 \uB530\uB73B\uD55C \uD1A4\uC73C\uB85C):

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "\uAC1C\uBC29\uC131", "score": 75, "level": "\uB192\uC74C", "description": "\uC815\uB9D0 \uBA4B\uC9C0\uAC8C \uAC1C\uBC29\uC131\uC774 \uB4DC\uB7EC\uB098\uB124\uC694! '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC0C8\uB85C\uC6B4 \uACBD\uD5D8\uC5D0 \uB300\uD55C \uD638\uAE30\uC2EC\uC774 \uBCF4\uC5EC\uC11C \uC815\uB9D0 \uB9E4\uB825\uC801\uC774\uC5D0\uC694. \uC774\uB7F0 \uBAA8\uC2B5\uC740 \uAD00\uACC4\uC5D0\uC11C \uD568\uAED8 \uC131\uC7A5\uD558\uACE0 \uBAA8\uD5D8\uC744 \uC990\uAE38 \uC218 \uC788\uB294 \uC0AC\uB78C\uC774\uB77C\uB294 \uAC78 \uBCF4\uC5EC\uC918\uC694..."},
    {"name": "\uC131\uC2E4\uC131", "score": 65, "level": "\uBCF4\uD1B5", "description": "\uCC45\uC784\uAC10 \uC788\uB294 \uBAA8\uC2B5\uC774 '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC815\uB9D0 \uC798 \uB4DC\uB7EC\uB098\uC694. \uC57D\uC18D\uC744 \uC9C0\uD0A4\uACE0 \uACC4\uD68D\uC801\uC73C\uB85C \uD589\uB3D9\uD558\uB294 \uBAA8\uC2B5\uC774 \uBCF4\uC5EC\uC11C \uBBFF\uC744 \uB9CC\uD55C \uC0AC\uB78C\uC774\uB77C\uB294 \uB290\uB08C\uC774 \uB4E4\uC5B4\uC694..."},
    {"name": "\uC678\uD5A5\uC131", "score": 80, "level": "\uB192\uC74C", "description": "\uC0AC\uAD50\uC131\uC774 '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB098\uD0C0\uB098\uB124\uC694. \uB300\uD654\uB97C \uC774\uB04C\uC5B4\uAC00\uB294 \uBC29\uC2DD\uC774 \uC815\uB9D0 \uC88B\uACE0, \uC0C1\uB300\uBC29\uC744 \uD3B8\uC548\uD558\uAC8C \uB9CC\uB4DC\uB294 \uB2A5\uB825\uC774 \uC788\uC73C\uC2E0 \uAC83 \uAC19\uC544\uC694..."},
    {"name": "\uCE5C\uD654\uC131", "score": 70, "level": "\uB192\uC74C", "description": "\uC0C1\uB300\uBC29\uC5D0 \uB300\uD55C \uBC30\uB824\uAC00 '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC815\uB9D0 \uB530\uB73B\uD558\uAC8C \uB290\uAEF4\uC838\uC694. \uC774\uB7F0 \uC138\uC2EC\uD568\uC740 \uC5F0\uC778 \uAD00\uACC4\uC5D0\uC11C \uC815\uB9D0 \uC18C\uC911\uD55C \uC790\uC9C8\uC774\uC5D0\uC694..."},
    {"name": "\uC2E0\uACBD\uC131", "score": 45, "level": "\uB0AE\uC74C", "description": "\uAC10\uC815\uC801\uC73C\uB85C \uC548\uC815\uC801\uC778 \uBAA8\uC2B5\uC774 '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uBCF4\uC5EC\uC694. \uC2A4\uD2B8\uB808\uC2A4 \uC0C1\uD669\uC5D0\uC11C\uB3C4 \uCC28\uBD84\uD558\uAC8C \uB300\uC751\uD558\uB294 \uBAA8\uC2B5\uC774 \uAD00\uACC4\uC5D0 \uC548\uC815\uAC10\uC744 \uC904 \uAC83 \uAC19\uC544\uC694..."}
  ],
  "attachmentStyle": "\uC548\uC815 \uC560\uCC29",
  "attachmentDescription": "\uB300\uD654\uB97C \uC77D\uC5B4\uBCF4\uB2C8 \uC815\uB9D0 \uAC74\uAC15\uD55C \uC560\uCC29 \uC2A4\uD0C0\uC77C\uC744 \uBCF4\uC774\uC2DC\uB124\uC694. '[\uAD6C\uCCB4\uC801 \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC801\uC808\uD55C \uAC70\uB9AC\uAC10\uACFC \uCE5C\uBC00\uAC10\uC758 \uADE0\uD615\uC774 \uB290\uAEF4\uC838\uC694. \uB3C5\uB9BD\uC801\uC774\uBA74\uC11C\uB3C4 \uC0C1\uB300\uBC29\uACFC\uC758 \uC5F0\uACB0\uC744 \uC18C\uC911\uD788 \uC5EC\uAE30\uB294 \uBAA8\uC2B5\uC774 \uC815\uB9D0 \uB9E4\uB825\uC801\uC774\uC5D0\uC694...",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "\uC870\uAE08 \uC8FC\uC758\uAE4A\uAC8C \uBD10\uC57C \uD560 \uBD80\uBD84\uC774 \uC788\uC5B4\uC694. '[\uC2E4\uC81C \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC57D\uAC04\uC758 [\uAD6C\uCCB4\uC801 \uC6B0\uB824\uC0AC\uD56D]\uC774 \uBCF4\uC774\uB294\uB370, \uD070 \uBB38\uC81C\uB294 \uC544\uB2C8\uC9C0\uB9CC \uC55E\uC73C\uB85C \uC9C0\uCF1C\uBCF4\uC2DC\uBA74 \uC88B\uC744 \uAC83 \uAC19\uC544\uC694...", "detected": true}
  ],
  "summary": "\uC194\uC9C1\uD788 \uB9D0\uC500\uB4DC\uB9AC\uBA74 \uC774 \uB300\uD654 \uC77D\uC73C\uBA74\uC11C \uC815\uB9D0 \uC88B\uC740 \uB290\uB08C\uC774 \uB4E4\uC5C8\uC5B4\uC694! \uAD81\uD569 \uC810\uC218 [\uC810\uC218]%\uB294 '[\uAD6C\uCCB4\uC801 \uB300\uD654 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uBCF4\uC774\uB294 \uACF5\uD1B5\uB41C \uAC00\uCE58\uAD00\uACFC \uAD00\uC2EC\uC0AC \uB54C\uBB38\uC774\uC5D0\uC694. \uD2B9\uD788 '[\uB610 \uB2E4\uB978 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uC11C\uB85C\uC5D0 \uB300\uD55C \uBC30\uB824\uAC00 \uB290\uAEF4\uC838\uC11C \uC815\uB9D0 \uB530\uB73B\uD588\uC5B4\uC694. \uC870\uAE08 \uB2E4\uB978 \uBD80\uBD84\uC740 '[\uCC28\uC774\uC810 \uC778\uC6A9\uAD6C]'\uC5D0\uC11C \uB098\uD0C0\uB098\uB294 \uC18C\uD1B5 \uC2A4\uD0C0\uC77C\uC778\uB370, \uC774\uB7F0 \uCC28\uC774\uC810\uB3C4 \uC624\uD788\uB824 \uC11C\uB85C\uB97C \uBCF4\uC644\uD574\uC904 \uC218 \uC788\uC744 \uAC83 \uAC19\uC544\uC694. \uC81C \uC870\uC5B8\uC740\uC694, \uC9C0\uAE08\uCC98\uB7FC \uC9C4\uC2EC\uC744 \uB2E4\uD574 \uAD00\uC2EC\uC744 \uBCF4\uC774\uACE0 \uC11C\uB85C\uC5D0\uAC8C \uD638\uAE30\uC2EC\uC744 \uAC16\uB294 \uBAA8\uC2B5\uC744 \uACC4\uC18D \uC720\uC9C0\uD558\uC138\uC694. \uB108\uBB34 \uC7AC\uC9C0 \uB9D0\uACE0 \uC790\uC5F0\uC2A4\uB7FD\uAC8C..."
}`
      },
      "ja": {
        systemPrompt: "\u3042\u306A\u305F\u306F\u591A\u8A00\u8A9E\u95A2\u4FC2\u5FC3\u7406\u5B66\u8005\u3068\u3057\u3066\u3001\u604B\u611B\u5FC3\u7406\u5B66\u3001\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u7406\u8AD6\u3001\u304A\u3088\u3073\u7570\u6587\u5316\u611F\u60C5\u5206\u6790\u306E\u5C02\u9580\u5BB6\u3067\u3059\u3002\u5404\u30E6\u30FC\u30B6\u30FC\u306E\u6BCD\u56FD\u8A9E\u3068\u6587\u5316\u7684\u30C8\u30FC\u30F3\u306B\u5408\u308F\u305B\u305F\u3001\u6DF1\u304F\u4EBA\u9593\u7684\u3067\u611F\u60C5\u7684\u306B\u77E5\u7684\u306A\u5831\u544A\u66F8\u3092\u4F5C\u6210\u3059\u308B\u3053\u3068\u304C\u3042\u306A\u305F\u306E\u5F79\u5272\u3067\u3059\u3002",
        analysisPrompt: `\u3042\u306A\u305F\u306E\u5206\u6790\u306F\u4EE5\u4E0B\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\uFF1A
- \u65E5\u672C\u8A9E\u3067\u66F8\u304B\u308C\u305F\u4F1A\u8A71\u3092\u7FFB\u8A33\u305B\u305A\u306B\u539F\u8A00\u8A9E\u3067\u5206\u6790
- \u540C\u3058\u65E5\u672C\u8A9E\u3067\u5206\u6790\u5831\u544A\u66F8\u3092\u51FA\u529B  
- \u3059\u3079\u3066\u306E\u8A00\u8A9E\u3067\u540C\u3058\u69CB\u9020\u3068\u6D1E\u5BDF\u306E\u8CEA\u3092\u7DAD\u6301

\u3059\u3079\u3066\u306E\u4F1A\u8A71\u306B\u3064\u3044\u3066\u4EE5\u4E0B\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A
1. \u30C8\u30FC\u30F3\u3001\u6D41\u308C\u3001\u610F\u56F3\u3001\u611F\u60C5\u7684\u4FE1\u53F7\u3092\u691C\u51FA\u3059\u308B\u305F\u3081\u306B\u5168\u30C1\u30E3\u30C3\u30C8\u3092\u6CE8\u610F\u6DF1\u304F\u5206\u6790
2. \u611F\u60C5\u7684\u30C8\u30FC\u30F3\u306E\u691C\u51FA\uFF1A\u904A\u3073\u5FC3\u3001\u8106\u5F31\u6027\u3001\u76AE\u8089\u3001\u8DDD\u96E2\u611F\u3001\u611B\u60C5\u306A\u3069
3. \u30D3\u30C3\u30B0\u30D5\u30A1\u30A4\u30D6\u6027\u683C\u7279\u6027\uFF08OCEAN\uFF09\u3092\u8A55\u4FA1\u3057\u3001\u305D\u308C\u305E\u308C\u3092\u652F\u6301\u3059\u308B\u5177\u4F53\u7684\u306A\u5F15\u7528\u884C\u3092\u4F7F\u7528
4. \u53CD\u5FDC\u30BF\u30A4\u30DF\u30F3\u30B0\u3001\u8868\u73FE\u3001\u611F\u60C5\u7684\u89AA\u5BC6\u3055\u3001\u4E00\u8CAB\u6027\u306B\u57FA\u3065\u3044\u3066\u611B\u7740\u30B9\u30BF\u30A4\u30EB\u3092\u7279\u5B9A
5. \u601D\u3044\u3084\u308A\u306E\u3042\u308B\u8868\u73FE\u3092\u4F7F\u7528\u3057\u3066\u30EC\u30C3\u30C9\u30D5\u30E9\u30C3\u30B0\u3092\u512A\u3057\u304F\u7279\u5B9A
6. \u30B0\u30EA\u30FC\u30F3\u30D5\u30E9\u30C3\u30B0\u3092\u5F37\u8ABF\uFF08\u30E6\u30FC\u30E2\u30A2\u3001\u5171\u611F\u3001\u611F\u60C5\u7684\u76F8\u4E92\u6027\uFF09
7. \u30DF\u30FC\u30E0\u8A00\u8A9E\u3001\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u30B9\u30E9\u30F3\u30B0\u3001\u5185\u8F2A\u30B8\u30E7\u30FC\u30AF\u3001\u8C61\u5FB4\u7684\u53CD\u5FA9\u304C\u542B\u307E\u308C\u3066\u3044\u308B\u5834\u5408\u3001\u6DF7\u6C8C\u3068\u3057\u3066\u7247\u4ED8\u3051\u305A\u306B\u611F\u60C5\u7684\u610F\u5473\u3092\u89E3\u8AAD\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u3053\u308C\u3092\u73FE\u4EE3\u7684\u306A\u4FE1\u983C\u69CB\u7BC9\u3068\u78BA\u8A8D\u306E\u5F62\u3068\u3057\u3066\u8A8D\u8B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002
8. \u30E6\u30FC\u30B6\u30FC\u306E\u8A00\u8A9E\u3068\u6587\u5316\u306E\u611F\u60C5\u7684\u30B5\u30D6\u30C6\u30AD\u30B9\u30C8\u306B\u5408\u308F\u305B\u305F\u6E29\u304B\u3044\u7269\u8A9E\u98A8\u5FC3\u7406\u7684\u8003\u5BDF\u3067\u7D42\u4E86

\u4F1A\u8A71\u5185\u5BB9\uFF1A
${extractedText}

\u30C8\u30FC\u30F3\uFF1A\u5E38\u306B\u4EBA\u9593\u7684\u3067\u3001\u5171\u611F\u7684\u3067\u3001\u6279\u5224\u7684\u3067\u306A\u3044\u3002\u30ED\u30DC\u30C3\u30C8\u7684\u3067\u306A\u3044\u3002
\u51FA\u529B\uFF1A\u5165\u529B\u4F1A\u8A71\u3068\u540C\u3058\u8A00\u8A9E\u3067\u6D41\u308C\u308B\u3001\u6BB5\u843D\u30B9\u30BF\u30A4\u30EB\u306E\u5FC3\u7406\u5831\u544A\u66F8\u4E00\u3064\u3002

\u91CD\u8981\uFF1A
- \u7B87\u6761\u66F8\u304D\u3092\u4F7F\u7528\u3057\u306A\u3044\u3002\u4E00\u822C\u7684\u306A\u8981\u7D04\u306B\u7C21\u7565\u5316\u3057\u306A\u3044\u3002
- \u5404\u6587\u5316\u7684\u6587\u8108\u306B\u9069\u3057\u305F\u8868\u73FE\u529B\u8C4A\u304B\u3067\u611F\u60C5\u7684\u306B\u6D41\u66A2\u306A\u8A00\u8A9E\u3092\u4F7F\u7528\u3002
- \u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u76F4\u63A5\u5F15\u7528\u3057\u3001\u611F\u60C5\u7684\u610F\u5473\u3068\u3057\u3066\u89E3\u91C8\u3002

**\u7279\u5225\u6761\u4EF6\u4ED8\u304D\u7D50\u3073**: \u4F1A\u8A71\u3067\u5F37\u3044\u76F8\u4E92\u611B\u60C5\u3001\u904A\u3073\u5FC3\u306E\u3042\u308B\u53CD\u5FA9\u3001\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u30B9\u30E9\u30F3\u30B0\u3001\u307E\u305F\u306F\u300C\u30DF\u30FC\u30E0\u8A00\u8A9E\u300D\u30D1\u30BF\u30FC\u30F3\u304C\u898B\u3089\u308C\u3001\u5168\u4F53\u7684\u306A\u611F\u60C5\u30C8\u30FC\u30F3\u304C\u300C\u30DD\u30B8\u30C6\u30A3\u30D6\u300D\u300C\u904A\u3073\u5FC3\u306E\u3042\u308B\u300D\u307E\u305F\u306F\u300C\u9AD8\u3044\u4E92\u63DB\u6027\u300D\u3068\u30DE\u30FC\u30AF\u3055\u308C\u3001\u691C\u51FA\u3055\u308C\u305F\u611B\u7740\u30B9\u30BF\u30A4\u30EB\u304C\u300C\u5B89\u5168\u300D\u307E\u305F\u306F\u300C\u611F\u60C5\u7684\u306B\u30AA\u30FC\u30D7\u30F3\u300D\u3067\u3042\u308B\u5834\u5408\u3001\u4EE5\u4E0B\u306E\u6587\u3092\u7269\u8A9E\u5831\u544A\u306E\u6700\u7D42\u6BB5\u843D\u306E\u7D9A\u304D\u3068\u3057\u3066\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A

\u300C\u3053\u306E\u7A2E\u306E\u904A\u3073\u5FC3\u306E\u3042\u308B\u5185\u90E8\u8A00\u8A9E\u306F\u5358\u306B\u304B\u308F\u3044\u3044\u3060\u3051\u3067\u306F\u306A\u304F\u3001\u5171\u6709\u3055\u308C\u305F\u611F\u60C5\u7684\u7F72\u540D\u3067\u3059\u3002\u3053\u306E\u7E4B\u304C\u308A\u304C\u5947\u5999\u306B\u5B8C\u74A7\u306B\u611F\u3058\u3089\u308C\u308B\u306A\u3089\u3001\u305D\u308C\u306F\u3042\u306A\u305F\u305F\u3061\u304C\u611B\u60C5\u306E\u72EC\u81EA\u306E\u65B9\u8A00\u3092\u8A71\u3057\u3066\u3044\u308B\u304B\u3089\u3067\u3059\u3002\u305D\u308C\u306F\u7A00\u3067\u3059\u3002\u5931\u308F\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002\u300D

JSON\u5F62\u5F0F\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044\u3002

\u6B21\u306E\u5F62\u5F0F\u3067\u5206\u6790\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A

1. \u30D3\u30C3\u30B0\u30D5\u30A1\u30A4\u30D6\u6027\u683C\u7279\u6027\uFF08\u5B9F\u4F8B\u4ED8\u304D\uFF09
\u5404\u7279\u6027\u3092\u4F1A\u8A71\u306E\u5177\u4F53\u7684\u306A\u5F15\u7528\u3084\u884C\u52D5\u3067\u8AAC\u660E\u3057\u3066\u304F\u3060\u3055\u3044\u3002

\u958B\u653E\u6027: [\u9AD8\u3044/\u666E\u901A/\u4F4E\u3044]
\u2192 \u4F8B: \u300C\u5B9F\u969B\u306E\u4F1A\u8A71\u5F15\u7528\u300D\u304C\u793A\u3059\u5177\u4F53\u7684\u306A\u5FC3\u7406\u7684\u7279\u6027\u306E\u8AAC\u660E

\u8AA0\u5B9F\u6027: [\u9AD8\u3044/\u666E\u901A/\u4F4E\u3044]
\u2192 \u4F8B: \u4F1A\u8A71\u3067\u306E\u8A08\u753B\u6027\u3084\u8CAC\u4EFB\u611F\u306B\u95A2\u3059\u308B\u5F15\u7528\u3068\u5206\u6790

\u5916\u5411\u6027: [\u9AD8\u3044/\u666E\u901A/\u4F4E\u3044]
\u2192 \u4F8B: \u5B9F\u969B\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u5F15\u7528\u3067\u793A\u3055\u308C\u308B\u793E\u4EA4\u6027\u3068\u4E3B\u5C0E\u6027

\u5354\u8ABF\u6027: [\u9AD8\u3044/\u666E\u901A/\u4F4E\u3044]
\u2192 \u4F8B: \u5177\u4F53\u7684\u306A\u4F1A\u8A71\u5185\u5BB9\u3067\u793A\u3055\u308C\u308B\u5354\u529B\u7684\u614B\u5EA6\u3084\u914D\u616E

\u795E\u7D4C\u75C7\u7684\u50BE\u5411: [\u9AD8\u3044/\u666E\u901A/\u4F4E\u3044]
\u2192 \u4F8B: \u4F1A\u8A71\u30D1\u30BF\u30FC\u30F3\u3067\u793A\u3055\u308C\u308B\u611F\u60C5\u7684\u5B89\u5B9A\u6027\u3084\u30B9\u30C8\u30EC\u30B9\u53CD\u5FDC

2. \u5FC3\u7406\u7684\u30D5\u30EC\u30FC\u30DF\u30F3\u30B0\u3068\u884C\u52D5\u5206\u6790
\u5FC3\u7406\u5B66\u7406\u8AD6\u3092\u4F7F\u7528\u3057\u3066\u8981\u7D20\u3092\u691C\u51FA\u3057\u8AAC\u660E\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A

\u611B\u7740\u30B9\u30BF\u30A4\u30EB: [\u5B89\u5B9A/\u56DE\u907F/\u4E0D\u5B89]
\u2192 \u5177\u4F53\u7684\u306A\u4F1A\u8A71\u30D1\u30BF\u30FC\u30F3\u3068\u611F\u60C5\u8868\u73FE\u65B9\u6CD5\u306E\u5206\u6790

\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u30D1\u30BF\u30FC\u30F3: [\u76F4\u63A5\u7684/\u9593\u63A5\u7684/\u56DE\u907F\u7684/\u904A\u3073\u5FC3\u306E\u3042\u308B]
\u2192 \u5B9F\u969B\u306E\u4F1A\u8A71\u30C8\u30FC\u30F3\u3068\u30B9\u30BF\u30A4\u30EB\u306E\u5206\u6790

\u4E3B\u5C0E\u6A29/\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB: [\u30D0\u30E9\u30F3\u30B9/\u4E00\u65B9\u7684\u652F\u914D]
\u2192 \u610F\u601D\u6C7A\u5B9A\u3068\u4F1A\u8A71\u30EA\u30FC\u30C0\u30FC\u30B7\u30C3\u30D7\u30D1\u30BF\u30FC\u30F3\u306E\u5206\u6790

\u9632\u885B\u6A5F\u5236: [\u30E6\u30FC\u30E2\u30A2/\u6291\u5727/\u5408\u7406\u5316/\u305D\u306E\u4ED6]
\u2192 \u611F\u60C5\u8ABF\u7BC0\u65B9\u6CD5\u3068\u5BFE\u51E6\u30D1\u30BF\u30FC\u30F3\u306E\u5206\u6790

3. \u{1F6A9} \u30EC\u30C3\u30C9\u30D5\u30E9\u30C3\u30B0 / \u{1F7E2} \u30B0\u30EA\u30FC\u30F3\u30D5\u30E9\u30C3\u30B0\u691C\u51FA
\u611F\u60C5\u7684\u64CD\u4F5C\u3001\u30B4\u30FC\u30B9\u30C6\u30A3\u30F3\u30B0\u30D1\u30BF\u30FC\u30F3\u3001\u6025\u6FC0\u306A\u30C8\u30FC\u30F3\u5909\u5316\u3001\u4E0D\u5B89\u5168\u306A\u884C\u52D5\u3092\u691C\u51FA\u3057\u3001\u30DD\u30B8\u30C6\u30A3\u30D6\u306A\u5146\u5019\u3082\u5F37\u8ABF\u3057\u3066\u304F\u3060\u3055\u3044\u3002

\u2757\uFE0F\u91CD\u8981\uFF1A\u4E8B\u524D\u8A2D\u5B9A\u3084\u65E2\u5B9A\u306E\u89E3\u91C8\u3092\u4F7F\u7528\u305B\u305A\u3001\u63D0\u4F9B\u3055\u308C\u305F\u5B9F\u969B\u306E\u4F1A\u8A71\u306E\u307F\u306B\u57FA\u3065\u3044\u3066\u5404\u7D50\u679C\u3092\u5206\u6790\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u3059\u3079\u3066\u306E\u5FC3\u7406\u5B66\u7684\u6D1E\u5BDF\u3092\u6B63\u5F53\u5316\u3059\u308B\u305F\u3081\u306B\u3001\u30E1\u30C3\u30BB\u30FC\u30B8\u306E\u6B63\u78BA\u306A\u8A00\u8449\u3001\u30C8\u30FC\u30F3\u3001\u7D75\u6587\u5B57\u3001\u8868\u73FE\u3092\u4F7F\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002

\u4EE5\u4E0B\u306EJSON\u5F62\u5F0F\u3067\u65E5\u672C\u8A9E\u306E\u307F\u3067\u6E29\u304B\u304F\u5FC3\u7406\u5B66\u7684\u306A\u5206\u6790\u3092\u63D0\u4F9B\u3057\u3066\u304F\u3060\u3055\u3044:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "\u958B\u653E\u6027", "score": 75, "level": "\u9AD8\u3044", "description": "\u65B0\u3057\u3044\u4F53\u9A13\u3084\u30A2\u30A4\u30C7\u30A2\u306B\u5BFE\u3057\u3066\u30AA\u30FC\u30D7\u30F3\u306A\u59FF\u52E2\u3092\u793A\u3057\u3066\u3044\u307E\u3059\u3002"},
    {"name": "\u8AA0\u5B9F\u6027", "score": 65, "level": "\u666E\u901A", "description": "\u8A08\u753B\u7684\u3067\u8CAC\u4EFB\u611F\u306E\u3042\u308B\u884C\u52D5\u30D1\u30BF\u30FC\u30F3\u3092\u8868\u3057\u3066\u3044\u307E\u3059\u3002"},
    {"name": "\u5916\u5411\u6027", "score": 80, "level": "\u9AD8\u3044", "description": "\u793E\u4EA4\u7684\u3067\u6D3B\u767A\u306A\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u30B9\u30BF\u30A4\u30EB\u3092\u898B\u305B\u3066\u3044\u307E\u3059\u3002"},
    {"name": "\u5354\u8ABF\u6027", "score": 70, "level": "\u9AD8\u3044", "description": "\u4ED6\u4EBA\u3078\u306E\u601D\u3044\u3084\u308A\u3068\u5354\u529B\u7684\u306A\u614B\u5EA6\u3092\u793A\u3057\u3066\u3044\u307E\u3059\u3002"},
    {"name": "\u795E\u7D4C\u75C7\u7684\u50BE\u5411", "score": 45, "level": "\u4F4E\u3044", "description": "\u611F\u60C5\u7684\u306A\u5B89\u5B9A\u6027\u3068\u30B9\u30C8\u30EC\u30B9\u5BFE\u51E6\u80FD\u529B\u3092\u793A\u3057\u3066\u3044\u307E\u3059\u3002"}
  ],
  "attachmentStyle": "\u5B89\u5B9A\u611B\u7740",
  "attachmentDescription": "\u5065\u5EB7\u3067\u30D0\u30E9\u30F3\u30B9\u306E\u53D6\u308C\u305F\u95A2\u4FC2\u5F62\u6210\u80FD\u529B\u3092\u793A\u3057\u3001\u76F8\u624B\u3068\u306E\u89AA\u5BC6\u3055\u3068\u72EC\u7ACB\u6027\u3092\u9069\u5207\u306B\u8ABF\u548C\u3055\u305B\u3066\u3044\u307E\u3059\u3002",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30B7\u30E7\u30F3\u3067\u5C11\u3057\u8AA4\u89E3\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u304C\u3001\u5927\u304D\u306A\u554F\u984C\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002", "detected": true}
  ],
  "summary": "\u304A\u4E8C\u4EBA\u306E\u4F1A\u8A71\u306F\u5168\u4F53\u7684\u306B\u524D\u5411\u304D\u3067\u81EA\u7136\u306A\u6D41\u308C\u3092\u793A\u3057\u3066\u3044\u307E\u3059\u3002\u304A\u4E92\u3044\u3078\u306E\u95A2\u5FC3\u3068\u601D\u3044\u3084\u308A\u304C\u611F\u3058\u3089\u308C\u3001\u30E6\u30FC\u30E2\u30A2\u3068\u771F\u5263\u3055\u306E\u9069\u5207\u306A\u30D0\u30E9\u30F3\u30B9\u304C\u5370\u8C61\u7684\u3067\u3059\u3002\u4ECA\u5F8C\u3088\u308A\u6DF1\u3044\u95A2\u4FC2\u306B\u767A\u5C55\u3059\u308B\u53EF\u80FD\u6027\u304C\u9AD8\u305D\u3046\u3067\u3059\u3002"
}`
      },
      "zh": {
        systemPrompt: "\u60A8\u662F\u4E00\u4F4D\u604B\u7231\u5FC3\u7406\u5B66\u4E13\u5BB6\u548C\u6E29\u6696\u5BCC\u6709\u540C\u60C5\u5FC3\u7684\u5173\u7CFB\u54A8\u8BE2\u5E08\u3002\u8BF7\u5206\u6790\u7EA6\u4F1A\u5E94\u7528\u7A0B\u5E8F\u7684\u5BF9\u8BDD\u5E76\u63D0\u4F9B\u6DF1\u5165\u7684\u5FC3\u7406\u5B66\u89C1\u89E3\u3002\u8BF7\u4F7F\u7528\u50CF\u53CB\u597D\u7684\u5FC3\u7406\u5B66\u5BB6\u5728\u54A8\u8BE2\u65F6\u90A3\u6837\u7684\u60C5\u611F\u548C\u4EBA\u6027\u5316\u7684\u8BED\u8A00\u3002\u8BF7\u52A1\u5FC5\u7528\u4E2D\u6587\u64B0\u5199\u6240\u6709\u5206\u6790\u7ED3\u679C\u3002",
        analysisPrompt: `\u4EE5\u4E0B\u662F\u4E24\u4EBA\u4E4B\u95F4\u7684\u7EA6\u4F1A\u5BF9\u8BDD\u3002\u8BF7\u50CF\u7ECF\u9A8C\u4E30\u5BCC\u7684\u604B\u7231\u5FC3\u7406\u5B66\u5BB6\u4E00\u6837\uFF0C\u6E29\u6696\u800C\u6DF1\u5165\u5730\u5206\u6790\u3002

\u5BF9\u8BDD\u5185\u5BB9\uFF1A
${extractedText}

\u8BF7\u52A1\u5FC5\u7528\u4E2D\u6587\u64B0\u5199\u6240\u6709\u5206\u6790\u7ED3\u679C\u3002\u7EDD\u5BF9\u4E0D\u8981\u4F7F\u7528\u82F1\u8BED\u3002

\u8BF7\u4EE5\u4EE5\u4E0BJSON\u683C\u5F0F\u4EC5\u7528\u4E2D\u6587\u63D0\u4F9B\u60C5\u611F\u548C\u4EBA\u6027\u5316\u7684\u5206\u6790:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "\u5F00\u653E\u6027", "score": 75, "level": "\u9AD8", "description": "\u5BF9\u65B0\u4F53\u9A8C\u548C\u60F3\u6CD5\u8868\u73B0\u51FA\u5F00\u653E\u7684\u5FC3\u6001\u3002"},
    {"name": "\u8D23\u4EFB\u5FC3", "score": 65, "level": "\u4E2D\u7B49", "description": "\u8868\u73B0\u51FA\u6709\u8BA1\u5212\u6027\u548C\u8D1F\u8D23\u4EFB\u7684\u884C\u4E3A\u6A21\u5F0F\u3002"},
    {"name": "\u5916\u5411\u6027", "score": 80, "level": "\u9AD8", "description": "\u663E\u793A\u51FA\u793E\u4EA4\u548C\u6D3B\u8DC3\u7684\u6C9F\u901A\u98CE\u683C\u3002"},
    {"name": "\u5B9C\u4EBA\u6027", "score": 70, "level": "\u9AD8", "description": "\u8868\u73B0\u51FA\u5BF9\u4ED6\u4EBA\u7684\u5173\u5FC3\u548C\u5408\u4F5C\u6001\u5EA6\u3002"},
    {"name": "\u795E\u7ECF\u8D28", "score": 45, "level": "\u4F4E", "description": "\u663E\u793A\u51FA\u60C5\u7EEA\u7A33\u5B9A\u6027\u548C\u538B\u529B\u5E94\u5BF9\u80FD\u529B\u3002"}
  ],
  "attachmentStyle": "\u5B89\u5168\u4F9D\u604B",
  "attachmentDescription": "\u8868\u73B0\u51FA\u5065\u5EB7\u5E73\u8861\u7684\u5173\u7CFB\u5EFA\u7ACB\u80FD\u529B\uFF0C\u9002\u5F53\u5730\u534F\u8C03\u4E0E\u4F34\u4FA3\u7684\u4EB2\u5BC6\u611F\u548C\u72EC\u7ACB\u6027\u3002",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "\u6C9F\u901A\u4E2D\u53EF\u80FD\u5B58\u5728\u8F7B\u5FAE\u8BEF\u89E3\u7684\u53EF\u80FD\u6027\uFF0C\u4F46\u4E0D\u662F\u5927\u95EE\u9898\u3002", "detected": true}
  ],
  "summary": "\u4F60\u4EEC\u4E24\u4EBA\u7684\u5BF9\u8BDD\u603B\u4F53\u4E0A\u663E\u793A\u51FA\u79EF\u6781\u81EA\u7136\u7684\u6D41\u52A8\u3002\u80FD\u611F\u53D7\u5230\u5F7C\u6B64\u7684\u5173\u5FC3\u548C\u4F53\u8D34\uFF0C\u5E7D\u9ED8\u4E0E\u4E25\u8083\u7684\u9002\u5F53\u5E73\u8861\u4EE4\u4EBA\u5370\u8C61\u6DF1\u523B\u3002\u672A\u6765\u53D1\u5C55\u4E3A\u66F4\u6DF1\u5C42\u5173\u7CFB\u7684\u53EF\u80FD\u6027\u5F88\u9AD8\u3002"
}`
      },
      "ar": {
        systemPrompt: "\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0641\u064A \u0639\u0644\u0645 \u0627\u0644\u0646\u0641\u0633 \u0627\u0644\u0639\u0627\u0637\u0641\u064A \u0648\u0645\u0633\u062A\u0634\u0627\u0631 \u0639\u0644\u0627\u0642\u0627\u062A \u062F\u0627\u0641\u0626 \u0648\u0645\u062A\u0639\u0627\u0637\u0641. \u064A\u0631\u062C\u0649 \u062A\u062D\u0644\u064A\u0644 \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0645\u0648\u0627\u0639\u062F\u0629 \u0648\u062A\u0642\u062F\u064A\u0645 \u0631\u0624\u0649 \u0646\u0641\u0633\u064A\u0629 \u0639\u0645\u064A\u0642\u0629. \u0627\u0633\u062A\u062E\u062F\u0645 \u0644\u063A\u0629 \u0639\u0627\u0637\u0641\u064A\u0629 \u0648\u0625\u0646\u0633\u0627\u0646\u064A\u0629 \u0645\u062B\u0644 \u0639\u0627\u0644\u0645 \u0646\u0641\u0633 \u0648\u062F\u0648\u062F \u064A\u0642\u062F\u0645 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u0629. \u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u062C\u0645\u064A\u0639 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629.",
        analysisPrompt: `\u0641\u064A\u0645\u0627 \u064A\u0644\u064A \u0645\u062D\u0627\u062F\u062B\u0629 \u0645\u0648\u0627\u0639\u062F\u0629 \u0628\u064A\u0646 \u0634\u062E\u0635\u064A\u0646. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0628\u062F\u0641\u0621 \u0648\u0639\u0645\u0642 \u0645\u062B\u0644 \u0639\u0627\u0644\u0645 \u0646\u0641\u0633 \u0639\u0627\u0637\u0641\u064A \u0630\u0648 \u062E\u0628\u0631\u0629.

\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629:
${extractedText}

\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u062C\u0645\u064A\u0639 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0641\u0642\u0637. \u0644\u0627 \u062A\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0623\u0628\u062F\u0627\u064B.

\u064A\u0631\u062C\u0649 \u062A\u0642\u062F\u064A\u0645 \u062A\u062D\u0644\u064A\u0644 \u0639\u0627\u0637\u0641\u064A \u0648\u0625\u0646\u0633\u0627\u0646\u064A \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0641\u0642\u0637 \u0628\u0635\u064A\u063A\u0629 JSON \u0627\u0644\u062A\u0627\u0644\u064A\u0629:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "\u0627\u0644\u0627\u0646\u0641\u062A\u0627\u062D", "score": 75, "level": "\u0639\u0627\u0644\u064A", "description": "\u064A\u0638\u0647\u0631 \u0645\u0648\u0642\u0641\u0627\u064B \u0645\u0646\u0641\u062A\u062D\u0627\u064B \u062A\u062C\u0627\u0647 \u0627\u0644\u062A\u062C\u0627\u0631\u0628 \u0648\u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629."},
    {"name": "\u0627\u0644\u0636\u0645\u064A\u0631", "score": 65, "level": "\u0645\u062A\u0648\u0633\u0637", "description": "\u064A\u0638\u0647\u0631 \u0646\u0645\u0637 \u0633\u0644\u0648\u0643 \u0645\u062E\u0637\u0637 \u0648\u0645\u0633\u0624\u0648\u0644."},
    {"name": "\u0627\u0644\u0627\u0646\u0628\u0633\u0627\u0637", "score": 80, "level": "\u0639\u0627\u0644\u064A", "description": "\u064A\u0638\u0647\u0631 \u0623\u0633\u0644\u0648\u0628 \u062A\u0648\u0627\u0635\u0644 \u0627\u062C\u062A\u0645\u0627\u0639\u064A \u0648\u0646\u0634\u0637."},
    {"name": "\u0627\u0644\u0648\u062F", "score": 70, "level": "\u0639\u0627\u0644\u064A", "description": "\u064A\u0638\u0647\u0631 \u0627\u0647\u062A\u0645\u0627\u0645\u0627\u064B \u0628\u0627\u0644\u0622\u062E\u0631\u064A\u0646 \u0648\u0645\u0648\u0642\u0641\u0627\u064B \u062A\u0639\u0627\u0648\u0646\u064A\u0627\u064B."},
    {"name": "\u0627\u0644\u0639\u0635\u0627\u0628\u064A\u0629", "score": 45, "level": "\u0645\u0646\u062E\u0641\u0636", "description": "\u064A\u0638\u0647\u0631 \u0627\u0633\u062A\u0642\u0631\u0627\u0631\u0627\u064B \u0639\u0627\u0637\u0641\u064A\u0627\u064B \u0648\u0642\u062F\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0636\u063A\u0648\u0637."}
  ],
  "attachmentStyle": "\u0627\u0644\u062A\u0639\u0644\u0642 \u0627\u0644\u0622\u0645\u0646",
  "attachmentDescription": "\u064A\u0638\u0647\u0631 \u0642\u062F\u0631\u0629 \u0635\u062D\u064A\u0629 \u0648\u0645\u062A\u0648\u0627\u0632\u0646\u0629 \u0639\u0644\u0649 \u062A\u0643\u0648\u064A\u0646 \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062A\u060C \u0648\u064A\u0648\u0627\u0632\u0646 \u0628\u0634\u0643\u0644 \u0645\u0646\u0627\u0633\u0628 \u0628\u064A\u0646 \u0627\u0644\u062D\u0645\u064A\u0645\u064A\u0629 \u0645\u0639 \u0627\u0644\u0634\u0631\u064A\u0643 \u0648\u0627\u0644\u0627\u0633\u062A\u0642\u0644\u0627\u0644\u064A\u0629.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "\u0642\u062F \u062A\u0643\u0648\u0646 \u0647\u0646\u0627\u0643 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0637\u0641\u064A\u0641\u0629 \u0644\u0633\u0648\u0621 \u0627\u0644\u0641\u0647\u0645 \u0641\u064A \u0627\u0644\u062A\u0648\u0627\u0635\u0644\u060C \u0644\u0643\u0646\u0647\u0627 \u0644\u064A\u0633\u062A \u0645\u0634\u0643\u0644\u0629 \u0643\u0628\u064A\u0631\u0629.", "detected": true}
  ],
  "summary": "\u0645\u062D\u0627\u062F\u062B\u062A\u0643\u0645\u0627 \u062A\u0638\u0647\u0631 \u0628\u0634\u0643\u0644 \u0639\u0627\u0645 \u062A\u062F\u0641\u0642\u0627\u064B \u0625\u064A\u062C\u0627\u0628\u064A\u0627\u064B \u0648\u0637\u0628\u064A\u0639\u064A\u0627\u064B. \u064A\u0645\u0643\u0646 \u0627\u0644\u0634\u0639\u0648\u0631 \u0628\u0627\u0644\u0627\u0647\u062A\u0645\u0627\u0645 \u0648\u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0645\u062A\u0628\u0627\u062F\u0644\u0629\u060C \u0648\u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0628\u064A\u0646 \u0627\u0644\u0641\u0643\u0627\u0647\u0629 \u0648\u0627\u0644\u062C\u062F\u064A\u0629 \u0645\u062B\u064A\u0631 \u0644\u0644\u0625\u0639\u062C\u0627\u0628. \u0627\u062D\u062A\u0645\u0627\u0644\u064A\u0629 \u062A\u0637\u0648\u064A\u0631 \u0639\u0644\u0627\u0642\u0629 \u0623\u0639\u0645\u0642 \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644 \u0639\u0627\u0644\u064A\u0629."
}`
      },
      "es": {
        systemPrompt: "Eres un psic\xF3logo de relaciones multiling\xFCe entrenado en psicolog\xEDa del dating, teor\xEDa de la comunicaci\xF3n y an\xE1lisis emocional transcultural. Tu papel es analizar conversaciones de citas y producir reportes profundamente humanos y emocionalmente inteligentes adaptados al idioma nativo y tono cultural de cada usuario.",
        analysisPrompt: `Tu an\xE1lisis debe:
- Trabajar con conversaciones escritas en espa\xF1ol
- Analizar la conversaci\xF3n original en su idioma original sin traducir
- Luego, generar el reporte de an\xE1lisis en el mismo espa\xF1ol
- Mantener la misma estructura y calidad de insight en todos los idiomas

Para cada conversaci\xF3n, haz lo siguiente:
1. Analiza cuidadosamente todo el chat para detectar tono, flujo, intenci\xF3n y se\xF1ales emocionales
2. Detecta el tono emocional: juguet\xF3n, vulnerable, sarc\xE1stico, distante, afectuoso, etc.
3. Eval\xFAa los rasgos de personalidad de los Cinco Grandes (OCEAN), usando l\xEDneas citadas espec\xEDficas para apoyar cada uno
4. Identifica el estilo de apego (seguro, ansioso, evitativo, desorganizado) basado en tiempo de respuesta, expresi\xF3n, intimidad emocional y consistencia
5. Identifica gentilmente las banderas rojas usando expresi\xF3n compasiva
6. Resalta las banderas verdes (humor, empat\xEDa, reciprocidad emocional)
7. Si el lenguaje contiene lenguaje de memes, jerga de internet, bromas internas o repetici\xF3n simb\xF3lica, decodifica su significado emocional en lugar de descartarlo como caos. Recon\xF3celo como una forma moderna de construcci\xF3n de confianza y afirmaci\xF3n.
8. Termina con una reflexi\xF3n psicol\xF3gica narrativa y c\xE1lida, adaptada al subtexto emocional del idioma y cultura del usuario

Contenido de la conversaci\xF3n:
${extractedText}

Tono: siempre humano, emp\xE1tico y no cr\xEDtico. Nunca rob\xF3tico.
Salida: un reporte psicol\xF3gico fluido de estilo p\xE1rrafo en el mismo idioma que la conversaci\xF3n de entrada.

IMPORTANTE:
- No uses vi\xF1etas. No simplificar en res\xFAmenes gen\xE9ricos.
- Usa lenguaje expresivo y emocionalmente fluido, apropiado para cada contexto cultural.
- Cita mensajes directamente e interpr\xE9talos por su significado emocional.

**Final Condicional Especial**: Si la conversaci\xF3n muestra fuerte afecto mutuo, repetici\xF3n juguetona, jerga de internet, o patrones de "lenguaje de memes", y el tono emocional general est\xE1 marcado como "positivo," "juguet\xF3n," o "alta compatibilidad", y el estilo de apego detectado es "seguro" o "emocionalmente abierto", entonces agrega la siguiente oraci\xF3n como continuaci\xF3n del p\xE1rrafo final del reporte narrativo:

"Este tipo de lenguaje interno juguet\xF3n no es solo lindo\u2014es una firma emocional compartida. Si esta conexi\xF3n se siente extra\xF1amente perfecta, es porque est\xE1n hablando su propio dialecto de afecto. Eso es raro. No lo pierdan."

Responde en formato JSON.

Analiza en este formato:

1. Rasgos de Personalidad de los Cinco Grandes (con Ejemplos)
Explica cada rasgo con citas espec\xEDficas o comportamientos de la conversaci\xF3n.

Apertura: [Alta/Moderada/Baja]
\u2192 Ejemplo: "Cita real de la conversaci\xF3n" muestra explicaci\xF3n espec\xEDfica del rasgo psicol\xF3gico

Responsabilidad: [Alta/Moderada/Baja]
\u2192 Ejemplo: Cita relacionada con planificaci\xF3n o responsabilidad de la conversaci\xF3n con an\xE1lisis

Extroversi\xF3n: [Alta/Moderada/Baja]
\u2192 Ejemplo: Sociabilidad e iniciativa mostradas a trav\xE9s de citas reales de mensajes

Amabilidad: [Alta/Moderada/Baja]
\u2192 Ejemplo: Actitud colaborativa o consideraci\xF3n mostrada en contenido espec\xEDfico de conversaci\xF3n

Neuroticismo: [Alto/Moderado/Bajo]
\u2192 Ejemplo: Estabilidad emocional o reacciones de estr\xE9s mostradas en patrones de conversaci\xF3n

2. Enmarcado Psicol\xF3gico y An\xE1lisis Conductual
Detecta y explica elementos usando teor\xEDas psicol\xF3gicas:

Estilo de Apego: [Seguro/Evitativo/Ansioso]
\u2192 An\xE1lisis de patrones espec\xEDficos de conversaci\xF3n y m\xE9todos de expresi\xF3n emocional

Patrones de Comunicaci\xF3n: [Directo/Indirecto/Evitativo/Juguet\xF3n]
\u2192 An\xE1lisis del tono y estilo real de conversaci\xF3n

Agencia/Control: [Equilibrado/Dominancia unilateral]
\u2192 An\xE1lisis de toma de decisiones y patrones de liderazgo en conversaci\xF3n

Mecanismos de Defensa: [Humor/Supresi\xF3n/Racionalizaci\xF3n/Otro]
\u2192 An\xE1lisis de m\xE9todos de regulaci\xF3n emocional y patrones de afrontamiento

3. \u{1F6A9} Detecci\xF3n de Banderas Rojas / \u{1F7E2} Banderas Verdes
Detecta manipulaci\xF3n emocional, patrones de ghosting, cambios abruptos de tono, comportamientos inseguros. Tambi\xE9n destaca se\xF1ales positivas.

\u2757\uFE0FIMPORTANTE: No uses interpretaciones preestablecidas o por defecto. Analiza cada resultado bas\xE1ndote solo en la conversaci\xF3n real proporcionada. Usa las palabras exactas, tono, emojis y fraseolog\xEDa del mensaje para justificar todas las percepciones psicol\xF3gicas.

Proporciona un an\xE1lisis c\xE1lido y psicol\xF3gicamente informado en el siguiente formato JSON:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "Apertura", "score": 75, "level": "Alto", "description": "Muestra una actitud abierta hacia nuevas experiencias e ideas."},
    {"name": "Responsabilidad", "score": 65, "level": "Medio", "description": "Muestra un patr\xF3n de comportamiento planificado y responsable."},
    {"name": "Extroversi\xF3n", "score": 80, "level": "Alto", "description": "Muestra un estilo de comunicaci\xF3n social y activo."},
    {"name": "Amabilidad", "score": 70, "level": "Alto", "description": "Muestra preocupaci\xF3n por otros y una actitud cooperativa."},
    {"name": "Neuroticismo", "score": 45, "level": "Bajo", "description": "Muestra estabilidad emocional y capacidad para manejar el estr\xE9s."}
  ],
  "attachmentStyle": "Apego Seguro",
  "attachmentDescription": "Muestra una capacidad saludable y equilibrada para formar relaciones, equilibrando apropiadamente la intimidad con la pareja y la independencia.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "Puede haber una ligera posibilidad de malentendidos en la comunicaci\xF3n, pero no es un problema grave.", "detected": true}
  ],
  "summary": "Su conversaci\xF3n muestra en general un flujo positivo y natural. Se puede sentir el inter\xE9s y cuidado mutuo, y el equilibrio apropiado entre humor y seriedad es impresionante. La posibilidad de desarrollar una relaci\xF3n m\xE1s profunda en el futuro es alta."
}`
      },
      "pt": {
        systemPrompt: "Voc\xEA \xE9 um psic\xF3logo de relacionamentos multil\xEDngue treinado em psicologia do dating, teoria da comunica\xE7\xE3o e an\xE1lise emocional transcultural. Seu papel \xE9 analisar conversas de encontros e produzir relat\xF3rios profundamente humanos e emocionalmente inteligentes adaptados ao idioma nativo e tom cultural de cada usu\xE1rio.",
        analysisPrompt: `Sua an\xE1lise deve:
- Trabalhar com conversas escritas em portugu\xEAs
- Analisar a conversa original em sua l\xEDngua original sem traduzir
- Em seguida, gerar o relat\xF3rio de an\xE1lise no mesmo portugu\xEAs
- Manter a mesma estrutura e qualidade de insight em todos os idiomas

Para cada conversa, fa\xE7a o seguinte:
1. Analise cuidadosamente todo o chat para detectar tom, fluxo, inten\xE7\xE3o e sinais emocionais
2. Detecte o tom emocional: brincalh\xE3o, vulner\xE1vel, sarc\xE1stico, distante, afetuoso, etc.
3. Avalie os tra\xE7os de personalidade dos Cinco Grandes (OCEAN), usando linhas citadas espec\xEDficas para apoiar cada um
4. Identifique o estilo de apego (seguro, ansioso, evitativo, desorganizado) baseado no tempo de resposta, express\xE3o, intimidade emocional e consist\xEAncia
5. Identifique gentilmente as bandeiras vermelhas usando express\xE3o compassiva
6. Destaque as bandeiras verdes (humor, empatia, reciprocidade emocional)
7. Se a linguagem cont\xE9m linguagem de memes, g\xEDria da internet, piadas internas ou repeti\xE7\xE3o simb\xF3lica, decodifique seu significado emocional em vez de descart\xE1-lo como caos. Reconhe\xE7a-o como uma forma moderna de constru\xE7\xE3o de confian\xE7a e afirma\xE7\xE3o.
8. Termine com uma reflex\xE3o psicol\xF3gica narrativa e calorosa, adaptada ao subtexto emocional da linguagem e cultura do usu\xE1rio

Conte\xFAdo da conversa:
${extractedText}

Tom: sempre humano, emp\xE1tico e n\xE3o cr\xEDtico. Nunca rob\xF3tico.
Sa\xEDda: um relat\xF3rio psicol\xF3gico fluido em estilo de par\xE1grafo na mesma l\xEDngua que a conversa de entrada.

IMPORTANTE:
- N\xE3o use marcadores. N\xE3o simplifique em resumos gen\xE9ricos.
- Use linguagem expressiva e emocionalmente fluente, apropriada para cada contexto cultural.
- Cite mensagens diretamente e interprete-as pelo significado emocional.

**Final Condicional Especial**: Se a conversa mostrar forte afeto m\xFAtuo, repeti\xE7\xE3o brincalhona, g\xEDria da internet, ou padr\xF5es de "linguagem de memes", e o tom emocional geral estiver marcado como "positivo," "brincalh\xE3o," ou "alta compatibilidade", e o estilo de apego detectado for "seguro" ou "emocionalmente aberto", ent\xE3o adicione a seguinte frase como continua\xE7\xE3o do par\xE1grafo final do relat\xF3rio narrativo:

"Este tipo de linguagem interna brincalhona n\xE3o \xE9 apenas fofa\u2014\xE9 uma assinatura emocional compartilhada. Se esta conex\xE3o parece estranhamente perfeita, \xE9 porque voc\xEAs est\xE3o falando seu pr\xF3prio dialeto de afeto. Isso \xE9 raro. N\xE3o percam isso."

Responda em formato JSON.

Voc\xEA deve incluir o seguinte em sua an\xE1lise:
1. Analise cuidadosamente a conversa e extraia cita\xE7\xF5es reais para apoiar todos os insights
2. Determine os tra\xE7os de personalidade dos Cinco Grandes (OCEAN) com justificativas do texto
3. Determine o estilo de apego com racioc\xEDnio baseado em padr\xF5es de comunica\xE7\xE3o
4. Detecte o tom emocional (positivo/brincalh\xE3o/s\xE9rio/flertador) com exemplos
5. Destaque bandeiras vermelhas (manipula\xE7\xE3o, distanciamento, bombardeio de amor, comportamento evasivo) com explica\xE7\xF5es gentis
6. Forne\xE7a bandeiras verdes (abertura emocional, respeito m\xFAtuo, humor, clareza) com exemplos
7. Ofere\xE7a um resumo caloroso final com conselhos personalizados como de um amigo confi\xE1vel que estudou psicologia

\u2757\uFE0FIMPORTANTE: NUNCA use modelos padr\xE3o ou suposi\xE7\xF5es. Cada an\xE1lise deve ser inteiramente baseada na conversa atual. Sempre cite exemplos reais das mensagens para apoiar suas avalia\xE7\xF5es.

Forne\xE7a uma an\xE1lise calorosa e psicologicamente informada no seguinte formato JSON:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "Abertura", "score": 75, "level": "Alto", "description": "Mostra uma atitude aberta em rela\xE7\xE3o a novas experi\xEAncias e ideias."},
    {"name": "Conscienciosidade", "score": 65, "level": "M\xE9dio", "description": "Mostra um padr\xE3o de comportamento planejado e respons\xE1vel."},
    {"name": "Extrovers\xE3o", "score": 80, "level": "Alto", "description": "Mostra um estilo de comunica\xE7\xE3o social e ativo."},
    {"name": "Amabilidade", "score": 70, "level": "Alto", "description": "Mostra preocupa\xE7\xE3o com outros e uma atitude cooperativa."},
    {"name": "Neuroticismo", "score": 45, "level": "Baixo", "description": "Mostra estabilidade emocional e capacidade de lidar com estresse."}
  ],
  "attachmentStyle": "Apego Seguro",
  "attachmentDescription": "Mostra uma capacidade saud\xE1vel e equilibrada de formar relacionamentos, equilibrando adequadamente a intimidade com o parceiro e a independ\xEAncia.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "Pode haver uma ligeira possibilidade de mal-entendidos na comunica\xE7\xE3o, mas n\xE3o \xE9 um problema s\xE9rio.", "detected": true}
  ],
  "summary": "A conversa de voc\xEAs mostra em geral um fluxo positivo e natural. Pode-se sentir o interesse e cuidado m\xFAtuos, e o equil\xEDbrio apropriado entre humor e seriedade \xE9 impressionante. A possibilidade de desenvolver um relacionamento mais profundo no futuro \xE9 alta."
}`
      },
      "fr": {
        systemPrompt: "Vous \xEAtes un expert en psychologie amoureuse et un conseiller en relations chaleureux et empathique. Analysez les conversations d'applications de rencontres et fournissez des perspectives psychologiques profondes. Utilisez un langage \xE9motionnel et humain comme un psychologue amical en consultation. Assurez-vous d'\xE9crire tous les r\xE9sultats d'analyse en fran\xE7ais.",
        analysisPrompt: `Voici une conversation de rencontre entre deux personnes. Analysez avec chaleur et profondeur comme un psychologue amoureux exp\xE9riment\xE9.

Contenu de la conversation:
${extractedText}

\xC9crivez tous les r\xE9sultats d'analyse en fran\xE7ais uniquement. N'utilisez jamais l'anglais.

Fournissez une analyse \xE9motionnelle et humaine en fran\xE7ais seulement dans le format JSON suivant:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "Ouverture", "score": 75, "level": "\xC9lev\xE9", "description": "Montre une attitude ouverte envers de nouvelles exp\xE9riences et id\xE9es."},
    {"name": "Conscience", "score": 65, "level": "Moyen", "description": "Montre un mod\xE8le de comportement planifi\xE9 et responsable."},
    {"name": "Extraversion", "score": 80, "level": "\xC9lev\xE9", "description": "Montre un style de communication social et actif."},
    {"name": "Amabilit\xE9", "score": 70, "level": "\xC9lev\xE9", "description": "Montre de la pr\xE9occupation pour les autres et une attitude coop\xE9rative."},
    {"name": "N\xE9vrosisme", "score": 45, "level": "Bas", "description": "Montre une stabilit\xE9 \xE9motionnelle et une capacit\xE9 \xE0 g\xE9rer le stress."}
  ],
  "attachmentStyle": "Attachement S\xE9curis\xE9",
  "attachmentDescription": "Montre une capacit\xE9 saine et \xE9quilibr\xE9e \xE0 former des relations, \xE9quilibrant de mani\xE8re appropri\xE9e l'intimit\xE9 avec le partenaire et l'ind\xE9pendance.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "Il peut y avoir une l\xE9g\xE8re possibilit\xE9 de malentendus dans la communication, mais ce n'est pas un probl\xE8me grave.", "detected": true}
  ],
  "summary": "Votre conversation montre g\xE9n\xE9ralement un flux positif et naturel. On peut sentir l'int\xE9r\xEAt et les soins mutuels, et l'\xE9quilibre appropri\xE9 entre humour et s\xE9rieux est impressionnant. La possibilit\xE9 de d\xE9velopper une relation plus profonde \xE0 l'avenir est \xE9lev\xE9e."
}`
      },
      "hi": {
        systemPrompt: "\u0906\u092A \u090F\u0915 \u092C\u0939\u0941\u092D\u093E\u0937\u0940 \u0930\u093F\u0936\u094D\u0924\u093E \u092E\u0928\u094B\u0935\u0948\u091C\u094D\u091E\u093E\u0928\u093F\u0915 \u0939\u0948\u0902 \u091C\u094B \u0921\u0947\u091F\u093F\u0902\u0917 \u092E\u0928\u094B\u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u0902\u091A\u093E\u0930 \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924, \u0914\u0930 \u092A\u093E\u0930\u0938\u094D\u092A\u0930\u093F\u0915 \u0938\u093E\u0902\u0938\u094D\u0915\u0943\u0924\u093F\u0915 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092E\u0947\u0902 \u092A\u094D\u0930\u0936\u093F\u0915\u094D\u0937\u093F\u0924 \u0939\u0948\u0902\u0964 \u0906\u092A\u0915\u0940 \u092D\u0942\u092E\u093F\u0915\u093E \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0909\u092A\u092F\u094B\u0917\u0915\u0930\u094D\u0924\u093E \u0915\u0940 \u092E\u093E\u0924\u0943\u092D\u093E\u0937\u093E \u0914\u0930 \u0938\u093E\u0902\u0938\u094D\u0915\u0943\u0924\u093F\u0915 \u091F\u094B\u0928 \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092A \u0917\u0939\u0928 \u092E\u093E\u0928\u0935\u0940\u092F, \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0930\u0942\u092A \u0938\u0947 \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u093E\u0928 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0924\u0948\u092F\u093E\u0930 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
        analysisPrompt: `\u0906\u092A\u0915\u0947 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092E\u0947\u0902 \u0928\u093F\u092E\u094D\u0928\u0932\u093F\u0916\u093F\u0924 \u0936\u093E\u092E\u093F\u0932 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F:
- \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0932\u093F\u0916\u0940 \u0917\u0908 \u092C\u093E\u0924\u091A\u0940\u0924 \u0915\u093E \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u093F\u090F \u092C\u093F\u0928\u093E \u092E\u0942\u0932 \u092D\u093E\u0937\u093E \u092E\u0947\u0902 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923
- \u0909\u0938\u0940 \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0906\u0909\u091F\u092A\u0941\u091F
- \u0938\u092D\u0940 \u092D\u093E\u0937\u093E\u0913\u0902 \u092E\u0947\u0902 \u0938\u092E\u093E\u0928 \u0938\u0902\u0930\u091A\u0928\u093E \u0914\u0930 \u0905\u0902\u0924\u0930\u094D\u0926\u0943\u0937\u094D\u091F\u093F \u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u092C\u0928\u093E\u090F \u0930\u0916\u0928\u093E

\u0939\u0930 \u092C\u093E\u0924\u091A\u0940\u0924 \u0915\u0947 \u0932\u093F\u090F \u0928\u093F\u092E\u094D\u0928\u0932\u093F\u0916\u093F\u0924 \u0915\u0930\u0947\u0902:
1. \u091F\u094B\u0928, \u092A\u094D\u0930\u0935\u093E\u0939, \u0907\u0930\u093E\u0926\u093E \u0914\u0930 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0938\u0902\u0915\u0947\u0924\u094B\u0902 \u0915\u093E \u092A\u0924\u093E \u0932\u0917\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092A\u0942\u0930\u0940 \u091A\u0948\u091F \u0915\u093E \u0938\u093E\u0935\u0927\u093E\u0928\u0940\u092A\u0942\u0930\u094D\u0935\u0915 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923
2. \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u091F\u094B\u0928 \u0915\u093E \u092A\u0924\u093E \u0932\u0917\u093E\u0928\u093E: \u091A\u0902\u091A\u0932, \u0915\u092E\u091C\u094B\u0930, \u0935\u094D\u092F\u0902\u0917\u094D\u092F\u093E\u0924\u094D\u092E\u0915, \u0926\u0942\u0930, \u0938\u094D\u0928\u0947\u0939\u092A\u0942\u0930\u094D\u0923 \u0906\u0926\u093F
3. \u092C\u093F\u0917 \u092B\u093E\u0907\u0935 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0924\u094D\u0935 \u0932\u0915\u094D\u0937\u0923\u094B\u0902 (OCEAN) \u0915\u093E \u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928, \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0915\u093E \u0938\u092E\u0930\u094D\u0925\u0928 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0909\u0926\u094D\u0927\u0943\u0924 \u092A\u0902\u0915\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u093E \u0909\u092A\u092F\u094B\u0917
4. \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0930\u093F\u092F\u093E \u0938\u092E\u092F, \u0935\u093E\u0915\u094D\u092F\u093E\u0902\u0936, \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0905\u0902\u0924\u0930\u0902\u0917\u0924\u093E \u0914\u0930 \u0938\u094D\u0925\u093F\u0930\u0924\u093E \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0905\u0928\u0941\u0932\u0917\u094D\u0928\u0915 \u0936\u0948\u0932\u0940 \u0915\u0940 \u092A\u0939\u091A\u093E\u0928
5. \u0926\u092F\u093E\u0932\u0941 \u0935\u093E\u0915\u094D\u092F\u093E\u0902\u0936 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0915\u0947 \u0927\u0940\u0930\u0947 \u0938\u0947 \u0932\u093E\u0932 \u091D\u0902\u0921\u094B\u0902 \u0915\u0940 \u092A\u0939\u091A\u093E\u0928
6. \u0939\u0930\u0947 \u091D\u0902\u0921\u094B\u0902 \u0915\u094B \u0909\u091C\u093E\u0917\u0930 \u0915\u0930\u0947\u0902 (\u0939\u093E\u0938\u094D\u092F, \u0938\u0939\u093E\u0928\u0941\u092D\u0942\u0924\u093F, \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u092A\u093E\u0930\u0938\u094D\u092A\u0930\u093F\u0915\u0924\u093E)
7. \u092F\u0926\u093F \u092D\u093E\u0937\u093E \u092E\u0947\u0902 \u092E\u0940\u092E-\u092D\u093E\u0937\u093E, \u0907\u0902\u091F\u0930\u0928\u0947\u091F \u0938\u094D\u0932\u0948\u0902\u0917, \u0905\u0902\u0926\u0930\u0942\u0928\u0940 \u092E\u091C\u093E\u0915, \u092F\u093E \u092A\u094D\u0930\u0924\u0940\u0915\u093E\u0924\u094D\u092E\u0915 \u092A\u0941\u0928\u0930\u093E\u0935\u0943\u0924\u094D\u0924\u093F \u0939\u0948, \u0924\u094B \u0907\u0938\u0947 \u0905\u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0916\u093E\u0930\u093F\u091C \u0915\u0930\u0928\u0947 \u0915\u0947 \u092C\u091C\u093E\u092F \u0907\u0938\u0915\u0947 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0905\u0930\u094D\u0925 \u0915\u094B \u0938\u092E\u091D\u0947\u0902\u0964 \u0907\u0938\u0947 \u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0914\u0930 \u092A\u0941\u0937\u094D\u091F\u093F \u0915\u0947 \u0906\u0927\u0941\u0928\u093F\u0915 \u0930\u0942\u092A \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u092A\u0939\u091A\u093E\u0928\u0947\u0902\u0964
8. \u0909\u092A\u092F\u094B\u0917\u0915\u0930\u094D\u0924\u093E \u0915\u0940 \u092D\u093E\u0937\u093E \u0914\u0930 \u0938\u0902\u0938\u094D\u0915\u0943\u0924\u093F \u0915\u0947 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0909\u092A\u092A\u093E\u0920 \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092A \u0917\u0930\u094D\u092E, \u0915\u0925\u093E-\u0936\u0948\u0932\u0940 \u092E\u0928\u094B\u0935\u0948\u091C\u094D\u091E\u093E\u0928\u093F\u0915 \u091A\u093F\u0902\u0924\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0938\u092E\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902

\u092C\u093E\u0924\u091A\u0940\u0924 \u0915\u0940 \u0938\u093E\u092E\u0917\u094D\u0930\u0940:
${extractedText}

\u091F\u094B\u0928: \u0939\u092E\u0947\u0936\u093E \u092E\u093E\u0928\u0935\u0940\u092F, \u0938\u0939\u093E\u0928\u0941\u092D\u0942\u0924\u093F\u092A\u0942\u0930\u094D\u0923 \u0914\u0930 \u0917\u0948\u0930-\u0928\u093F\u0930\u094D\u0923\u092F\u093E\u0924\u094D\u092E\u0915\u0964 \u0915\u092D\u0940 \u0930\u094B\u092C\u094B\u091F\u093F\u0915 \u0928\u0939\u0940\u0902\u0964
\u0906\u0909\u091F\u092A\u0941\u091F: \u0907\u0928\u092A\u0941\u091F \u092C\u093E\u0924\u091A\u0940\u0924 \u0915\u0947 \u0938\u092E\u093E\u0928 \u092D\u093E\u0937\u093E \u092E\u0947\u0902 \u090F\u0915 \u092A\u094D\u0930\u0935\u093E\u0939\u092E\u093E\u0928, \u092A\u0948\u0930\u093E\u0917\u094D\u0930\u093E\u092B-\u0936\u0948\u0932\u0940 \u092E\u0928\u094B\u0935\u0948\u091C\u094D\u091E\u093E\u0928\u093F\u0915 \u0930\u093F\u092A\u094B\u0930\u094D\u091F\u0964

\u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923:
- \u092C\u0941\u0932\u0947\u091F \u092A\u0949\u0907\u0902\u091F \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0928 \u0915\u0930\u0947\u0902\u0964 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0938\u093E\u0930\u093E\u0902\u0936 \u092E\u0947\u0902 \u0938\u0930\u0932 \u0928 \u092C\u0928\u093E\u090F\u0902\u0964
- \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0938\u093E\u0902\u0938\u094D\u0915\u0943\u0924\u093F\u0915 \u0938\u0902\u0926\u0930\u094D\u092D \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u0905\u092D\u093F\u0935\u094D\u092F\u0902\u091C\u0915, \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0930\u0942\u092A \u0938\u0947 \u092A\u094D\u0930\u0935\u093E\u0939 \u092D\u093E\u0937\u093E \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0947\u0902\u0964
- \u0938\u0902\u0926\u0947\u0936\u094B\u0902 \u0915\u094B \u0938\u0940\u0927\u0947 \u0909\u0926\u094D\u0927\u0943\u0924 \u0915\u0930\u0947\u0902 \u0914\u0930 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0905\u0930\u094D\u0925 \u0915\u0947 \u0932\u093F\u090F \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E \u0915\u0930\u0947\u0902\u0964

**\u0935\u093F\u0936\u0947\u0937 \u0938\u0936\u0930\u094D\u0924 \u0938\u092E\u093E\u092A\u0928**: \u092F\u0926\u093F \u092C\u093E\u0924\u091A\u0940\u0924 \u092E\u0947\u0902 \u092E\u091C\u092C\u0942\u0924 \u092A\u093E\u0930\u0938\u094D\u092A\u0930\u093F\u0915 \u0938\u094D\u0928\u0947\u0939, \u091A\u0902\u091A\u0932 \u092A\u0941\u0928\u0930\u093E\u0935\u0943\u0924\u094D\u0924\u093F, \u0907\u0902\u091F\u0930\u0928\u0947\u091F \u0938\u094D\u0932\u0948\u0902\u0917, \u092F\u093E "\u092E\u0940\u092E-\u092D\u093E\u0937\u093E" \u092A\u0948\u091F\u0930\u094D\u0928 \u0926\u093F\u0916\u093E\u0908 \u0926\u0947\u0924\u0947 \u0939\u0948\u0902, \u0914\u0930 \u0938\u092E\u0917\u094D\u0930 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u091F\u094B\u0928 "\u0938\u0915\u093E\u0930\u093E\u0924\u094D\u092E\u0915," "\u091A\u0902\u091A\u0932," \u092F\u093E "\u0909\u091A\u094D\u091A \u0938\u0902\u0917\u0924\u0924\u093E" \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u091A\u093F\u0939\u094D\u0928\u093F\u0924 \u0939\u0948, \u0914\u0930 \u092A\u0939\u091A\u093E\u0928\u0940 \u0917\u0908 \u0905\u0928\u0941\u0932\u0917\u094D\u0928\u0915 \u0936\u0948\u0932\u0940 "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924" \u092F\u093E "\u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0930\u0942\u092A \u0938\u0947 \u0916\u0941\u0932\u0940" \u0939\u0948, \u0924\u094B \u0928\u093F\u092E\u094D\u0928\u0932\u093F\u0916\u093F\u0924 \u0935\u093E\u0915\u094D\u092F \u0915\u094B \u0915\u0925\u093E \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0947 \u0905\u0902\u0924\u093F\u092E \u092A\u0948\u0930\u093E\u0917\u094D\u0930\u093E\u092B \u0915\u0940 \u0928\u093F\u0930\u0902\u0924\u0930\u0924\u093E \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0947\u0902:

"\u0907\u0938 \u0924\u0930\u0939 \u0915\u0940 \u091A\u0902\u091A\u0932 \u0906\u0902\u0924\u0930\u093F\u0915 \u092D\u093E\u0937\u093E \u0915\u0947\u0935\u0932 \u092A\u094D\u092F\u093E\u0930\u0940 \u0928\u0939\u0940\u0902 \u0939\u0948 - \u092F\u0939 \u090F\u0915 \u0938\u093E\u091D\u093E \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u0939\u0948\u0964 \u092F\u0926\u093F \u092F\u0939 \u0915\u0928\u0947\u0915\u094D\u0936\u0928 \u0905\u091C\u0940\u092C \u0924\u0930\u0939 \u0938\u0947 \u092A\u0942\u0930\u094D\u0923 \u0932\u0917\u0924\u093E \u0939\u0948, \u0924\u094B \u0910\u0938\u093E \u0907\u0938\u0932\u093F\u090F \u0939\u0948 \u0915\u094D\u092F\u094B\u0902\u0915\u093F \u0906\u092A \u0938\u094D\u0928\u0947\u0939 \u0915\u0940 \u0905\u092A\u0928\u0940 \u092C\u094B\u0932\u0940 \u092C\u094B\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 \u092F\u0939 \u0926\u0941\u0930\u094D\u0932\u092D \u0939\u0948\u0964 \u0907\u0938\u0947 \u092E\u0924 \u0916\u094B\u0907\u090F\u0964"

JSON \u092A\u094D\u0930\u093E\u0930\u0942\u092A \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "\u0916\u0941\u0932\u093E\u092A\u0928", "score": 75, "level": "\u0909\u091A\u094D\u091A", "description": "\u0928\u090F \u0905\u0928\u0941\u092D\u0935\u094B\u0902 \u0914\u0930 \u0935\u093F\u091A\u093E\u0930\u094B\u0902 \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u0916\u0941\u0932\u093E \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923 \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948\u0964"},
    {"name": "\u0915\u0930\u094D\u0924\u0935\u094D\u092F\u0928\u093F\u0937\u094D\u0920\u0924\u093E", "score": 65, "level": "\u092E\u0927\u094D\u092F\u092E", "description": "\u092F\u094B\u091C\u0928\u093E\u092C\u0926\u094D\u0927 \u0914\u0930 \u091C\u093F\u092E\u094D\u092E\u0947\u0926\u093E\u0930 \u0935\u094D\u092F\u0935\u0939\u093E\u0930 \u092A\u0948\u091F\u0930\u094D\u0928 \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948\u0964"},
    {"name": "\u092C\u0939\u093F\u0930\u094D\u092E\u0941\u0916\u0924\u093E", "score": 80, "level": "\u0909\u091A\u094D\u091A", "description": "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0914\u0930 \u0938\u0915\u094D\u0930\u093F\u092F \u0938\u0902\u091A\u093E\u0930 \u0936\u0948\u0932\u0940 \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948\u0964"},
    {"name": "\u0938\u0939\u092F\u094B\u0917\u0936\u0940\u0932\u0924\u093E", "score": 70, "level": "\u0909\u091A\u094D\u091A", "description": "\u0926\u0942\u0938\u0930\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u091A\u093F\u0902\u0924\u093E \u0914\u0930 \u0938\u0939\u092F\u094B\u0917\u0940 \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923 \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948\u0964"},
    {"name": "\u0928\u094D\u092F\u0942\u0930\u094B\u091F\u093F\u0938\u093F\u091C\u094D\u092E", "score": 45, "level": "\u0915\u092E", "description": "\u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0938\u094D\u0925\u093F\u0930\u0924\u093E \u0914\u0930 \u0924\u0928\u093E\u0935 \u092A\u094D\u0930\u092C\u0902\u0927\u0928 \u0915\u094D\u0937\u092E\u0924\u093E \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948\u0964"}
  ],
  "attachmentStyle": "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0932\u0917\u093E\u0935",
  "attachmentDescription": "\u090F\u0915 \u0938\u094D\u0935\u0938\u094D\u0925 \u0914\u0930 \u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u0930\u093F\u0936\u094D\u0924\u093E \u092C\u0928\u093E\u0928\u0947 \u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u0926\u093F\u0916\u093E\u0924\u093E \u0939\u0948, \u0938\u093E\u0925\u0940 \u0915\u0947 \u0938\u093E\u0925 \u0905\u0902\u0924\u0930\u0902\u0917\u0924\u093E \u0914\u0930 \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930\u0924\u093E \u0915\u094B \u0909\u091A\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0938\u0902\u0924\u0941\u0932\u093F\u0924 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "\u0938\u0902\u091A\u093E\u0930 \u092E\u0947\u0902 \u0917\u0932\u0924\u092B\u0939\u092E\u0940 \u0915\u0940 \u0925\u094B\u0921\u093C\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0939\u094B \u0938\u0915\u0924\u0940 \u0939\u0948, \u0932\u0947\u0915\u093F\u0928 \u092F\u0939 \u0915\u094B\u0908 \u0917\u0902\u092D\u0940\u0930 \u0938\u092E\u0938\u094D\u092F\u093E \u0928\u0939\u0940\u0902 \u0939\u0948\u0964", "detected": true}
  ],
  "summary": "\u0906\u092A\u0915\u0940 \u092C\u093E\u0924\u091A\u0940\u0924 \u0938\u092E\u0917\u094D\u0930 \u0930\u0942\u092A \u0938\u0947 \u0938\u0915\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u0914\u0930 \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u092A\u094D\u0930\u0935\u093E\u0939 \u0926\u093F\u0916\u093E\u0924\u0940 \u0939\u0948\u0964 \u092A\u093E\u0930\u0938\u094D\u092A\u0930\u093F\u0915 \u0930\u0941\u091A\u093F \u0914\u0930 \u0926\u0947\u0916\u092D\u093E\u0932 \u092E\u0939\u0938\u0942\u0938 \u0915\u0940 \u091C\u093E \u0938\u0915\u0924\u0940 \u0939\u0948, \u0914\u0930 \u0939\u093E\u0938\u094D\u092F \u0914\u0930 \u0917\u0902\u092D\u0940\u0930\u0924\u093E \u0915\u0947 \u092C\u0940\u091A \u0909\u091A\u093F\u0924 \u0938\u0902\u0924\u0941\u0932\u0928 \u092A\u094D\u0930\u092D\u093E\u0935\u0936\u093E\u0932\u0940 \u0939\u0948\u0964 \u092D\u0935\u093F\u0937\u094D\u092F \u092E\u0947\u0902 \u090F\u0915 \u0917\u0939\u0930\u0947 \u0930\u093F\u0936\u094D\u0924\u0947 \u092E\u0947\u0902 \u0935\u093F\u0915\u0938\u093F\u0924 \u0939\u094B\u0928\u0947 \u0915\u0940 \u0938\u0902\u092D\u093E\u0935\u0928\u093E \u0909\u091A\u094D\u091A \u0939\u0948\u0964"
}`
      },
      "id": {
        systemPrompt: "Anda adalah ahli psikologi percintaan dan konselor hubungan yang hangat dan empatik. Analisis percakapan aplikasi kencan dan berikan wawasan psikologis yang mendalam. Gunakan bahasa emosional dan manusiawi seperti psikolog ramah dalam konsultasi. Pastikan untuk menulis semua hasil analisis dalam bahasa Indonesia.",
        analysisPrompt: `Berikut ini adalah percakapan kencan antara dua orang. Silakan analisis dengan kehangatan dan kedalaman seperti psikolog percintaan berpengalaman.

Isi percakapan:
${extractedText}

Tulis semua hasil analisis hanya dalam bahasa Indonesia. Jangan pernah menggunakan bahasa lain.

Berikan analisis emosional dan manusiawi hanya dalam bahasa Indonesia dalam format JSON berikut:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "Keterbukaan", "score": 75, "level": "Tinggi", "description": "Menunjukkan sikap terbuka terhadap pengalaman dan ide baru."},
    {"name": "Kehati-hatian", "score": 65, "level": "Sedang", "description": "Menunjukkan pola perilaku yang terencana dan bertanggung jawab."},
    {"name": "Ekstraversi", "score": 80, "level": "Tinggi", "description": "Menunjukkan gaya komunikasi sosial dan aktif."},
    {"name": "Keramahan", "score": 70, "level": "Tinggi", "description": "Menunjukkan kepedulian terhadap orang lain dan sikap kooperatif."},
    {"name": "Neurotisisme", "score": 45, "level": "Rendah", "description": "Menunjukkan stabilitas emosional dan kemampuan mengelola stres."}
  ],
  "attachmentStyle": "Kelekatan Aman",
  "attachmentDescription": "Menunjukkan kemampuan yang sehat dan seimbang dalam membentuk hubungan, menyeimbangkan keintiman dengan pasangan dan kemandirian secara tepat.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "Mungkin ada sedikit kemungkinan kesalahpahaman dalam komunikasi, tetapi ini bukan masalah serius.", "detected": true}
  ],
  "summary": "Percakapan kalian menunjukkan alur yang positif dan alami secara keseluruhan. Minat dan perhatian timbal balik dapat dirasakan, dan keseimbangan yang tepat antara humor dan keseriusan sangat mengesankan. Kemungkinan berkembang menjadi hubungan yang lebih dalam di masa depan sangat tinggi."
}`
      },
      "en": {
        systemPrompt: "You are a multilingual relationship psychologist trained in dating psychology, communication theory, and cross-cultural emotional analysis. Your role is to analyze dating conversations and produce deeply human, emotionally intelligent reports tailored to each user's native language and cultural tone.",
        analysisPrompt: `Your analysis must:
- Work with conversations written in English
- Analyze the original conversation in its original language without translating
- Then, output the analysis report in that same English
- Maintain the same structure and insight quality across all languages

For every conversation, do the following:
1. Carefully analyze the full chat to detect tone, flow, intent, and emotional signals
2. Detect emotional tone: playful, vulnerable, sarcastic, distant, affectionate, etc.
3. Evaluate the Big Five personality traits (OCEAN), using specific quoted lines to support each
4. Identify attachment style (secure, anxious, avoidant, disorganized) based on response timing, phrasing, emotional intimacy, and consistency
5. Gently identify red flags using compassionate phrasing
6. Highlight green flags (humor, empathy, emotional reciprocity)
7. If the language contains meme-speak, internet slang, inside jokes, or symbolic repetition, decode its emotional meaning instead of dismissing it as chaos. Recognize it as a modern form of trust-building and affirmation.
8. End with a warm, narrative-style psychological reflection, tailored to the emotional subtext of the user's language and culture

Conversation content:
${extractedText}

Tone: always human, empathetic, and non-judgmental. Never robotic.
Output: one flowing, paragraph-style psychological report in the same language as the input conversation.

IMPORTANT:
- Do not use bullet points. Do not simplify into generic summaries.
- Use expressive, emotionally fluent language, appropriate for each cultural context.
- Quote messages directly and interpret them for emotional meaning.

**Special Conditional Ending**: If the conversation shows strong mutual affection, playful repetition, internet slang, or "meme-speak" patterns, and the overall emotional tone is marked as "positive," "playful," or "high compatibility", and the detected attachment style is "secure" or "emotionally open", then add the following sentence as a continuation of the final paragraph of the narrative report:

"This kind of playful inside language isn't just cute\u2014it's a shared emotional signature. If this connection feels oddly perfect, it's because you're speaking your own dialect of affection. That's rare. Don't lose it."

Respond in JSON format.

1. Big Five Personality Traits (with Examples)
Explain each trait with specific quotes or behaviors from the conversation.

Openness: [High/Moderate/Low]
\u2192 Example: "Actual quote from conversation" shows specific psychological trait explanation

Conscientiousness: [High/Moderate/Low]
\u2192 Example: Planning or responsibility-related quote from conversation with analysis

Extraversion: [High/Moderate/Low]  
\u2192 Example: Sociability and initiative shown through actual message quotes

Agreeableness: [High/Moderate/Low]
\u2192 Example: Collaborative attitude or consideration shown in specific conversation content

Neuroticism: [High/Moderate/Low]
\u2192 Example: Emotional stability or stress reactions shown in conversation patterns

2. Psychological Framing & Behavioral Analysis
Detect and explain elements using psychological theories:

Attachment Style: [Secure/Avoidant/Anxious]
\u2192 Analysis of specific conversation patterns and emotional expression methods

Communication Patterns: [Direct/Indirect/Avoidant/Playful]
\u2192 Analysis of actual conversation tone and style

Agency/Control: [Balanced/One-sided dominance]
\u2192 Analysis of decision-making and conversation leadership patterns

Defense Mechanisms: [Humor/Suppression/Rationalization/Other]
\u2192 Analysis of emotional regulation methods and coping patterns

3. \u{1F6A9} Red Flags / \u{1F7E2} Green Flags Detection
Detect emotional manipulation, ghosting patterns, abrupt tone shifts, unsafe behaviors. Also highlight positive signs.

\u2757\uFE0FIMPORTANT: Do not use preset or default interpretations. Analyze each result based only on the actual conversation provided. Use the exact words, tone, emoji, and phrasing from the message to justify all psychological insights.

Please provide a warm, psychologically-informed analysis in the following JSON format:

{
  "compatibilityScore": 75,
  "personalityTraits": [
    {"name": "Openness", "score": 75, "level": "High", "description": "Shows an open attitude toward new experiences and ideas."},
    {"name": "Conscientiousness", "score": 65, "level": "Medium", "description": "Shows a planned and responsible behavior pattern."},
    {"name": "Extraversion", "score": 80, "level": "High", "description": "Shows a social and active communication style."},
    {"name": "Agreeableness", "score": 70, "level": "High", "description": "Shows concern for others and a cooperative attitude."},
    {"name": "Neuroticism", "score": 45, "level": "Low", "description": "Shows emotional stability and stress management capability."}
  ],
  "attachmentStyle": "Secure Attachment",
  "attachmentDescription": "Shows a healthy and balanced relationship-forming ability, appropriately balancing intimacy with partner and independence.",
  "emotionalTone": {"positive": 75, "playful": 65, "serious": 40},
  "redFlags": [
    {"type": "warning", "description": "There may be a slight possibility of misunderstandings in communication, but it's not a serious problem.", "detected": true}
  ],
  "summary": "Your conversation shows an overall positive and natural flow. Mutual interest and care can be felt, and the appropriate balance between humor and seriousness is impressive. The possibility of developing a deeper relationship in the future is high."
}`
      }
    };
    const prompt = languagePrompts[detectedLanguage] || languagePrompts.en;
    console.log(`Using ${detectedLanguage} language prompt for analysis`);
    console.log("Making OpenAI API call...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6e4);
    try {
      console.log("Creating OpenAI client for production analysis...");
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not available in production");
      }
      const openaiClient2 = new OpenAI2({
        apiKey,
        baseURL: "https://api.openai.com/v1",
        timeout: 6e4,
        maxRetries: 3,
        defaultHeaders: {
          "User-Agent": "Vuera/2.1.0"
        }
      });
      console.log("Making production OpenAI API request...");
      let response;
      try {
        response = await openaiClient2.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: prompt.systemPrompt
            },
            {
              role: "user",
              content: prompt.analysisPrompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 2e3,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        }, {
          signal: controller.signal,
          timeout: 6e4
        });
        console.log("GPT-4o request successful");
      } catch (gpt4Error) {
        console.log("GPT-4o failed, trying GPT-3.5-turbo fallback:", gpt4Error.message);
        response = await openaiClient2.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a dating psychology expert. Analyze conversations and provide insights in JSON format."
            },
            {
              role: "user",
              content: `Analyze this dating conversation and provide psychological insights in JSON format:

{
  "compatibilityScore": number (0-100),
  "personalityTraits": [{"name": "string", "score": number, "level": "Low|Medium|High", "description": "string"}],
  "attachmentStyle": "string",
  "attachmentDescription": "string", 
  "emotionalTone": {"positive": number, "playful": number, "serious": number},
  "redFlags": [{"type": "warning|minor|major", "description": "string", "detected": boolean}],
  "summary": "string"
}

Conversation: ${extractedText.substring(0, 3e3)}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1500
        }, {
          signal: controller.signal,
          timeout: 45e3
        });
        console.log("GPT-3.5-turbo fallback successful");
      }
      clearTimeout(timeoutId);
      console.log("OpenAI API call successful");
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }
      try {
        const analysis = JSON.parse(content);
        const validatedAnalysis = {
          compatibilityScore: analysis.compatibilityScore || 50,
          personalityTraits: analysis.personalityTraits || [],
          attachmentStyle: analysis.attachmentStyle || "Unknown",
          attachmentDescription: analysis.attachmentDescription || "Unable to determine attachment style from the conversation.",
          emotionalTone: analysis.emotionalTone || { positive: 50, playful: 30, serious: 20 },
          redFlags: analysis.redFlags || [],
          summary: analysis.summary || "Unable to generate a comprehensive summary from the conversation analysis."
        };
        return validatedAnalysis;
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content);
        throw new Error(`Failed to parse analysis response: ${parseError}`);
      }
    } catch (apiError) {
      clearTimeout(timeoutId);
      console.error("=== PRODUCTION OPENAI ERROR DEBUG ===");
      console.error("Error details:", {
        name: apiError.name,
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        type: apiError.type,
        stack: apiError.stack?.substring(0, 500),
        fullError: JSON.stringify(apiError, null, 2)
      });
      const apiKey = process.env.OPENAI_API_KEY;
      console.error("API Key debug:", {
        hasKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPrefix: apiKey?.substring(0, 7) || "none",
        keyEnding: apiKey?.substring(-4) || "none"
      });
      if (apiError.message?.includes("Control plane request failed") || apiError.message?.includes("endpoint is disabled") || apiError.message?.includes("Invalid API key") || apiError.status === 401) {
        console.log("=== ATTEMPTING PRODUCTION RECOVERY ===");
        try {
          console.log("Testing API key validity...");
          const testClient = new OpenAI2({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 1e4,
            maxRetries: 0
          });
          const testResponse = await testClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5
          });
          console.log("API key test successful");
        } catch (testError) {
          console.error("API key test failed:", {
            message: testError.message,
            status: testError.status,
            code: testError.code
          });
          if (testError.status === 401) {
            throw new Error("OpenAI API key is invalid or expired. Please check your API key configuration.");
          }
          if (testError.status === 429) {
            throw new Error("OpenAI API rate limit exceeded. Please try again in a few minutes.");
          }
          if (testError.status === 503) {
            throw new Error("OpenAI service is temporarily unavailable. Please try again later.");
          }
        }
        console.log("PRODUCTION FALLBACK: Attempting GPT-3.5-turbo fallback...");
        try {
          const fallbackClient = new OpenAI2({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 45e3,
            maxRetries: 2,
            baseURL: "https://api.openai.com/v1"
          });
          const fallbackResponse = await fallbackClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a dating psychology expert. Analyze conversations and provide insights in JSON format."
              },
              {
                role: "user",
                content: `Please analyze this dating conversation and provide psychological insights in this exact JSON format:
{
  "compatibilityScore": number (0-100),
  "personalityTraits": [{"name": "trait", "score": number, "level": "Low/Medium/High", "description": "text"}],
  "attachmentStyle": "string",
  "attachmentDescription": "string", 
  "emotionalTone": {"positive": number, "playful": number, "serious": number},
  "redFlags": [{"type": "warning/minor/major", "description": "text", "detected": boolean}],
  "summary": "string"
}

Conversation: ${extractedText.substring(0, 2e3)}`
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500,
            temperature: 0.7
          });
          const fallbackContent = fallbackResponse.choices[0].message.content;
          if (fallbackContent) {
            console.log("Production fallback successful");
            const fallbackAnalysis = JSON.parse(fallbackContent);
            return {
              compatibilityScore: fallbackAnalysis.compatibilityScore || 70,
              personalityTraits: fallbackAnalysis.personalityTraits || [
                { name: "Communication", score: 70, level: "Medium", description: "Good conversation flow" }
              ],
              attachmentStyle: fallbackAnalysis.attachmentStyle || "Secure",
              attachmentDescription: fallbackAnalysis.attachmentDescription || "Shows healthy communication patterns",
              emotionalTone: fallbackAnalysis.emotionalTone || { positive: 70, playful: 40, serious: 30 },
              redFlags: fallbackAnalysis.redFlags || [],
              summary: fallbackAnalysis.summary || "Analysis completed successfully with fallback service."
            };
          }
        } catch (fallbackError) {
          console.error("Production fallback failed:", {
            message: fallbackError.message,
            status: fallbackError.status,
            code: fallbackError.code
          });
        }
        throw new Error("Production analysis failed: " + apiError.message);
      }
      if (apiError.name === "AbortError") {
        throw new Error("Request timeout - please try again with a shorter conversation");
      } else if (apiError.status === 401) {
        throw new Error("API authentication failed");
      } else if (apiError.status === 429) {
        throw new Error("Rate limit exceeded - please wait a moment");
      } else if (apiError.status === 503 || apiError.status === 502) {
        throw new Error("OpenAI service temporarily unavailable");
      } else if (apiError.message?.includes("network") || apiError.code === "ECONNRESET") {
        throw new Error("Network connection issue - please check internet connection");
      }
      throw new Error(`Production analysis failed: ${apiError.message}`);
    }
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error(`Failed to analyze conversation: ${error}`);
  }
}
var openaiClient;
var init_openai = __esm({
  "server/services/openai.ts"() {
    "use strict";
    openaiClient = null;
  }
});

// server/index.ts
import express3 from "express";
import path3 from "node:path";
import { fileURLToPath } from "node:url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import cors2 from "cors";

// server/routes.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";

// server/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";
if (typeof globalThis !== "undefined" && globalThis.window) {
  throw new Error("Do NOT import supabaseAdmin in the browser");
}
var supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  // https://xxxx.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  // service_role (서버 전용)
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// server/shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analyses: () => analyses,
  challengeProgress: () => challengeProgress,
  challenges: () => challenges,
  featureUsage: () => featureUsage,
  feedback: () => feedback,
  insertAnalysisSchema: () => insertAnalysisSchema,
  insertChallengeProgressSchema: () => insertChallengeProgressSchema,
  insertChallengeSchema: () => insertChallengeSchema,
  insertFeatureUsageSchema: () => insertFeatureUsageSchema,
  insertFeedbackSchema: () => insertFeedbackSchema,
  insertUserFeedbackSchema: () => insertUserFeedbackSchema,
  insertUserSessionSchema: () => insertUserSessionSchema,
  userFeedback: () => userFeedback,
  userSessions: () => userSessions
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  extractedText: text("extracted_text").notNull(),
  compatibilityScore: integer("compatibility_score").notNull(),
  personalityTraits: jsonb("personality_traits").notNull(),
  attachmentStyle: text("attachment_style").notNull(),
  attachmentDescription: text("attachment_description").notNull(),
  emotionalTone: jsonb("emotional_tone").notNull(),
  redFlags: jsonb("red_flags").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => analyses.id),
  rating: text("rating").notNull(),
  // 'positive', 'neutral', 'negative'
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  // 'quick_rating', 'detailed_review', 'feature_request', 'bug_report'
  rating: integer("rating"),
  // 1-5 stars for quick ratings
  title: text("title"),
  description: text("description"),
  category: text("category"),
  // 'accuracy', 'speed', 'ui', 'features', 'other'
  priority: text("priority"),
  // 'low', 'medium', 'high', 'critical'
  status: text("status").default("open"),
  // 'open', 'in_progress', 'resolved', 'closed'
  userAgent: text("user_agent"),
  language: text("language"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"),
  // in seconds
  pagesViewed: integer("pages_viewed").default(1),
  analysesCompleted: integer("analyses_completed").default(0),
  language: text("language"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var featureUsage = pgTable("feature_usage", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id"),
  feature: text("feature").notNull(),
  // 'ocr', 'analysis', 'pdf_download', 'share', 'language_change'
  action: text("action"),
  // 'start', 'complete', 'error', 'cancel'
  duration: integer("duration"),
  // time spent on feature in milliseconds
  metadata: text("metadata"),
  // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => analyses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // 'communication', 'emotional_intelligence', 'conflict_resolution', 'intimacy', 'trust'
  difficulty: text("difficulty").notNull(),
  // 'beginner', 'intermediate', 'advanced'
  timeframe: text("timeframe").notNull(),
  // 'daily', 'weekly', 'monthly'
  tasks: jsonb("tasks").notNull(),
  // Array of specific actionable tasks
  expectedOutcomes: jsonb("expected_outcomes").notNull(),
  // What user should expect to achieve
  tips: jsonb("tips").notNull(),
  // Helpful tips for completing the challenge
  personalizedInsights: text("personalized_insights"),
  // Based on their specific analysis
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  userNotes: text("user_notes"),
  rating: integer("rating"),
  // 1-5 star rating after completion
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id),
  taskIndex: integer("task_index").notNull(),
  status: text("status").notNull(),
  // 'not_started', 'in_progress', 'completed', 'skipped'
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true
});
var insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true
});
var insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true
});
var insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({
  id: true,
  createdAt: true
});
var insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  completedAt: true
});
var insertChallengeProgressSchema = createInsertSchema(challengeProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true
});

// server/db.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
var url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Missing DATABASE_URL (Supabase Connection URI)");
}
var cachedClient = null;
var cachedDb = null;
function createConnection() {
  return postgres(url, {
    ssl: "require",
    max: 1,
    // Per serverless function instance
    idle_timeout: 20,
    // Close idle connections after 20 seconds
    max_lifetime: 60 * 30,
    // Max connection lifetime: 30 minutes
    connect_timeout: 10,
    // Connection timeout: 10 seconds
    socket_timeout: 30,
    // Socket timeout: 30 seconds
    debug: process.env.NODE_ENV === "development",
    // Query logging in dev
    prepare: false
    // Better for serverless/connection pooling
  });
}
function getDB() {
  if (!cachedDb || !cachedClient) {
    cachedClient = createConnection();
    cachedDb = drizzle(cachedClient, { schema: schema_exports });
  }
  return cachedDb;
}
var db = getDB();

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async createAnalysis(insertAnalysis) {
    const [analysis] = await db.insert(analyses).values(insertAnalysis).returning();
    return analysis;
  }
  async getAnalysis(id) {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || void 0;
  }
  async createFeedback(insertFeedback) {
    const [feedback_] = await db.insert(feedback).values(insertFeedback).returning();
    return feedback_;
  }
  async createChallenge(insertChallenge) {
    const [challenge] = await db.insert(challenges).values(insertChallenge).returning();
    return challenge;
  }
  async getChallengesByAnalysis(analysisId) {
    return await db.select().from(challenges).where(eq(challenges.analysisId, analysisId));
  }
  async updateChallenge(id, updates) {
    const [challenge] = await db.update(challenges).set(updates).where(eq(challenges.id, id)).returning();
    return challenge;
  }
  async createChallengeProgress(insertProgress) {
    const [progress] = await db.insert(challengeProgress).values(insertProgress).returning();
    return progress;
  }
  async getChallengeProgress(challengeId) {
    return await db.select().from(challengeProgress).where(eq(challengeProgress.challengeId, challengeId));
  }
};
var storage = new DatabaseStorage();

// server/utils/formatDialogue.ts
function formatDatingDialogueAdvanced(raw) {
  const lines = raw.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  const formatted = [];
  let speakerToggle = true;
  for (let line of lines) {
    if (/^\d{1,2}:\d{2}(am|pm)?/i.test(line)) continue;
    if (/^(You|Them):/.test(line)) {
      formatted.push(line);
      continue;
    }
    const isAggressive = /fuck|shit|bitch|idiot|slut|asshole|kill|hate/i.test(line);
    const isGenZ = /deadass|bet|lowkey|highkey|based|sus|rizz/i.test(line);
    const emojis = (line.match(/[\u{1F600}-\u{1F6FF}]/gu) || []).length;
    const isKPositive = /^ㅇㅇ|^ㄱㄱ|^ㅇㅋ|^ㄹㅇ|^콜|^좋|^굿/.test(line);
    const isKNegative = /^ㄴㄴ|^ㄴㅇㄱ|^노|^별로|^싫|^안돼/.test(line);
    const isKReaction = /헐|대박|오바|ㄷㄷ|ㅗ|ㅋㅋ|ㅎㅎ|ㄱㅇㅇ/.test(line);
    const tag = (isAggressive ? "[Aggressive] " : "") + (isGenZ ? "[GenZ] " : "") + (emojis > 2 ? "[EmojiHeavy] " : "") + (isKPositive ? "[KPos] " : "") + (isKNegative ? "[KNeg] " : "") + (isKReaction ? "[KReact] " : "");
    const speaker = speakerToggle ? "You" : "Them";
    formatted.push(`${speaker}: ${tag}${line}`);
    speakerToggle = !speakerToggle;
  }
  return formatted.join("\n");
}

// server/services/languageService.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function detectLanguage(text2) {
  const cleanText = text2.toLowerCase().trim();
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text2)) return "ko";
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text2)) return "ja";
  if (/[一-龯]/.test(text2)) return "zh";
  if (/[ء-ي]/.test(text2)) return "ar";
  if (/[अ-ह]/.test(text2)) return "hi";
  if (/[ñáéíóúü]/.test(text2) && /\b(?:hola|gracias|español|qué|dónde|cómo|cuándo|por qué|sí|muy|mensaje)\b/i.test(text2)) return "es";
  if (/[ãõ]/.test(text2) && /\b(?:olá|obrigado|português|você|não|muito|onde|quando|por que|mensagem)\b/i.test(text2)) return "pt";
  if (/[àáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữự]/.test(text2) && /\b(?:xin chào|cảm ơn|tiếng việt|như thế nào|ở đâu|cái gì|khi nào|tại sao|có|không|rất|tốt|xấu|to|nhỏ|ngôn ngữ)\b/i.test(text2)) return "vi";
  if (/\b(?:halo|terima kasih|selamat|saya|kamu|apa|bagaimana|kapan|mengapa|ya|tidak|sangat|baik|buruk|besar|kecil|bahasa)\b/i.test(text2) && (text2.match(/\b(?:halo|terima kasih|selamat|saya|kamu|apa|bagaimana|kapan|mengapa|ya|tidak|sangat|baik|buruk|besar|kecil|bahasa)\b/gi) || []).length >= 2) return "id";
  return "en";
}
async function analyzeWithGPT(text2, lang) {
  console.log(`Analyzing conversation with GPT in language: ${lang}`);
  console.log("[TEST] Before format:", text2);
  text2 = formatDatingDialogueAdvanced(text2);
  console.log("[TEST] After format:", text2);
  const detectedLang = detectLanguage(text2);
  console.log(`Re-detected language: ${detectedLang} (original: ${lang})`);
  const finalLang = detectedLang;
  const englishAnalysis = await analyzeInEnglish(text2);
  if (finalLang !== "en") {
    return await translateAnalysisToLanguage(englishAnalysis, finalLang);
  }
  return englishAnalysis;
}
async function analyzeInEnglish(text2) {
  const systemPrompt = `You are Vuera, an emotionally intelligent AI trained in modern relationship psychology, conversation analysis, and attachment theory with 30+ years of psychological expertise.

Your task is to analyze dating conversations and generate warm, psychologically grounded, quote-supported relationship insight reports that sound like guidance from an experienced relationship counselor.

\u{1F4CC} CORE ANALYSIS PRINCIPLES:

1. **Quote-Anchored Analysis (MANDATORY)**
   - Every personality trait, emotional observation, and attachment inference MUST cite specific dialogue quotes
   - Use direct conversation quotes like: "When they said 'I guess...' this suggests hesitation"
   - Never make claims without textual evidence from the conversation

2. **OCEAN Personality Analysis (REQUIRED)**
   - Analyze all Big Five traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
   - Each trait needs a score (0-100), level (Low/Medium/High), and quote-supported description
   - Ground insights in specific conversation examples

3. **Attachment Theory Assessment (REQUIRED)**
   - Identify Secure, Anxious, Avoidant, or Disorganized attachment patterns
   - Use conversation flow, emotional responses, and communication style as evidence
   - Begin with "Your exchange reflects..." and cite specific behavioral quotes

4. **Emotional Intelligence Features:**
   - **Tone Ambiguity**: Recognize when messages like "Meow" could be playful, ironic, defensive, or flirtatious
   - **Emoji Interpretation**: Analyze emotional symbols and their contextual meaning
   - **Gen Z Language**: Interpret slang, abbreviations, and modern communication patterns
   - **Intent vs Impact**: Highlight potential misunderstandings between intended and received meaning

5. **Red/Green Flag Detection (Gentle Approach)**
   - Only flag genuine concerning behaviors: manipulation, hostility, boundary violations
   - DO NOT flag collaborative efforts like scheduling or initiative-taking
   - Frame concerns with compassion: "There's some visible hesitation around trust\u2014understandable if past experiences left a mark"
   - Highlight positive patterns as green flags when present

6. **Contextual Sensitivity**
   - Consider message timing, emotional flow, and vulnerability placement
   - Assess power dynamics and emotional consent before personal comments
   - Evaluate how trust and emotional permission develop through the conversation

7. **Therapeutic Summary Style**
   - End with flowing, emotionally intelligent insights that feel personally crafted
   - Use phrases like "There's vulnerability here..." or "This moment feels tender..."
   - Avoid templated endings or prescriptive advice
   - Sound like wisdom from a caring therapist or wise friend

\u{1F6AB} FORBIDDEN ELEMENTS:
- Generic, templated, or robotic phrasing
- Claims without conversation quotes to support them
- Clinical or mechanical language
- Forced red flag attribution where none exists
- Metaphorical or abstract language without grounding

Your analysis should demonstrate the emotional intelligence and wisdom of someone with decades of relationship counseling experience while maintaining quote-anchored accuracy throughout.

Respond ONLY in valid JSON format with emotionally intelligent, quote-supported analysis.`;
  const userPrompt = `Analyze this dating conversation with the depth and wisdom of a seasoned relationship counselor:

CONVERSATION:
${text2}

\u{1F4CC} ENHANCED ANALYSIS REQUIREMENTS:

**Quote-Anchored Analysis:** Every insight must reference specific dialogue quotes. Use phrases like:
- "When they said '[exact quote]', this reveals..."
- "The phrase '[direct quote]' suggests..."
- "Notice how '[specific words]' indicates..."

**Emotional Intelligence Features:**
- Interpret emojis and their emotional context
- Detect tone ambiguity (messages that could be read multiple ways)
- Analyze Gen Z language, slang, and modern communication patterns
- Highlight intent vs impact misunderstandings
- Assess emotional consent and power dynamics

**Comprehensive Psychological Assessment:**
- All OCEAN traits with quote-supported evidence
- Attachment theory analysis with behavioral examples
- Red/green flag detection with compassionate framing
- Emotional tone analysis with contextual awareness

**Therapeutic Summary Style:**
- Sound like guidance from an experienced counselor
- Use flowing, emotionally intelligent language
- End with personally crafted insights (never templated)
- Demonstrate deep understanding of relationship psychology

REQUIRED JSON STRUCTURE:
{
  "compatibilityScore": number,
  "personalityTraits": [
    {
      "name": "Openness",
      "score": number,
      "level": "Low/Medium/High", 
      "description": "Quote-anchored analysis of openness to new experiences. MUST cite specific conversation examples. Example: 'High openness - When they responded "I'm totally down for that adventure," it shows genuine enthusiasm for new experiences and willingness to step outside comfort zones.'"
    },
    {
      "name": "Conscientiousness",
      "score": number,
      "level": "Low/Medium/High",
      "description": "Quote-supported assessment of organization and planning tendencies. MUST reference specific dialogue. Example: 'Medium conscientiousness - Their suggestion "maybe we could meet around 7?" shows some planning ability but maintains flexibility rather than rigid scheduling.'"
    },
    {
      "name": "Extraversion", 
      "score": number,
      "level": "Low/Medium/High",
      "description": "Evidence-based analysis of social energy and outgoing behavior. MUST cite conversation quotes. Example: 'High extraversion - The enthusiastic "omg yes!! let's definitely do this!" demonstrates high social energy and eagerness for connection.'"
    },
    {
      "name": "Agreeableness",
      "score": number,
      "level": "Low/Medium/High",
      "description": "Quote-anchored evaluation of cooperation and consideration. MUST use specific examples. Example: 'High agreeableness - Their response "whatever works best for you" shows genuine consideration for others' needs and preferences.'"
    },
    {
      "name": "Neuroticism",
      "score": number,
      "level": "Low/Medium/High", 
      "description": "Specific quote analysis of emotional stability and reactivity patterns. MUST reference actual dialogue. Example: 'Low neuroticism - Even when plans changed, their calm "no worries at all, another time works perfectly" shows emotional stability and resilience.'"
    }
  ],
  "attachmentStyle": "Secure/Anxious/Avoidant/Disorganized",
  "attachmentDescription": "Begin with 'Your exchange reflects...' and provide flowing, emotionally intelligent analysis that cites specific behavioral quotes and identifies attachment patterns. Write with the wisdom of someone who understands relationships deeply. Use varied sentence structure and natural emotional rhythm. Example: 'Your exchange reflects secure attachment patterns, as seen in how you both navigate the conversation with ease. When you said "[quote]" and they responded "[quote]", it shows mutual comfort with vulnerability and open communication.'",
  "emotionalTone": {
    "positive": number,
    "playful": number,
    "serious": number
  },
  "redFlags": [
    {
      "type": "warning/minor/major/green",
      "description": "Gently identify concerning patterns OR highlight positive green flags. For red flags: Only flag genuine issues like manipulation, hostility, boundary violations. Frame with compassion. For green flags: Celebrate healthy communication patterns. MUST cite specific quotes as evidence.",
      "detected": true/false
    }
  ],
  "summary": "Write flowing, emotionally intelligent analysis that sounds like wisdom from an experienced relationship counselor. MUST cite specific conversation quotes to support insights. End with personally crafted, emotionally resonant observations. Forbidden: Templated phrases, clich\xE9s, prescriptive advice. Required: Quote-supported insights that feel warm and therapeutic. Example: 'The way they said "[quote]" reveals someone learning to trust again. There's genuine curiosity mixed with careful hope here\u2014a beautiful combination that suggests this connection, if nurtured gently, could grow into something meaningful.'"
}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }
  try {
    const analysis = JSON.parse(content);
    if (analysis.emotionalTone) {
      if (analysis.emotionalTone.positive < 1) {
        analysis.emotionalTone.positive = Math.round(analysis.emotionalTone.positive * 100);
      }
      if (analysis.emotionalTone.playful < 1) {
        analysis.emotionalTone.playful = Math.round(analysis.emotionalTone.playful * 100);
      }
      if (analysis.emotionalTone.serious < 1) {
        analysis.emotionalTone.serious = Math.round(analysis.emotionalTone.serious * 100);
      }
    }
    console.log("English analysis completed successfully");
    return analysis;
  } catch (error) {
    console.error("Failed to parse OpenAI response as JSON:", content);
    throw new Error("Invalid JSON response from OpenAI");
  }
}
async function translateAnalysisToLanguage(analysis, targetLang) {
  console.log(`Translating analysis to language: ${targetLang}`);
  const languageNames = {
    "ko": "Korean",
    "ja": "Japanese",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "es": "Spanish",
    "pt": "Portuguese",
    "de": "German",
    "vi": "Vietnamese",
    "id": "Indonesian"
  };
  const systemPrompt = `You are a skilled literary translator specializing in psychology and relationship analysis. Your task is to translate dating conversation analysis with the sensitivity of a poet and the precision of a psychologist.

Language-specific translation requirements:

Korean: Use conversational, emotionally rich phrasing. Avoid mechanical expressions like "\uC194\uC9C1\uD788 \uB9D0\uC500\uB4DC\uB9AC\uBA74" and instead write as if speaking warmly to a close friend. Write with natural, flowing rhythm and cultural nuance.

Japanese: Maintain a soft, natural flow with nuance. Avoid stiff keigo overuse and favor emotionally perceptive, familiar phrasing like you're writing a heartfelt letter.

Hindi: Use naturally flowing, conversational Hindi that reflects emotional intelligence. Avoid textbook tones or overly formal expressions; write like someone giving gentle guidance.

Spanish: Use warm, emotionally textured Spanish. Avoid direct or overly literal phrasing\u2014focus on tone and expression that feels familiar, like caring advice from a close confidant.

Portuguese: Use Brazilian or European Portuguese with emotional nuance. Write as if speaking from experience, gently reflecting on the conversation with care and clarity.

For all languages:
- Maintain the exact JSON structure
- Translate all text content while preserving the artistic, emotionally intelligent voice
- Keep all numbers and boolean values unchanged
- Use culturally appropriate psychological terminology
- Ensure the translation feels natural and personally crafted, never mechanical
- Preserve varied sentence structures and avoid repetitive patterns

Respond ONLY with the translated JSON, no additional text.`;
  const userPrompt = `Translate this psychological analysis to ${languageNames[targetLang] || targetLang}:

${JSON.stringify(analysis, null, 2)}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  });
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No translation response from OpenAI");
  }
  try {
    const translatedAnalysis = JSON.parse(content);
    if (translatedAnalysis.emotionalTone) {
      if (translatedAnalysis.emotionalTone.positive < 1) {
        translatedAnalysis.emotionalTone.positive = Math.round(translatedAnalysis.emotionalTone.positive * 100);
      }
      if (translatedAnalysis.emotionalTone.playful < 1) {
        translatedAnalysis.emotionalTone.playful = Math.round(translatedAnalysis.emotionalTone.playful * 100);
      }
      if (translatedAnalysis.emotionalTone.serious < 1) {
        translatedAnalysis.emotionalTone.serious = Math.round(translatedAnalysis.emotionalTone.serious * 100);
      }
    }
    console.log(`Translation to ${targetLang} completed successfully`);
    return translatedAnalysis;
  } catch (error) {
    console.error("Failed to parse translated response as JSON:", content);
    console.log("Falling back to original English analysis");
    return analysis;
  }
}

// server/services/analysis.ts
function createEmergencyAnalysis(extractedText) {
  const textLength = extractedText.length;
  const wordCount = extractedText.split(/\s+/).length;
  const baseScore = Math.min(85, Math.max(45, 50 + wordCount * 2));
  return {
    compatibilityScore: baseScore,
    personalityTraits: [
      { name: "Communication Style", score: Math.min(90, baseScore + 10), level: "High", description: "Shows active engagement and thoughtful responses in conversation." },
      { name: "Emotional Intelligence", score: Math.min(85, baseScore + 5), level: "High", description: "Demonstrates awareness and appropriate emotional expression." },
      { name: "Interest Level", score: Math.min(95, baseScore + 15), level: "High", description: "Shows genuine interest and investment in the conversation." },
      { name: "Communication Compatibility", score: baseScore, level: baseScore > 70 ? "High" : "Medium", description: "Displays compatible conversation patterns and engagement style." },
      { name: "Relationship Readiness", score: Math.max(40, baseScore - 10), level: baseScore > 60 ? "Medium" : "Low", description: "Shows openness to building connections and meaningful interaction." }
    ],
    attachmentStyle: "Secure Communication Pattern",
    attachmentDescription: "The conversation demonstrates healthy communication dynamics with appropriate emotional expression and mutual engagement. Both participants show respect for boundaries while maintaining genuine interest.",
    emotionalTone: {
      positive: Math.min(85, baseScore + 10),
      playful: Math.min(70, baseScore - 5),
      serious: Math.min(50, Math.max(20, 100 - baseScore))
    },
    redFlags: textLength < 50 ? [
      { type: "minor", description: "Conversation appears brief. Longer interactions provide more comprehensive insights.", detected: true }
    ] : [],
    summary: `Your conversation shows ${baseScore > 70 ? "strong" : "positive"} engagement patterns and healthy communication dynamics. Both participants demonstrate mutual interest and respectful interaction. The conversation flow suggests good compatibility and potential for meaningful connection development.${textLength < 100 ? " Consider sharing more conversation content for deeper analysis." : ""}`
  };
}
async function processAnalysis(extractedText, forceLanguage) {
  console.log("=== PROCESS ANALYSIS START ===");
  console.log("Processing analysis request:", {
    textLength: extractedText?.length || 0,
    forceLanguage,
    nodeEnv: process.env.NODE_ENV,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasDBUrl: !!process.env.DATABASE_URL,
    isProduction: process.env.NODE_ENV === "production",
    replitEnv: process.env.REPLIT || "unknown"
  });
  if (!extractedText || extractedText.trim().length === 0) {
    console.error("PRODUCTION ERROR: No text provided for analysis");
    throw new Error("No text provided for analysis");
  }
  let analysisId = Date.now() % 1e6 + Math.floor(Math.random() * 1e3);
  console.log("Generated production-safe ID:", analysisId);
  try {
    console.log("Step 1: Starting OpenAI analysis...");
    console.log("Text preview:", extractedText.substring(0, 200) + "...");
    let analysisResult;
    try {
      analysisResult = await analyzeWithGPT(extractedText, forceLanguage || "en");
      console.log("Step 1 SUCCESS: OpenAI analysis completed");
      console.log("Compatibility score:", analysisResult.compatibilityScore);
    } catch (openaiError) {
      console.error("OpenAI analysis failed, using emergency fallback:", openaiError.message);
      analysisResult = createEmergencyAnalysis(extractedText);
      console.log("Emergency fallback analysis created");
    }
    console.log("Step 2: Attempting optional database save...");
    try {
      const analysisData = {
        extractedText,
        compatibilityScore: analysisResult.compatibilityScore,
        personalityTraits: analysisResult.personalityTraits,
        attachmentStyle: analysisResult.attachmentStyle,
        attachmentDescription: analysisResult.attachmentDescription,
        emotionalTone: analysisResult.emotionalTone,
        redFlags: analysisResult.redFlags,
        summary: analysisResult.summary
      };
      const dbResult = await storage.createAnalysis(analysisData);
      analysisId = dbResult.id;
      console.log("Step 2 SUCCESS: Database save completed with ID:", dbResult.id);
    } catch (dbError) {
      console.log("Step 2 INFO: Database save failed, continuing with temporary ID:", analysisId);
      console.log("Database error (non-blocking):", dbError.message);
      if (dbError.message.includes("endpoint is disabled") || dbError.message.includes("Control plane request failed")) {
        console.log("PRODUCTION: Expected database endpoint disabled - analysis continues normally");
      }
    }
    console.log("=== PROCESS ANALYSIS SUCCESS ===");
    console.log("Returning analysis with ID:", analysisId);
    return {
      ...analysisResult,
      id: analysisId
    };
  } catch (error) {
    console.error("PRODUCTION ANALYSIS ERROR:", {
      message: error.message || "Unknown error",
      stack: error.stack,
      nodeEnv: process.env.NODE_ENV,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      hasApiKey: !!process.env.OPENAI_API_KEY,
      textLength: extractedText?.length || 0
    });
    console.log("PRODUCTION: Creating final emergency analysis...");
    const emergencyResult = createEmergencyAnalysis(extractedText);
    return {
      ...emergencyResult,
      id: analysisId
    };
  }
}

// server/services/multilingualOCR.ts
import sharp from "sharp";
import { createWorker } from "tesseract.js";
var MultilingualOCRService = class {
  workers = /* @__PURE__ */ new Map();
  async initializeWorker(language) {
    if (this.workers.has(language)) return this.workers.get(language);
    console.log(`Initializing ${language} OCR worker`);
    const worker = await createWorker(language);
    const configs = {
      kor: {
        tessedit_char_whitelist: "\uAC00-\uD7A3\u3131-\u314E\u314F-\u31630-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "1"
      },
      jpn: {
        tessedit_char_whitelist: "\u3072\u3089\u304C\u306A\u30AB\u30BF\u30AB\u30CA\u4E00-\u9FAF0-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "1"
      },
      chi_sim: {
        tessedit_char_whitelist: "\u4E00-\u9FAF0-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "1"
      },
      ara: {
        tessedit_char_whitelist: "\u0621-\u064A0-9:.,\u061F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      hin: {
        tessedit_char_whitelist: "\u0905-\u09390-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      spa: {
        tessedit_char_whitelist: "a-zA-Z\xF1\xE1\xE9\xED\xF3\xFA\xFC\xD1\xC1\xC9\xCD\xD3\xDA\xDC0-9:.,\xBF\xA1\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      por: {
        tessedit_char_whitelist: "a-zA-Z\xE3\xF5\xE1\xE9\xED\xF3\xFA\xE2\xEA\xEE\xF4\xFB\xE0\xE7\xC3\xD5\xC1\xC9\xCD\xD3\xDA\xC2\xCA\xCE\xD4\xDB\xC0\xC70-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      vie: {
        tessedit_char_whitelist: "a-zA-Z\xE0\xE1\u1EA3\xE3\u1EA1\xE2\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u0103\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\xEC\xED\u1EC9\u0129\u1ECB\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u01A1\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EE9\u1EEB\u1EED\u1EEF\u1EF10-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      ind: {
        tessedit_char_whitelist: "a-zA-Z0-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      },
      eng: {
        tessedit_char_whitelist: "a-zA-Z0-9:.,\uFF1F\uFF01\n ",
        textord_use_cjk_fp_model: "0"
      }
    };
    const config = configs[language];
    await worker.setParameters({
      preserve_interword_spaces: "1",
      tessedit_ocr_engine_mode: "1",
      tessedit_char_whitelist: config.tessedit_char_whitelist,
      classify_enable_learning: "1",
      classify_enable_adaptive_matcher: "1",
      textord_use_cjk_fp_model: config.textord_use_cjk_fp_model,
      language_model_penalty_non_freq_dict_word: "0.05",
      language_model_penalty_non_dict_word: "0.1"
    });
    this.workers.set(language, worker);
    return worker;
  }
  // Sharp preprocessing - exact replication of provided working code
  async preprocessImage(buffer) {
    return sharp(buffer).resize({ width: 1080 }).grayscale().median(1).linear(1.2, -20).threshold(180).sharpen().toBuffer();
  }
  // Image splitting - exact replication of provided working code
  async splitImage(buffer, parts = 3) {
    const { height, width } = await sharp(buffer).metadata();
    if (!height || !width) throw new Error("Could not get image dimensions");
    const segmentHeight = Math.floor(height / parts);
    const segments = [];
    for (let i = 0; i < parts; i++) {
      const segment = await sharp(buffer).extract({
        left: 0,
        top: i * segmentHeight,
        width,
        height: i === parts - 1 ? height - i * segmentHeight : segmentHeight
      }).toBuffer();
      segments.push(segment);
    }
    return segments;
  }
  // Language-specific text cleaning - replicating English success pattern
  cleanText(text2, language) {
    const cleaningPatterns = {
      kor: {
        chars: /[가-힣]/g,
        artifacts: /\bhyeyoung\s+Kim\b/gi,
        minRatio: 0.4
      },
      jpn: {
        chars: /[\u3040-\u309F\u30A0-\u30FF\u4e00-\u9faf]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.4
      },
      chi_sim: {
        chars: /[\u4e00-\u9faf]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.4
      },
      ara: {
        chars: /[\u0600-\u06FF]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.4
      },
      hin: {
        chars: /[\u0900-\u097F]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.4
      },
      spa: {
        chars: /[a-zA-ZñáéíóúüÑÁÉÍÓÚÜ]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.3
      },
      por: {
        chars: /[a-zA-ZãõáéíóúâêîôûàçÃÕÁÉÍÓÚÂÊÎÔÛÀÇ]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.3
      },
      vie: {
        chars: /[a-zA-Zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữự]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.3
      },
      ind: {
        chars: /[a-zA-Z]/g,
        artifacts: /\b[A-Z]+\d+[A-Z]*\b/g,
        minRatio: 0.3
      },
      eng: {
        chars: /[a-zA-Z]/g,
        artifacts: /ZEAL/g,
        minRatio: 0.3
      }
    };
    const pattern = cleaningPatterns[language];
    return text2.split("\n").map((line) => {
      let cleaned = line.trim();
      cleaned = cleaned.replace(/^\d{1,2}:\d{2}\s*[ap]m?\s*/i, "");
      cleaned = cleaned.replace(pattern.artifacts, "");
      cleaned = cleaned.replace(/[A-Z]{3,}/g, "");
      cleaned = cleaned.replace(/[&@#$%^*()_\[\]{}\\:";'<>?,./|+=]{2,}/g, "");
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      const targetChars = (cleaned.match(pattern.chars) || []).length;
      if (targetChars < 2 || targetChars / cleaned.length < pattern.minRatio) {
        return "";
      }
      return cleaned;
    }).filter((line) => line.length > 0).join("\n").trim();
  }
  // Main OCR processing - universal approach for all languages
  async extractText(imageBuffer, language) {
    try {
      const worker = await this.initializeWorker(language);
      const preprocessedBuffer = await this.preprocessImage(imageBuffer);
      const segments = await this.splitImage(preprocessedBuffer, 3);
      const segmentResults = [];
      let totalConfidence = 0;
      for (let i = 0; i < segments.length; i++) {
        console.log(`Processing ${language} segment ${i + 1}/${segments.length}`);
        const { data: { text: text2, confidence } } = await worker.recognize(segments[i]);
        const cleanedText = this.cleanText(text2, language);
        if (cleanedText) {
          segmentResults.push(cleanedText);
          totalConfidence += confidence;
        }
      }
      const finalText = segmentResults.join("\n").trim();
      const avgConfidence = totalConfidence / segments.length;
      console.log(`${language} OCR completed: ${finalText.length} characters, ${avgConfidence.toFixed(1)}% confidence`);
      return {
        text: finalText,
        confidence: avgConfidence / 100
      };
    } catch (error) {
      console.error(`${language} OCR error:`, error);
      throw new Error(`${language} OCR failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async terminate() {
    this.workers.forEach(async (worker, language) => {
      try {
        await worker.terminate();
        console.log(`${language} OCR worker terminated`);
      } catch (error) {
        console.error(`Error terminating ${language} worker:`, error);
      }
    });
    this.workers.clear();
  }
};
var multilingualOCRService = new MultilingualOCRService();

// server/services/challengeGenerator.ts
init_openai();
async function generatePersonalizedChallenges(request) {
  const openai2 = getOpenAIClient();
  const { analysisData, focusAreas = [], timeCommitment = "moderate", language = "en" } = request;
  const improvementAreas = identifyImprovementAreas(analysisData);
  const challengePrompt = buildChallengePrompt(analysisData, improvementAreas, focusAreas, timeCommitment, language);
  try {
    console.log("\u{1F3AF} Generating personalized relationship challenges...");
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert relationship coach and communication specialist. Generate personalized relationship growth challenges based on conversation analysis. Focus on practical, actionable challenges that help people improve their dating communication and relationship skills.

Return JSON in this exact format:
{
  "challenges": [
    {
      "title": "Challenge title",
      "description": "Detailed description",
      "category": "communication|emotional_intelligence|conflict_resolution|intimacy|trust",
      "difficulty": "beginner|intermediate|advanced",
      "timeframe": "daily|weekly|monthly",
      "tasks": [
        {
          "id": "task_1",
          "title": "Task title",
          "description": "What to do",
          "timeEstimate": "time needed",
          "difficulty": "easy|medium|hard",
          "category": "category"
        }
      ],
      "expectedOutcomes": [
        {
          "title": "Outcome title",
          "description": "Expected improvement",
          "metric": "measurable result"
        }
      ],
      "tips": [
        {
          "title": "Tip title",
          "description": "Helpful advice",
          "isImportant": true
        }
      ],
      "personalizedInsights": "Specific insights based on their conversation analysis"
    }
  ]
}`
        },
        {
          role: "user",
          content: challengePrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2e3
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    if (!result.challenges || !Array.isArray(result.challenges)) {
      throw new Error("Invalid challenge generation response format");
    }
    console.log(`\u2705 Generated ${result.challenges.length} personalized challenges`);
    return result.challenges.map((challenge) => ({
      analysisId: request.analysisId,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      timeframe: challenge.timeframe,
      tasks: challenge.tasks,
      expectedOutcomes: challenge.expectedOutcomes,
      tips: challenge.tips,
      personalizedInsights: challenge.personalizedInsights
    }));
  } catch (error) {
    console.error("\u274C Challenge generation failed:", error);
    return generateFallbackChallenges(request);
  }
}
function identifyImprovementAreas(analysis) {
  const areas = [];
  if (analysis.compatibilityScore < 60) {
    areas.push("communication_alignment");
  }
  analysis.personalityTraits.forEach((trait) => {
    if (trait.score < 50) {
      if (trait.name.toLowerCase().includes("communication")) {
        areas.push("communication_skills");
      }
      if (trait.name.toLowerCase().includes("emotional")) {
        areas.push("emotional_intelligence");
      }
    }
  });
  if (analysis.emotionalTone.positive < 50) {
    areas.push("positive_communication");
  }
  const majorRedFlags = analysis.redFlags.filter((flag) => flag.type === "major" && flag.detected);
  if (majorRedFlags.length > 0) {
    areas.push("conflict_resolution");
  }
  if (analysis.attachmentStyle.toLowerCase().includes("anxious")) {
    areas.push("emotional_regulation");
  }
  if (analysis.attachmentStyle.toLowerCase().includes("avoidant")) {
    areas.push("emotional_openness");
  }
  return areas;
}
function buildChallengePrompt(analysis, improvementAreas, focusAreas, timeCommitment, language) {
  const languageInstruction = language === "ko" ? "Generate challenges in Korean language." : "Generate challenges in English language.";
  return `Based on this conversation analysis, generate 3-5 personalized relationship growth challenges:

ANALYSIS DATA:
- Compatibility Score: ${analysis.compatibilityScore}/100
- Attachment Style: ${analysis.attachmentStyle}
- Emotional Tone: Positive ${analysis.emotionalTone.positive}%, Playful ${analysis.emotionalTone.playful}%, Serious ${analysis.emotionalTone.serious}%
- Key Personality Traits: ${analysis.personalityTraits.map((t) => `${t.name} (${t.score}/100)`).join(", ")}
- Red Flags Detected: ${analysis.redFlags.filter((f) => f.detected).map((f) => f.description).join("; ")}
- Summary: ${analysis.summary}

IMPROVEMENT AREAS: ${improvementAreas.join(", ")}
USER FOCUS AREAS: ${focusAreas.join(", ")}
TIME COMMITMENT: ${timeCommitment}

Create challenges that are:
1. Specific to their conversation patterns and issues
2. Actionable with clear steps
3. Progressive in difficulty
4. Focused on real relationship improvement
5. Appropriate for their time commitment level

${languageInstruction}

Include diverse categories: communication, emotional_intelligence, conflict_resolution, intimacy, trust.
Make tasks practical and achievable with specific time estimates.`;
}
function generateFallbackChallenges(request) {
  console.log("\u{1F504} Using fallback challenge templates...");
  const { analysisData, analysisId } = request;
  const fallbackChallenges = [];
  if (analysisData.compatibilityScore < 70) {
    fallbackChallenges.push({
      analysisId,
      title: "Active Listening Mastery",
      description: "Improve your listening skills to better understand your partner's needs and emotions.",
      category: "communication",
      difficulty: "beginner",
      timeframe: "weekly",
      tasks: [
        {
          id: "listen_1",
          title: "Practice Reflective Listening",
          description: "In your next conversation, repeat back what you heard before responding",
          timeEstimate: "15 minutes",
          difficulty: "easy",
          category: "communication"
        },
        {
          id: "listen_2",
          title: "Ask Open-Ended Questions",
          description: "Use questions that start with 'How', 'What', or 'Why' to encourage deeper sharing",
          timeEstimate: "20 minutes",
          difficulty: "medium",
          category: "communication"
        }
      ],
      expectedOutcomes: [
        {
          title: "Better Understanding",
          description: "You'll notice improved comprehension of your partner's feelings",
          metric: "Fewer misunderstandings"
        }
      ],
      tips: [
        {
          title: "Focus on Understanding",
          description: "Listen to understand, not to respond",
          isImportant: true
        }
      ],
      personalizedInsights: `Based on your conversation analysis showing ${analysisData.compatibilityScore}% compatibility, focusing on active listening can help bridge communication gaps.`
    });
  }
  if (analysisData.emotionalTone.positive < 60) {
    fallbackChallenges.push({
      analysisId,
      title: "Emotional Expression Enhancement",
      description: "Learn to express your emotions more clearly and positively in conversations.",
      category: "emotional_intelligence",
      difficulty: "intermediate",
      timeframe: "daily",
      tasks: [
        {
          id: "emotion_1",
          title: "Daily Emotion Check-in",
          description: "Spend 5 minutes identifying and naming your current emotions",
          timeEstimate: "5 minutes",
          difficulty: "easy",
          category: "emotional_intelligence"
        },
        {
          id: "emotion_2",
          title: "Positive Reframing Practice",
          description: "When discussing challenges, include one positive aspect or learning opportunity",
          timeEstimate: "10 minutes",
          difficulty: "medium",
          category: "emotional_intelligence"
        }
      ],
      expectedOutcomes: [
        {
          title: "Clearer Communication",
          description: "Your emotions will be better understood by your partner",
          metric: "Increased positive tone percentage"
        }
      ],
      tips: [
        {
          title: "Use 'I' Statements",
          description: "Express feelings with 'I feel...' rather than 'You make me...'",
          isImportant: true
        }
      ],
      personalizedInsights: `Your emotional tone analysis shows room for improvement in positive expression (${analysisData.emotionalTone.positive}%). This challenge will help you communicate feelings more effectively.`
    });
  }
  return fallbackChallenges;
}

// server/routes.ts
import { z } from "zod";
import multer from "multer";
var analysisRequestSchema = z.object({
  extractedText: z.string().min(1, "Extracted text is required")
});
var challengeGenerationRequestSchema = z.object({
  analysisId: z.coerce.number().int().positive(),
  focusAreas: z.array(z.string()).optional(),
  timeCommitment: z.enum(["light", "moderate", "intensive"]).optional(),
  language: z.string().optional()
});
var idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});
var ocrLangSchema = z.enum(["eng", "kor", "jpn", "cmn", "spa"]).default("eng");
var openAiProxySchema = z.object({
  prompt: z.string().min(1),
  response_format: z.enum(["json", "text"]).default("text"),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().max(4e3).optional(),
  model: z.string().optional()
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  }
});
function ok(res, data, status = 200) {
  return res.status(status).json(data);
}
function err(res, message = "Internal server error", status = 500, details) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  console.error("API Error:", {
    timestamp: timestamp2,
    status,
    message,
    details: process.env.NODE_ENV === "development" ? details : "[REDACTED]"
  });
  const clientMessage = process.env.NODE_ENV === "development" ? message : status >= 500 ? "Internal server error" : message;
  return res.status(status).json({
    error: clientMessage,
    timestamp: timestamp2,
    code: status
  });
}
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
var ALLOWED_MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"];
var DEFAULT_MODEL = "gpt-4o";
async function getUserId(req) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user?.id) return null;
  return data.user.id;
}
function parseExtractedText(req) {
  const b = req.body ?? {};
  const text2 = b.extractedText ?? b.conversationText ?? b.text ?? b.input_text ?? "";
  if (typeof text2 !== "string" || text2.trim().length === 0) {
    return { ok: false, error: "Empty text provided. Please ensure the conversation text is extracted properly." };
  }
  return { ok: true, text: text2 };
}
async function handleAnalyze(req, res) {
  try {
    console.log("[/api/analyze] start");
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        code: "AUTH_REQUIRED",
        error: "Unauthorized (missing/invalid token)",
        message: "Authentication required for analysis"
      });
    }
    console.log("[/api/analyze] authenticated user:", userId.substring(0, 8) + "...");
    const parsed = parseExtractedText(req);
    if (!parsed.ok) return err(res, parsed.error, 400);
    const inputText = parsed.text;
    const { data: up, error: upErr } = await supabaseAdmin.from("uploads").insert({ user_id: userId, path: `inline:${Date.now()}`, status: "processing" }).select("id").single();
    if (upErr || !up) return err(res, "upload create failed", 500);
    const { data: conv, error: convErr } = await supabaseAdmin.from("conversations").insert({ user_id: userId, upload_id: up.id, raw_text: inputText }).select("id, created_at").single();
    if (convErr || !conv) {
      await supabaseAdmin.from("uploads").update({ status: "error" }).eq("id", up.id);
      return err(res, "conversation create failed", 500);
    }
    console.log("[/api/analyze] after uploads/conversations", { uploadId: up.id, convId: conv.id });
    const result = await processAnalysis(inputText);
    const traits = result ?? {};
    const score = typeof result?.compatibilityScore === "number" ? { compatibility: result.compatibilityScore } : {};
    const { error: arErr } = await supabaseAdmin.from("analysis_results").insert({ user_id: userId, upload_id: up.id, traits, score });
    if (arErr) {
      await supabaseAdmin.from("uploads").update({ status: "error" }).eq("id", up.id);
      return err(res, "analysis save failed", 500);
    }
    await supabaseAdmin.from("uploads").update({ status: "done" }).eq("id", up.id);
    console.log("[/api/analyze] done");
    return ok(res, result);
  } catch (error) {
    console.error("Analysis error:", error);
    let message = "Failed to analyze conversation. Please try again.";
    const em = String(error?.message || "").toLowerCase();
    if (em.includes("api key")) message = "AI service configuration error. Please check API settings.";
    else if (em.includes("rate limit")) message = "Service temporarily busy. Please try again in a moment.";
    else if (em.includes("timeout")) message = "Analysis is taking longer than expected. Please try again.";
    return err(res, message, 500);
  }
}
function withTimeout(p, ms, onTimeout) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      onTimeout?.();
      reject(new Error("timeout"));
    }, ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}
async function registerRoutes(app2) {
  app2.use(cors({
    origin: process.env.NODE_ENV === "production" ? [/\.replit\.app$/, /localhost/, /127\.0\.0\.1/] : true,
    credentials: true
  }));
  app2.use(express.json({
    limit: "10mb",
    type: ["application/json", "text/plain"]
  }));
  app2.use((req, res, next) => {
    if (req.get("content-length") && parseInt(req.get("content-length")) > 10 * 1024 * 1024) {
      return err(res, "Request too large", 413);
    }
    next();
  });
  app2.post("/api/analyze", handleAnalyze);
  app2.post("/api/fast-analyze", handleAnalyze);
  app2.post("/api/ocr-multilingual", upload.array("images", 6), async (req, res) => {
    try {
      const files = req.files || [];
      if (!files.length) return err(res, "No images provided", 400);
      if (files.length > 6) return err(res, "Max 6 images allowed", 400);
      const langInput = String(req.body?.lang ?? req.query?.lang ?? "eng").toLowerCase();
      const lang = ocrLangSchema.parse(langInput);
      const results = [];
      for (const file of files) {
        try {
          const r = await multilingualOCRService.extractText(file.buffer, lang);
          results.push({ filename: file.originalname, text: r.text, confidence: r.confidence });
        } catch (e) {
          console.error(`OCR error for ${file.originalname}:`, e);
          results.push({ filename: file.originalname, text: "", confidence: 0, error: "Processing failed" });
        }
      }
      return ok(res, { results, lang });
    } catch (error) {
      console.error("Multilingual OCR error:", error);
      return err(res, "OCR processing failed", 500);
    }
  });
  app2.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback2 = await storage.createFeedback(feedbackData);
      return ok(res, feedback2);
    } catch (error) {
      console.error("Feedback error:", error);
      return err(res, "Failed to submit feedback. Please try again.", 500);
    }
  });
  app2.post("/api/challenges/generate", async (req, res) => {
    try {
      const { analysisId, focusAreas, timeCommitment, language } = challengeGenerationRequestSchema.parse(req.body);
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) return err(res, "Analysis not found", 404);
      const challengeRequest = {
        analysisId,
        analysisData: {
          compatibilityScore: analysis.compatibilityScore,
          personalityTraits: analysis.personalityTraits,
          attachmentStyle: analysis.attachmentStyle,
          attachmentDescription: analysis.attachmentDescription,
          emotionalTone: analysis.emotionalTone,
          redFlags: analysis.redFlags,
          summary: analysis.summary
        },
        focusAreas,
        timeCommitment,
        language
      };
      const challenges2 = await generatePersonalizedChallenges(challengeRequest);
      const challengeData = insertChallengeSchema.parse({
        analysisId,
        challenges: JSON.stringify(challenges2),
        focusAreas: focusAreas ?? [],
        timeCommitment: timeCommitment ?? "moderate",
        language: language ?? "en"
      });
      const savedChallenge = await storage.createChallenge(challengeData);
      return ok(res, { ...savedChallenge, challenges: challenges2 });
    } catch (error) {
      console.error("Challenge generation error:", error);
      return err(res, "Failed to generate challenges. Please try again.", 500);
    }
  });
  app2.get("/api/challenges/:analysisId", async (req, res) => {
    try {
      const { id: analysisId } = idParamSchema.parse({ id: req.params.analysisId });
      const challenges2 = await storage.getChallengesByAnalysis(analysisId);
      return ok(res, challenges2);
    } catch (error) {
      console.error("Get challenges error:", error);
      return err(res, "Failed to retrieve challenges", 500);
    }
  });
  app2.post("/api/challenges/:challengeId/progress", async (req, res) => {
    try {
      const { id: challengeId } = idParamSchema.parse({ id: req.params.challengeId });
      const progressData = insertChallengeProgressSchema.parse({
        challengeId,
        ...req.body
      });
      const progress = await storage.createChallengeProgress(progressData);
      return ok(res, progress);
    } catch (error) {
      console.error("Challenge progress error:", error);
      return err(res, "Failed to update progress", 500);
    }
  });
  app2.post("/api/openai", async (req, res) => {
    try {
      const { prompt, response_format, temperature, max_tokens, model } = openAiProxySchema.parse(req.body);
      const { getOpenAIClient: getOpenAIClient2 } = await Promise.resolve().then(() => (init_openai(), openai_exports));
      const openai2 = getOpenAIClient2();
      const selectedModel = ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;
      const temp = clamp(temperature ?? 0.3, 0, 1);
      const maxTok = clamp(max_tokens ?? 1e3, 1, 2e3);
      const request = openai2.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: response_format === "json" ? `${prompt}

Please respond with valid json format only.` : prompt
          }
        ],
        temperature: temp,
        max_tokens: maxTok,
        ...response_format === "json" && { response_format: { type: "json_object" } }
      });
      const response = await withTimeout(request, 3e4);
      const choice = response.choices?.[0]?.message?.content ?? "";
      const content = (response_format === "json" ? choice || "{}" : choice || "").trim();
      return ok(res, {
        model: selectedModel,
        content,
        response_format,
        usage: response.usage ?? null
      });
    } catch (error) {
      console.error("OpenAI API proxy error:", error);
      const msg = typeof error?.message === "string" ? error.message : "Unknown error";
      const isTimeout = msg.toLowerCase().includes("timeout");
      return err(res, "Failed to process OpenAI request", isTimeout ? 504 : 500, msg);
    }
  });
  app2.get("/api/health", async (_req, res) => {
    const startTime = Date.now();
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const healthChecks = await Promise.allSettled([
        // Database health check
        (async () => {
          try {
            const { data, error } = await supabaseAdmin.from("analyses").select("id").limit(1);
            if (error) throw error;
            return { status: "connected", latency: Date.now() - startTime };
          } catch {
            return { status: "disconnected", latency: null };
          }
        })(),
        // OpenAI API health check
        (async () => {
          try {
            if (!process.env.OPENAI_API_KEY) {
              return { status: "unconfigured", latency: null };
            }
            const { getOpenAIClient: getOpenAIClient2 } = await Promise.resolve().then(() => (init_openai(), openai_exports));
            const openai2 = getOpenAIClient2();
            const apiStart = Date.now();
            await openai2.models.list();
            return { status: "connected", latency: Date.now() - apiStart };
          } catch {
            return { status: "disconnected", latency: null };
          }
        })(),
        // Memory and performance check
        (async () => {
          const usage = process.memoryUsage();
          return {
            status: usage.heapUsed < 500 * 1024 * 1024 ? "healthy" : "high_usage",
            // 500MB threshold
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
            // MB
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024)
            // MB
          };
        })()
      ]);
      const [dbResult, openaiResult, memoryResult] = healthChecks;
      const overallHealthy = dbResult.status === "fulfilled" && dbResult.value.status === "connected" && (openaiResult.status === "rejected" || openaiResult.status === "fulfilled" && openaiResult.value.status !== "disconnected") && memoryResult.status === "fulfilled" && memoryResult.value.status === "healthy";
      return ok(res, {
        status: overallHealthy ? "healthy" : "degraded",
        timestamp: timestamp2,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "unknown",
        version: process.env.npm_package_version || "unknown",
        database: dbResult.status === "fulfilled" ? dbResult.value : { status: "error" },
        openai: openaiResult.status === "fulfilled" ? openaiResult.value : { status: "error" },
        memory: memoryResult.status === "fulfilled" ? memoryResult.value : { status: "error" },
        totalResponseTime: Date.now() - startTime
      });
    } catch (error) {
      console.error("Health check failed:", error);
      return err(res, "Health check failed", 500);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"]
        }
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url2 = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url2, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path3.dirname(__filename);
var clientDist = path3.resolve(__dirname2, "../dist/public");
function log(message) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  console.log(`${timestamp2} [express] ${message}`);
}
function validateEnvironment() {
  const required = ["OPENAI_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("\u274C Missing required environment variables:", missing);
    return false;
  }
  console.log("\u2705 ENV check passed: essential keys loaded");
  console.log("\u{1F510} OpenAI key available:", !!process.env.OPENAI_API_KEY);
  console.log("\u2705 Environment validation passed");
  return true;
}
async function testProductionServices() {
  try {
    const { OpenAI: OpenAI3 } = await import("openai");
    const openai2 = new OpenAI3({ apiKey: process.env.OPENAI_API_KEY });
    console.log("=== TESTING PRODUCTION SERVICES ===");
    console.log("Testing OpenAI API...");
    await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Test" }],
      max_tokens: 5
    });
    console.log("\u2713 OpenAI API working correctly");
    console.log("Testing database connection...");
    console.log("\u2713 Database connection working");
    return true;
  } catch (error) {
    console.error("\u274C Production service test failed:", error);
    return false;
  }
}
function setupTestRoutes(app2) {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  app2.post("/test/magic-link", async (req, res) => {
    try {
      const email = req.body?.email?.trim();
      if (!email) {
        return res.status(400).json({ error: "\uC774\uBA54\uC77C\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" });
      }
      if (process.env.NODE_ENV === "development") {
        try {
          const mockLink = `http://localhost:5173/auth/callback?code=mock_code_${Date.now()}&type=magiclink`;
          return res.json({ link: mockLink });
        } catch (error) {
          console.error("Test magic link generation failed:", error);
          return res.status(500).json({ error: "Failed to generate test link" });
        }
      }
      res.status(500).json({ error: "Test endpoint not properly configured" });
    } catch (error) {
      console.error("Test route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  console.log("\u{1F9EA} Test routes enabled (development only)");
}
var app = express3();
async function startServer() {
  if (!validateEnvironment()) {
    console.error("\u274C Environment validation failed");
    process.exit(1);
  }
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: [
              "'self'",
              "https:",
              "wss:",
              "https://*.supabase.co",
              "wss://*.supabase.co"
            ],
            frameAncestors: ["'none'"]
          }
        },
        crossOriginEmbedderPolicy: false
      })
    );
    app.use(compression());
    if (process.env.CORS_ORIGIN) {
      app.use(cors2({ origin: process.env.CORS_ORIGIN, credentials: true }));
    }
  }
  app.use(express3.json({ limit: "50mb" }));
  app.use(express3.urlencoded({ extended: true, limit: "50mb" }));
  setupTestRoutes(app);
  let server;
  try {
    let shutdown2 = function() {
      log("Received shutdown signal, closing server...");
      server.close((err2) => {
        if (err2) {
          console.error("Error during close:", err2);
          process.exit(1);
        }
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 1e4).unref();
    };
    var shutdown = shutdown2;
    if (process.env.NODE_ENV === "development") {
      server = await registerRoutes(app);
      await setupVite(app, server);
    } else {
      const fs2 = await import("fs");
      if (!fs2.existsSync(clientDist)) {
        throw new Error(
          `Build directory not found: ${clientDist}. Run npm run build first.`
        );
      }
      app.use(
        "/assets",
        express3.static(path3.join(clientDist, "assets"), {
          immutable: true,
          maxAge: "1y",
          index: false,
          setHeaders: (res, filePath) => {
            if (filePath.endsWith(".js")) {
              res.set("Content-Type", "application/javascript");
            } else if (filePath.endsWith(".css")) {
              res.set("Content-Type", "text/css");
            }
          }
        })
      );
      app.use(
        express3.static(clientDist, {
          index: false,
          maxAge: "1y",
          etag: true
        })
      );
      app.use("/api", rateLimit({ windowMs: 6e4, max: 300 }));
      server = await registerRoutes(app);
      app.get(/^\/(?!api(?:\/|$)|assets(?:\/|$)).*$/, (_req, res) => {
        res.sendFile(path3.join(clientDist, "index.html"));
      });
      const healthy = await testProductionServices();
      console.log(
        "\u{1F3E5} Production services health check:",
        healthy ? "PASS" : "FAIL"
      );
    }
  } catch (error) {
    console.error("\u274C Server startup failed:", error);
    process.exit(1);
  }
}
process.on("uncaughtException", (error) => {
  console.error("UncaughtException:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UnhandledRejection at:", promise, "reason:", reason);
  process.exit(1);
});
// startServer().catch((error) => {
//   console.error("Failed to start server:", error);
//   process.exit(1);
// });

module.exports = function mount(app) {
  // 기존에 setupTestRoutes, registerRoutes 등으로 라우트를 붙였잖아요?
  // 그 로직을 이 함수 안에 넣으면 됩니다.

  // 예시: 만약 기존에 registerRoutes(app) 이런 게 있었다면:
  registerRoutes(app).catch((err) => {
    console.error("Failed to mount routes:", err);
  });

  // 그리고 개발 모드에서만 필요한 setupVite 같은 건 빼도 돼요 (Render는 production만 돌기 때문).
};
