// US-28: Loading kustom / skeleton saat memuat data halaman
export default function Loading() {
  return (
    <div className="py-10 animate-pulse">
      <div className="h-10 w-64 rounded-xl bg-permukaan mb-4"></div>
      <div className="h-5 w-96 rounded-lg bg-permukaan mb-8"></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full bg-permukaan"></div>
            <div className="p-3 flex flex-col gap-2">
              <div className="h-3 w-16 bg-permukaan rounded"></div>
              <div className="h-5 w-36 bg-permukaan rounded"></div>
              <div className="h-6 w-24 bg-permukaan rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
