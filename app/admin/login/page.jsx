"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function HalamanLogin() {
  const [state, aksi, sedangProses] = useActionState(login, null);

  return (
    <main>
      <form action={aksi}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {state?.error && <p role="alert">{state.error}</p>}
        <button type="submit" disabled={sedangProses}>
          {sedangProses ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}