import { DayTable } from "@/components/DayTable";

export default function HomePage() {
  return (
    <main className="px-4 pt-4">
      <DayTable
        names={["Niklas", "Holger", "Greta", "Anna", "Cele"]}
        startDate={new Date("2023-12-01")}
        endDate={new Date("2023-12-17")}
      />
    </main>
  );
}
