import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

export const statusOptions = [
    {
        name: "SUBMITTED",
        id: "SUBMITTED",
    },
    {
        name: "NOT SUBMITTED",
        id: "NOT_SUBMITTED",
    }
]

export const undertakingOptions = [
    {
        name: "CORRECTIONS",
        id: "CORRECTIONS",
    },
    {
        name: "NO CORRECTIONS",
        id: "NOCORRECTIONS",
    }
]

export function generateColumns() {
    return [
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "shortName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[60px] tw-max-w-[60px] tw-w-[60px] ",
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        },
        {
            Header: "Admission No",
            accessor: "admissionNo",
            disableSortBy: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
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
            Header: "Date of Birth",
            accessor: "dob",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <div className="tw-w-[100px] tw-max-w-[100px] tw-min-w-[100px] ">{original?.dob ? getDdMmYyyyFormat(new Date(original?.dob)) : "-"}</div>;
            },
        },
        {
            Header: "Date of Admission",
            accessor: "dateOfAdmission",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.dateOfAdmission ? getDdMmYyyyFormat(new Date(original?.dateOfAdmission)) : "-";
            },
        },
        {
            Header: "Father Name",
            accessor: "fatherName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
        },
        {
            Header: "Mother Name",
            accessor: "motherName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
        },
        {
            Header: "Gender",
            accessor: "genderName",
            disableSortBy: true,
        },
        {
            Header: "Caste",
            accessor: "casteName",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { casteFile } = original || {};
                return (
                    <>
                        <span>{original?.casteName}</span><br/>
                        {
                            casteFile?.s3URL ? <span onClick={() => {
                                window.open(casteFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{casteFile?.originalFileName}</span> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>They will mail</span>
                        <span>cast certificate ?</span>
                    </div>
                )
            },
            accessor: "casteMail",
            disableSortBy: true,
        },
        {
            Header: "Mobile No.",
            accessor: "smsPriorityNo",
            disableSortBy: true,
        },
        {
            Header: "Email ID",
            accessor: "emailId",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Does Candidate have</span>
                        <span>aadhar details ?</span>
                    </div>
                )
            },
            accessor: "isAadharCardPresent",
            disableSortBy: true,
        },
        {
            Header: "Aadhar No.",
            accessor: "aadharCardNo",
            disableSortBy: true,
        },
        {
            Header: "Aadhar File",
            accessor: "aadharCardFile",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { aadharCardFile } = original || {};
                return (
                    <>
                        {
                            aadharCardFile?.s3URL ? <div onClick={() => {
                                window.open(aadharCardFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{aadharCardFile?.originalFileName}</div> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: "Minority",
            accessor: "isMinority",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Is Candidate handicapper ?</span>
                        <span>and Remarks</span>
                    </div>
                )
            },
            accessor: "isHandicapped",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const handiCappedRemark = original?.isHandicapped?.toLowerCase() === "yes"
                    ? (original?.handicappedFor?.toLowerCase() === "others"
                        ? original?.handicappedOtherRemarks
                        : original?.handicappedFor)
                    : original?.isHandicapped;

                return (<>
                    {handiCappedRemark}
                </>)
            },
        },
        {
            Header: "Medical Remarks",
            accessor: "medicalRemarks",
            disableSortBy: true,
        },
        {
            Header: "Has Siblings ?",
            accessor: "hasSibling",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Is Sibling Studying</span>
                        <span>in school ?</span>
                    </div>
                )
            },
            accessor: "isSiblingStudyingInSameSchool",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Sibling Details ( Id /</span>
                        <span>Name / Campus / Curriculum</span>
                        <span>Class / Section )</span>
                    </div>
                )
            },
            accessor: "siblingAcademicYear",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { siblingStudentCode, siblingStudentName, siblingBranchName, siblingCurriculumName, siblingClassShortName, siblingSectionName } = original || {}
                return siblingStudentCode && (
                    <>
                        {`${siblingStudentCode} / ${siblingStudentName} / ${siblingBranchName} / ${siblingCurriculumName} / ${siblingClassShortName} / ${siblingSectionName}`}
                    </>
                );
            },
        },
        {
            Header: "Second Language",
            accessor: "secondLanguage",
            disableSortBy: true,
        },
        {
            Header: "Third Language",
            accessor: "thirdLanguage",
            disableSortBy: true,
        },
        {
            Header: "Skill Subject",
            accessor: "skillSubjectName",
            disableSortBy: true,
        },
        {
            Header: "Board Roll No",
            accessor: "boardRollNo",
            disableSortBy: true,
        },
        {
            Header: "Board Name",
            accessor: "boardName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                return original?.boardName === "OTHERS" ? original?.boardOtherName : original?.boardName;
            },
        },
        {
            Header: "Class-X Board Certificate",
            accessor: "marksSheetFile",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { marksSheetFile } = original || {};
                return (
                    <>
                        {
                            marksSheetFile?.s3URL ? <div onClick={() => {
                                window.open(marksSheetFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{marksSheetFile?.originalFileName}</div> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: "Undertaking",
            accessor: "undertaking",
            disableSortBy: true,
        },
        {
            Header: "Letter of Request",
            accessor: "requestLetterFile",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { requestLetterFile } = original || {};
                return (
                    <>
                        {
                            requestLetterFile?.s3URL ? <div onClick={() => {
                                window.open(requestLetterFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{requestLetterFile?.originalFileName}</div> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: "Notary Affidavit",
            accessor: "affidavitFile",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { affidavitFile } = original || {};
                return (
                    <>
                        {
                            affidavitFile?.s3URL ? <div onClick={() => {
                                window.open(affidavitFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{affidavitFile?.originalFileName}</div> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: "Proof of Evidence",
            accessor: "evidenceProofFile",
            disableSortBy: true,
            columnClassName: "tw-min-w-[200px] tw-max-w-[200px] ",
            Cell: ({ row: { original } }: any) => {
                const { evidenceProofFile } = original || {};
                return (
                    <>
                        {
                            evidenceProofFile?.s3URL ? <div onClick={() => {
                                window.open(evidenceProofFile?.s3URL, "_blank")
                            }} className="tw-text-blue-500 tw-cursor-pointer">{evidenceProofFile?.originalFileName}</div> : "-"
                        }
                    </>
                );
            },
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>They will mail </span>
                        <span>Documents ?</span>
                    </div>
                )
            },
            accessor: "documentMail",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Student Name </span>
                        <span>( Correction )</span>
                    </div>
                )
            },
            accessor: "correctedStudentName",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Father Name </span>
                        <span>( Correction )</span>
                    </div>
                )
            },
            accessor: "correctedFatherName",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Mother Name </span>
                        <span>( Correction )</span>
                    </div>
                )
            },
            accessor: "correctedMotherName",
            disableSortBy: true,
        },
        {
            Header: () => {
                return (
                    <div className="tw-flex tw-flex-col">
                        <span>Date of Birth</span>
                        <span>( Correction )</span>
                    </div>
                )
            },
            accessor: "correctedDob",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.correctedDob ? getDdMmYyyyFormat(new Date(original?.correctedDob)) : "-";
            },
        },
        {
            Header: "Submission Status",
            accessor: "submissionStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{original?.submissionStatus?.split("_")?.join(" ")}</span>
            },
        },
        {
            Header: "Submitted Date",
            accessor: "createdAt",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.submissionStatus?.toLowerCase() === "submitted" && <div className="tw-w-[100px] tw-max-w-[100px] tw-min-w-[100px] ">{original?.createdAt ? getDdMmYyyyFormat(new Date(original?.createdAt)) : "-"}</div> ;
            },
        },
    ];
}

