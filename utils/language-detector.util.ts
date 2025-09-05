diff --git a//dev/null b/utils/language-detector.util.ts
index 0000000000000000000000000000000000000000..7003cced9e5c918530dd6873e86dce3f7e2c0ff3 100644
--- a//dev/null
+++ b/utils/language-detector.util.ts
@@ -0,0 +1,38 @@
+import { SupportedLanguage } from '../types/analysis.types';
+import { LANGUAGE_PATTERNS } from '../config/language-patterns.config';
+
+export class LanguageDetector {
+  static detect(text: string): SupportedLanguage {
+    if (!text?.trim()) return 'en';
+
+    const scores = this.calculateLanguageScores(text);
+    const detectedLang = this.selectBestLanguage(scores);
+    return this.validateThreshold(detectedLang, scores) ? detectedLang : 'en';
+  }
+
+  private static calculateLanguageScores(text: string): Record<SupportedLanguage, number> {
+    const scores: Record<SupportedLanguage, number> = {} as any;
+    const textLower = text.toLowerCase();
+
+    Object.entries(LANGUAGE_PATTERNS).forEach(([lang, pattern]) => {
+      const charMatches = (text.match(pattern.chars) || []).length;
+      const wordMatch = pattern.words.test(textLower) ? 1 : 0;
+      const charRatio = charMatches / text.length;
+      scores[lang as SupportedLanguage] = charRatio * 0.7 + wordMatch * 0.3;
+    });
+
+    return scores;
+  }
+
+  private static selectBestLanguage(scores: Record<SupportedLanguage, number>): SupportedLanguage {
+    return Object.entries(scores).reduce(
+      (max, [lang, score]) => (score > max.score ? { lang: lang as SupportedLanguage, score } : max),
+      { lang: 'en' as SupportedLanguage, score: 0 }
+    ).lang;
+  }
+
+  private static validateThreshold(lang: SupportedLanguage, scores: Record<SupportedLanguage, number>): boolean {
+    const threshold = LANGUAGE_PATTERNS[lang].threshold;
+    return scores[lang] >= threshold;
+  }
+}
