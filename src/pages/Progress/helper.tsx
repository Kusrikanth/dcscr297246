
export function generateColumns() {
    return ([
        {
            id: "expander",
            disableSortBy: true,
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
                <span {...getToggleAllRowsExpandedProps()}>
                    {isAllRowsExpanded ? "-" : "+"}
                </span>
            ),
            rowSpan: 2,

            columns: [
                {
                    Header: 'Hidden',
                    displayNone: true,
                    disableSortBy: true,
                    Cell: ({ row }: any) =>
                        row.canExpand ? (
                            <span
                                {...row.getToggleRowExpandedProps({
                                    style: {
                                        paddingLeft: `${row.depth * 2}rem`,
                                    },
                                })}
                            >
                                {row.isExpanded ? "-" : "+"}
                            </span>
                        ) : null,

                },
            ],
        },
        {
            Header: "Id",
            accessor: "id",
            disableSortBy: true,
            rowSpan: 2,
            columns: [
                {
                    Header: 'Hidden',
                    displayNone: true,
                    accessor: "studentName",
                    disableSortBy: true,
                    columnClassName: "tw-text-nowrap",
                },
            ],
        },
        {
            Header: "English Core",
            accessor: "english",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "englishMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "englishGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Physics",
            accessor: "product_name",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "physicsMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "physicsGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Maths",
            accessor: "date",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "mathMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "mathGrades",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Chemistry",
            accessor: "chemistry",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "chemistryMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "chemistryGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Hindi",
            accessor: "hindi",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "hindiMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "hindiGrades",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Science",
            accessor: "science",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "scienceMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "scienceGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Computers",
            accessor: "computers",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "computerMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "computerGrades",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Social Science",
            accessor: "social_science",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "socialScienceMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "socialScienceGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        },
        {
            Header: "Total",
            accessor: "total",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            columns: [
                {
                    Header: 'M',
                    accessor: "totalMarks",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
                {
                    Header: 'G',
                    accessor: "totalGrade",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                },
            ],
        }
    ])
}

export const tableData = [
    {
        "studentName": "Aarav Sharma",
        "englishMarks": 85,
        "englishGrade": "A",
        "physicsMarks": 78,
        "physicsGrade": "B",
        "mathMarks": 92,
        "mathGrades": "A+",
        "chemistryMarks": 88,
        "chemistryGrade": "A",
        "hindiMarks": 75,
        "hindiGrades": "B+",
        "scienceMarks": 80,
        "scienceGrade": "B+",
        "computerMarks": 95,
        "computerGrades": "A+",
        "socialScienceMarks": 82,
        "socialScienceGrade": "A",
        "totalGrade": "A",
        "totalMarks": 675,
        "subRows": [
            {
                "studentName": "",
                "englishMarks": 85,
                "englishGrade": "A",
                "physicsMarks": 78,
                "physicsGrade": "B",
                "mathMarks": 92,
                "mathGrades": "A+",
                "chemistryMarks": 88,
                "chemistryGrade": "A",
                "hindiMarks": 75,
                "hindiGrades": "B+",
                "scienceMarks": 80,
                "scienceGrade": "B+",
                "computerMarks": 95,
                "computerGrades": "A+",
                "socialScienceMarks": 82,
                "socialScienceGrade": "A",
                "totalGrade": "A",
                "totalMarks": 675,
            }
        ]
    },
    {
        "studentName": "Ishita Mehta",
        "englishMarks": 72,
        "englishGrade": "B",
        "physicsMarks": 81,
        "physicsGrade": "A",
        "mathMarks": 85,
        "mathGrades": "A",
        "chemistryMarks": 79,
        "chemistryGrade": "B+",
        "hindiMarks": 68,
        "hindiGrades": "B",
        "scienceMarks": 83,
        "scienceGrade": "A",
        "computerMarks": 90,
        "computerGrades": "A+",
        "socialScienceMarks": 75,
        "socialScienceGrade": "B+",
        "totalGrade": "A",
        "totalMarks": 633
    },
    {
        "studentName": "Rohan Gupta",
        "englishMarks": 95,
        "englishGrade": "A+",
        "physicsMarks": 89,
        "physicsGrade": "A",
        "mathMarks": 98,
        "mathGrades": "A+",
        "chemistryMarks": 94,
        "chemistryGrade": "A+",
        "hindiMarks": 82,
        "hindiGrades": "A",
        "scienceMarks": 87,
        "scienceGrade": "A",
        "computerMarks": 96,
        "computerGrades": "A+",
        "socialScienceMarks": 88,
        "socialScienceGrade": "A",
        "totalGrade": "A+",
        "totalMarks": 729
    },
    {
        "studentName": "Kavya Reddy",
        "englishMarks": 68,
        "englishGrade": "B",
        "physicsMarks": 72,
        "physicsGrade": "B",
        "mathMarks": 78,
        "mathGrades": "B+",
        "chemistryMarks": 70,
        "chemistryGrade": "B",
        "hindiMarks": 65,
        "hindiGrades": "B",
        "scienceMarks": 74,
        "scienceGrade": "B",
        "computerMarks": 85,
        "computerGrades": "A",
        "socialScienceMarks": 72,
        "socialScienceGrade": "B",
        "totalGrade": "B+",
        "totalMarks": 584
    },
    {
        "studentName": "Aditya Singh",
        "englishMarks": 88,
        "englishGrade": "A",
        "physicsMarks": 82,
        "physicsGrade": "A",
        "mathMarks": 91,
        "mathGrades": "A+",
        "chemistryMarks": 86,
        "chemistryGrade": "A",
        "hindiMarks": 79,
        "hindiGrades": "B+",
        "scienceMarks": 83,
        "scienceGrade": "A",
        "computerMarks": 89,
        "computerGrades": "A+",
        "socialScienceMarks": 80,
        "socialScienceGrade": "A",
        "totalGrade": "A",
        "totalMarks": 678
    }
]



//Input With Regex
// interface ITextInputWithRegex {
//     // eslint-disable-next-line no-restricted-globals
//     name: string,
//     formgroupClassName?: (string | undefined),
//     labelText?: string,
//     inputClassName?: string,
//     value?: (string | number | undefined | null),
//     placeHolder?: string,
//     onChange?: any,
//     onBlur?: any,
//     invalid?: boolean,
//     error?: any,
//     isReadOnly?: boolean,
//     isDisabled?: boolean,
//     children?: React.ReactNode,
//     helperText?: string,
//     labelClass?: string;
//     regexAllowedRegex?: string;
//     maxLength?: number;
//     invalidRegexClear?: any;
// }

// export const TextInputWithRegex: React.FC<ITextInputWithRegex> = (props) => {
//     const inputRef = useRef<any>(null);
//     // const valueRef = useRef("");
//     // useEffect(()=>{

//     // })
//     const regexValue = useMemo(() => {
//         if (props.regexAllowedRegex) {
//             return new RegExp(props.regexAllowedRegex);
//         } else {
//             return undefined;
//         }
//     }, [props.regexAllowedRegex]);
//     function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
//         const { name, value } = event.target;
//         if (regexValue) {
//             if (!value || regexValue.test(value)) {
//                 props.onChange(event);
//             } else {
//                 return;
//             }
//         } else {
//             props.onChange(event);
//         }
//     }

//     function keyUpHnldr(event: React.KeyboardEvent<HTMLInputElement>) {
//         const { key } = event, { name, value } = event.target;
//         if (key === "Backspace" && value && !regexValue?.test(value)) {
//             if (inputRef && inputRef.current && typeof props.invalidRegexClear === "function") {
//                 props.invalidRegexClear(props.name);
//             }
//         }
//     }

//     return (
//         <div className={props.formgroupClassName || "mb-3"}>
//             {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
//             <Input
//                 name={props.name}
//                 id={props.name}
//                 className={classnames(props.inputClassName)}
//                 placeholder={props.placeHolder}
//                 type="text"
//                 onChange={onChangeHndlr}
//                 ref={inputRef}
//                 onBlur={props.onBlur}
//                 value={props.value || ""}
//                 maxLength={props.maxLength || 45}
//                 disabled={props.isDisabled || false}
//                 readOnly={props.isReadOnly || false}
//                 // onKeyUp={keyUpHnldr}
//             />
//             {/* <input type="button" onClick={handleClick} /> */}
//             {props.helperText && <FormText>
//                 {props.helperText}
//             </FormText>}
//             {props.error && <FormFeedback type="invalid">
//                 {props.error}
//             </FormFeedback>}
//         </div>
//     )
// }

export const searchInputOptions = [
    {
        id: 'name',
        name: 'Student Name'
    },
    {
        id: 'id',
        name: 'Student Id'
    },
    {
        id: 'phone',
        name: 'Mobile Number'
    }
]