import { useEffect, useRef, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { formations, formationNames } from "./formations";
import { exportPitchAsPng, exportPlayersAsExcel } from "./exporters";
import { FootballPitch } from "./FootballPitch";
import { PlayerForm } from "./PlayerForm";
import { PlayerTable } from "./PlayerTable";
import { CustomFormationBuilder } from "./CustomFormationBuilder";
import { fetchSavedSquad, saveSquad } from "./api";
import type { Formation, FormationName, Player, Role, RoleSlot } from "./types";

const STORAGE_KEY = "football-squad-builder-v10";

type SavedSquadState = {
  players: Player[];
  formationName: FormationName;
  customFormation: Formation;
};

function loadSavedState(): SavedSquadState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSquadState;
  } catch {
    return null;
  }
}

export default function App() {
  const savedState = loadSavedState();

  const [players, setPlayers] = useState<Player[]>(savedState?.players ?? []);
  const [formationName, setFormationName] = useState<FormationName>(savedState?.formationName ?? "4-4-2");
  const [customFormation, setCustomFormation] = useState<Formation>(savedState?.customFormation ?? formations.Custom);
  const pitchRef = useRef<HTMLDivElement | null>(null);

  const hasLoadedRemoteData = useRef(false);

  useEffect(() => {
    async function loadRemoteData() {
      try {
        const remoteState = await fetchSavedSquad();

        if (remoteState.players) {
          setPlayers(remoteState.players);
        }

        if (remoteState.formationName) {
          setFormationName(remoteState.formationName);
        }

        if (remoteState.customFormation) {
          setCustomFormation(remoteState.customFormation);
        }
      } catch (error) {
        console.warn("MongoDB API is not available. Using localStorage fallback.", error);
      } finally {
        hasLoadedRemoteData.current = true;
      }
    }

    loadRemoteData();
  }, []);

  useEffect(() => {
    const stateToSave: SavedSquadState = {
      players,
      formationName,
      customFormation,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

    if (!hasLoadedRemoteData.current) return;

    const timer = window.setTimeout(() => {
      saveSquad(stateToSave).catch((error) => {
        console.warn("Failed to save to MongoDB. localStorage fallback is still saved.", error);
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [players, formationName, customFormation]);

  async function resetSavedSquad() {
    const emptyState: SavedSquadState = {
      players: [],
      formationName: "4-4-2",
      customFormation: formations.Custom,
    };

    localStorage.removeItem(STORAGE_KEY);
    setPlayers(emptyState.players);
    setFormationName(emptyState.formationName);
    setCustomFormation(emptyState.customFormation);

    try {
      await saveSquad(emptyState);
    } catch (error) {
      console.warn("Failed to clear MongoDB data. localStorage was cleared.", error);
    }
  }

  function buildCustomFromCurrentFormation(nextFormationName: FormationName): Formation {
    if (nextFormationName !== "Custom") return customFormation;

    const sourceFormation =
      formationName === "Custom" ? customFormation : formations[formationName];

    const copiedSlots: RoleSlot[] = sourceFormation.slots.map((slot) => ({
      ...slot,
      id: crypto.randomUUID(),
    }));

    const fallbackPositions = [
      { x: 50, y: 92 },
      { x: 18, y: 72 },
      { x: 39, y: 72 },
      { x: 61, y: 72 },
      { x: 82, y: 72 },
      { x: 25, y: 50 },
      { x: 50, y: 50 },
      { x: 75, y: 50 },
      { x: 25, y: 25 },
      { x: 50, y: 18 },
      { x: 75, y: 25 },
    ];

    const existingRoles = new Set(copiedSlots.map((slot) => slot.role));
    const visiblePlayers = players.filter((player) => player.role !== "Reserve");

    visiblePlayers.forEach((player, index) => {
      if (player.role === "Reserve" || existingRoles.has(player.role)) return;

      const position = fallbackPositions[index % fallbackPositions.length];
      copiedSlots.push({
        id: crypto.randomUUID(),
        role: player.role,
        label: player.role,
        x: position.x,
        y: position.y,
      });
      existingRoles.add(player.role);
    });

    return {
      name: "Custom",
      slots: copiedSlots,
    };
  }

  function handleFormationChange(nextFormationName: FormationName) {
    if (nextFormationName === "Custom") {
      setCustomFormation(buildCustomFromCurrentFormation(nextFormationName));
    }

    setFormationName(nextFormationName);
  }

  function addPlayer(player: Omit<Player, "id">) {
    setPlayers((current) => [
      ...current.map((item) => ({ ...item, isCaptain: player.isCaptain ? false : item.isCaptain })),
      { ...player, id: crypto.randomUUID() },
    ]);
  }

  function updateRole(id: string, role: Role) {
    setPlayers((current) =>
      current.map((player) => (player.id === id ? { ...player, role } : player))
    );
  }

  function toggleCaptain(id: string) {
    setPlayers((current) => {
      const selected = current.find((player) => player.id === id);
      const shouldUnset = selected?.isCaptain;

      return current.map((player) => ({
        ...player,
        isCaptain: shouldUnset ? false : player.id === id,
      }));
    });
  }

  function removePlayer(id: string) {
    setPlayers((current) => current.filter((player) => player.id !== id));
  }

  function moveCustomSlot(slotId: string, x: number, y: number) {
    setCustomFormation((current) => ({
      ...current,
      slots: current.slots.map((slot) => (slot.id === slotId ? { ...slot, x, y } : slot)),
    }));
  }

  function updateCustomSlots(slots: RoleSlot[]) {
    setCustomFormation({ name: "Custom", slots });
  }

  const selectedFormation = formationName === "Custom" ? customFormation : formations[formationName];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Squad Builder</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black md:text-5xl">Football Team Registration</h1>
              <p className="mt-2 max-w-2xl text-slate-300">
                Your squad is saved to MongoDB through Prisma, with localStorage as a browser fallback.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetSavedSquad}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 font-bold text-white ring-1 ring-white/15 transition hover:bg-slate-700"
              >
                Clear Data
              </button>
              <button
                type="button"
                onClick={() => exportPitchAsPng(pitchRef.current)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-100"
              >
                <Download size={18} />
                Export PNG
              </button>
              <button
                type="button"
                onClick={() => exportPlayersAsExcel(players)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-600"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
          <div className="space-y-6">
            <PlayerForm players={players} onAddPlayer={addPlayer} />

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Formation / Strategy
                <select
                  value={formationName}
                  onChange={(event) => handleFormationChange(event.target.value as FormationName)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none ring-emerald-500 focus:ring-2"
                >
                  {formationNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>

              <p className="mt-3 text-sm text-slate-500">
                Reserve players are saved in the squad list but are not placed on the pitch.
              </p>
            </div>

          </div>

          <div className="space-y-6">
            <FootballPitch
              ref={pitchRef}
              formation={selectedFormation}
              players={players}
              isCustom={formationName === "Custom"}
              onMoveCustomSlot={moveCustomSlot}
            />

            {formationName === "Custom" && (
              <CustomFormationBuilder formation={customFormation} onChange={updateCustomSlots} />
            )}

            <PlayerTable
              players={players}
              onUpdateRole={updateRole}
              onToggleCaptain={toggleCaptain}
              onRemove={removePlayer}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
