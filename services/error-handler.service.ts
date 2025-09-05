diff --git a//dev/null b/services/error-handler.service.ts
index 0000000000000000000000000000000000000000..618b521270b153bec088b682e7e9d2cb8d51be52 100644
--- a//dev/null
+++ b/services/error-handler.service.ts
@@ -0,0 +1,85 @@
+import { APP_CONFIG } from '../config/app.config';
+import { AnalysisResult } from '../types/analysis.types';
+import { OpenAIClientService } from './openai-client.service';
+import { AnalysisValidatorService } from './analysis-validator.service';
+
+export class ErrorHandlerService {
+  static handleApiError(error: any): Error {
+    console.error("=== OpenAI API Error ===", {
+      name: error.name,
+      message: error.message,
+      status: error.status,
+      code: error.code
+    });
+
+    if (error.name === "AbortError") {
+      return new Error("Request timeout - please try again with a shorter conversation");
+    }
+    
+    if (error.status === 401) {
+      return new Error("OpenAI API authentication failed - please check API key");
+    }
+    
+    if (error.status === 429) {
+      return new Error("OpenAI API rate limit exceeded - please wait a moment");
+    }
+    
+    if (error.status === 503 || error.status === 502) {
+      return new Error("OpenAI service temporarily unavailable - please try again later");
+    }
+    
+    if (error.message?.includes("network") || error.code === "ECONNRESET") {
+      return new Error("Network connection issue - please check internet connection");
+    }
+
+    return new Error(`Analysis failed: ${error.message}`);
+  }
+
+  static async attemptFallbackAnalysis(extractedText: string): Promise<AnalysisResult> {
+    console.log("\uD83D\uDD04 Attempting fallback analysis with GPT-3.5-turbo...");
+    
+    try {
+      const fallbackPrompt = this.createSimplifiedPrompt(extractedText);
+      const response = await OpenAIClientService.createChatCompletion(
+        fallbackPrompt,
+        APP_CONFIG.openai.fallbackModel,
+        APP_CONFIG.openai.fallbackMaxTokens
+      );
+
+      const content = response.choices[0].message.content;
+      if (content) {
+        console.log("\u2705 Fallback analysis successful");
+        return AnalysisValidatorService.validateApiResponse(content);
+      }
+    } catch (fallbackError) {
+      console.error("\u274C Fallback analysis failed:", fallbackError);
+    }
+
+    return AnalysisValidatorService.createFallbackAnalysis(extractedText.length);
+  }
+
+  private static createSimplifiedPrompt(extractedText: string): any[] {
+    return [
+      {
+        role: "system",
+        content: "You are a dating psychology expert. Analyze conversations and provide insights in JSON format."
+      },
+      {
+        role: "user",
+        content: `Analyze this dating conversation and provide psychological insights in JSON format:
+
+{
+  "compatibilityScore": number (0-100),
+  "personalityTraits": [{"name": "string", "score": number, "level": "Low|Medium|High", "description": "string"}],
+  "attachmentStyle": "string",
+  "attachmentDescription": "string", 
+  "emotionalTone": {"positive": number, "playful": number, "serious": number},
+  "redFlags": [{"type": "warning|minor|major", "description": "string", "detected": boolean}],
+  "summary": "string"
+}
+
+Conversation: ${extractedText.substring(0, 3000)}`
+      }
+    ];
+  }
+}
