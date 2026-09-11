import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { SelectInput, TextInputWithRegex } from "../../../../../Components/Common";
import SubMenuMultiSelect from "../../../../../Components/Common/SubMenuMultiSelect";

interface OptionType {
  id: string;
  name: string;
  children?: OptionType[];
}

const ImportChapter = () => {
  const [selectedStandards, setSelectedStandards] = useState<OptionType[]>([]);

  const hierarchicalOptions: OptionType[] = [
    {
      id: "1",
      name: "Unit 1: Number Systems",
      children: [
        {
          id: "2",
          name: "Chapter 1: Real Numbers",
          children: [
            {
              id: "3",
              name: "Topic 1.1: Euclid’s Division Lemma",
              children: [
                { id: "4", name: "Session 1.1.1: Derivation and example problems" }
              ]
            },
            {
              id: "5",
              name: "Topic 1.2: Fundamental Theorem of Arithmetic",
              children: [
                { id: "6", name: "Session 1.2.1: Prime factorization of integers" }
              ]
            },
            {
              id: "7",
              name: "Topic 1.3: Revisiting Irrational Numbers",
              children: [
                { id: "8", name: "Session 1.3.1: Proof of irrationality of √2, √3, etc." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "9",
      name: "Unit 2: Algebra",
      children: [
        {
          id: "10",
          name: "Chapter 2: Polynomials",
          children: [
            {
              id: "11",
              name: "Topic 2.1: Zeros of Polynomial",
              children: [
                { id: "12", name: "Session 2.1.1: Graphical understanding" }
              ]
            },
            {
              id: "13",
              name: "Topic 2.2: Relationship between Zeros & Coefficients",
              children: [
                { id: "14", name: "Session 2.2.1: Algebraic derivations" }
              ]
            }
          ]
        },
        {
          id: "15",
          name: "Chapter 3: Pair of Linear Equations in Two Variables",
          children: [
            { id: "16", name: "Topic 3.1: Graphical Method" },
            { id: "17", name: "Topic 3.2: Substitution Method" },
            { id: "18", name: "Topic 3.3: Elimination Method" }
          ]
        },
        {
          id: "19",
          name: "Chapter 4: Quadratic Equations",
          children: [
            {
              id: "20",
              name: "Topic 4.1: Standard Form",
              children: [
                { id: "21", name: "Session 4.1.1: Derivation by completing square" }
              ]
            },
            { id: "22", name: "Topic 4.2: Factorization Method" },
            { id: "23", name: "Topic 4.3: Discriminant Method" }
          ]
        },
        {
          id: "24",
          name: "Chapter 5: Arithmetic Progressions",
          children: [
            { id: "25", name: "Topic 5.1: nth Term" },
            { id: "26", name: "Topic 5.2: Sum of n Terms" }
          ]
        }
      ]
    },
    {
      id: "27",
      name: "Unit 3: Coordinate Geometry",
      children: [
        {
          id: "28",
          name: "Chapter 6: Lines in Two Dimensions",
          children: [
            { id: "29", name: "Topic 6.1: Distance Formula" },
            { id: "30", name: "Topic 6.2: Section Formula" },
            { id: "31", name: "Topic 6.3: Area of Triangle" }
          ]
        }
      ]
    },
    {
      id: "32",
      name: "Unit 4: Geometry",
      children: [
        {
          id: "33",
          name: "Chapter 7: Triangles",
          children: [
            { id: "34", name: "Topic 7.1: Similarity of Triangles" },
            { id: "35", name: "Topic 7.2: Pythagoras Theorem" }
          ]
        },
        {
          id: "36",
          name: "Chapter 8: Circles",
          children: [
            { id: "37", name: "Topic 8.1: Tangents from a Point to a Circle" }
          ]
        },
        {
          id: "38",
          name: "Chapter 9: Constructions",
          children: [
            { id: "39", name: "Topic 9.1: Division of a Line Segment" },
            { id: "40", name: "Topic 9.2: Tangent to a Circle" }
          ]
        }
      ]
    },
    {
      id: "41",
      name: "Unit 5: Trigonometry",
      children: [
        {
          id: "42",
          name: "Chapter 10: Introduction to Trigonometry",
          children: [
            { id: "43", name: "Topic 10.1: Trigonometric Ratios" },
            { id: "44", name: "Topic 10.2: Values of Standard Angles" }
          ]
        },
        {
          id: "45",
          name: "Chapter 11: Trigonometric Identities",
          children: [
            { id: "46", name: "Topic 11.1: Proving Identities" }
          ]
        },
        {
          id: "47",
          name: "Chapter 12: Heights and Distances",
          children: [
            { id: "48", name: "Topic 12.1: Angle of Elevation" },
            { id: "49", name: "Topic 12.2: Angle of Depression" }
          ]
        }
      ]
    },
    {
      id: "50",
      name: "Unit 6: Mensuration",
      children: [
        {
          id: "51",
          name: "Chapter 13: Areas Related to Circles",
          children: [
            { id: "52", name: "Topic 13.1: Sector Area" },
            { id: "53", name: "Topic 13.2: Segment Area" }
          ]
        },
        {
          id: "54",
          name: "Chapter 14: Surface Areas and Volumes",
          children: [
            { id: "55", name: "Topic 14.1: Cones and Cylinders" },
            { id: "56", name: "Topic 14.2: Spheres and Hemispheres" },
            { id: "57", name: "Topic 14.3: Combination of Solids" }
          ]
        }
      ]
    },
    {
      id: "58",
      name: "Unit 7: Statistics & Probability",
      children: [
        {
          id: "59",
          name: "Chapter 15: Statistics",
          children: [
            { id: "60", name: "Topic 15.1: Mean, Median, Mode" },
            { id: "61", name: "Topic 15.2: Graphical Representation (Ogive, Histogram)" }
          ]
        },
        {
          id: "62",
          name: "Chapter 16: Probability",
          children: [
            { id: "63", name: "Topic 16.1: Classical Probability" }
          ]
        }
      ]
    }
  ];


  const handleStandardsChange = (value: OptionType[]) => {
    setSelectedStandards(value);
  };

  const findPathToValue = (
    options: OptionType[],
    targetId: string,
    path: string[] = []
  ): string[] | null => {
    for (const option of options) {
      const newPath = [...path, option.id];
      if (option.id === targetId) {
        return newPath;
      }
      if (option.children) {
        const childPath = findPathToValue(option.children, targetId, newPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  const getNamePathFromIdPath = (options: OptionType[], path: string[]): string[] => {
    const names: string[] = [];
    let currentOptions = options;

    for (const id of path) {
      const match = currentOptions.find((opt) => opt.id === id);
      if (match) {
        names.push(match.name);
        currentOptions = match.children || [];
      } else {
        break;
      }
    }

    return names;
  };
  const subjectList = [
    { id: "physics", shortName: "Physics" },
    { id: "chemistry", shortName: "Chemistry" },
    { id: "maths", shortName: "Mathematics" },
  ];
  const initialValues = {
    subject: '',
  };
  const addQuestionForm = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => { },
  });
  const getSelectedCounts = (selectedItems: OptionType[]) => {
  const unitSet = new Set<string>();
  const chapterSet = new Set<string>();
  const topicSet = new Set<string>();

  selectedItems.forEach((item) => {
    const path = findPathToValue(hierarchicalOptions, item.id);
    if (!path) return;

    if (path.length >= 1) unitSet.add(path[0]);
    if (path.length >= 2) chapterSet.add(path[1]);
    if (path.length >= 3) topicSet.add(path[2]);
  });

  return {
    units: unitSet.size,
    chapters: chapterSet.size,
    topics: topicSet.size,
  };
};

  return (
    <div className="p-4">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="row">
            <div className="col-12">
              <div className='col-12 pe-2'>
                <SelectInput
                  name="subject"
                  value={addQuestionForm.values.subject}
                  onChange={addQuestionForm.handleChange}
                  menuItems={subjectList}
                  valueKey="id"
                  textKey="shortName"
                  inputClassName=''
                  labelText='Subject'
                  floatingLabel
                />
              </div>
            </div>
            <div className="col-12"><SubMenuMultiSelect
              onChange={handleStandardsChange}
              value={selectedStandards}
              options={hierarchicalOptions}
              labelText="Select Chapter"
            /></div>
            <div className="col-12">
              <div className="my-3 p-3 tw-text-sm tw-text-muted"  style={{backgroundColor: "#eff2f7"}}>
                {selectedStandards.length === 0 ? (
                  <strong>No Chapters Selected</strong>
                ) : (
                  (() => {
                    const counts = getSelectedCounts(selectedStandards);
                    return (
                      <strong>
                        Units: {counts.units} | Chapters: {counts.chapters} | Topics: {counts.topics}
                      </strong>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="">
            <h4 className="tw-mb-0 fs-14">
              Selected Chapter's :
            </h4>
            <div className="p-3">
              {Object.entries(
                selectedStandards.reduce((acc, item) => {
                  const idPath = findPathToValue(hierarchicalOptions, item.id) || [];
                  const namePath = getNamePathFromIdPath(hierarchicalOptions, idPath);
                  const parentPath = namePath.slice(0, -1).join(" > ");
                  const leafName = namePath[namePath.length - 1];
                  if (!acc[parentPath]) acc[parentPath] = [];
                  acc[parentPath].push(leafName);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([parent, leaves]) => (
                <div key={parent} className="tw-mb-2">
                  <strong>{parent} &gt;</strong>
                  <ul className="tw-ml-4 tw-list-disc">
                    {leaves.map((leaf, idx) => (
                      <li key={idx}>{leaf}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div></div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 text-center">
          <button
            type="button"
            className="btn btn-light mx-2 fs-12 px-5"
          >
            Cancel
          </button>

          <button type="button" className="btn btn-success fs-12 px-5" >
            Next
          </button>

        </div>
      </div>
    </div>
  );
};

export default ImportChapter;
