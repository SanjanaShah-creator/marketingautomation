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

    // Use nested create — $transaction is not supported with the pg adapter
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        workspaceMembers: {
          create: {
            role: "OWNER",
            workspace: { create: { name: wsName, slug } },
          },
        },
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[Register] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
