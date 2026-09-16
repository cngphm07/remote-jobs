import { auth, signIn, signOut } from "@/lib/auth/config";

export async function AuthButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="filter-btn active flex items-center gap-2 py-1.5 px-3 text-[.56rem]"
          style={{ letterSpacing: ".16em" }}
          title="Đăng nhập Google để đồng bộ Gmail và quản lý hồ sơ"
        >
          <span className="inline-block size-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          SIGN IN
        </button>
      </form>
    );
  }

  const initial = session.user.email ? session.user.email.slice(0, 1).toUpperCase() : "U";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2">
        <div
          className="display grid size-6 place-items-center bg-[var(--accent)] text-[.65rem] text-black"
          title={session.user.email || "User"}
        >
          {initial}
        </div>
        <span
          className="mono hidden text-[.54rem] text-[var(--g1)] sm:inline-block"
          style={{ letterSpacing: ".14em" }}
        >
          {session.user.email}
        </span>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="filter-btn py-1 px-2 text-[.5rem] text-[var(--g2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
          style={{ letterSpacing: ".14em" }}
        >
          SIGN OUT
        </button>
      </form>
    </div>
  );
}
