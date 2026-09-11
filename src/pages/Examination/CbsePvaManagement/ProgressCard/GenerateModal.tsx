import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { filterOptions, generationType } from "./helper";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { RadioInputContainer, SelectInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";

interface TermOption {
    termId: string | number;
    termName: string;
}

const initialValues = {
    generationType: "term",
    displayType: "",
    termId: "",
    examinationId: "",
};

const GenerateModal = ({ previewProgressCardsForCbse, isSingleStu, id }: any) => {

    const [termOptions, setTermOptions] = useState<TermOption[]>([]);
    const [systemFileId, setSystemFileId] = useState<string | undefined>(undefined);
    const location = useLocation();
    const isIGCSEManagement = location.pathname === '/igcse-management';
    const filteredGenerationTypes = isIGCSEManagement
        ? generationType.filter(item => item.id !== 'exam')
        : generationType;

    useEffect(() => {
        if (id) {
            setSystemFileId(id);
        }
    }, [id]);

    const {
        getIgseTermNameListResp,
        getCbseExaminationRequestListResp,
        getFilterListForCbseResp,
        showApiLoader
    } = useAppSelector(
        ({ examinationSettings, globalData, examinationManagement }) => ({
            showApiLoader: globalData.showApiLoader,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
            getFilterListForCbseResp: examinationManagement.getFilterListForCbseResp,
        }),
        shallowEqual
    );

    const generateProgressCardFormik = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    useEffect(() => {
        const updatedOptions: TermOption[] = [
            // { termId: "BOTH", termName: "Both" },
            ...(Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : [])
        ];
        setTermOptions(updatedOptions);
    }, [getIgseTermNameListResp]);

    const { isBothMarksGrades, isOnlyGrades, isOnlyMarks } = getFilterListForCbseResp || {}

    const menuOptions = useMemo(() => {
        return filterOptions.map((option) => {
            const isExam = generateProgressCardFormik.values.generationType === "exam"
            if (isExam) {
                if (option.id === "ONLY_MARKS") return { ...option, itemDisabled: true }
                if (option.id === "ONLY_GRADES") return { ...option, itemDisabled: true }
                if (option.id === "BOTH_MARKS_GRADES") return { ...option, itemDisabled: false }
            } else {
                if (option.id === "ONLY_MARKS" && isOnlyMarks) return { ...option, itemDisabled: false }
                if (option.id === "ONLY_GRADES" && isOnlyGrades) return { ...option, itemDisabled: false }
                if (option.id === "BOTH_MARKS_GRADES" && isBothMarksGrades) return { ...option, itemDisabled: false }
            }
            return { ...option, itemDisabled: true }
        })
    }, [getFilterListForCbseResp, generateProgressCardFormik.values.generationType])

    const filterHndler = (event : React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value } = event.target;
        generateProgressCardFormik.setValues(prevState => ({ ...prevState, [name]: value,displayType : "",examinationId:"",termId:""}));
    }

    return (
        <>
            <div className="row px-4 mt-2 g-3">
                <div className="col-xs-12 col-md-6">
                    <SelectInput
                        name="generationType"
                        value={generateProgressCardFormik.values.generationType}
                        onChange={filterHndler}
                        menuItems={filteredGenerationTypes}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="mb-3 mb-xl-0"
                        labelText='Generation Type'
                        floatingLabel
                    />
                </div>
                {generateProgressCardFormik.values.generationType === "term" && (
                    <div className="col-xs-12 col-md-6">
                        <SelectInput
                            name="termId"
                            value={generateProgressCardFormik.values.termId}
                            onChange={generateProgressCardFormik.handleChange}
                            menuItems={termOptions}
                            valueKey="termId"
                            textKey="termName"
                            formgroupClassName="mb-3 mb-xl-0"
                            labelText='Term Name'
                            floatingLabel
                        />
                    </div>
                )}
                {generateProgressCardFormik.values.generationType === "exam" && (
                    <div className="col-xs-12 col-md-6">
                        <SelectInput
                            name="examinationId"
                            value={generateProgressCardFormik.values.examinationId}
                            onChange={generateProgressCardFormik.handleChange}
                            menuItems={(Array.isArray(getCbseExaminationRequestListResp?.data) && getCbseExaminationRequestListResp?.data) || []}
                            valueKey="id"
                            textKey="examinationName"
                            formgroupClassName="mb-3 mb-xl-0"
                            labelText='Examination Name'
                            floatingLabel
                            invalid={(generateProgressCardFormik.touched.examinationId && generateProgressCardFormik.errors.examinationId) ? true : false}
                            error={(generateProgressCardFormik.touched.examinationId && generateProgressCardFormik.errors.examinationId) ? generateProgressCardFormik.errors.examinationId : ""}
                        />
                    </div>
                )}
                {/* <div className="col-xs-12 col-md-6">
                    <RadioInputContainer
                        name="displayType"
                        labelText="Display :"
                        inputContainerClassName="mt-2"
                        radioOptions={menuOptions}
                        value={generateProgressCardFormik.values.displayType}
                        onChange={generateProgressCardFormik.handleChange}
                    />
                </div> */}
            </div>
            <div className="row w-100 d-flex justify-content-center">
                <div className="d-flex gap-2 w-auto justify-content-center mx-4 my-3">
                    <button
                        disabled={showApiLoader}
                        className="btn btn-info me-2"
                        onClick={() => previewProgressCardsForCbse("PREVIEW", generateProgressCardFormik.values, systemFileId, isSingleStu)}
                    >
                        View
                    </button>
                    <button
                        disabled={showApiLoader}
                        className="btn btn-success"
                        onClick={() => previewProgressCardsForCbse("DOWNLOAD", generateProgressCardFormik.values, systemFileId, isSingleStu)}
                    >
                        Download
                    </button>
                </div>
            </div>
        </>
    );
};

export default GenerateModal;
