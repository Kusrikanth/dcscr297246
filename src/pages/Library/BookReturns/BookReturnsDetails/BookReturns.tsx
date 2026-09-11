import React from 'react'
import { SelectInput, TextInput } from '../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getLibraryDetailsListAct } from '../../../../store/library/settings/librarysettingsaction';

const BookReturns = (props: any) => {

    const { filterState, setFilterState,bookReturnForm , setStudentListState, setSearchStudentState  } = props || {};
    const dispatch = useAppDispatch();

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        libraryDetailsRequestListResp,
        getBookIssuanceUserTypeListResp,
    }: any = useAppSelector(
        ({ instAcademics, appData, librarysettings,libraryBookIssuance }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
            getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
        }),
        shallowEqual
    );

    const changeHndler = (event: any) => {
        const { name, value } = event.target;
        const data = getBookIssuanceUserTypeListResp?.find((item: any) => item.userType === value)
      
            setStudentListState([])
    
        setSearchStudentState(null)
        bookReturnForm.setValues((prev: any) => ({ ...prev, [name]: value , userTypeId : data?.id || "", studentId: "",classId: "",className: "",sectionId: "",sectionName: "",fineAmtPerDay: data?.fineAmountPerDay || 1 ,empCategoryId:""  }));
       
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        bookReturnForm.setFieldValue(name, value);
        if (name === "academicYearId") {
            setFilterState((prevState: any) => ({
                ...prevState,
                academicYearId: value,
            }));
            if (value) {
                const payload1 = { academicYearId: value, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
                const payload2 = { branchId, academicYearId: value, sortBy: "createdAt", orderBy: "asc", pageNo: 0, pageSize: 100, };
                dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload2)));
            }
        }
    };    

    return (
        <>
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-3">
                <div>
                    <SelectInput
                        name="academicYearId"
                        labelText="Academic Year"
                        value={bookReturnForm.values.academicYearId}
                        onChange={handleChange}
                        menuItems={academicYearListResp?.data}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelClass="required"
                        invalid={(bookReturnForm.touched.academicYearId && bookReturnForm.errors.academicYearId) ? true : false}
                        error={(bookReturnForm.touched.academicYearId && bookReturnForm.errors.academicYearId) ? bookReturnForm.errors.academicYearId : ""}
                    />
                </div>
                <div>
                    <SelectInput
                        name="libraryId"
                        labelText="Library Name"
                        labelClass='required'
                        value={bookReturnForm.values.libraryId}
                        onChange={handleChange}
                        menuItems={(Array.isArray(libraryDetailsRequestListResp?.content) && libraryDetailsRequestListResp?.content) || []}
                        valueKey="id"
                        textKey="libraryName"
                        formgroupClassName="tw-mb-0"
                        invalid={bookReturnForm.touched.libraryId && bookReturnForm.errors.libraryId ? true : false}
                        error={bookReturnForm.touched.libraryId && bookReturnForm.errors.libraryId ? bookReturnForm.errors.libraryId : ""}
                    />
                </div>
                <div>
                    <SelectInput
                        name="userType"
                        labelText="User Type"
                        value={bookReturnForm.values.userType}
                        onChange={changeHndler}
                        menuItems={getBookIssuanceUserTypeListResp || []}
                        labelClass='required'
                        valueKey="userType"
                        textKey="userType"
                        formgroupClassName="tw-mb-0"
                        invalid={bookReturnForm.touched.userType && bookReturnForm.errors.userType ? true : false}
                        error={bookReturnForm.touched.userType && bookReturnForm.errors.userType ? bookReturnForm.errors.userType : ""}
                    />
                </div>
            </div>
        </>
    )
}

export default BookReturns