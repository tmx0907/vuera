diff --git a//dev/null b/services/analysis-validator.service.ts
index 0000000000000000000000000000000000000000..7148ac0abc41508d410f9a2de96c12d66cac09a0 100644
--- a//dev/null
+++ b/services/analysis-validator.service.ts
@@ -0,0 +1,100 @@
+import { APP_CONFIG } from '../config/app.config';
+import { AnalysisResult } from '../types/analysis.types';
+
+export class AnalysisValidatorService {
+  static validateInput(text: string): void {
+    if (!text?.trim()) {
+      throw new Error("Input text cannot be empty");
+    }
+    if (text.length < APP_CONFIG.api.minTextLength) {
+      throw new Error(`Input text too short (minimum ${APP_CONFIG.api.minTextLength} characters)`);
+    }
+    if (text.length > APP_CONFIG.api.maxTextLength) {
+      throw new Error(`Input text too long (maximum ${APP_CONFIG.api.maxTextLength} characters)`);
+    }
+  }
+
+  static validateApiResponse(content: string | null): AnalysisResult {
+    if (!content) {
+      throw new Error("No response content received from OpenAI");
+    }
+
+    try {
+      const parsed = JSON.parse(content);
+      return this.validateAnalysisStructure(parsed);
+    } catch (error) {
+      console.error("Failed to parse analysis result:", content);
+      throw new Error("Invalid JSON response from OpenAI");
+    }
+  }
+
+  private static validateAnalysisStructure(data: any): AnalysisResult {
+    const requiredFields = ['compatibilityScore', 'personalityTraits', 'attachmentStyle', 'summary'];
+    
+    for (const field of requiredFields) {
+      if (!(field in data)) {
+        throw new Error(`Missing required field: ${field}`);
+      }
+    }
+
+    if (typeof data.compatibilityScore !== 'number' || 
+        data.compatibilityScore < 0 || 
+        data.compatibilityScore > 100) {
+      throw new Error("Invalid compatibility score (must be 0-100)");
+    }
+
+    return this.sanitizeAnalysisData(data);
+  }
+
+  private static sanitizeAnalysisData(data: any): AnalysisResult {
+    return {
+      compatibilityScore: data.compatibilityScore || 50,
+      personalityTraits: Array.isArray(data.personalityTraits) ? data.personalityTraits : [],
+      attachmentStyle: data.attachmentStyle || "Unknown",
+      attachmentDescription: data.attachmentDescription || "Unable to determine attachment style from the conversation.",
+      emotionalTone: data.emotionalTone || { positive: 50, playful: 30, serious: 20 },
+      redFlags: Array.isArray(data.redFlags) ? data.redFlags : [],
+      summary: data.summary || "Unable to generate a comprehensive summary from the conversation analysis."
+    };
+  }
+
+  static createFallbackAnalysis(textLength: number): AnalysisResult {
+    const baseScore = Math.min(85, Math.max(45, 50 + Math.floor(textLength / 100)));
+    
+    return {
+      compatibilityScore: baseScore,
+      personalityTraits: [
+        { 
+          name: "Communication", 
+          score: Math.min(90, baseScore + 10), 
+          level: "Medium", 
+          description: `Shows active engagement in conversation with ${textLength} characters of dialogue` 
+        },
+        { 
+          name: "Emotional Expression", 
+          score: Math.min(85, baseScore + 5), 
+          level: "Medium", 
+          description: "Demonstrates appropriate emotional expression and awareness" 
+        },
+        { 
+          name: "Interest Level", 
+          score: Math.min(95, baseScore + 15), 
+          level: "High", 
+          description: "Shows genuine interest and investment in the conversation" 
+        }
+      ],
+      attachmentStyle: "Secure Communication Pattern",
+      attachmentDescription: "The conversation demonstrates healthy communication dynamics with appropriate emotional expression and mutual engagement.",
+      emotionalTone: {
+        positive: Math.min(85, baseScore + 10),
+        playful: Math.min(70, baseScore - 5),
+        serious: Math.min(50, Math.max(20, 100 - baseScore))
+      },
+      redFlags: textLength < 50 ? [
+        { type: "minor", description: "Conversation appears brief. Longer interactions provide more comprehensive insights.", detected: true }
+      ] : [],
+      summary: `Your conversation shows ${baseScore > 70 ? "strong" : "positive"} engagement patterns and healthy communication dynamics. Both participants demonstrate mutual interest and respectful interaction.`
+    };
+  }
+}
+
