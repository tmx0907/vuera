diff --git a//dev/null b/config/language-patterns.config.ts
index 0000000000000000000000000000000000000000..2e778567ea6eae4ee406bc60af1a508eb5734516 100644
--- a//dev/null
+++ b/config/language-patterns.config.ts
@@ -0,0 +1,39 @@
+import { SupportedLanguage, LanguagePattern } from '../types/analysis.types';
+
+const createPattern = (
+  chars: RegExp,
+  words: readonly string[],
+  threshold: number
+): LanguagePattern => ({
+  chars,
+  words: new RegExp(`(?:${words.join('|')})`, 'i'),
+  threshold
+});
+
+export const LANGUAGE_PATTERNS: Record<SupportedLanguage, LanguagePattern> = {
+  ko: createPattern(
+    /[가-힣ㄱ-ㅎㅏ-ㅣ]/g,
+    ['안녕','좋아','사랑','만나','시간','어디','언제','뭐','어떻게','그래','맞아','진짜','정말','너무','같이','우리','나는','너는','이에요','예요','습니다','해요','했어요','할까요'],
+    0.1
+  ),
+  ja: createPattern(
+    /[\u3040-\u309F\u30A0-\u30FF]/g,
+    ['こんにちは','ありがとう','すみません','おはよう','こんばんは','さようなら','好き','愛','時間','今日','明日','昨日','今','私','あなた','何','です','ます','でしょう','ました','ください'],
+    0.1
+  ),
+  es: createPattern(
+    /[ñáéíóúü]/g,
+    ['hola','gracias','español','qué','dónde','cómo','cuándo','por qué','sí','muy','tiempo','amor','nosotros','yo','tú'],
+    0.05
+  ),
+  pt: createPattern(
+    /[ãõç]/g,
+    ['olá','obrigado','português','você','não','muito','onde','quando','por que','tempo','amor','nós','eu','tu'],
+    0.05
+  ),
+  en: createPattern(
+    /[a-zA-Z]/g,
+    ['hello','thank','english','what','where','how','when','why','yes','very','time','love','we','i','you'],
+    0.8
+  )
+};
