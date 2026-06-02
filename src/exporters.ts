import { toPng } from "html-to-image";
import * as XLSX from "xlsx";
import type { Player } from "./types";

export async function exportPitchAsPng(node: HTMLElement | null) {
  if (!node) return;
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#176534",
  });

  const link = document.createElement("a");
  link.download = "football-lineup.png";
  link.href = dataUrl;
  link.click();
}

export function exportPlayersAsExcel(players: Player[]) {
  const rows = players.map((player, index) => ({
    No: index + 1,
    Name: player.name,
    "Shirt Number": player.shirtNumber,
    "Shirt Size": player.shirtSize ?? "M",
    Role: player.role,
    Captain: player.isCaptain ? "Yes" : "No",
    Type: player.role === "Reserve" ? "Reserve Player" : "Lineup Player",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Squad");
  XLSX.writeFile(workbook, "football-squad.xlsx");
}
