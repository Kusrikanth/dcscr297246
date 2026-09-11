import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import logoSm from "../assets/imagesdps/logo-sm.png";
import logoLight from "../assets/imagesdps/logo-md.png";
import DefaultStudentImage from "../assets/imagesdps/student-default-img.png";
//Import Components
import VerticalLayout from "./VerticalLayouts";

//Common Component
import { ModalContainerUpdated, SelectInput } from "../Components/Common";


import { default as ExpandIcon } from "../assets/imagesdps/menuicon/parent-icon/expand-up-down-line.svg?react";

import store from '../store';
//redux
import { shallowEqual } from "react-redux";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../utility/reduxutility";
import { getInstituteListAct } from "../store/mastersettings/instituteinfo/instituteinfoactions";
import { cleanAppDataStateAct, setCurrentBranchIdAct, setCurrentInstIdAct, setCurrentStudentIdAct } from "../store/appdata/appdataslice";
import { toast } from "react-toastify";
import { getParentChildrensAct } from "../store/directory/studentmanagement/studentmanagementactions";
import SelectChildModal from "./SelectChildModal";
import ChangePassword from "./ChangePassword";
import { getUserMeAct, logoutUserAct, setLogoutUserAct } from "../store/login/loginaction";
import { getDisplayDateForTableFormat } from "../utility/dateutility";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../utility/storageUtility";
import { accessSessionKey, accessTokenKey, instituteIdKey } from "../Components/constants/storageconstants";
import { getConcernDeptByHeadAct } from "../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { getInstHeaderBranchesAct } from "../store/mastersettings/branch/branchactions";
import { getHostelStudentAvailabilityAct } from "../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";

const Sidebar = ({ layoutType }) => {
  const [selectedChildState, setSelectedChildState] = useState("");
  const [showSelectChildModalState, setShowSelectChildModalState] = useState(false);
  const [showChangePasswordState, setShowChangePasswordState] = useState({
    showModal: false,
    userIds: undefined
  });
  const [hiddenSubmoduleState, setHiddenSubmoduleState] = useState([]);
  const dispatch = useAppDispatch();
  const { userMeResp, loginUserResp, academicYearListResp, currentInstIdResp: instituteId,
    currentInstCodeResp: instituteCode,
    concernDeptByHeadResp, loggedInUserRole,
    headerCurriculumResp,
    currentBranchIdResp: branchId, userDetails, parentChildrensResp, instituteListResp } =
    useAppSelector(({ login, masterData, instAcademics, appData, concernsFeedback, directoryStudent, instituteInfo, Profile }) => ({
      userDetails: Profile.userDetails,
      loginUserResp: login.loginUserResp,
      userMeResp: login.userMeResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentInstCodeResp: appData.currentInstCodeResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      concernDeptByHeadResp: concernsFeedback.concernDeptByHeadResp,
      headerCurriculumResp: masterData.headerCurriculumResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      instituteListResp: instituteInfo.instituteListResp,
      academicYearListResp: instAcademics.academicYearListResp,
    }), shallowEqual);
  const prevCurrentInstState = useRef(undefined);
  const currentAcademicYearIdRef = useRef(undefined);
  const { role = "INSTITUTE_ADMIN" } = userDetails || {},
    { data: instituteList } = instituteListResp || {};

  const sidebarRef = useRef({
    prevParentChildrensResp: undefined,
    prevConcernDeptByHeadResp: concernDeptByHeadResp,
  });

  const currentAcademicYearId = useMemo(() => (
    academicYearListResp?.data?.find(item => item.yearStatus === "CURRENT")?.academicYearId
  ), [academicYearListResp]);

  useEffect(() => {
    const { prevConcernDeptByHeadResp, prevParentChildrensResp } = sidebarRef.current;
    if (parentChildrensResp && prevParentChildrensResp !== parentChildrensResp) {
      if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
        const allNotReporting = parentChildrensResp.every(item => item.notReportingStatus === "YES");
        if (allNotReporting) {
          const { fromDate, admissionEmailId } = parentChildrensResp[0] || {};
          toast.error(`Student has been marked not reporting since ${getDisplayDateForTableFormat(fromDate) || '-'}. 
          Please connect to admission team ${admissionEmailId || '-'}.`);
          setTimeout(() => {
            dispatch(logoutUserAct(generateActionPayload("logout_user", { sessionId: getLocalStorage(accessSessionKey) })));
            setTimeout(() => {
              dispatch(cleanAppDataStateAct({}));
              removeLocalStorage(accessTokenKey);
              removeLocalStorage(instituteIdKey);
              removeLocalStorage(accessSessionKey);
              store.dispatch({ type: "RESET_STATE" });
              dispatch(setLogoutUserAct(undefined));
            }, 100);
          }, 5000);

        } else {
          const selectedChild = parentChildrensResp.find(item => item.notReportingStatus !== "YES");
          setSelectedChildState(selectedChild);
          dispatch(getHostelStudentAvailabilityAct(generateActionPayload("get_hostel_student_availability", {
            studentId: selectedChild?.childId
          }, { academicYearId: selectedChild?.academicYearId })));
          dispatch(setCurrentStudentIdAct(selectedChild?.childId));
        }

      } else {
        toast.error("No child record found. Please contact administrator.");
      }
    } else if (concernDeptByHeadResp && prevConcernDeptByHeadResp !== concernDeptByHeadResp) {
      if (loggedInUserRole !== "BRANCH_ADMIN" && loggedInUserRole !== "INSTITUTE_ADMIN" && loggedInUserRole !== "PARENT") {
        if (Array.isArray(concernDeptByHeadResp) && concernDeptByHeadResp.length === 0) {
          setHiddenSubmoduleState(prevState => ([...prevState, 'concerns-feedback']));
        }
      }
    }
    sidebarRef.current.prevParentChildrensResp = parentChildrensResp;
    sidebarRef.current.prevConcernDeptByHeadResp = concernDeptByHeadResp;
  }, [userMeResp, instituteId, concernDeptByHeadResp, loggedInUserRole, parentChildrensResp]);

  useEffect(() => {
    const parentCode = userMeResp?.userInfo?.loginId;
    const { userInfo } = userMeResp || {},
      { roles } = userInfo || {},
      hasParentRole = Array.isArray(roles) && roles.some(item => item?.description === "PARENT");
    if (!hasParentRole || !currentAcademicYearId || currentAcademicYearIdRef.current === currentAcademicYearId) return;
    currentAcademicYearIdRef.current = currentAcademicYearId;
    dispatch(getParentChildrensAct(generateActionPayload("get_parent_childrens", undefined, {
      parentCode,
      instituteId,
      academicYearId: currentAcademicYearId
    })));
  }, [userMeResp, instituteId, currentAcademicYearId, dispatch]);

  useEffect(() => {
    const { data } = headerCurriculumResp || {};
    if (Array.isArray(data) && loggedInUserRole !== 'EY_PA') {
      const examinationSettings = ['IGCSE', 'CBSE'];
      const existingBranchCurriculum = data.map(i => i.shortName);
      const missingCurriculum = examinationSettings.filter(item =>
        !existingBranchCurriculum.includes(item)
      );
      const curriculumKeys = ['igse-examination', 'cbse-examination', 'early-years-examination'];

      if (missingCurriculum.length) {
        const menuKeys = missingCurriculum.map(item => {
          if (item === 'IGCSE') {
            return 'igse-examination';
          } else if (item === 'CBSE') {
            return 'cbse-examination'
          } else if (item === 'EY1-EY3') {
            return 'early-years-examination'
          } else {
            return ''
          }
        })

        setHiddenSubmoduleState(prevState => ([
          ...prevState.filter(item => !curriculumKeys.includes(item)), // remove old curriculum keys
          ...menuKeys // add new ones
        ]));
      } else {
        setHiddenSubmoduleState(prevState => ([
          ...prevState.filter(item => !curriculumKeys.includes(item)), // remove old curriculum keys
        ]));
      }
    }
  }, [headerCurriculumResp]);


  useEffect(() => {
    if (role === "PARENT" && userMeResp) {
      const { isPasswordChange } = userMeResp;
      if (!isPasswordChange && typeof isPasswordChange === "boolean") {
        setShowChangePasswordState(prevState => ({ ...prevState, showModal: true, userIds: [userMeResp?.id] }))
      }
    }
  }, [role, userMeResp]);

  useEffect(() => {
    if (userMeResp) {
      const { id: userId } = userMeResp;
      if (userId) {
        dispatch(getConcernDeptByHeadAct(generateActionPayload("get_concern_dept_head", { userId })));
      }
    }
  }, [branchId, userMeResp, dispatch]);

  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  useEffect(() => {
    if (userDetails?.role !== "SUPER_ADMIN") {
      const params = {
        instituteGroupId: "1", pageNo: 0, pageSize: 10,
        // approvalStatus: "APPROVED"
      };
      dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params, { hideLoader: true })));
    }
  }, [userDetails, dispatch]);

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };

  useEffect(() => {
    if (instituteId && prevCurrentInstState.current?.toString() !== instituteId?.toString()) {
      const payload = { pageSize: 100, pageNo: 0, instituteId: instituteId };
      dispatch(getInstHeaderBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true })));
    }
    prevCurrentInstState.current = instituteId;
  }, [instituteId]);

  function onChangeInstHndlr(event) {
    const { name, value } = event.target;
    setLocalStorage(instituteIdKey, value);
    dispatch(setCurrentInstIdAct(value));
    dispatch(setCurrentBranchIdAct(undefined));
    dispatch(getUserMeAct(generateActionPayload("get_user_me_v2", undefined, undefined, {
      headers: {
        ...(value ? { 'X-Institute-ID': value } : {})
      },
    })));
  }


  function showSelectChildModalHndlr() {
    setShowSelectChildModalState(true);
  }

  function updateChildHandler(childId) {
    if (childId !== selectedChildState?.childId) {
      const childInfo = parentChildrensResp.find((item) => item.childId?.toString() === childId);
      setSelectedChildState(childInfo);
      dispatch(getHostelStudentAvailabilityAct(generateActionPayload("get_hostel_student_availability", {
        studentId: childInfo?.childId
      }, { academicYearId: childInfo?.academicYearId })));
      dispatch(setCurrentStudentIdAct(childId));
    }
    setShowSelectChildModalState(false);
  }

  const toggleChangePwdHandler = useCallback((apiCall) => {
    if (typeof apiCall === "boolean" && apiCall) {
      dispatch(getUserMeAct(generateActionPayload("get_user_me")));
    }
    setShowChangePasswordState(prevState => ({ ...prevState, showModal: false, userIds: undefined }));
    // setChangePwdModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
  }, []);

  const loggedInUserInst = useMemo(() => {
    if (!Array.isArray(instituteList) || !instituteList.length) return [];
    const { access } = loginUserResp || {};
    if (!Array.isArray(access) || !access.length) return [];
    const allowedInstIds = new Set(
      access.map(item => item.instituteId?.toString()).filter(Boolean)
    );

    if (!allowedInstIds.size) return [];

    return instituteList.filter(item =>
      allowedInstIds.has(item?.id?.toString())
    );
  }, [instituteList, loginUserResp]);

  const instituteDetails = instituteList?.find(item => item.id === +instituteId);
  const childImgUrl = selectedChildState?.childImageURL ? `data:image/jpeg;base64, ${selectedChildState?.childImageURL}` : null;
  const { hasSuperAdminAccess } = loginUserResp || {};

  const getSimpleBarHeight = useMemo(() => {
    let totalOffset = 78; // Base navbar-brand-box height (including margin-bottom)

    // Add institute dropdown height if visible
    if (loggedInUserInst.length > 1) {
      totalOffset += 50; // Institute selector height
    }

    // Add child selector height if visible
    if (role === "PARENT" && parentChildrensResp && selectedChildState) {
      totalOffset += 80; // Child selector component height
    }

    return `calc(100% - ${totalOffset}px)`;
  }, [loggedInUserInst.length, role, parentChildrensResp, selectedChildState]);

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box mb-2">
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              {hasSuperAdminAccess ? <img src={logoSm} alt="logo" className="mt-2" style={{ width: '100%' }} /> :
                <img src={instituteDetails?.logoUrl1} alt="logo" style={{ maxWidth: '100%' }} />}
            </span>
            <span className="logo-lg">
              {hasSuperAdminAccess ? <img src={logoLight} alt="logo" className="mt-2" style={{ width: '100%' }} /> :
                <img src={instituteDetails?.logoUrl1} alt="" style={{ maxWidth: '100%' }} />}
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
          {loggedInUserInst.length > 1 &&
            <SelectInput
              name="institute"
              value={instituteId}
              onChange={onChangeInstHndlr}
              menuItems={loggedInUserInst}
              valueKey="id"
              textKey="instituteName"
              inputClassName="mt-2 institute-selector"
              hideSelectOption={true}
            />}
        </div>
        {parentChildrensResp && <>{(selectedChildState ? (<div onClick={showSelectChildModalHndlr} className="selected-child">
          <img alt="child-default" className="child-img shrink-0" src={childImgUrl || DefaultStudentImage} />
          <div className="d-flex flex-column flex-grow-1 overflow-hidden ms-1 me-1">
            <h6 title={selectedChildState?.childName} className="mb-0 text-white fw-normal text-nowrap text-truncate">{selectedChildState?.childName}</h6>
            <p className="m-0 text-muted">{selectedChildState?.childCode}</p>
          </div>
          <div className="shrink-0">
            <ExpandIcon className="expand-icon" />
          </div>
        </div>) : (<div className="selected-child">No child details found.</div>))}</>}
        <SimpleBar color="red" id="scrollbar" autoHide={false} style={{ height: getSimpleBarHeight }}>
          <div className="container-fluid">
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayout layoutType={layoutType}
                hiddenSubmodulesIds={hiddenSubmoduleState}
                instituteId={instituteId}
                instituteCode={instituteCode}
              />
            </ul>
          </div>
        </SimpleBar>
        <div className="sidebar-background"></div>
      </div>
      <div className="vertical-overlay"></div>
      <ModalContainerUpdated
        isOpen={showSelectChildModalState}
        modalTitle="Select Child"
        toggle={() => { setShowSelectChildModalState(false) }}
        modalSize="md"

      >
        <SelectChildModal
          toggleModal={() => { setShowSelectChildModalState(false) }}
          childList={parentChildrensResp}
          selectedChildId={selectedChildState?.childId}
          updateChildHandler={updateChildHandler}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="changepassword-modal"
        isOpen={showChangePasswordState.showModal}
        modalTitle="Change Password"
        toggle={null}
        modalSize="md"
      >
        <ChangePassword
          isMandatory={true}
          toggle={toggleChangePwdHandler}
          userIds={showChangePasswordState.userIds}
        />
      </ModalContainerUpdated>
    </React.Fragment>
  );
};

export default Sidebar;
