import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../Components/Common";

  export function generateColumns() {
    return [
      {
        Header: "Student Name",
        accessor: "studentName",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return (
                <>
                 <UserDetails
          displayName={original?.studentName}
          displayId={original?.studentCode}
          showAvatar={false}
        />
                </>
            );
        },
    },
        {
          Header: "Curriculum",
          accessor: "curriculum",
          disableSortBy: true,
      },
      {
        Header: "Class",
        accessor: "class",
        disableSortBy: true,
    },
      {
        Header: "Concession Amount",
        accessor: "concessionAmount",
        disableSortBy: true,
    },
    {
      Header: "Concession Type",
      accessor: "concessionType",
      disableSortBy: true,
  },
    {
      Header: "Document",
      accessor: "document",
      disableSortBy: true,
  },

    ];
}
export const HostelStudentLedgerTableData: Array<any> =
  [
    {
     id: 1,
     studentName : "Lingam Prkruth",
     studentCode : "124000012",
     curriculum: "CBSE",
     class: "V",
     section: "V-A",
     totalAmount: "₹ 12,1540.00",
     paidAmount: "₹ 0.00",
     balanceAmount: "₹ 12,1540.00",
    },
    {
     id: 2,
     studentName : "Lingam Prkruth",
     studentCode : "124000012",
     curriculum: "CBSE",
     class: "V",
     section: "V-A",
     totalAmount: "₹ 12,1540.00",
     paidAmount: "₹ 0.00",
     balanceAmount: "₹ 12,1540.00",
    } ,
    
    {
     id: 3,
     studentName : "Lingam Prkruth",
     studentCode : "124000012",
     curriculum: "CBSE",
     class: "V",
     section: "V-A",
     totalAmount: "₹ 12,1540.00",
     paidAmount: "₹ 0.00",
     balanceAmount: "₹ 12,1540.00",
    },
    {
     id: 4,
     studentName : "Lingam Prkruth",
     studentCode : "124000012",
     curriculum: "CBSE",
     class: "V",
     section: "V-A",
     totalAmount: "₹ 12,1540.00",
     paidAmount: "₹ 0.00",
     balanceAmount: "₹ 12,1540.00",
    },
  ];