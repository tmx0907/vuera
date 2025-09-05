diff --git a//dev/null b/services/openai-client.service.ts
index 0000000000000000000000000000000000000000..45477ff024f7b4993966d16142f072c1ad6336f4 100644
--- a//dev/null
+++ b/services/openai-client.service.ts
@@ -0,0 +1,46 @@
+import OpenAI from 'openai';
+import { APP_CONFIG } from '../config/app.config';
+import { EnvironmentUtil } from '../utils/environment.util';
+
+export class OpenAIClientService {
+  private static instance: OpenAI | null = null;
+
+  static getClient(): OpenAI {
+    if (!this.instance) {
+      const apiKey = EnvironmentUtil.getOpenAIApiKey();
+      EnvironmentUtil.logInitialization();
+
+      this.instance = new OpenAI({
+        apiKey,
+        baseURL: APP_CONFIG.openai.baseURL,
+        timeout: APP_CONFIG.openai.timeout,
+        maxRetries: APP_CONFIG.openai.maxRetries,
+        defaultHeaders: {
+          'User-Agent': 'Vuera/2.1.0'
+        }
+      });
+
+      console.log('✅ OpenAI client initialized successfully');
+    }
+    return this.instance;
+  }
+
+  static async createChatCompletion(
+    messages: any[],
+    model: string = APP_CONFIG.openai.primaryModel,
+    maxTokens: number = APP_CONFIG.openai.maxTokens
+  ): Promise<any> {
+    const client = this.getClient();
+
+    return await client.chat.completions.create({
+      model,
+      messages,
+      response_format: { type: 'json_object' },
+      temperature: APP_CONFIG.openai.temperature,
+      max_tokens: maxTokens,
+      top_p: 1,
+      frequency_penalty: 0,
+      presence_penalty: 0
+    });
+  }
+}
