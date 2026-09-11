import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextArea, TextInput } from "../../../../../../Components/Common";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight03Icon, Delete02StrokeStandard, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { PassFailToggle } from "./Toggle";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";

const GradesDistrubition = ({ settingsFormik }) => {
    const dispatch = useAppDispatch();

    const formikArrayHelpers = useRef<any>(null);
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getGradeDistrubutionResp,
        getSettingsByAssessmentIdResp
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, lmsAssessment }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getGradeDistrubutionResp: lmsAssessment.getGradeDistrubutionResp,
            getSettingsByAssessmentIdResp: lmsAssessment.getSettingsByAssessmentIdResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (!getGradeDistrubutionResp?.length) {
            settingsFormik.setFieldValue("gradesSettingDTOs", []);
            return;
        }
        const mapped = getGradeDistrubutionResp.map((item: any) => ({
            id: item.id,
            grade: item.grade || "",
            fromMarks: item.fromPerc?.toString() || "",
            toMarks: item.toPerc?.toString() || "",
            remarks: item.remarks?.toString() ?? "",
            result: item.result === "PASS" ? "Pass" : "Fail",
        }));
        
        settingsFormik.setFieldValue("gradesSettingDTOs", mapped);
    }, [getGradeDistrubutionResp]);
    const addSlabHandler = () => {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                id: generateUniqueNumber(),
                grade: "",
                fromMarks: "",
                toMarks: "",
                remarks: "",
                result: "",
                isDeleted: false
            });
        }
    };
   
    const handleDelete = (index: number) => {
        const currentItem = settingsFormik.values.gradesSettingDTOs[index];
      
        const isFromAPI = getSettingsByAssessmentIdResp?.gradesSettingDTOs?.some(
            apiItem => apiItem.id === currentItem.id
        );

        if (isFromAPI) {
           
            settingsFormik.setFieldValue(`gradesSettingDTOs[${index}].isDeleted`, true);
        } else {
          
            formikArrayHelpers.current?.remove(index);
        }
    };

   
    const visibleItems = settingsFormik.values?.gradesSettingDTOs?.filter(item => !item.isDeleted) || [];

    return (
        <>
            <div className='px-0 pb-3'>
                <div className='row d-flex justify-content-center'>
                    <div className="px-4 mb-2">
                        <div className="row bg-light align-items-center py-3 px-2">
                            <div className="col-2 ps-5">
                                <h6 className="form-label required">Title</h6>
                            </div>
                            <div className="col-4">
                                <h6 className="form-label required">Between Marks</h6>
                            </div>
                            <div className="col-3">
                                <h6 className="form-label">Remarks</h6>
                            </div>
                            <div className="col-2">
                                <h6 className="form-label required">Pass/Fail</h6>
                            </div>
                            <div className="col-1 text-end">
                                {visibleItems.length < 6 && (
                                    <button
                                        onClick={addSlabHandler}
                                        type="button"
                                        className="btn btn-outline-primary btn-sm fs-14"
                                    >
                                        <HugeiconsIcon icon={PlusSignIcon} size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <FormikProvider value={settingsFormik}>
                        <FieldArray name="gradesSettingDTOs">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                const visibleItems = settingsFormik.values?.gradesSettingDTOs?.filter((item: any) => !item.isDeleted) || [];

                                return (
                                    <>
                                        {settingsFormik.values?.gradesSettingDTOs?.map((item: any, index: number) => {

                                            if (item.isDeleted) return null;
                                            const visibleIndex = visibleItems.findIndex((visibleItem: any) => visibleItem.id === item.id);
                                            const isEvenRow = visibleIndex % 2 === 0;
                                            const isLastRow = visibleIndex === visibleItems.length - 1;

                                            return (
                                                <div key={item.id} className="w-100 grades" style={{padding: "0px 12px"}}>


                                                <div  className="row w-100 align-items-center mb-0 py-3 mx-0"
                                                    style={{
                                                        backgroundColor: isEvenRow ? '#FFFFFF' : '#F9FAFB',
                                                        borderLeft: '1px solid #E5E7EB',
                                                        borderRight: '1px solid #E5E7EB',
                                                        borderBottom: '1px solid #E5E7EB',
                                                        borderRadius: isLastRow ? '0 0 8px 8px' : '0'
                                                    }}>
                                                    <div className="col-2 ps-5">
                                                        <TextInput
                                                            name={`gradesSettingDTOs[${index}].grade`}
                                                            value={item.grade}
                                                            onChange={settingsFormik.handleChange}
                                                            onBlur={settingsFormik.handleBlur}
                                                            formgroupClassName="mb-0"
                                                        />
                                                    </div>
                                                    <div className="col-4 d-flex align-items-center">
                                                        <TextInput
                                                            name={`gradesSettingDTOs[${index}].fromMarks`}
                                                            value={item.fromMarks}
                                                            onChange={settingsFormik.handleChange}
                                                            onBlur={settingsFormik.handleBlur}
                                                            formgroupClassName="mb-0 me-2"
                                                        />
                                                            <span className="text-muted fs-14 me-2">to</span>
                                                            <TextInput
                                                                name={`gradesSettingDTOs[${index}].toMarks`}
                                                                value={item.toMarks}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0"
                                                            />
                                                        </div>
                                                        <div className="col-3 px-1">
                                                            <TextArea
                                                                name={`gradesSettingDTOs[${index}].remarks`}
                                                                value={item.remarks}
                                                                onChange={settingsFormik.handleChange}
                                                                onBlur={settingsFormik.handleBlur}
                                                                formgroupClassName="mb-0 w-70"
                                                            />
                                                        </div>
                                                        <div className="col-2 px-1">
                                                            <PassFailToggle
                                                            value={item.result}
                                                            onChange={(val: any) =>
                                                                settingsFormik.setFieldValue(`gradesSettingDTOs[${index}].result`, val)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-1 px-1">
                                                        {visibleIndex !== 0 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(index)}
                                                                className="btn btn-sm btn-icon btn-rounded btn-hover-danger btn-light"
                                                            >
                                                                <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={12} />
                                                            </button>
                                                        ) : (
                                                            <span>&nbsp;</span> // Empty space for the first row to maintain alignment
                                                        )}
                                                    </div>
                                                </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>
                </div>
            </div>
        </>
    )
}

export default GradesDistrubition