import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { generationType } from "./helper";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SelectInput } from "../../../../../Components/Common";
import { useAppSelector } from "../../../../../hooks/storehook";

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
        showApiLoader
    } = useAppSelector(
        ({ examinationSettings, globalData }) => ({
            showApiLoader: globalData.showApiLoader,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
        }),
        shallowEqual
    );

    const generateProgressCardFormik = useFormik({
        initialValues,
        onSubmit: () => { },
    });

    useEffect(() => {
        const updatedOptions: TermOption[] = [
            ...(Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp.data : [])
        ];
        setTermOptions(updatedOptions);
    }, [getIgseTermNameListResp]);

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
