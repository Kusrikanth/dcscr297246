
import { SelectInput, TextInput } from '../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { Current_Date, getDateAfterCurrentDay } from '../../../../utility/dateutility';
import { nanoid } from 'nanoid';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBookIssuanceUserTypeListAct } from '../../../../store/library/bookissuance/bookissuanceaction';

const Issuances = (props: any) => {

    const { bookIssuancesForm , setStudentListState  } = props || {};

    const dispatch = useAppDispatch();

    const userList = (otherProps?: any) => {
        let payload = {
            branchId,
            recordTypeId: bookIssuancesForm.values.recordTypeId,
            ...otherProps,
        };
        dispatch(getBookIssuanceUserTypeListAct(generateActionPayload("get_book_issuance_user_list", undefined, payload)));
    };

    const {
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        libraryDetailsRequestListResp,
        libraryRecordRequestListResp,
        getBookIssuanceUserTypeListResp,
    } = useAppSelector(
        ({ instAcademics, appData, librarysettings,libraryBookIssuance }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
            libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
            getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
        }),
        shallowEqual
    );

    const changeHndler = (event: any) => {
        const { name, value } = event.target;
        if (name === "recordTypeId") {
            userList({ [name]: value });
            setStudentListState([])
            bookIssuancesForm.setValues((prev:any)=>({...prev , [name] : value , userType : ""}))
        }else{
            const data = getBookIssuanceUserTypeListResp?.find((item: any) => item.userType === value)
            setStudentListState([{
                matchId : nanoid() , isSelected: true, bookName: "", authorName: "", publisherName: "", issuanceDate: Current_Date, returnDate: getDateAfterCurrentDay(+data?.maximumDays)
            }])
            bookIssuancesForm.setFieldValue(name, value);
        }
    }
    
    return (
        <>
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-3">
                <div>
                    <TextInput
                        name="academicYearName"
                        labelText="Academic Year"
                        value={bookIssuancesForm.values.academicYearName}
                        onChange={undefined}
                        isDisabled={true}
                        formgroupClassName="tw-mb-3"
                    />
                </div>
                <div>
                    <SelectInput
                        name="recordTypeId"
                        labelText="Record Type"
                        labelClass='required'
                        value={bookIssuancesForm.values.recordTypeId}
                        onChange={changeHndler}
                        menuItems={(Array.isArray(libraryRecordRequestListResp?.content) && libraryRecordRequestListResp?.content) || []}
                        valueKey="id"
                        textKey="recordType"
                        formgroupClassName="tw-mb-3"
                        invalid={bookIssuancesForm.touched.recordTypeId && bookIssuancesForm.errors.recordTypeId ? true : false}
                        error={bookIssuancesForm.touched.recordTypeId && bookIssuancesForm.errors.recordTypeId ? bookIssuancesForm.errors.recordTypeId : ""}
                    />
                </div>
                <div>
                    <SelectInput
                        name="libraryId"
                        labelText="Library Name"
                        labelClass='required'
                        value={bookIssuancesForm.values.libraryId}
                        onChange={bookIssuancesForm.handleChange}
                        menuItems={(Array.isArray(libraryDetailsRequestListResp?.content) && libraryDetailsRequestListResp?.content) || []}
                        valueKey="id"
                        textKey="libraryName"
                        formgroupClassName="tw-mb-3"
                        invalid={bookIssuancesForm.touched.libraryId && bookIssuancesForm.errors.libraryId ? true : false}
                        error={bookIssuancesForm.touched.libraryId && bookIssuancesForm.errors.libraryId ? bookIssuancesForm.errors.libraryId : ""}
                    />
                </div>
                <div>
                    <SelectInput
                        name="userType"
                        labelText="User Type"
                        value={bookIssuancesForm.values.userType}
                        onChange={changeHndler}
                        menuItems={getBookIssuanceUserTypeListResp || []}
                        labelClass='required'
                        valueKey="userType"
                        textKey="userType"
                        formgroupClassName="tw-mb-3"
                        invalid={bookIssuancesForm.touched.userType && bookIssuancesForm.errors.userType ? true : false}
                        error={bookIssuancesForm.touched.userType && bookIssuancesForm.errors.userType ? bookIssuancesForm.errors.userType : ""}
                    />
                </div>
            </div>
        </>
    )
}

export default Issuances