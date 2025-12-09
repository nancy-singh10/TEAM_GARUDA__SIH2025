import { NextResponse } from "next/server";

// Using ElevenLabs API or a free alternative
export async function POST(req: Request) {
  try {
    const { text, languageCode } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Try ElevenLabs if API key is available
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    // Debug log (safe)
    console.log(`TTS Request: Text length ${text.length}, Language: ${languageCode}`);
    console.log(`ElevenLabs Key present: ${!!elevenLabsApiKey}`);

    if (elevenLabsApiKey) {
      // Map language codes to ElevenLabs voice IDs
      const voiceMap: Record<string, string> = {
        "en-US": "21m00Tcm4TlvDq8ikWAM", // Default voice
        "en-GB": "XB0fDUnXU5powFXDhCwa",
        "hi-IN": "21m00Tcm4TlvDq8ikWAM", // Multilingual model
        "es-ES": "21m00Tcm4TlvDq8ikWAM",
        "fr-FR": "21m00Tcm4TlvDq8ikWAM",
        "de-DE": "21m00Tcm4TlvDq8ikWAM",
      };

      const voiceId = voiceMap[languageCode] || voiceMap["en-US"];

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API Error (${response.status}):`, errorText);
        throw new Error(`ElevenLabs API failed with status ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      return NextResponse.json({
        audioContent: audioBase64,
        contentType: "audio/mpeg",
      });
    } else {
      console.warn("ElevenLabs API Key is missing. Falling back to browser TTS.");
    }

    // Fallback: Return success but client will use browser TTS
    return NextResponse.json({
      useBrowserTTS: true,
      message: "Using browser-based TTS",
    });
  } catch (error: any) {
    console.error("TTS API Exception:", error);
    // Return fallback response instead of error
    return NextResponse.json({
      useBrowserTTS: true,
      message: "Falling back to browser TTS",
    });
  }
}
