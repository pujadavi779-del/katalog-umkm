import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { logout } from "@/app/admin/actions";

export default function NavAdmin() {
  return (
    <nav>
      {/* Pertahankan link menu & class lamamu */}
      <Link href="/admin">Produk</Link>
      <Link href="/admin/password">Ganti password</Link>
      <form action={logout}>
  <button type="submit" className="...class tombol lamamu...">Keluar</button>
</form>
    </nav>
  );
}