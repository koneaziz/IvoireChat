import { NextResponse } from "next/server";
import { z } from "zod";
import { demoResponse } from "@/lib/demo";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "La question doit contenir entre 1 et 1 000 caractères." }, { status: 400 });
  }

  return NextResponse.json(demoResponse(parsed.data.message));
}
