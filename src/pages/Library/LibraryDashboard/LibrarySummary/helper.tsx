import { UserDetails } from "../../../../Components/Common";
import { getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumnsIssuedBooks() {
  return [
    {
      Header: "Book Name",
      accessor: "subject",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.title}
              displayId={original?.author}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Member",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImage}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Issued/Returned Date",
      accessor: "date",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
              <span
                className="circle"
                style={{
                  backgroundColor: original.issueStatus === "RETURNED" ? "#d4edda" : "#f8d7da",
                  color: original.issueStatus === "RETURNED" ? "#28a745" : "#dc3545",
                }}
              >
                <i
                  className={
                    original.issueStatus === "RETURNED"
                    ? "ri-arrow-left-down-line"
                    :"ri-arrow-right-up-line"
                  }
                ></i>
              </span>
              <p className="tw-text-gray-600 text-truncate tw-mb-0">{original.issueStatus === "RETURNED" ? getFormattedDateddMMMYYYY(original.returnDate) : original.issueStatus === "ISSUED" ? getFormattedDateddMMMYYYY(original.issueDate) : getFormattedDateddMMMYYYY(original.renewalDate) }</p>
            </div>
          </>
        );
      },
    },
   
  ];
}
export function generateColumnsTopReaders() {
  return [
    
    {
      Header: "Student Name",
      accessor: "maxMarks",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.name}
              displayId={original?.studentCode}
              imageUrl={original?.studentImage}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "No.of.Books Read",
      accessor: "noOfBooksRead",
      disableSortBy: true,
    },
   
  ];
}
export function generateColumnsMostIssued() {
  return [
    
    {
      Header: "Book Title",
      accessor: "bookName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.title}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Issue Count",
      accessor: "issueCount",
      disableSortBy: true,
    },
   
  ];
}
export function generateColumnsTopCircullatedBooks() {
  return [
    
    {
      Header: "Library Name",
      accessor: "libraryName",
      disableSortBy: true,
    },
    {
      Header: "Book Title",
      accessor: "bookName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.title}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true, 
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Issue Count",
      accessor: "issueCount",
      disableSortBy: true, 
    },
   
  ];
}

export const transformLibraryData = (data: Record<string, any>): Array<any> => {
  if (!data || typeof data !== 'object') {
    return [];
  }
  return Object.entries(data)?.map(([key, value]) => ({
      name: key,
      ...value
  }));
};

export function generateColumnsibraryBooksSummary() {
  return [
    
    {
      Header: "Library Name",
      accessor: "name",
      disableSortBy: true,
      Footer: "Total",
      footerClassName: "fw-bold"
    },
    {
      Header: "Books Count",
      accessor: "booksCount",
      disableSortBy: true,
      Footer: ({ rows }: any) => {
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.booksCount) ? 0 : Number(original?.booksCount));
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Available Books",
      accessor: "availableBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.availableBooks) ? 0 : Number(original?.availableBooks));
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Books Issued",
      accessor: "issuedBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.issuedBooks) ? 0 : Number(original?.issuedBooks));
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Missing/Lost Books",
      accessor: "lostBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.lostBooks) ? 0 : Number(original?.lostBooks));
        }, 0);        
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Discarded Books",
      accessor: "discardedBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.discardedBooks) ? 0 : Number(original?.discardedBooks));
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Over Due Books",
      accessor: "overDueBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {        
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.overDueBooks) ? 0 : Number(original?.overDueBooks));        
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    },
    {
      Header: "Transfered Books",
      accessor: "transferredBooks",
      disableSortBy: true,
      Footer: ({ rows }: any) => {        
        const totalBooks = rows?.reduce((total: number, row: any) => {
          const { original } = row;
          return total + (isNaN(original?.transferredBooks) ? 0 : Number(original?.transferredBooks));        
        }, 0);
        return <span className="fw-bold">{(totalBooks)}</span>;
      },
    }
   
  ];
}