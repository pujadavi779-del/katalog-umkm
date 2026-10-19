"use client";

import { useActionState } from "react";
import { gantiPassword } from "../actions";

export default function HalamanGantiPassword() {
  const [state, aksi, sedangProses] = useActionState(gantiPassword, null);

  return (
    <main>
      <form action={aksi}>
        <input name="password_baru" type="password" placeholder="Password baru" minLength={8} required />
        <input name="konfirmasi" type="password" placeholder="Ulangi password baru" required />
        {state?.error && <p role="alert">{state.error}</p>}
        {state?.sukses && <p role="status">{state.sukses}</p>}
        <button type="submit" disabled={sedangProses}>Simpan</button>
      </form>
    </main>
  );
}