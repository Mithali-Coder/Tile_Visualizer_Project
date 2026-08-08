import { useMemo, useState } from "react";
import {
  Search,
  Moon,
  Sun,
  X,
  Check,
  Layers,
  IndianRupee,
  Ruler,
  Palette,
  MapPin,
  Sparkles,
  ZoomIn,
} from "lucide-react";
import { tiles, categories, finishes, materials } from "../data/tiles.js";
import { rooms } from "../data/rooms.jsx";
import { textureUrl } from "../lib/textures.js";
import { useApp } from "../context/AppContext.jsx";

const patternLabels = {
  grid: "Straight Grid",
  brick: "Offset / Brick",
  diagonal: "Diagonal",
  herringbone: "Herringbone",
  hexagon: "Hexagon",
  large: "Large Format",
};

export default function TileCatalogue() {
  const { catalogueDark, toggleCatalogueDark, room, surface, applyTile } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [finish, setFinish] = useState("All Finishes");
  const [material, setMaterial] = useState("All Materials");
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tiles.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (finish !== "All Finishes" && t.finish !== finish) return false;
      if (material !== "All Materials" && t.material !== material) return false;
      if (q && !`${t.name} ${t.material} ${t.finish} ${t.size} ${t.category}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [query, category, finish, material]);

  const dark = catalogueDark;

  return (
    <section
      className={`flex h-full flex-col rounded-2xl border p-4 transition-colors ${
        dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2
            className={`text-sm font-bold ${dark ? "text-slate-100" : "text-slate-800"}`}
          >
            Tile Catalogue
          </h2>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {filtered.length} of {tiles.length} tiles
          </p>
        </div>
        <button
          onClick={toggleCatalogueDark}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            dark
              ? "border-slate-700 bg-slate-800 text-amber-300 hover:bg-slate-700"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
          title="Toggle dark browsing mode"
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
          <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
        </button>
      </div>

      <div className="relative mb-3">
        <Search
          size={15}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`}
        />
        <input
          className={`input-field pl-9 ${dark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : ""}`}
          placeholder="Search tiles, materials, finishes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="tile-scrollbar -mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {categories.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-brand-600 text-white shadow-card"
                  : dark
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <select
          className={`input-field w-auto text-xs ${dark ? "border-slate-700 bg-slate-800 text-slate-200" : ""}`}
          value={finish}
          onChange={(e) => setFinish(e.target.value)}
        >
          {finishes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          className={`input-field w-auto text-xs ${dark ? "border-slate-700 bg-slate-800 text-slate-200" : ""}`}
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`tile-scrollbar -mr-1 flex-1 space-y-2.5 overflow-y-auto pr-1 ${
          filtered.length === 0 ? "flex items-center justify-center" : ""
        }`}
      >
        {filtered.length === 0 && (
          <div className="text-center text-sm text-slate-400">No tiles match your filters.</div>
        )}
        {filtered.map((tile) => (
          <TileCard
            key={tile.id}
            tile={tile}
            dark={dark}
            onSelect={() => setDetail(tile)}
            onApply={() => applyTile(tile.id, surface)}
          />
        ))}
      </div>

      {detail && <TileModal tile={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}

function TileCard({ tile, dark, onSelect, onApply }) {
  const { surface } = useApp();
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition hover:shadow-card-hover ${
        dark
          ? "border-slate-700 bg-slate-800 hover:border-slate-500"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <button onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${textureUrl(tile.texture)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              dark ? "bg-slate-900/80 text-slate-200" : "bg-white/85 text-slate-700"
            }`}
          >
            {tile.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`absolute right-2 top-2 rounded-full p-1.5 transition ${
              dark
                ? "bg-slate-900/70 text-slate-200 hover:bg-slate-900"
                : "bg-white/85 text-slate-600 hover:bg-white"
            }`}
            title="View details"
          >
            <ZoomIn size={13} />
          </button>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}>
                {tile.name}
              </p>
              <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {tile.size} · {tile.finish}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600">
              <IndianRupee size={11} />
              {tile.price}/m²
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Layers size={12} /> Apply
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                dark
                  ? "border-slate-600 text-slate-200 hover:bg-slate-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Details
            </button>
          </div>
          <p className={`mt-1.5 truncate text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Applies to {surface}
          </p>
        </div>
      </button>
    </div>
  );
}

function TileModal({ tile, onClose }) {
  const { surface, applyTile } = useApp();
  const compatibleRooms = rooms.filter((r) => tile.rooms.includes(r.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-modal-in w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${textureUrl(tile.texture)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-slate-700">
            {tile.category} Tile
          </span>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-slate-600 transition hover:bg-white"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{tile.name}</h3>
              <p className="text-sm text-slate-500">
                {tile.material} · {patternLabels[tile.pattern] || tile.pattern}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-lg font-bold text-brand-600">
                <IndianRupee size={15} />
                {tile.price}
                <span className="text-xs font-medium text-slate-400">/m²</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Spec icon={Ruler} label="Size" value={tile.size} />
            <Spec icon={Layers} label="Pattern" value={patternLabels[tile.pattern] || tile.pattern} />
            <Spec icon={Palette} label="Finish" value={tile.finish} />
            <Spec icon={Sparkles} label="Material" value={tile.material} />
          </div>

          <div className="mt-4">
            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <MapPin size={12} /> Suitable rooms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {compatibleRooms.map((r) => (
                <span key={r.id} className="chip bg-slate-100 text-slate-600">
                  {r.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Check size={13} className="text-emerald-500" />
              {tile.colors.length} tone{tile.colors.length > 1 ? "s" : ""}:
            </span>
            <div className="flex gap-1">
              {tile.colors.map((c) => (
                <span key={c} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => applyTile(tile.id, surface)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
            >
              <Layers size={15} /> Apply to {surface}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <Icon size={14} className="shrink-0 text-slate-400" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-xs font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
