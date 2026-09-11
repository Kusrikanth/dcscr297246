  
  const rankColors = [
    { bgColor: "#0ab39c", rankBgColor: "#85d9ce" },
    { bgColor: "#405189", rankBgColor: "#a0a8c4" }, 
    { bgColor: "#f7b84b", rankBgColor: "#fbdca5" },
    { bgColor: "#f36d6d", rankBgColor: "#f8a4a4" },
  ];
  
  export const transformStudentDataToCards = (students: any[]) => {
    return students?.map((student, index) => {
      const rankLabel = `${student?.rank}${getOrdinalSuffix(student?.rank)}`;
      const { bgColor, rankBgColor } = rankColors[index % rankColors.length];
  
      return {
        studentName: student?.studentName,
        studentId: student?.studentCode,
        studentRank: rankLabel,
        studentPercentage: `${student?.percentage.toFixed(2)}%`,
        bgColor,
        rankBgColor,
        studentImage: student?.studentImageS3URL ?? undefined,
      };
    });
  };
  
  const getOrdinalSuffix = (rank: number): string => {
    const j = rank % 10,
      k = rank % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };
  