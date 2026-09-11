import TrendSparkline from "./TrendSparkline";

export interface ISubjectResult {
  subject: string;
  color: string;
  unit1: number;
  mid: number;
  unit2: number;
  final: number;
  classAverage: number;
}

export interface IExamColumn {
  key: string;
  label: string;
}

export const subjectResults: Array<ISubjectResult> = [
  {
    subject: "Mathematics",
    color: "#2563eb",
    unit1: 84,
    mid: 87,
    unit2: 91,
    final: 94,
    classAverage: 82,
  },
  {
    subject: "Science",
    color: "#0f9488",
    unit1: 83,
    mid: 86,
    unit2: 90,
    final: 93,
    classAverage: 81,
  },
  {
    subject: "English",
    color: "#7c3aed",
    unit1: 86,
    mid: 89,
    unit2: 93,
    final: 96,
    classAverage: 86,
  },
  {
    subject: "Social Studies",
    color: "#d97706",
    unit1: 68,
    mid: 71,
    unit2: 75,
    final: 78,
    classAverage: 76,
  },
  {
    subject: "Hindi",
    color: "#db2777",
    unit1: 77,
    mid: 80,
    unit2: 84,
    final: 87,
    classAverage: 79,
  },
  {
    subject: "Computer Science",
    color: "#0891b2",
    unit1: 89,
    mid: 92,
    unit2: 96,
    final: 99,
    classAverage: 88,
  },
];

export const yearResults = [
  { year: "2024-25", className: "VIII - A", score: 78.4, classAverage: 75.8 },
  { year: "2025-26", className: "IX - A", score: 83.7, classAverage: 78.2 },
  { year: "2026-27", className: "X - A", score: 86.2, classAverage: 80.4 },
];

export const examColumns: Array<IExamColumn> = [
  { key: "unit1", label: "Unit Test 1" },
  { key: "mid", label: "Mid Term" },
  { key: "unit2", label: "Unit Test 2" },
  { key: "final", label: "Final Exam" },
];

export const academicYearsList = ["2023-24", "2024-25", "2025-26", "2026-27"];

export const academicYearOptions = [...academicYearsList]
  .reverse()
  .map((year) => ({ key: year, name: year }));

export const subjectFilterOptions = [
  { key: "All Subjects", name: "All Subjects" },
  ...subjectResults.map((row) => ({ key: row.subject, name: row.subject })),
];

export const examFilterOptions = [
  { key: "All Exams", name: "All Exams" },
  ...examColumns.map((exam) => ({ key: exam.label, name: exam.label })),
];

export function subjectAverage(row: ISubjectResult) {
  return Math.round(
    examColumns.reduce(
      (sum, exam) => sum + Number((row as any)[exam.key] || 0),
      0
    ) / examColumns.length
  );
}

export function toGrade(value: number) {
  if (value >= 90) return "A+";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  return "C";
}

export function heatColor(value: number) {
  if (value >= 90) return "#dff3e8";
  if (value >= 80) return "#fff0cc";
  return "#fde3e1";
}

export function generateHeatmapColumns(visibleExams: Array<IExamColumn>) {
  return [
    {
      Header: "Subject",
      accessor: "subject",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <span className="tw-flex tw-items-center tw-gap-2">
          <i
            className="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full"
            style={{ background: original?.color }}
          />
          {original?.subject}
        </span>
      ),
    },
    ...visibleExams.map((exam) => ({
      Header: exam.label,
      accessor: exam.key,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const value = Number(original?.[exam.key] || 0);
        return (
          <div
            className="tw-rounded-md tw-px-2 tw-py-1 tw-text-center"
            style={{ background: heatColor(value) }}
            title={`${original?.subject}: ${value}/100, Grade ${toGrade(value)}`}
          >
            <strong>{value}%</strong>
          </div>
        );
      },
    })),
    {
      Header: "Average",
      accessor: "average",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <b>{subjectAverage(original)}%</b>
      ),
    },
  ];
}

export interface ISubjectYearRow {
  subject: string;
  color: string;
  change: number;
  trend: Array<number>;
  [key: string]: any;
}

export interface IExamPerformanceRow {
  exam: string;
  max: number;
  overall: number;
  change: number | null;
  [key: string]: any;
}

export const examMaxMarks: Record<string, number> = {
  unit1: 50,
  mid: 100,
  unit2: 50,
  final: 100,
};

const examOffsets: Record<string, number> = {
  unit1: -5,
  mid: -2,
  unit2: 2,
  final: 5,
};

const subjectYearScores = [
  { subject: "Mathematics", color: "#2563eb", scores: [76, 80, 85, 89] },
  { subject: "Science", color: "#0f9488", scores: [74, 79, 84, 88] },
  { subject: "English", color: "#7c3aed", scores: [82, 85, 88, 91] },
  { subject: "Social Studies", color: "#d97706", scores: [64, 67, 70, 73] },
  { subject: "Hindi", color: "#db2777", scores: [71, 75, 79, 82] },
  { subject: "Computer Science", color: "#0891b2", scores: [83, 87, 91, 94] },
];

export const subjectYearRows: Array<ISubjectYearRow> = subjectYearScores.map(
  (item) => {
    const row: ISubjectYearRow = {
      subject: item.subject,
      color: item.color,
      trend: item.scores,
      change: Number(
        (item.scores[item.scores.length - 1] - item.scores[0]).toFixed(1)
      ),
    };
    academicYearsList.forEach((year, index) => {
      row[year] = item.scores[index];
    });
    return row;
  }
);

export function scoreToneClass(value: number) {
  if (value >= 85) return "tw-bg-green-50 tw-text-green-700";
  if (value >= 75) return "tw-bg-blue-50 tw-text-blue-700";
  if (value >= 65) return "tw-bg-amber-50 tw-text-amber-700";
  return "tw-bg-red-50 tw-text-red-700";
}

export function changeToneClass(value: number) {
  if (value > 0) return "tw-bg-green-50 tw-text-green-700";
  if (value < 0) return "tw-bg-red-50 tw-text-red-700";
  return "tw-bg-gray-100 tw-text-gray-500";
}

export function formatChange(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

export function buildExamPerformanceRows(
  year: string,
  subjects: Array<ISubjectYearRow>,
  exams: Array<IExamColumn>
): Array<IExamPerformanceRow> {
  let previous: number | null = null;

  return exams.map((exam) => {
    const row: IExamPerformanceRow = {
      exam: exam.label,
      max: examMaxMarks[exam.key] || 100,
      overall: 0,
      change: null,
    };

    let total = 0;
    subjects.forEach((subject) => {
      const value = Math.min(
        100,
        Math.max(0, Number(subject[year] || 0) + (examOffsets[exam.key] || 0))
      );
      row[subject.subject] = value;
      total += value;
    });

    row.overall = subjects.length
      ? Number((total / subjects.length).toFixed(1))
      : 0;
    row.change =
      previous === null ? null : Number((row.overall - previous).toFixed(1));
    previous = row.overall;

    return row;
  });
}

export function generateSubjectYearColumns() {
  return [
    {
      Header: "Subject",
      accessor: "subject",
      Cell: ({ row: { original } }: any) => (
        <span className="tw-flex tw-items-center tw-gap-2 tw-font-medium tw-text-gray-700">
          <i
            className="tw-inline-block tw-w-2.5 tw-h-2.5 tw-rounded-full tw-flex-shrink-0"
            style={{ background: original?.color }}
          />
          {original?.subject}
        </span>
      ),
    },
    ...academicYearsList.map((year) => ({
      Header: year,
      accessor: year,
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const value = Number(original?.[year] || 0);
        return (
          <span
            className={`tw-inline-flex tw-items-center tw-justify-center tw-min-w-[64px] tw-rounded-md tw-px-2 tw-py-1 tw-text-sm tw-font-semibold ${scoreToneClass(
              value
            )}`}
          >
            {value}%
          </span>
        );
      },
    })),
    {
      Header: "Change",
      accessor: "change",
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const value = Number(original?.change || 0);
        return (
          <span
            className={`tw-inline-flex tw-items-center tw-gap-1 tw-rounded-full tw-px-2.5 tw-py-1 tw-text-xs tw-font-semibold ${changeToneClass(
              value
            )}`}
          >
            {value > 0 ? "▲" : value < 0 ? "▼" : "—"} {formatChange(value)} pts
          </span>
        );
      },
    },
    {
      Header: "Trend",
      accessor: "trend",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <TrendSparkline
          trend={original?.trend || []}
          color={original?.color}
        />
      ),
    },
  ];
}

export function generateExamPerformanceColumns(
  subjects: Array<ISubjectYearRow>
) {
  return [
    {
      Header: "Examination",
      accessor: "exam",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <span className="tw-font-medium tw-text-gray-700">
          {original?.exam}
        </span>
      ),
    },
    {
      Header: "Max",
      accessor: "max",
      disableSortBy: true,
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
    },
    ...subjects.map((subject) => ({
      Header: subject.subject,
      accessor: subject.subject,
      disableSortBy: true,
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const value = Number(original?.[subject.subject] || 0);
        return (
          <span
            className={`tw-inline-flex tw-items-center tw-justify-center tw-min-w-[56px] tw-rounded-md tw-px-2 tw-py-1 tw-text-sm tw-font-semibold ${scoreToneClass(
              value
            )}`}
          >
            {value}%
          </span>
        );
      },
    })),
    {
      Header: "Overall",
      accessor: "overall",
      disableSortBy: true,
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => (
        <b className="tw-text-sm">{Number(original?.overall || 0).toFixed(1)}%</b>
      ),
    },
    {
      Header: "Trend",
      accessor: "change",
      disableSortBy: true,
      thClass: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        if (original?.change === null || original?.change === undefined) {
          return <span className="tw-text-gray-400">—</span>;
        }
        const value = Number(original?.change);
        return (
          <span
            className={`tw-inline-flex tw-items-center tw-gap-1 tw-rounded-full tw-px-2.5 tw-py-1 tw-text-xs tw-font-semibold ${changeToneClass(
              value
            )}`}
          >
            {value > 0 ? "▲" : value < 0 ? "▼" : "—"} {formatChange(value)}
          </span>
        );
      },
    },
  ];
}

export function yearAverage(year: string) {
  return Number(
    (
      subjectYearRows.reduce((sum, row) => sum + Number(row[year] || 0), 0) /
      subjectYearRows.length
    ).toFixed(1)
  );
}

export function yearImprovement(year: string) {
  const index = academicYearsList.indexOf(year);
  if (index <= 0) return null;
  return Number(
    (yearAverage(year) - yearAverage(academicYearsList[index - 1])).toFixed(1)
  );
}
