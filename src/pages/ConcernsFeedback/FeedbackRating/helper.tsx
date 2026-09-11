import { UserDetails } from "../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Name",
      accessor: "userName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-break-words",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.userName}
              displayId={original?.userId}
              showAvatar={true}
              size="xs"
            ></UserDetails>
          </>
        );
      },
    },
    {
      Header: "Feedback",
      accessor: "feedBack",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px] tw-break-words",
    },
    {
      Header: "Rating",
      accessor: "rating",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { rating } = original;
        const ratingValue = Number(rating) || 0;
        return (
          <div>
            {[...Array(5)].map((_, ind: any) => (
              <span key={ind}>
                <i
                    className={`ri-star-${
                      ind < ratingValue ? "fill" : "line"
                    } fs-16 me-1`}
                  style={{ color: ind < ratingValue ? "#FFB22C" : "#3D3D3D" }}
                ></i>
              </span>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Source",
      accessor: "source",
      disableSortBy: true,
    },
    {
      Header: "OS Browser",
      accessor: "osBrowser",
      disableSortBy: true,
    },
    {
      Header: "Version",
      accessor: "version",
      disableSortBy: true,
    },
    {
      Header: "Date & Time",
      accessor: "date",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.feedBackDate}
              displayId={original?.feedBackTime}
              showAvatar={false}
            ></UserDetails>
          </>
        );
      },
    },
  ];
}

export const tableData = [
  {
    userName: "Rajesh Sharma",
    userId: "P1241256",
    feedBack: "Great app, very useful!",
    rating: "5",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.0.0-production",
    feedBackDate: "2024-11-30",
    feedBackTime: "11:30",
  },
  {
    userName: "Priya Mehta",
    userId: "P25263",
    feedBack: "Excellent UI",
    rating: "4",
    source: "MOBILE",
    osBrowser: "Android",
    version: "1.0.24",
    feedBackDate: "2024-11-25",
    feedBackTime: "16:40",
  },
  {
    userName: "Amit Verma",
    userId: "P39142",
    feedBack: "Needs more features",
    rating: "3",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.2.0-production",
    feedBackDate: "2025-01-24",
    feedBackTime: "12:00",
  },
  {
    userName: "Sunita Reddy",
    userId: "P59003",
    feedBack: "No subject data in this app",
    rating: "2",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.3.0-production",
    feedBackDate: "2025-02-12",
    feedBackTime: "10:10",
  },
  {
    userName: "Ramesh Iyer",
    userId: "P14792",
    feedBack: "Needs updates",
    rating: "1",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.3.0-production",
    feedBackDate: "2025-02-13",
    feedBackTime: "18:20",
  },
  {
    userName: "Anjali Kapoor",
    userId: "P23004",
    feedBack: "School is good, but some people talking bad word",
    rating: "1",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.1.3-production",
    feedBackDate: "2025-01-20",
    feedBackTime: "12:40",
  },
  {
    userName: "Deepak Joshi",
    userId: "P19261",
    feedBack: "Good",
    rating: "1",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.1.3-production",
    feedBackDate: "2025-01-19",
    feedBackTime: "15:20",
  },
  {
    userName: "Nisha Patel",
    userId: "P4293",
    feedBack: "App is helpful!",
    rating: "5",
    source: "MOBILE",
    osBrowser: "Android",
    version: "2.0.2-production",
    feedBackDate: "2024-12-06",
    feedBackTime: "07:30",
  },
  {
    userName: "Vikram Singh",
    userId: "P25263",
    feedBack: "New app is really nice!!",
    rating: "1",
    source: "MOBILE",
    osBrowser: "Android",
    version: "1.0.24",
    feedBackDate: "2024-11-26",
    feedBackTime: "13:20",
  },
  {
    userName: "Kavita Gupta",
    userId: "P37582",
    feedBack: "Excellent new App",
    rating: "1",
    source: "MOBILE",
    osBrowser: "Android",
    version: "1.0.24",
    feedBackDate: "N/A",
    feedBackTime: "N/A",
  },
];
