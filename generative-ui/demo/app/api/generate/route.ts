import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { catalog } from "@/lib/catalog";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: catalog.prompt(),
    prompt,
  });

  return result.toTextStreamResponse();
}
