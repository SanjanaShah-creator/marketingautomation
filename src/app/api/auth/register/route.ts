import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  workspaceName: z.string().min(1).max(100).optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    console.error("[Register] DATABASE_URL not configured");
    return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 422 });
    }

    const { name, email, password, workspaceName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const wsName = (workspaceName?.trim() || name).trim();
    const baseSlug = slugify(wsName) || "workspace";
    let slug = baseSlug;
    let suffix = 0;
    while (await prisma.workspace.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash },
      });
      const workspace = await tx.workspace.create({
        data: { name: wsName, slug },
      });
      await tx.workspaceMember.create({
        data: { userId: user.id, workspaceId: workspace.id, role: "OWNER" },
      });
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[Register] error:", msg);
    // surface DB-related errors clearly
    if (msg.includes("connect") || msg.includes("ENOTFOUND") || msg.includes("timeout")) {
      return NextResponse.json({ error: "Could not connect to database. Please try again." }, { status: 503 });
    }
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
