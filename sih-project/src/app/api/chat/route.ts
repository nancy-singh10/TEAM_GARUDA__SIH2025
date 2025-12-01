import { GoogleGenAI } from "@google/genai";

// Use standard 'Response' for streaming in Next.js App Router
export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });

    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
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
    console.error("Gemini API Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}