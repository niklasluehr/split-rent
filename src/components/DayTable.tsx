"use client";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import { useState } from "react";

const ROWS = 5;
const COLS = 5;

interface DayTableProps {
  startDate: Date;
  endDate: Date;
  names: string[];
}

export const DayTable = ({ names, startDate, endDate }: DayTableProps) => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const dates = Array.from(
    { length: Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) },
    (_, i) => new Date(startDate.getTime() + i * 86400000),
  );

  const toggleCellSelection = (i: number, j: number) => {
    const cellId = `${i}-${j}`;
    if (selectedCells.includes(cellId)) {
      setSelectedCells((prev) => prev.filter((cell) => cell !== cellId));
    } else {
      setSelectedCells((prev) => [...prev, cellId]);
    }
  };

  const isSelected = (i: number, j: number) => {
    const cellId = `${i}-${j}`;
    return selectedCells.includes(cellId);
  };

  return (
    <table>
      <tbody>
        <tr>
          <td></td>
          {names.map((name, i) => (
            <th className="w-12 px-0.5 pb-1 text-sm font-normal" key={i}>
              {name}
            </th>
          ))}
        </tr>
        {dates.map((date, i) => (
          <tr key={i}>
            <th className="pr-2 text-sm font-normal">
              {format(date, "LLL dd")}
            </th>
            {names.map((_, j) => (
              <td
                onClick={(e) => toggleCellSelection(i, j)}
                className={cn(
                  "h-6 cursor-cell border-2 text-center text-sm text-primary-foreground",
                  {
                    "bg-primary": isSelected(i, j),
                  },
                )}
                key={`${i}-${j}`}
              >
                {isSelected(i, j) ? `${date.getDate()}.` : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface TableProps {
  onCellClick: (cellId: string) => void;
  onCellDrag: (cellId: string) => void;
  selectedCells: string[];
}

const Table = ({ onCellClick, onCellDrag, selectedCells }: TableProps) => {
  const renderTable = () => {
    const table = [];
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
        const cellId = `${i}-${j}`;
        const isSelected = selectedCells.includes(cellId);
        row.push(
          <td
            key={cellId}
            id={cellId}
            className={isSelected ? "bg-primary" : ""}
            onMouseDown={() => onCellClick(cellId)}
            onMouseOver={() => onCellDrag(cellId)}
          >
            {cellId}
          </td>,
        );
      }
      table.push(<tr key={i}>{row}</tr>);
    }
    return table;
  };

  return (
    <table>
      <tbody>{renderTable()}</tbody>
    </table>
  );
};

const DayTable2 = () => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const handleCellClick = (cellId: string) => {
    setSelectedCells([cellId]);
  };

  const handleCellDrag = (cellId: string) => {
    if (selectedCells.length > 0) {
      const startCell = selectedCells[0]!.split("-").map(Number);
      const currentCell = cellId.split("-").map(Number);

      const rows = Array.from(
        { length: Math.abs(currentCell[0]! - startCell[0]!) + 1 },
        (_, i) => Math.min(startCell[0]!, currentCell[0]!) + i,
      );

      const cols = Array.from(
        { length: Math.abs(currentCell[1]! - startCell[1]!) + 1 },
        (_, i) => Math.min(startCell[1]!, currentCell[1]!) + i,
      );

      const newSelectedCells: string[] = [];
      rows.forEach((row) => {
        cols.forEach((col) => {
          newSelectedCells.push(`${row}-${col}`);
        });
      });

      setSelectedCells(newSelectedCells);
    }
  };

  return (
    <div className="App">
      <h1>Table Selection Example</h1>
      <Table
        onCellClick={handleCellClick}
        onCellDrag={handleCellDrag}
        selectedCells={selectedCells}
      />
    </div>
  );
};
