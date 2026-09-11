export const transformExamStatsToCards = (data: any) => {
    return [
      {
        cardTitle: "Total Students",
        cardCount: data?.totalStudents || 0,
        cardIconBgColor: "rgb(10, 179, 156)",
      },
      {
        cardTitle: "Students Appeared",
        cardCount: data?.studentAppearedForExamCount || 0,
        cardIconBgColor: "rgb(64, 81, 137)",
      },
      {
        cardTitle: "Highest Score",
        cardCount: isNaN(data?.highestMarks) || isNaN(data?.highestMarksPercentage)
          ? "0 (0%)"
          : `${data?.highestMarks || 0} (${data?.highestMarksPercentage.toFixed(2) || 0}%)`,
        cardIconBgColor: "rgb(254, 176, 25)",
      },
      {
        cardTitle: "Average Score",
        cardCount: isNaN(data?.highestMarksAverage) || isNaN(data?.highestAveragePercentage)
          ? "0 (0%)"
          : `${data?.highestMarksAverage.toFixed(2) || "0.00"} (${data?.highestAveragePercentage.toFixed(2) || 0}%)`,
        cardIconBgColor: "rgb(240, 101, 48)",
      },
    ];
  };