import { useCallback, useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

const ViewQuestions = (props: any) => {
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

  // Normalize API response when it comes in
  useEffect(() => {
    if (props.getAssessmentQuestionsByIdResp && Array.isArray(props.getAssessmentQuestionsByIdResp)) {
      const mappedData = props.getAssessmentQuestionsByIdResp.map((q: any) => {
        let parsedDescription = q.questionDescription;
        try {
          const parsedJSON = JSON.parse(q.questionDescription);
          if (parsedJSON?.content?.[0]?.content?.[0]?.text) {
            parsedDescription = parsedJSON.content[0].content[0].text;
          }
        } catch {
          // leave as-is if not valid JSON
        }

        return {
          id: q.questionId,
          questionTitle: q.questionTitle,
          description: parsedDescription,
          marks: q.marks,
          questionOrder: q.questionOrder,
          questionTypeName: q.questionTypeName,
          difficultyLevelName: q.difficultyLevelName,
          duration: q.duration,
          isSelectedStudent: false,
          errors: {}
        };
      });
      props.setSelectedStudentData(mappedData);
    }
  }, [props.getAssessmentQuestionsByIdResp]);

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    const updateState = props.selectedStudentData.map((item: any) => ({
      ...item,
      isSelectedStudent: checked,
      ...(checked ? {} : { errors: {} })
    }));
    props.setSelectedStudentData(updateState);
  }, [props.selectedStudentData]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    const studentIdNumber = event.currentTarget.getAttribute("data-id");
    const updatedState = props.selectedStudentData.map((item: any) =>
      +item.id === Number(studentIdNumber)
        ? { ...item, isSelectedStudent: checked, ...(checked ? {} : { errors: {} }) }
        : item
    );
    props.setSelectedStudentData(updatedState);
    setAllStudentSelectedState(updatedState.every((item: any) => item.isSelectedStudent));
  }, [props.selectedStudentData]);

  const onChangeTableHndlr = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");
    const indexMatch = indexKey.match(/\[(.*?)\]/);
    const index = indexMatch ? Number(indexMatch[1]) : -1;

    if (index >= 0) {
      const updatedState = [...props.selectedStudentData];
      updatedState[index] = {
        ...updatedState[index],
        [nameKey]: value
      };
      props.setSelectedStudentData(updatedState);
    }
  };

  const columns = useMemo(
    () => generateColumns(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr),
    [props.selectedStudentData, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr]
  );

  const totalMarks = useMemo(
    () => props.selectedStudentData.reduce((sum, q) => sum + (Number(q.marks) || 0), 0),
    [props.selectedStudentData]
  );

  return (
    <>
      <div className="row mb-2">
        <div className="col-auto ms-auto d-flex">
          <h4 className="text-muted mb-0 fs-12 me-2">
            Total Questions: {props.selectedStudentData.length.toString().padStart(2, "0")},
          </h4>
          <h4 className="text-muted mb-0 fs-12">
            Total Marks : {totalMarks.toString().padStart(2, "0")}
          </h4>
        </div>
      </div>
      <TableContainer
        columns={columns}
        data={props.selectedStudentData}
        showPagination={false}
        tableClass="mb-0"
        divClass="table-responsive mb-3 fs-12"
        theadClass="table-light text-muted align-middle fs-12"
        manualSorting={false}
        onChangeInputHndlr={onChangeTableHndlr}
      />
    </>
  );
};

export default ViewQuestions;
