import { Plus, Trash2 } from "lucide-react";
import { pitchRoles } from "./formations";
import type { Formation, RoleSlot } from "./types";

interface CustomFormationBuilderProps {
  formation: Formation;
  onChange: (slots: RoleSlot[]) => void;
}

export function CustomFormationBuilder({ formation, onChange }: CustomFormationBuilderProps) {
  function updateSlot(slotId: string, patch: Partial<RoleSlot>) {
    onChange(formation.slots.map((slot) => (slot.id === slotId ? { ...slot, ...patch } : slot)));
  }

  function addSlot() {
    const newSlot: RoleSlot = {
      id: crypto.randomUUID(),
      role: "Central Midfielder",
      label: "Custom Role",
      x: 50,
      y: 50,
    };
    onChange([...formation.slots, newSlot]);
  }

  function removeSlot(slotId: string) {
    onChange(formation.slots.filter((slot) => slot.id !== slotId));
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Custom Formation Builder</h2>
          <p className="text-sm text-slate-600">Edit roles here, then drag the shirts on the pitch.</p>
        </div>
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Role Slot
        </button>
      </div>

      <div className="space-y-3">
        {formation.slots.map((slot) => (
          <div key={slot.id} className="grid gap-3 rounded-2xl bg-white p-3 md:grid-cols-[1fr_1fr_72px_72px_42px] md:items-center">
            <input
              value={slot.label}
              onChange={(event) => updateSlot(slot.id, { label: event.target.value })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Label"
            />
            <select
              value={slot.role}
              onChange={(event) => updateSlot(slot.id, { role: event.target.value as RoleSlot["role"] })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {pitchRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input
              type="number"
              value={slot.x}
              min={0}
              max={100}
              onChange={(event) => updateSlot(slot.id, { x: Number(event.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              value={slot.y}
              min={0}
              max={100}
              onChange={(event) => updateSlot(slot.id, { y: Number(event.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => removeSlot(slot.id)}
              className="rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-100"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
