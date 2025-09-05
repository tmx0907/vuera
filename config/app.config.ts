diff --git a//dev/null b/config/app.config.ts
index 0000000000000000000000000000000000000000..5311390f044d0661034d7e7a58043aa1d24d5393 100644
--- a//dev/null
+++ b/config/app.config.ts
@@ -0,0 +1,16 @@
+export const APP_CONFIG = {
+  openai: {
+    baseURL: 'https://api.openai.com/v1',
+    timeout: 10000,
+    maxRetries: 2,
+    primaryModel: 'gpt-4o-mini',
+    maxTokens: 1000,
+    temperature: 0.7,
+    fallbackModel: 'gpt-3.5-turbo',
+    fallbackMaxTokens: 500
+  },
+  api: {
+    minTextLength: 20,
+    maxTextLength: 5000
+  }
+} as const;
