// app/api/auth/user/route.ts
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Extract the Supabase auth token from cookies
    // Supabase stores the session as sb-<project-ref>-auth-token
    const allCookies = cookieStore.getAll();

    // Find the auth token cookie (works for any project ref)
    const authCookie = allCookies.find(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"),
    );

    if (!authCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Parse the session from the cookie value
    let session: any = null;
    try {
      const decoded = decodeURIComponent(authCookie.value);
      const parsed = JSON.parse(decoded);
      // Cookie can be [sessionObject] array or the object directly
      session = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const accessToken = session?.access_token;
    if (!accessToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify the token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth user route error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
