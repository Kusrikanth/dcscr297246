import React from "react";
import { AoSelectionDataTypes, AoSelectionDataTypesI, } from "./AoSelectionTypes";
import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
  
  export const selectData1 = [
    
    {
      yearType: "2022-23",
    },
    {
      yearType: "2021-22",
    },
    {
      yearType: "2020-21",
    },
  ];
  
  export const selectData2 = [
    {
      classType: "Class",
    },
    {
      classType: "X",
    },
    {
      classType: "IX",
    },
    {
      classType: "VIII",
    },
  ];
  export const selectData4 = [
    {
      yearType: "PT1",
    },
    {
      yearType: "PT2",
    },
    {
      yearType: "PT3",
    },
  ];
  export const selectData5 = [
    {
      termType: "Term",
    },
    {
      termType: "Term I",
    },
    {
      termType: "Term II",
    },
    {
      termType: "Term III",
    },
  ];
  export const selectData7 = [
    {
      subjectType: "English",
    },
    {
      subjectType: "Hindi",
    },
    {
      subjectType: "Science",
    },
  ];
  export const selectData6 = [
    {
      sectionType: "Section",
    },
    {
      sectionType: "X-A",
    },
    {
      sectionType: "X-B",
    },
    {
      sectionType: "X-C",
    },
  ];

export function generateColumns(actionList: Array<IOptionsHrtl>) {
        return [
           
            {
                Header: "Subject Name",
                accessor: "subjectName",
                disableSortBy: true,
            },
            {
                Header: "Assesment Objectives",
                accessor: "assesmentObjectives",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                    return (
                      <>
                        <div>{original?.assesmentObjectives?.assesmentObjectives1}</div>
                        <div>{original?.assesmentObjectives?.assesmentObjectives2}</div>
                        <div>{original?.assesmentObjectives?.assesmentObjectives3}</div>
                        <div>{original?.assesmentObjectives?.assesmentObjectives4}</div>
                      </>
                    );
                  },
            },
            {
                Header: "Action",
                thClass: "w-5",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  return (
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
                  );
                },
              },
        ];
}
export const AoSelectionTableData: Array<AoSelectionDataTypes> =
  [
    {
      id: 1,
      subjectName: "English",
      assesmentObjectives: {
        assesmentObjectives1: "1.Analyse, evaluate and develop facts, ideas and opinions,using appropriate support from the text",
        assesmentObjectives2:"2.Demonstrate understanding of how writers achieve effects and influence readersions, using appropriate support from the text",
        assesmentObjectives3:" 3.Sequence facts, ideas and opinions support from the text",
        assesmentObjectives4:"4.Show understanding of the connections between ideas, opinions and attitudes"
      },
      },
      {
        id: 2,
        subjectName: "Mathematics",
        assesmentObjectives: {
          assesmentObjectives1: "1. organise, process and present information accurately in written, tabular, graphical and diagrammatic forms",
          assesmentObjectives2:"2.recognise and use spatial relationships in two and three dimensions.",
          assesmentObjectives3:"3.recognise patterns and structures in a variety of situations, and form generalisations",
          assesmentObjectives4:"4.Perform calculations and procedures by suitable methods."
        },
        },
        {
            id: 3,
            subjectName: "Science",
            assesmentObjectives: {
              assesmentObjectives1: "1. Learners can name four or more things that are living and never been alive.ammatic forms",
              assesmentObjectives2:"2.Learners can say what will happen to a plant with no light.",
              assesmentObjectives3:"3.Learners can recognise and name the roots, leaf, stem and flower of a plant.",
              assesmentObjectives4:"4. Learners can say how some sounds are loud and others are quiet."
            },
            },
  ];
  export function generateColumnsI() {
    return [
       
        {
            Header: "Assement Objectives",
            accessor: "subjectName",
            disableSortBy: true,
        },
        
    ];
}
export const AoSelectionTableDataI: Array<AoSelectionDataTypesI> = [
  {
    id: 1,
    subjectName:
      "Analyse, evaluate and develop facts, ideas and opinions,using appropriate support from the text",
  },
  {
    id: 2,
    subjectName:
      "Demonstrate understanding of how writers achieve effects and influence readersions, using appropriate support from the text",
  },
  {
    id: 3,
    subjectName: "Sequence facts, ideas and opinions support from the text",
  },
  {
    id: 4,
    subjectName:
      "Analyse, evaluate and develop facts, ideas and opinions,using appropriate support from the text",
  },
  {
    id: 5,
    subjectName:
      "Demonstrate understanding of how writers achieve effects and influence readersions, using appropriate support from the text",
  },
  {
    id: 6,
    subjectName: "Sequence facts, ideas and opinions support from the text",
  },
  {
    id: 7,
    subjectName:
      "Analyse, evaluate and develop facts, ideas and opinions,using appropriate support from the text",
  },
  {
    id: 8,
    subjectName:
      "Demonstrate understanding of how writers achieve effects and influence readersions, using appropriate support from the text",
  },
  {
    id: 9,
    subjectName: "Sequence facts, ideas and opinions support from the text",
  },
  {
    id: 10,
    subjectName:
      "Analyse, evaluate and develop facts, ideas and opinions,using appropriate support from the text",
  },
  {
    id: 11,
    subjectName:
      "Demonstrate understanding of how writers achieve effects and influence readersions, using appropriate support from the text",
  },
  {
    id: 12,
    subjectName: "Sequence facts, ideas and opinions support from the text",
  },
];