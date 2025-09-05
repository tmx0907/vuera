diff --git a//dev/null b/services/dialogue-formatter.service.ts
index 0000000000000000000000000000000000000000..4d3c7af4800d5dac7b7ef6fc61811279bce25617 100644
--- a//dev/null
+++ b/services/dialogue-formatter.service.ts
@@ -0,0 +1,46 @@
+export class DialogueFormatterService {
+  static formatConversation(rawText: string): string {
+    const lines = rawText
+      .split("\n")
+      .map((line) => line.trim())
+      .filter((line) => line.length > 0);
+
+    const formatted: string[] = [];
+    let speakerToggle = true;
+
+    for (const line of lines) {
+      if (/^\d{1,2}:\d{2}(am|pm)?/i.test(line)) continue;
+
+      if (/^(You|Them):/.test(line)) {
+        formatted.push(line);
+        continue;
+      }
+
+      const characteristics = this.analyzeLineCharacteristics(line);
+      const speaker = speakerToggle ? "You" : "Them";
+
+      formatted.push(`${speaker}: ${characteristics.tags}${line}`);
+      speakerToggle = !speakerToggle;
+    }
+
+    return formatted.join("\n");
+  }
+
+  private static analyzeLineCharacteristics(line: string): { tags: string } {
+    const tags: string[] = [];
+
+    if (/^ㅇㅇ|^ㄱㄱ|^ㅇㅋ|^ㄹㅇ|^콜|^좋|^굿/.test(line)) tags.push("[KPos]");
+    if (/^ㄴㄴ|^ㄴㅇㄱ|^노|^별로|^싫|^안돼/.test(line)) tags.push("[KNeg]");
+    if (/헐|대박|오바|ㄷㄷ|ㅗ|ㅋㅋ|ㅎㅎ|ㄱㅇㅇ/.test(line)) tags.push("[KReact]");
+
+    const isAggressive = /fuck|shit|bitch|idiot|slut|asshole|kill|hate/i.test(line);
+    const isGenZ = /deadass|bet|lowkey|highkey|based|sus|rizz/i.test(line);
+    const emojis = (line.match(/[\u{1F600}-\u{1F6FF}]/gu) || []).length;
+
+    if (isAggressive) tags.push("[Aggressive]");
+    if (isGenZ) tags.push("[GenZ]");
+    if (emojis > 2) tags.push("[EmojiHeavy]");
+
+    return { tags: tags.join(" ") + (tags.length > 0 ? " " : "") };
+  }
+}
