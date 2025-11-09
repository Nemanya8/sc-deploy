import { compile } from "@parity/resolc";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Function to recursively read imported files
function resolveImports(importPath: string, visited = new Set<string>()): Record<string, { content: string }> {
  const sources: Record<string, { content: string }> = {};

  // Prevent circular imports
  if (visited.has(importPath)) {
    return sources;
  }
  visited.add(importPath);

  try {
    // Handle @openzeppelin imports (both contracts and contracts-upgradeable)
    if (importPath.startsWith("@openzeppelin/")) {
      const contractsPath = path.join(
        process.cwd(),
        "node_modules",
        importPath
      );

      if (fs.existsSync(contractsPath)) {
        const content = fs.readFileSync(contractsPath, "utf-8");
        sources[importPath] = { content };

        // Parse and resolve nested imports
        const importRegex = /import\s+["'](.+?)["'];/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const nestedImport = match[1];
          if (nestedImport.startsWith("@openzeppelin")) {
            const nested = resolveImports(nestedImport, visited);
            Object.assign(sources, nested);
          } else {
            // Relative import
            const resolvedPath = path.join(path.dirname(importPath), nestedImport);
            const normalized = resolvedPath.replace(/\\/g, "/");
            const nested = resolveImports(normalized, visited);
            Object.assign(sources, nested);
          }
        }
      }
    }
  } catch (error) {
    // Silently handle import resolution errors
  }

  return sources;
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const sources: Record<string, { content: string }> = {
      ["contract.sol"]: {
        content: code,
      }
    };

    // Parse imports from the main contract
    const importRegex = /import\s+["'](.+?)["'];/g;
    let match;
    const visited = new Set<string>();

    while ((match = importRegex.exec(code)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith("@openzeppelin")) {
        const imports = resolveImports(importPath, visited);
        Object.assign(sources, imports);
      }
    }

    const out = await compile(sources);

    return NextResponse.json(out);
  } catch (error) {
    console.error("Compilation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: errorMessage,
      message: errorMessage
    }, { status: 500 });
  }
}
