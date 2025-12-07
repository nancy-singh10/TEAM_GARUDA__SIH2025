import { GoogleGenAI } from "@google/genai";

// Helper function to stream from Ollama
async function streamOllamaResponse(message: string, history: any[]) {
  try {
    // Transform history to Ollama format
    const formattedHistory = history.map((item: any) => ({
      role: item.role === "model" ? "assistant" : item.role,
      content: item.parts[0].text
    }));

    // Add current message
    const messages = [...formattedHistory, { role: "user", content: message }];

    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen3:4b", // Using the requested model
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body from Ollama");
    }

    // Create a transformer to parse Ollama's JSON stream and extract the text
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  controller.enqueue(encoder.encode(json.message.content));
                }
                if (json.done) {
                  // End of stream
                }
              } catch (e) {
                console.warn("Error parsing Ollama chunk:", e);
              }
            }
          }
        } catch (error) {
          console.error("Ollama streaming error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

  } catch (error) {
    console.error("Ollama implementation error:", error);
    throw error;
  }
}

// Use standard 'Response' for streaming in Next.js App Router
export async function POST(req: Request) {
  let { message, history } = await req.json();

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn("No Gemini API key found, falling back to Ollama...");
      const stream = await streamOllamaResponse(message, history);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    const genAI = new GoogleGenAI({ apiKey });

    const chat = genAI.chats.create({
      model: "gemini-2.5-flash",
      history: history || [],
      config: {
        maxOutputTokens: 1000,
      },
    });

    // 1. Call sendMessageStream instead of sendMessage
    const resultStream = await chat.sendMessageStream({
      message: message,
    });

    // 2. Create a ReadableStream to pipe data to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          // Iterate over the async generator from the SDK
          for await (const chunk of resultStream) {
            // chunk.text gives the text delta for this chunk
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    // 3. Return the stream with the correct headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("Gemini API Error, attempting fallback:", error);

    try {
      // Fallback to Ollama
      const stream = await streamOllamaResponse(message, history);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    } catch (fallbackError: any) {
      console.error("Fallback failed:", fallbackError);
      return Response.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
