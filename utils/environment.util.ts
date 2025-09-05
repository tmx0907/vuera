diff --git a//dev/null b/utils/environment.util.ts
index 0000000000000000000000000000000000000000..4f5d04aaf9f7af32e876d916708ace9edbb53e7d 100644
--- a//dev/null
+++ b/utils/environment.util.ts
@@ -0,0 +1,32 @@
+export class EnvironmentUtil {
+  private static readonly API_KEY_CANDIDATES = [
+    'OPENAI_API_KEY',
+    'OPENAI_KEY_BACKUP',
+    'OPENAI_API_KEY_PRODUCTION',
+    'OPENAI_SECRET_KEY'
+  ] as const;
+
+  static getOpenAIApiKey(): string {
+    for (const candidate of this.API_KEY_CANDIDATES) {
+      const key = process.env[candidate]?.trim();
+      if (key) return key;
+    }
+    throw new Error(`OpenAI API key not found. Checked: ${this.API_KEY_CANDIDATES.join(', ')}`);
+  }
+
+  static logInitialization(): void {
+    console.log("🔐 OpenAI client initialization:", {
+      hasApiKey: !!process.env.OPENAI_API_KEY,
+      nodeEnv: process.env.NODE_ENV,
+      timestamp: new Date().toISOString()
+    });
+  }
+
+  static isDevelopment(): boolean {
+    return process.env.NODE_ENV === 'development';
+  }
+
+  static isProduction(): boolean {
+    return process.env.NODE_ENV === 'production';
+  }
+}
