import { forwardRef } from "react";
import { roleShortName } from "./formations";
import type { Formation, Player, RoleSlot } from "./types";

interface FootballPitchProps {
  formation: Formation;
  players: Player[];
  isCustom: boolean;
  onMoveCustomSlot: (slotId: string, x: number, y: number) => void;
}

function getPlayersByRole(players: Player[], role: string) {
  return players.filter((player) => player.role === role);
}

export const FootballPitch = forwardRef<HTMLDivElement, FootballPitchProps>(
  ({ formation, players, isCustom, onMoveCustomSlot }, ref) => {
    const occupiedSlotByRoleCount: Record<string, number> = {};
    const reservePlayers = players.filter((player) => player.role === "Reserve");

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>, slot: RoleSlot) {
      if (!isCustom || event.buttons !== 1) return;

      const pitch = event.currentTarget.parentElement;
      if (!pitch) return;

      const rect = pitch.getBoundingClientRect();
      const x = Math.min(94, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(94, Math.max(6, ((event.clientY - rect.top) / rect.height) * 100));
      onMoveCustomSlot(slot.id, Number(x.toFixed(1)), Number(y.toFixed(1)));
    }

    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
        <div
          ref={ref}
          className="pitch-grass relative aspect-[4/3] w-full touch-none overflow-hidden rounded-[1.6rem] border-4 border-white shadow-2xl"
        >
          <div className="pitch-line left-[6%] top-[4%] h-[92%] w-[88%]" />
          <div className="pitch-line left-[28%] top-[-18%] h-[38%] w-[44%] rounded-b-full" />
          <div className="pitch-line left-[32%] bottom-[-1%] h-[18%] w-[36%]" />
          <div className="pitch-line left-[38%] bottom-[-1%] h-[8%] w-[24%]" />
          <div className="pitch-line left-[6%] top-1/2 h-0 w-[88%]" />
          <div className="pitch-line left-1/2 top-[45%] h-[10%] w-[10%] -translate-x-1/2 rounded-full" />

          {players.filter((player) => player.role !== "Reserve").length === 0 && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-3xl bg-black/30 px-6 py-4 text-center text-white backdrop-blur">
                <p className="text-lg font-black">No lineup players yet</p>
                <p className="text-sm opacity-90">Add a player to show them on the field.</p>
              </div>
            </div>
          )}

          {formation.slots.map((slot) => {
            const count = occupiedSlotByRoleCount[slot.role] ?? 0;
            const player = getPlayersByRole(players, slot.role)[count];
            occupiedSlotByRoleCount[slot.role] = count + 1;

            // Important: no empty marker is rendered.
            // If the squad has 1 lineup player, only 1 shirt appears.
            // If the squad has 2 lineup players, only 2 shirts appear, and so on.
            if (!player) return null;

            return (
              <div
                key={slot.id}
                onPointerMove={(event) => handlePointerMove(event, slot)}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${isCustom ? "cursor-grab active:cursor-grabbing" : ""}`}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <div className="player-pin relative">
                  <div className={`shirt flex h-14 w-14 flex-col items-center justify-center text-white ${
                    player.role === "Goalkeeper" ? "bg-zinc-400" : "bg-red-600"
                  }`}>
                    <span className="text-[10px] font-black leading-none">{roleShortName[player.role]}</span>
                    <span className="text-sm font-black leading-none">{player.shirtNumber}</span>
                  </div>
                  {player.isCaptain && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-950">
                      C
                    </div>
                  )}
                </div>

                <div className="mt-1 max-w-32 rounded-full bg-black/35 px-2 py-1 text-center text-[10px] font-bold leading-tight text-white backdrop-blur">
                  <div className="truncate">{player.name}</div>
                  <div className="truncate opacity-90">{player.realName ?? player.name}</div>
                  <div className="truncate opacity-90">{slot.label} · Size {player.shirtSize ?? "M"}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-900">Bench / Coach Area</h3>
              <p className="text-sm text-slate-500">Reserve players stay ready outside the field.</p>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
              {reservePlayers.length} reserve
            </span>
          </div>

          {reservePlayers.length === 0 ? (
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500">
              No reserve players yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {reservePlayers.map((player) => (
                <div key={player.id} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-600 text-xs font-black text-white">
                    #{player.shirtNumber}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {player.name} {player.isCaptain && <span className="text-amber-500">(C)</span>}
                    </p>
                    <p className="text-xs font-bold text-slate-500">{player.realName ?? player.name}</p>
                    <p className="text-xs font-bold text-slate-500">Reserve · Size {player.shirtSize ?? "M"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FootballPitch.displayName = "FootballPitch";
