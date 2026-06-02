import { useState } from "react";
import { Plus } from "lucide-react";
import { roles, shirtSizes } from "./formations";
import type { Player, Role, ShirtSize } from "./types";

interface PlayerFormProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, "id">) => void;
}

const MAX_PLAYERS = 18;

export function PlayerForm({ players, onAddPlayer }: PlayerFormProps) {
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const shirtNumberText = String(formData.get("shirtNumber") ?? "").trim();
    const requestedRole = String(formData.get("role") ?? "Reserve") as Role;
    const shirtSize = String(formData.get("shirtSize") ?? "M") as ShirtSize;
    const isCaptain = formData.get("isCaptain") === "on";
    const role: Role =
      requestedRole !== "Reserve" &&
      players.some((player) => player.role === requestedRole)
        ? "Reserve"
        : requestedRole;

    if (players.length >= MAX_PLAYERS) {
      setError("Maximum player limit reached. You can register up to 18 players only.");
      return;
    }

    if (!name || !shirtNumberText) {
      setError("Please enter player name and shirt number.");
      return;
    }

    const shirtNumber = Number(shirtNumberText);
    if (!Number.isInteger(shirtNumber) || shirtNumber < 1 || shirtNumber > 9999) {
      setError("Shirt number must be between 1 and 99.");
      return;
    }

    if (players.some((player) => player.shirtNumber === shirtNumber)) {
      setError("This shirt number is already used.");
      return;
    }

    onAddPlayer({ name, shirtNumber, shirtSize, role, isCaptain });

    if (role === "Reserve" && requestedRole !== "Reserve") {
      setError(`${requestedRole} already has a player, so ${name} was added as Reserve.`);
    }

    event.currentTarget.reset();
  }

  const maxReached = players.length >= MAX_PLAYERS;

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Register Player</h2>
        <p className="text-sm text-slate-500">{players.length}/{MAX_PLAYERS} players registered</p>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          If a selected role already has a player, the new player is added as Reserve automatically.
        </p>
      </div>

      {(error || maxReached) && (
        <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
          error.includes("added as Reserve")
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {error || "Maximum player limit reached. You can register up to 18 players only."}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Player name
          <input
            name="name"
            disabled={maxReached}
            placeholder="e.g. Dara Sok"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 transition focus:ring-2 disabled:bg-slate-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Shirt number
          <input
            name="shirtNumber"
            disabled={maxReached}
            type="number"
            min={1}
            max={99}
            placeholder="10"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 transition focus:ring-2 disabled:bg-slate-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Shirt size
          <select
            name="shirtSize"
            defaultValue="M"
            disabled={maxReached}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 transition focus:ring-2 disabled:bg-slate-100"
          >
            {shirtSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Position / role
          <select
            name="role"
            defaultValue="Reserve"
            disabled={maxReached}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 transition focus:ring-2 disabled:bg-slate-100"
          >
            {roles.map((roleItem) => (
              <option key={roleItem} value={roleItem}>{roleItem}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 sm:col-span-2">
          <input
            name="isCaptain"
            type="checkbox"
            disabled={maxReached}
            className="h-5 w-5 rounded border-slate-300 accent-emerald-600"
          />
          Make this player captain
        </label>
      </div>

      <button
        type="submit"
        disabled={maxReached}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Plus size={18} />
        Add Player
      </button>
    </form>
  );
}
