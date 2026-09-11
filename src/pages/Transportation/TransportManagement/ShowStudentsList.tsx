import { shallowEqual } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer"
import { getStudentsBasedOnRouteAct } from "../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useEffect, useMemo } from "react";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateStudentsColumns } from "./helper";

const ShowStudentsList = ({ isOpen,routeId, academicYearId }: any) => {

    const dispatch = useAppDispatch();

    const {
        getStudentsBasedOnRouteResp,
        academicYearListResp,
    } = useAppSelector(
        ({transportrequest,instAcademics }) => ({
            getStudentsBasedOnRouteResp:transportrequest.getStudentsBasedOnRouteResp,
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    useEffect(() => {
      if(isOpen){
        getOccupiedStudentsList()
      }
    }, [isOpen])

    function paginationHndlr(paginationInfo: IPaginationState) {
        getOccupiedStudentsList(paginationInfo)
    }
    

    const getOccupiedStudentsList = (otherProps?:any)=>{

        // let { academicYearId } = academicYearListResp?.data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};

        dispatch(getStudentsBasedOnRouteAct(generateActionPayload("get_students_occupency_list", undefined, { academicYearId , routeId,pageNo : 0 , pageSize : 10,...otherProps})));
    }

    const roleColumns = useMemo(() => generateStudentsColumns(), [getStudentsBasedOnRouteResp]);

    const { totalElements,totalPages,pageble } = getStudentsBasedOnRouteResp || {}
     
    return (
        <div>
         
         
         <TableContainer
            columns={roleColumns || []}
            data={getStudentsBasedOnRouteResp?.data || []}
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageble?.pageNumber || 0}
        />
      
     
        </div >
    )
}

export default ShowStudentsList
