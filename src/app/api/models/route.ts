import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";


export async function GET() {
    const openai = getOpenAIClient();
    const models = await openai.models.list();
    const modelIds = models.data.map((model) => model.id);
    return NextResponse.json(modelIds);

}