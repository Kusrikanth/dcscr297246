import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";


export function getTotalStudents(data: any) {
  if (!data || !data.marksRange) return 0;
  
  return data.marksRange.reduce(
    (total: number, branch: any) => total + branch.totalStudents,
    0
  );
}


export function getHighestMarkAcrossBranches(data: any) {
  if (!data || !data.marksRange) return 0;
  
  return Math.round(
    Math.max(...data.marksRange.map((branch: any, index: number) => branch.highestMarks || 0))
  );
}

export function getTotalForSlab(data: any, slabName: string) {
  if (!data || !data.marksRange) return 0;

  return data.marksRange.reduce(
    (sum: number, branch: any) => sum + (branch.slabCounts[slabName] || 0),
    0
  );
}


export function transformApiDataToTableData(data: any) {
  if (!data || !data.marksRange) return [];

  return data.marksRange.map((branch: any, index: number) => {
    // Create base branch object
    const branchData: any = {
      key: `branch-${index}`,
      branchName: branch.branchName,
      strength: branch.totalStudents,
      highestMark: branch.highestMarks,
    };

    // Add all slabs data
    data.slabDisplayNames.forEach((slabName: string) => {
      const accessor = slabName;
      branchData[accessor] = branch.slabCounts[slabName] || 0;
    });

    return branchData;
  });
}


export function generateColumns(data: any) {
  if (!data || !data.slabDisplayNames) return [];

  return [
    {
      Header: () => (
        <div className="d-flex align-items-center justify-content-center">
          <HugeiconsIcon icon={SchoolIcon} size={20} className="me-2" />
          <span>Branch Name</span>
        </div>
      ),
      accessor: "hiddenBranchName",
      columnClassName: "w-150px min-w-150px max-w-150px",
      disableSortBy: true,
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          columnClassName: "",
          disableSortBy: true,
          Footer: "GRAND TOTAL",
        },
      ],
    },
    {
      Header: "Strength",
      accessor: "hiddenStrength",
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "strength",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: getTotalStudents(data), 
        },
      ],
    },
    {
      Header: "Highest Mark",
      accessor: "hiddenHighestMark",
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "highestMark",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: getHighestMarkAcrossBranches(data), 
        },
      ],
    },
    {
      Header: "Marks Range",
      accessor: "marksRange",
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      Footer: "",
      columns: data.slabDisplayNames.map((slabName: string, index: number) => {
        const accessor = slabName;
        return {
          Header: slabName,
          accessor: accessor,
          disableSortBy: true,
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          Footer: getTotalForSlab(data, slabName),
          key: `slab-${index}`,
        };
      }),
    },
  ];
}