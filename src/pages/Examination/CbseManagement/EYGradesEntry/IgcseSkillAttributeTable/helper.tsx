import { useLocation } from "react-router-dom";
import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import { SelectInput } from "../../../../../Components/Common";
import { set } from "date-fns";

const AttributeSelectField = ({
  row: { index, original },
  column,
  onChangeInputHndlr,
  rowDataInfo,
}: any) => {
  const attrId = column?.attrItem?.attributeId;
  const fieldKey = `attributeId${attrId}`;

  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`[${index}].${fieldKey}`}
        value={original?.[fieldKey] || ""}
        menuItems={rowDataInfo?.data || []}
        onChange={onChangeInputHndlr}
        valueKey="id"
        textKey="overAllGrades"
        isDisabled={!original?.isSelected}
        error={
          original?.touched?.[fieldKey] && original?.errors?.[fieldKey]
            ? original.errors[fieldKey]
            : ""
        }
        invalid={Boolean(
          original?.touched?.[fieldKey] && original?.errors?.[fieldKey]
        )}
      />
    </div>
  );
};

function generateDynamicColumns(selectedSkillAttributeColumns: any) {
  return Array.isArray(selectedSkillAttributeColumns) &&
    selectedSkillAttributeColumns.length > 0
    ? selectedSkillAttributeColumns.map((column: any) => ({
        Header: <div className="tw-capitalize">{column.attributeName}</div>,
        id: `attributeId${column.attributeId}`,
        disableSortBy: true,
        attrItem: column,
        Cell: AttributeSelectField,
      }))
    : [];
}

export function generateColumns(
  allStudentCheckHndlr: any,
  singleStudentCheckHndlr: any,
  allStudentSelectedState: any,
  isEy: boolean,
  isIgcse: boolean,
  selectedSkillAttributeColumns: any
) {
  return [
    {
      Header: () => (
        <InputCheckbox
          name={"all-student"}
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
      accessor: "id",
      columnClassName: "w-5 sticky-left z-index-1",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        const { isSelected } = original;
        const studentId = original?.studentId;
        return (
          <InputCheckbox
            name={`student-${studentId}`}
            value={isSelected}
            onChange={singleStudentCheckHndlr}
            dataId={studentId}
            formgroupClassName="mb-0"
          />
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName:
        "sticky-left-checkbox  min-w-300px w-300px max-w-300px z-index-1",
      Cell: ({ row: { original } }: any) => {
        const studentName = original?.studentName || "-";
        const studentCode = original?.studentCode || "-";
        return (
          <UserDetails
            displayName={studentName}
            displayId={studentCode}
            imageUrl={original?.studentImageBase64}
            size={"xs"}
            defaultImgType="student"
          />
        );
      },
    },

    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original?.rollNo || "-"}</span>;
      },
    },

    ...generateDynamicColumns(selectedSkillAttributeColumns),
  ];
}
