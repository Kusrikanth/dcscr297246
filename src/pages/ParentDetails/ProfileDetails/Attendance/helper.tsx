export function formatAcademicYearDates(startDate: string, endDate: string): { year: number; months: string[] }[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;

    const monthsByYear: { year: number; months: string[] }[] = [];

    for (let year = startYear; year <= endYear; year++) {
      let startM = year === startYear ? startMonth : 1;
      let endM = year === endYear ? endMonth : 12;

      const months = Array.from({ length: endM - startM + 1 }, (_, i) =>
        (startM + i).toString().padStart(2, "0")
      );

      monthsByYear.push({ year, months });
    }

    return monthsByYear;
  }