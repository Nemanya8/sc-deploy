import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { bytecode } = await request.json();

    // Calculate based on bytecode size
    const bytecodeSize = bytecode.replace('0x', '').length / 2; // hex string to bytes
    const refTime = Math.max(100_000_000_000, bytecodeSize * 1_000_000);
    const proofSize = Math.max(100_000, bytecodeSize * 2);

    // Estimate storage deposit
    // Storage deposit = (bytecode_size + storage_vars) * storage_byte_deposit
    // Rough estimate: contract size * 100,000 + 10 tokens buffer
    const storageDepositEstimate = (bytecodeSize * 100_000) + 10_000_000_000;

    return NextResponse.json({
      gasRequired: {
        refTime: refTime.toLocaleString(),
        proofSize: proofSize.toLocaleString(),
      },
      storageDeposit: {
        estimate: storageDepositEstimate.toLocaleString(),
        humanReadable: `${(storageDepositEstimate / 1_000_000_000_000).toFixed(4)} tokens`,
        recommendation: "Start with this value. Increase if you get StorageDepositLimitExhausted error.",
      },
      bytecodeSize: `${bytecodeSize} bytes`,
      debugMessage: "Estimated based on bytecode size. For accurate values, test on a live network.",
    });
  } catch (error) {
    console.error("Gas estimation error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
