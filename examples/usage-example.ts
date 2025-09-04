import { ConversationAnalysisService } from '../services/main-analysis.service';

// Example usage of the conversation analysis service
async function exampleUsage() {
  try {
    // Example conversation text
    const conversationText = `
      안녕하세요! 오늘 어떠셨나요?
      안녕하세요~ 좋은 하루였어요! 당신은 어떠셨어요?
      저도 괜찮았어요. 혹시 시간 되시면 커피 한잔 하실래요?
      좋아요! 언제가 좋을까요?
      내일 오후 2시는 어떠세요?
      완벽해요! 어디서 만날까요?
      스타벅스 강남점은 어떠세요?
      좋아요! 내일 2시에 스타벅스 강남점에서 만나요 😊
    `;

    // 1. Basic analysis
    console.log("=== Basic Analysis ===");
    const result = await ConversationAnalysisService.processAnalysis(conversationText);
    
    console.log("Analysis ID:", result.id);
    console.log("Compatibility Score:", result.compatibilityScore);
    console.log("Attachment Style:", result.attachmentStyle);
    console.log("Emotional Tone:", result.emotionalTone);
    console.log("Red Flags:", result.redFlags.length);
    
    // 2. Analysis with forced language
    console.log("\n=== Analysis with Forced Language ===");
    const englishResult = await ConversationAnalysisService.processAnalysis(
      "Hey, how was your day? It was great, thanks for asking!",
      'en'
    );
    
    console.log("English Analysis ID:", englishResult.id);
    console.log("Summary:", englishResult.summary);

    // 3. Format dialogue only
    console.log("\n=== Dialogue Formatting ===");
    const rawText = `
      10:30am Hey there
      10:31am Hi! How are you?
      10:35am I'm doing well, thanks
      10:36am That's great to hear!
    `;
    
    const formattedDialogue = ConversationAnalysisService.formatDialogue(rawText);
    console.log("Formatted Dialogue:");
    console.log(formattedDialogue);

    // 4. Get stored analysis
    console.log("\n=== Retrieving Stored Analysis ===");
    if (result.id) {
      const storedAnalysis = await ConversationAnalysisService.getAnalysis(result.id);
      console.log("Retrieved analysis:", storedAnalysis ? "Success" : "Not found");
    }

  } catch (error) {
    console.error("Example usage failed:", error);
  }
}

// Run the example
if (require.main === module) {
  exampleUsage()
    .then(() => console.log("Example completed"))
    .catch(console.error);
}

export { exampleUsage };
