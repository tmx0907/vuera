diff --git a//dev/null b/services/conversation-analysis.service.ts
index 0000000000000000000000000000000000000000..15bedd97ce35c1cd75dc4fdc14e44197c17d99fe 100644
--- a//dev/null
+++ b/services/conversation-analysis.service.ts
@@ -0,0 +1,58 @@
+import { SupportedLanguage, AnalysisResult } from '../types/analysis.types';
+import { LanguageDetector } from '../utils/language-detector.util';
+import { PromptTemplateService } from './prompt-template.service';
+import { OpenAIClientService } from './openai-client.service';
+import { AnalysisValidatorService } from './analysis-validator.service';
+import { ErrorHandlerService } from './error-handler.service';
+
+export class ConversationAnalyzerService {
+  static async analyzeConversation(
+    extractedText: string,
+    forceLanguage?: SupportedLanguage
+  ): Promise<AnalysisResult> {
+    try {
+      AnalysisValidatorService.validateInput(extractedText);
+      const detectedLanguage = forceLanguage || LanguageDetector.detect(extractedText);
+
+      console.log("🔍 Analysis starting:", {
+        textLength: extractedText.length,
+        detectedLanguage,
+        forceLanguage,
+        timestamp: new Date().toISOString(),
+      });
+
+      return await this.performAnalysis(extractedText, detectedLanguage);
+    } catch (error) {
+      console.error("❌ Conversation analysis failed:", error);
+      throw ErrorHandlerService.handleApiError(error);
+    }
+  }
+
+  private static async performAnalysis(
+    extractedText: string,
+    language: SupportedLanguage
+  ): Promise<AnalysisResult> {
+    const systemPrompt = PromptTemplateService.getSystemPrompt(language);
+    const analysisPrompt = PromptTemplateService.getAnalysisPrompt(
+      language,
+      extractedText
+    );
+
+    const messages = [
+      { role: "system", content: systemPrompt },
+      { role: "user", content: analysisPrompt },
+    ];
+
+    try {
+      const response = await OpenAIClientService.createChatCompletion(messages);
+      const content = response.choices[0].message.content;
+
+      console.log("✅ Primary analysis successful");
+      return AnalysisValidatorService.validateApiResponse(content);
+    } catch {
+      console.log("⚠️ Primary model failed, attempting fallback...");
+      return ErrorHandlerService.attemptFallbackAnalysis(extractedText);
+    }
+  }
+}
+
