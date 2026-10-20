"use client";

import Tombol from "@/components/Tombol";

// US-10: Tombol hapus produk dengan konfirmasi dialog.
export default function TombolHapus({ action, id, nama }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Yakin ingin menghapus produk "${nama}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Tombol type="submit" varian="bahaya">
        Hapus
      </Tombol>
    </form>
  );
}
