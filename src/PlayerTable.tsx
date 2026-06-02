import { Trash2 } from "lucide-react";
import { roleShortName, roles } from "./formations";
import type { Player, Role } from "./types";

interface PlayerTableProps {
  players: Player[];
  onUpdateRole: (id: string, role: Role) => void;
  onToggleCaptain: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PlayerTable({ players, onUpdateRole, onToggleCaptain, onRemove }: PlayerTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Squad List</h2>

      <div className="space-y-3">
        {players.map((player) => (
          <div key={player.id} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-[1fr_88px_88px_220px_118px_42px] md:items-center">
            <div className="flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-black text-white ${player.role === "Reserve" ? "bg-slate-500" : "bg-red-600"}`}>
                {roleShortName[player.role]}
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {player.name} {player.isCaptain && <span className="text-amber-500">(C)</span>}
                </p>
                <p className="text-sm text-slate-500">#{player.shirtNumber}</p>
              </div>
            </div>

            <span className="rounded-full bg-white px-3 py-2 text-center text-sm font-bold text-slate-700">
              No. {player.shirtNumber}
            </span>

            <span className="rounded-full bg-white px-3 py-2 text-center text-sm font-bold text-emerald-700">
              {player.shirtSize ?? "M"}
            </span>

            <select
              value={player.role}
              onChange={(event) => onUpdateRole(player.id, event.target.value as Role)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none ring-emerald-500 focus:ring-2"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onToggleCaptain(player.id)}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                player.isCaptain
                  ? "bg-amber-400 text-slate-950"
                  : "bg-white text-slate-600 hover:bg-amber-100"
              }`}
            >
              {player.isCaptain ? "Unset C" : "Captain"}
            </button>

            <button
              type="button"
              onClick={() => onRemove(player.id)}
              className="rounded-xl bg-white p-2 text-red-500 transition hover:bg-red-50"
              aria-label={`Remove ${player.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {players.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No players yet. Add a lineup player or a reserve player.
          </div>
        )}
      </div>
    </div>
  );
}
