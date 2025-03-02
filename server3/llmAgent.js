import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from "dotenv";
config();

// Initialize the Anthropic model
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.0-flash-lite", //Gemini 2.0 Flash-Lite
  apiKey: process.env.GEMINI_API_KEY,
});

// LLM Agent function
async function llmAgent(userInput, systemPrompt) {
  try {
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userInput),
    ];

    const response = (await model.invoke(messages));
    let res = response.content;
    res = res.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(res);
    } catch (error) {
      throw new Error(`Failed to parse response: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`API call failed: ${error.message}`);
  }
}
async function llmAgentReport(userInput, systemPrompt) {
  try {
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userInput),
    ];

    const response = (await model.invoke(messages));
    let res = response.content;
    res = res.replace(/```html/g, '').replace(/```/g, '').trim();
    try {
      return res;
    } catch (error) {
      throw new Error(`Failed to parse response: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`API call failed: ${error.message}`);
  }
}

// export default llmAgent;
export default{ llmAgent,llmAgentReport };