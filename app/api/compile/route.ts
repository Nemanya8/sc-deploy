import { compile } from "@parity/resolc";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const sources = {
      ["contract.sol"]: {
        content: code,
      }
    };

    const out = await compile(sources);

    return NextResponse.json(out);
  } catch (error) {
    console.error("Compilation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
