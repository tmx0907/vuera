diff --git a//dev/null b/types/analysis.types.ts
index 0000000000000000000000000000000000000000..aa5b1ddd63963ff4539346025fc493b287a04cb9 100644
--- a//dev/null
+++ b/types/analysis.types.ts
@@ -0,0 +1,41 @@
+export type SupportedLanguage = 'ko' | 'ja' | 'es' | 'pt' | 'en';
+
+export interface LanguagePattern {
+  chars: RegExp;
+  words: RegExp;
+  threshold: number;
+}
+
+export interface PersonalityTrait {
+  name: string;
+  score: number;
+  level: 'Low' | 'Medium' | 'High';
+  description: string;
+}
+
+export interface RedFlag {
+  type: 'warning' | 'minor' | 'major';
+  description: string;
+  detected: boolean;
+}
+
+export interface EmotionalTone {
+  positive: number;
+  playful: number;
+  serious: number;
+}
+
+export interface AnalysisResult {
+  id?: number;
+  compatibilityScore: number;
+  personalityTraits: PersonalityTrait[];
+  attachmentStyle: string;
+  attachmentDescription: string;
+  emotionalTone: EmotionalTone;
+  redFlags: RedFlag[];
+  summary: string;
+}
+
+export interface OCRResult {
+  text: string;
+}
