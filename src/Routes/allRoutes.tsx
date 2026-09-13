import React from "react";
//Public Routes
const Login = React.lazy(() => import("../pages/Login"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword"));
const ValidateOtp = React.lazy(() => import("../pages/ValidateOtp"));
const Terms = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/ApplicationSaleOnline/TermsAndCondition"));
const ApplicationSaleParent = React.lazy(() => import("../pages/ApplicationSaleParent"));
const ApplicationTracking = React.lazy(() => import("../pages/ApplicationTracking"));
const TCTracking = React.lazy(() => import("../pages/TcTracking"));
const ApplicationSaleOnline = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/ApplicationSaleOnline"));
const PaymentStatus = React.lazy(() => import("../pages/ThankYouPage/PaymentStatus"));

const PallaviApplicationSaleOnline = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/PallaviApplicationSaleOnline"));
const RegistrationNote = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/RegistrationNote"));

const ApplicationSaleOnlineV2 = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/ApplicationSaleOnlineV2"))
const ApplicationSaleLogin = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/ApplicationSaleOnlineV2/ApplicationSaleLogin"));

//Authentication Routes
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const BranchSummaryDashboard = React.lazy(() => import("../pages/DashBoardBranchSummary"));

const InstituteDashboard = React.lazy(() => import("../pages/UpdatedDashboard"));

const BranchAdminDashboard = React.lazy(() => import("../pages/BranchSettings/BranchAdminDashboard"));

const ParentDashboard = React.lazy(() => import("../pages/BranchSettings/ParentDashboard"));
const ParentUploadDocuments = React.lazy(() => import("../pages/ParentDetails/ParentUploadDocuments"));

const NewAcademics = React.lazy(() => import("../pages/NewAcademics"));
const AcademaicSectionDetails = React.lazy(
  () => import("../pages/NewAcademics/AcademaicSectionDetails")
);
const AssignGroup = React.lazy(
  () => import("../pages/NewAcademics/AssignGroup")
);
const GenerateRollNumbers = React.lazy(
  () => import("../pages/NewAcademics/GenerateRollNumbers")
);

// const LanguagesCopm = React.lazy(
//   () => import("../pages/NewAcademics/LanguagesCopm")
// );
const ClassSubjects = React.lazy(
  () => import("../pages/NewAcademics/ClassSubject")
);
const ManageLanguages = React.lazy(
  () => import("../pages/NewAcademics/ManageLanguages")
);
const StudentSubjectAllocation = React.lazy(() => import("../pages/NewAcademics/StudentSubjectAllocation"));

const SubjectTeachers = React.lazy(
  () => import("../pages/NewAcademics/SubjectTeachers")
);
const StudentSubject = React.lazy(
  () => import("../pages/NewAcademics/StudentSubject")
);
const TransferCertificate = React.lazy(
  () => import("../pages/NewAcademics/TransferCertificate")
);
const BonafideCertificate = React.lazy(
  () => import("../pages/NewAcademics/BonafideCertificate")
);
const HigherClassEligibility = React.lazy(
  () => import("../pages/NewAcademics/HigherClassEligibility")
);
const TimeTable = React.lazy(() => import("../pages/TimeTableManagement"));
const PreviewTimeTable = React.lazy(() => import("../pages/TimeTableManagement/PreviewTimeTable"))
const CreateTimeTable = React.lazy(() => import("../pages/TimeTableManagement/CreateTimeTable"));
const TimeTableSettings = React.lazy(() => import("../pages/TimeTableManagement/TimeTableSettings"));
const TimeTableSettingsClassRoom = React.lazy(() => import("../pages/TimeTableManagement/TimeTableSettings/ClassRooms"));
const TimeTableSettingsPeriodCategory = React.lazy(() => import("../pages/TimeTableManagement/TimeTableSettings/PeriodCategeroy"));
const TimeTableSettingsTimeTableBreaksType = React.lazy(() => import("../pages/TimeTableManagement/TimeTableSettings/BreaksType"));
const TimeTableSettingsTimeTableBreaks = React.lazy(() => import("../pages/TimeTableManagement/TimeTableSettings/Breaks"));
const HealthFormVerification = React.lazy(
  () => import("../pages/NewAcademics/HealthFormVerification")
);
const PromoteStudents = React.lazy(
  () => import("../pages/NewAcademics/PromoteStudents")
);
const DetentionsPromotions = React.lazy(
  () => import("../pages/NewAcademics/DetentionsPromotions")
);
const ChangeStream = React.lazy(
  () => import("../pages/NewAcademics/ChangeStream")
);
const ChangeCampus = React.lazy(
  () => import("../pages/NewAcademics/ChangeCampus")
);

const ChangeCurriculum = React.lazy(
  () => import("../pages/NewAcademics/ChangeCurriculum")
);

const CampusTransferRequests = React.lazy(
  () => import("../pages/NewAcademics/CampusTransferRequests")
);

const AlmanacUploaded = React.lazy(() => import("../pages/NewAcademics/AlmanacUploaded"));
const UploadDocuments = React.lazy(() => import("../pages/NewAcademics/UploadDocuments"));
const TypeofWork = React.lazy(() => import("../pages/NewAcademics/TypeofWork"));

// Fee component
const FeeDashBoard = React.lazy(
  () => import("../pages/FreeModules/FeeDashBoard")
);
const FeeSummary = React.lazy(
  () => import("../pages/FreeModules/FeeSummary")
);
const PaymentActiveDetails = React.lazy(
  () => import("../pages/FreeModules/PaymentActiveDetails")
);
const WebhookLogs = React.lazy(
  () => import("../pages/FreeModules/WebhookLogs")
);
const PaymentReconciliation = React.lazy(
  () => import("../pages/FreeModules/PaymentReconciliation")
);
const FeeSummaryDetails = React.lazy(
  () => import("../pages/FreeModules/FeeSummary/FeeSummaryDetails")
);
const FeePaymentsRecords = React.lazy(
  () => import("../pages/FreeModules/FeePaymentsRecords")
);
const FeeReceipts = React.lazy(
  () => import("../pages/FreeModules/FeeReceipts")
);
const FeeReversals = React.lazy(
  () => import("../pages/FreeModules/FeeReversal")
);
const NewFeeReceiptPage = React.lazy(
  () => import("../pages/FreeModules/FeeReceipts/NewFeeReceiptPage")
);
const PreviewFeeReceiptPage = React.lazy(
  () => import("../pages/FreeModules/FeeReceipts/PreviewReceipt")
);
const StudentLedger = React.lazy(
  () => import("../pages/FreeModules/StudentLedger")
);
const FeeRefunds = React.lazy(() => import("../pages/FreeModules/FeeRefunds"));
const StudentConcessions = React.lazy(
  () => import("../pages/FreeModules/StudentConcessions")
);
const StudentConcessionV2 = React.lazy(
  () => import("../pages/FreeModules/StudentConcessionV2")
);
const TutionFeeConcessions = React.lazy(
  () => import("../pages/FreeModules/TutionFeeConcessions")
);
const FeeName = React.lazy(() => import("../pages/FreeModules/FeeName"));
const FeeConcessionType = React.lazy(() => import("../pages/FreeModules/FeeConcessionType"));
const ChronicParentType = React.lazy(() => import("../pages/FreeModules/ChronicParentType"));
const FeeStructure = React.lazy(
  () => import("../pages/FreeModules/FeeStructure")
);
const SpecialFee = React.lazy(() => import("../pages/FreeModules/SpecialFee"));
const SpecialFeeSettings = React.lazy(() => import("../pages/FreeModules/SpecialFeeSettings"))
const FeeConcession = React.lazy(() => import("../pages/FreeModules/FeeConcession"));
const TransportFeeConcession = React.lazy(() => import("../pages/FreeModules/TransportFeeConcession"));

const ChequeHistory = React.lazy(
  () => import("../pages/FreeModules/ChequeHistory")
);
const FeeRefundPage = React.lazy(
  () => import("../pages/FreeModules/FeeRefunds/FeeRefundPage")
);
const TutionFeeConcessionPage = React.lazy(
  () =>
    import("../pages/FreeModules/TutionFeeConcessions/TutionFeeConcessionPage")
);
const StudentConcessionPage = React.lazy(
  () => import("../pages/FreeModules/StudentConcessions/StudentConcessionPage")
);
const AddStudentConcessionV2 = React.lazy(
  () => import("../pages/FreeModules/StudentConcessionV2/AddStudentConcessionV2")
);
const PaymentTesting = React.lazy(
  () => import("../pages/FreeModules/PaymentTesting")
);
const CampusTransferFeeRefundApprovalRequest = React.lazy(
  () => import("../pages/FreeModules/CampusTransferFeeRefundApprovalRequest")
);
const TransferRequestApprovals = React.lazy(
  () => import("../pages/FreeModules/TransferRequestApprovals")
);
const AdmissionWithdrawal = React.lazy(
  () => import("../pages/FreeModules/AdmissionWithdrawal")
);
const ItFormApprovals = React.lazy(
  () => import("../pages/FreeModules/ItFormApprovals")
);

const CashPaymentApproval = React.lazy(
  () => import("../pages/FreeModules/CashPaymentApproval")
);


const FeeCollectors = React.lazy(
  () => import("../pages/FreeModules/FeeCollectors")
);
const Fines = React.lazy(() => import("../pages/FreeModules/Fines"));
const FeeDueSummary = React.lazy(
  () => import("../pages/FreeModules/FeeDueSummary")
);

// Concerns and feedback 

const ConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList')
)
const MyConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/MyConcernFeedbaclList/index')
)
const AddConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList/AddConcernFeedback')
)
const ViewConcernFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList/ViewConcernFeedback')
)
const ComplaintDepartment = React.lazy(
  () => import('../pages/ConcernsFeedback/ComplaintDepartment')
)
const MasterDepartmentSetting = React.lazy(
  () => import('../pages/ConcernsFeedback/Settings/MasterDepartments/index')
)
const ConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent')
)
const FeedbackRating = React.lazy(() => import("../pages/ConcernsFeedback/FeedbackRating"))
const AddConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent/AddConcernToParent')
)
const ViewConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent/ViewConcernToParent')
)
const ConcernFromSchool = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent')
)

// Front Desk

const AdmissionManagement = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment'));
const ThankYouPage = React.lazy(() => import('../pages/ThankYouPage/index'));
const ApplicationSuccess = React.lazy(() => import('../pages/ApplicationSuccess'));
const AddObservationAndInterviewReport = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment/ObservationandInterviewerReport/AddObservationAndInterviewReport/index'));
const AddPanelInterviewResult = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment/PanelInterviewResult/AddPanelInterviewResult'));
const RegistrationModal = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/Registration/AddStudent"));
const AddNewExam = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment/Examination/AddNewExam'));
const AddNewInterview = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment/PanelInterview/AddNewInterview'));
const SiblingVerification = React.lazy(() => import('../pages/FrontDesk/SiblingVerification'));
const ChangeStudentDetails = React.lazy(() => import('../pages/FrontDesk/ChangeStudentDetails'));
const RecommendedCampus = React.lazy(() => import('../pages/FrontDesk/RecommendedCampus'));
const MessRegistration = React.lazy(() => import("../pages/FrontDesk/MessRegistration"));
const ChangeTransferRequests = React.lazy(() => import('../pages/FrontDesk/RecommendedCampus'));
const FeeReports = React.lazy(() => import('../pages/FrontDesk/Reports/FeeReports'));
const AdmissionWithdrawalDetails = React.lazy(() => import('../pages/FrontDesk/AdmissionWithdrawalDetails'));
const FeeStatusReport = React.lazy(() => import('../pages/FrontDesk/Reports/FeeStatusReport'));
const FeePaymentReport = React.lazy(() => import('../pages/FrontDesk/Reports/FeePaymentReport'));
const CCAvenueReport = React.lazy(() => import('../pages/FrontDesk/Reports/CCAvenueReport'));
const FeeConcessionReport = React.lazy(() => import('../pages/FrontDesk/Reports/FeeConcessionReport'));
const FeeCallingReport = React.lazy(() => import('../pages/FrontDesk/Reports/FeeCallingReport'));
const ClassWiseFeeSummaryReport = React.lazy(() => import('../pages/FrontDesk/Reports/ClassWiseFeeSummaryReport'));
const UnpaidReport = React.lazy(() => import('../pages/FrontDesk/Reports/UnpaidReport'));
const CbseVerification = React.lazy(() => import('../pages/FrontDesk/Reports/CbseVerification'));
const UpdateCbseVerification = React.lazy(() => import('../pages/FrontDesk/Reports/CbseVerification/UpdateCbseVerification'));

const AdmissionTrackerReport = React.lazy(() => import('../pages/FrontDesk/Reports/TrackerReport/index'));
const FeedBackForm = React.lazy(() => import('../pages/FrontDesk/Reports/UnpaidReport/FeedBackForm'));
const FeedbackThankYouPage = React.lazy(() => import('../pages/FrontDesk/Reports/UnpaidReport/ThankYouPage'));


const ConsolidatedView = React.lazy(() => import('../pages/FrontDesk/Reports/ConsolidatedView'));
const ConsolidatedViewNew = React.lazy(() => import('../pages/FrontDesk/Reports/ConsolidatedViewNew'));
const ConsolidatedViewOld = React.lazy(() => import('../pages/FrontDesk/Reports/ConsolidatedViewOld'));

const AdmissionAvailability = React.lazy(() => import('../pages/FrontDesk/Settings/AdmissionAvailability'));
const BranchClassLanguage = React.lazy(() => import('../pages/FrontDesk/Settings/BranchClassLanguage'));
const AdmissionWithdrawalSetting = React.lazy(() => import('../pages/FrontDesk/Settings/AdmissionWithdrawalSetting'));
const ProposedAdmission = React.lazy(() => import('../pages/FrontDesk/Settings/ProposedAdmission'));
const AgeCriteria = React.lazy(() => import('../pages/FrontDesk/Settings/AgeCriteria'));
const ExamSubjects = React.lazy(() => import('../pages/FrontDesk/Settings/ExamSubjects'));
const PanelMember = React.lazy(() => import('../pages/FrontDesk/Settings/PanelMember'));
const EvaluationProcess = React.lazy(() => import('../pages/FrontDesk/Settings/EvaluationProcess'));
//Master-Documents
const MasterDocuments = React.lazy(() => import('../pages/FrontDesk/Settings/MasterDocuments'));
const ClassWiseDocuments = React.lazy(() => import('../pages/FrontDesk/Settings/ClassWiseDocuments'));
const AdmissionFacility = React.lazy(() => import('../pages/FrontDesk/Settings/AdmissionFacility'));
const OptionalSubjects = React.lazy(() => import("../pages/FrontDesk/Settings/OptionalSubjects"))
const AdmissionConfigurationSettings = React.lazy(() => import('../pages/FrontDesk/Settings/AdmissionConfigurationSettings'));
const SignatureConfiguration = React.lazy(() => import('../pages/FrontDesk/Settings/SignatureConfiguration'));
const Enquiry = React.lazy(() => import('../pages/FrontDesk/Enquiry'));
const ExaminationMarksModal = React.lazy(() => import('../pages/FrontDesk/AdmissionManagment/ExaminationMarks/ExaminationMarksModal'));
const EditorTest = React.lazy(() => import('../Components/Common/EditorTest'));

// Student Attendance

const AttandanceDashboard = React.lazy(() => import('../pages/StudentAttendance/AttendanceDashboard'));
const DailyAttendance = React.lazy(() => import('../pages/StudentAttendance/DailyAttendance'));
const StudentLongLeaves = React.lazy(() => import('../pages/StudentAttendance/StudentLongLeaves'));
const MonthWiseAttendance = React.lazy(() => import('../pages/StudentAttendance/MonthWiseAttendance'));
const StudentHolidayDetails = React.lazy(() => import('../pages/StudentAttendance/StudentHolidayDetails'));
const ScheduleTask = React.lazy(() => import('../pages/StudentAttendance/ScheduleTask'));
const ScheduleLogs = React.lazy(() => import('../pages/StudentAttendance/ScheduleLogs'));
const AttendanceReport = React.lazy(() => import('../pages/StudentAttendance/Reports/AttendanceReport'));
const TotalWorkingDaysHolidays = React.lazy(() => import('../pages/StudentAttendance/Reports/NoofWorkingDaysHolidays'));

// Parent Details
const ParentProfileDetails = React.lazy(() => import('../pages/ParentDetails/ProfileDetails/index'));
const ParentITFormRequest = React.lazy(() => import('../pages/ParentDetails/ParentRequest/ItFormRequest/index'));
const ParentBonofideRequest = React.lazy(() => import('../pages/ParentDetails/ParentRequest/BonofideRequest'));
const TCRequest = React.lazy(() => import('../pages/ParentDetails/ParentRequest/TCRequest'));
const ParentFeeDetails = React.lazy(() => import('../pages/ParentDetails/FeeDetails'));
const SchoolTransportDetails = React.lazy(() => import('../pages/ParentDetails/Transportation/SchoolTransport'));
const Attendance = React.lazy(() => import('../pages/ParentDetails/Attendance'));
const HealthForm = React.lazy(() => import('../pages/ParentDetails/HealthForm'));
const AlamanacStudent = React.lazy(() => import('../pages/AlamanacStudent'));

// Health Records

const HealthRecordsDetails = React.lazy(() => import('../pages/HealthRecords/HealthRecordsDetails'));
const AddHealthRecords = React.lazy(() => import('../pages/HealthRecords/HealthRecordsDetails/AddHealthRecords/index'));
const MIRoomsDetails = React.lazy(() => import('../pages/HealthRecords/MIRoomsDetails/index'));
const StudentHealthIssues = React.lazy(() => import('../pages/HealthRecords/StudentHealthIssues'));

//Comman-Alingments 
const SubAlingments = React.lazy(() => import('../pages/HealthRecords/Settings/SubAlingments'));

//Medicens
const MedicensDetails = React.lazy(() => import('../pages/HealthRecords/Settings/Medicens'));
// Assign Languages

const AssignLanguages = React.lazy(() => import('../pages/AssignLanguages'));
const NotReportingStudents = React.lazy(() => import('../pages/NewAcademics/NotReportingStudents'));
const IdCard = React.lazy(() => import('../pages/NewAcademics/IdCard'));
const AddStudentIdCard = React.lazy(() => import('../pages/NewAcademics/IdCard/AddStudentIdCard'));

// Special Fee Payments 

const SpecialFeePayments = React.lazy(() => import('../pages/SpecialFee/SpecialFeePayments'));
const SpecialFeeCategory = React.lazy(() => import('../pages/SpecialFee/SpecialFeeCategory'));
const SpecialFeeReceipts = React.lazy(() => import('../pages/SpecialFee/SpecialFeeReceipt'));
const PreviewSpecialFeeReceiptPage = React.lazy(() => import('../pages/SpecialFee/SpecialFeeReceipt/PreviewReceipt'));
const AddSpecialFeeReceipt = React.lazy(() => import('../pages/SpecialFee/SpecialFeeReceipt/AddSpecialFeeReceipt'));

//School Calendar
const CalendarSummary = React.lazy(() => import('../pages/SchoolCalendar/CalendarSummary'));
const CalendarSetting = React.lazy(() => import('../pages/SchoolCalendar/Setting'));

//Communication
const CommunicationEvents = React.lazy(() => import("../pages/Communication/Events"));
const AddEvent = React.lazy(() => import("../pages/Communication/Events/AddEvent"));
const ViewEvent = React.lazy(() => import("../pages/Communication/Events/ViewEvent"));
const CommunicationSettings = React.lazy(() => import("../pages/Communication/Settings/index"));
const CommunicationBatchReport = React.lazy(() => import("../pages/Communication/Reports/CommunicationBatchReport/index"));
const ManageAllNotifcations = React.lazy(() => import("../pages/Communication/ManageAllNotifcations/index"));
const WhatsappNotifcations = React.lazy(() => import("../pages/Communication/WhatsappNotifications"));
const ComposeWhatsappMessage = React.lazy(() => import("../pages/Communication/WhatsappNotifications/ComposeMessage"));
const WhatsappSettings = React.lazy(() => import("../pages/Communication/WhatsappNotifications/WhatsappSettings"));

const NotificationHistory = React.lazy(() => import("../pages/Communication/NotificationHistory"));
const Feeds = React.lazy(() => import("../pages/Communication/Feeds"));

const StudentGallery = React.lazy(() => import("../pages/Communication/Gallery/StudentGallery"))

//Examination Component
const ExaminationDashboard = React.lazy(() => import("../pages/Examination/ExaminationDashboard"));
const CbseManagement = React.lazy(() => import("../pages/Examination/CbseManagement/index"));
const CbseSettings = React.lazy(() => import("../pages/Examination/CbseSettings/index"));
const ExaminationName = React.lazy(() => import("../pages/Examination/CbseSettings/ExaminationName"));
const ExaminationWeightage = React.lazy(() => import("../pages/Examination/CbseSettings/ExaminationWeightage"));
const CoscholasticGrades = React.lazy(() => import("../pages/Examination/CbseSettings/CoscholasticGrades"));
const ExaminationSubjects = React.lazy(() => import("../pages/Examination/CbseSettings/ExaminationSubjects"));
const OverallGrades = React.lazy(() => import("../pages/Examination/CbseSettings/OverallGrades"));
const InternalSubjectGrades = React.lazy(() => import("../pages/Examination/CbseSettings/InternalSubjectGrades"));
const ReportCardSettings = React.lazy(() => import("../pages/Examination/CbseSettings/ReportCardSettings"));
const SkillAttributeSettings = React.lazy(() => import("../pages/Examination/IgseSettings/SkillAttributeSettings"));
const PercentageSlabs = React.lazy(() => import("../pages/Examination/CbseSettings/PercentageSlabs"));
const StudentReportGradeBook = React.lazy(() => import("../pages/Examination/CbseReports/StudentReportGradeBook"));
const MarksEntryReport = React.lazy(() => import("../pages/Examination/CbseReports/MarksEntryReport"));
const IgseSettings = React.lazy(() => import("../pages/Examination/IgseSettings/index"));
const InstituteSettings = React.lazy(() => import("../pages/Examination/InstituteSettings/index"));
const TermName = React.lazy(() => import("../pages/Examination/IgseSettings/TermName"));
const TermDetails = React.lazy(() => import("../pages/Examination/IgseSettings/TermDetails"));
const IgseManagement = React.lazy(() => import("../pages/Examination/IgseManagement"));
const EarlyYearsManagement = React.lazy(() => import("../pages/Examination/EarlyYears/Management/index"));
const EarlyYearsSettings = React.lazy(() => import("../pages/Examination/EarlyYears/Settings/index"));
const SkillSet = React.lazy(() => import("../pages/Examination/EarlyYears/Settings/SkillSet"));
const AoMapping = React.lazy(() => import("../pages/Examination/EarlyYears/Settings/AoMapping"));
const AreaofStrengthFocus = React.lazy(() => import("../pages/Examination/EarlyYears/Settings/AreaofStrengthFocus"));
const IGSEAoSelection = React.lazy(() => import("../pages/Examination/IgseSettings/AoSelection"));
const ExaminationSettings = React.lazy(() => import("../pages/Examination/Settings/index"))
const SportsSettings = React.lazy(() => import("../pages/Examination/Sports/Settings"))
const Sports = React.lazy(() => import("../pages/Examination/Sports/Settings/Sports"))
const SportsAttribute = React.lazy(() => import("../pages/Examination/Sports/Settings/SportsAttribute"))
const SportsGradeSetting = React.lazy(() => import("../pages/Examination/Sports/Settings/Grade"))
const SportsClassMapping = React.lazy(() => import("../pages/Examination/Sports/SportsManagement/MapSportsToClass"))
const SubAttributeSports = React.lazy(() => import("../pages/Examination/Sports/SportsManagement/SubAttributeSports"))
const SportsDescription = React.lazy(() => import("../pages/Examination/Sports/SportsManagement/SportsAttributeDescription"))
const TeacherAssign = React.lazy(() => import("../pages/Examination/Sports/SportsManagement/TeacherAssign"))
const SportsReportCardSettings = React.lazy(() => import("../pages/Examination/Sports/Settings/ReportCardSettings"))
const SportsManagement = React.lazy(() => import("../pages/Examination/Sports/SportsManagement"))

// green report card
const GreenReportCardSettings = React.lazy(() => import("../pages/Examination/GreenReportCard/GreenReportCardSettings"))
const GreenReportCardManagement = React.lazy(() => import("../pages/Examination/GreenReportCard/GreenReportCardManagement"))
const ManageCategory = React.lazy(() => import("../pages/Examination/GreenReportCard/GreenReportCardSettings/ManageCategory"))
const GreenGradeConfiguration = React.lazy(() => import("../pages/Examination/GreenReportCard/GradeConfiguration"))

// Discipline Report
const DisciplineReportSettings = React.lazy(() => import("../pages/Examination/Discipline/DisciplineReportSettings"))
const DisciplineReportDomains = React.lazy(() => import("../pages/Examination/Discipline/DisciplineReportSettings/DisciplineReportDomains"))
const DisciplineReportSubDomains = React.lazy(() => import("../pages/Examination/Discipline/DisciplineReportSettings/DisciplineReportSubDomains"))
const DisciplineGradeConfiguration = React.lazy(() => import("../pages/Examination/Discipline/DisciplineReportSettings/GradeConfiguration"))
const DisciplineInternalSubjectGrades = React.lazy(() => import("../pages/Examination/Discipline/DisciplineReportSettings/DisciplineInternalSubjectGrades"))


const HolisticManagement = React.lazy(() => import("../pages/Examination/HolisticReports/HolisticReportsManagement"))
const HolisticFoundationStage = React.lazy(() => import("../pages/Examination/HolisticReports/Reports/HolisticFoundationStage"))
const HolisticSettings = React.lazy(() => import("../pages/Examination/HolisticReports/Settings"))
const HolisticDomain = React.lazy(() => import("../pages/Examination/HolisticReports/Settings/Domain"))
const HolisticCurriculum = React.lazy(() => import("../pages/Examination/HolisticReports/Settings/CurriculumGoals"))
const HolisticActivities = React.lazy(() => import("../pages/Examination/HolisticReports/Settings/Activities"))
const HolisticActivitiesAdd = React.lazy(() => import("../pages/Examination/HolisticReports/Settings/Activities/AddEditNewSportsModal"))
const DomainActivities = React.lazy(() => import("../pages/Examination/HolisticReports/Settings/DomainActivities"))
const PreparatorySettings = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatorySettings"))
const PreparatoryDomains = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatorySettings/PreparatoryDomains"))
const PreparatoryCurriculumGoals = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatorySettings/PreparatoryCurriculumGoals"))

//Preparatory Report
const PreparatoryManagement = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatoryManagement"))
const PreparatoryActivities = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatoryManagement/PreparatoryActivities"))
const PreparatoryActivitiesAdd = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatoryManagement/PreparatoryActivities/AddEditNewSportsModal"))
const PreparatoryGradeEntryAdd = React.lazy(() => import("../pages/Examination/HolisticReports/PreparatoryReport/PreparatoryManagement/PreparatoryGradeEntry/PvaGradeEntryAdd"))

//PVA Settings
const CbsePvaSettings = React.lazy(() => import("../pages/Examination/CbsePVASettings/index"));
const PvaSubjects = React.lazy(() => import("../pages/Examination/CbsePVASettings/PvaSubjects"));
const PvaSkillArea = React.lazy(() => import("../pages/Examination/CbsePVASettings/PvaSkillArea"));
const MapPvaSubjectsClasses = React.lazy(() => import("../pages/Examination/CbsePVASettings/MapPvaSubjectsClasses"));
const ReportCardSettingsIGSE = React.lazy(() => import("../pages/Examination/CbsePVASettings/ReportCardSettings"));
const GradeConfiguration = React.lazy(() => import("../pages/Examination/CbsePVASettings/GradeConfiguration"));

//PVA Management
const CbsePvaManagement = React.lazy(() => import("../pages/Examination/CbsePvaManagement/index"));
//examination Parents
const ExaminationParent = React.lazy(() => import("../pages/Examination/Parents/index"));
const ProgressCardParent = React.lazy(() => import("../pages/ParentDetails/ProgressCard"));

//Hostel-Admission
const HostelAdmissions = React.lazy(() => import("../pages/Hostel/HostelAdmissions/HostelAdmissions/index"));
const NewHostelTerminationReq = React.lazy(() => import("../pages/Hostel/HostelAdmissions/HostelAdmissions/HostelTermination/NewHostelTerminationReq"));
const HostelClassEligibility = React.lazy(() => import("../pages/Hostel/Settings/HostelClassEligibility/index"));
const HostelFeeParticulars = React.lazy(() => import("../pages/Hostel/Settings/FeeName/index"));
const HostelFeeStructure = React.lazy(() => import("../pages/Hostel/Settings/HostelFeeStructure/index"));
const EligibilityPromote = React.lazy(() => import("../pages/Hostel/HostelAdmissions/EligibilityPromote/index"));
const HostelPromoteStudents = React.lazy(() => import("../pages/Hostel/HostelAdmissions/PromoteStudents/index"));
const HostelBedAllocation = React.lazy(() => import("../pages/Hostel/HostelAdmissions/HostelBedAllocation"));
const HostelStudentLedger = React.lazy(() => import("../pages/Hostel/HostelFee/HostelStudentLedger/index"));
const StudentLedgerDetails = React.lazy(() => import("../pages/Hostel/HostelFee/HostelStudentLedger/StudentLedgerDetails/index"));
const HostelConcessions = React.lazy(() => import("../pages/Hostel/HostelFee/HostelConcessions/index"));
const CautionFeeConcession = React.lazy(() => import("../pages/Hostel/CautionFeeConcessions"));
const HostelFeeReversal = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeReversal"));
const ChequeClearance = React.lazy(() => import("../pages/Hostel/ChequeClearance"));
const HostelFeeReceipts = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeReceipts/index"));
const HostelFeeRefunds = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeRefunds"));
const HostelFeeFines = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeFine"));
const HostelExitApprovals = React.lazy(() => import("../pages/Hostel/HostelExitApprovals"));

const HostelFeeAddRefunds = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeRefunds/FeeRefundPage"));
const PreviewHostelFeeReceipts = React.lazy(() => import("../pages/Hostel/HostelFee/HostelFeeReceipts/PreviewReceipt/index"));

const CreateConcession = React.lazy(
  () => import("../pages/Hostel/HostelFee/HostelConcessions/CreateConcession")
);
const CreateFeeRecipt = React.lazy(
  () => import("../pages/Hostel/HostelFee/HostelFeeReceipts/CreateFeeRecipt")
);

//Hostel-Setup
const HostelSetup = React.lazy(
  () => import("../pages/Hostel/HostelSetup")
);

const HostelDetails = React.lazy(
  () => import("../pages/Hostel/HostelSetup/HostelDetails")
);
const HostelBuilding = React.lazy(
  () => import("../pages/Hostel/HostelSetup/HostelBuilding")
);
const HostelFloor = React.lazy(
  () => import("../pages/Hostel/HostelSetup/HostelFloor")
);
const HostelRoom = React.lazy(
  () => import("../pages/Hostel/HostelSetup/HostelRoom")
);
const HostelRoomDetails = React.lazy(
  () => import("../pages/Hostel/HostelSetup/HostelRoomDetails")
);
//Election-Council
const StudentCouncilElections = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/StudentCouncilElections"));
const StudentCouncilElectionsNew = React.lazy(() => import("../pages/FrontDesk/AdmissionManagment/StudentCouncilElectionsNew"));

//Student Id Card
const StudentIdCard = React.lazy(() => import("../pages/ParentDetails/StudentIdCard"));
const AddIdCard = React.lazy(() => import("../pages/ParentDetails/StudentIdCard/AddIdCard"));

// user management
const ManageUser = React.lazy(
  () => import("../pages/UserManagement/ManageUser")
);
const LoginActivities = React.lazy(
  () => import("../pages/UserManagement/ManageUser/LoginActivities")
);
const ModulePermission = React.lazy(
  () => import("../pages/UserManagement/ModulePermission")
);
const RoleTypes = React.lazy(
  () => import("../pages/UserManagement/RoleTypes")
);
const LoginHistory = React.lazy(() => import("../pages/UserManagement/IPManagement/LoginHistory"))
const IPRestriction = React.lazy(() => import("../pages/UserManagement/IPManagement/IPRestriction"))

// transportation
const TransportationDashboard = React.lazy(
  () => import("../pages/Transportation/Dashboard")
);
const TransportationSettings = React.lazy(
  () => import("../pages/Transportation/Settings")
);
const LiveTracking = React.lazy(
  () => import("../pages/Transportation/LiveTracking")
);
const TransportationRecords = React.lazy(
  () => import("../pages/Transportation/TransportationRecords")
);
const TransportionEmployee = React.lazy(
  () => import("../pages/Transportation/TransportationEmployee")
);
const TransportRegistration = React.lazy(
  () => import("../pages/Transportation/TransportRegistration")
);
const AddEditTransportionEmployee = React.lazy(
  () => import("../pages/Transportation/TransportationEmployee/AddTransportEmployee")
);

const AllTransportationRecords = React.lazy(
  () => import("../pages/AllTransportationRecords")
);
const TeacherTimeTable = React.lazy(
  () => import("../pages/TimeTableManagement/TeacherViewTimeTable")
);

const StudentLedgers = React.lazy(
  () => import("../pages/StudentLedgers")
);
const TransportationTCRequest = React.lazy(
  () => import("../pages/Transportation/TransportationTCRequest")
);

const NewChangeRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/ChangeRequests/NewChangeRequest"
    )
);
const NewTerminationRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/Termination/NewTerminationRequest"
    )
);
const AddNewRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/NewRequests/AddNewRequests"
    )
);
const TransportConcession = React.lazy(
  () => import("../pages/Transportation/TransportConcession")
);
const NewTransportConcession = React.lazy(
  () =>
    import("../pages/Transportation/TransportConcession/NewTransportConcession")
);
const RoutesTab = React.lazy(
  () => import("../pages/Transportation/Settings/RoutesTab")
);
const CreateStopPage = React.lazy(
  () => import("../pages/Transportation/Settings/CreateStopPage")
);
const AllStopCreateStopPage = React.lazy(
  () => import("../pages/Transportation/Settings/AllStops/CreateStopPage")
);
const AllStops = React.lazy(
  () => import("../pages/Transportation/Settings/AllStops")
);
const Slabs = React.lazy(
  () => import("../pages/Transportation/Settings/Slabs")
);
const VehiclesType = React.lazy(
  () => import("../pages/Transportation/Settings/VehicalsType")
);
const VehicleDetails = React.lazy(
  () => import("../pages/Transportation/Settings/VehicleDetails")
);
const VehicleManufacture = React.lazy(
  () => import("../pages/Transportation/Settings/VehicleManufacture")
);
const AssignEmployee = React.lazy(
  () => import("../pages/Transportation/Settings/AssignEmployee")
);
const SlabsTerms = React.lazy(
  () => import("../pages/Transportation/Settings/SlabsTerms")
);
const TransportManagement = React.lazy(
  () => import("../pages/Transportation/TransportManagement")
);
//Library
const LibraryDashboard = React.lazy(
  () => import("../pages/Library/LibraryDashboard")
);
const LibrarySettings = React.lazy(
  () => import("../pages/Library/Settings")
);
const BookCollectionUpload = React.lazy(
  () => import("../pages/Library/BookCollectionUpload")
);
const BookIssuances = React.lazy(
  () => import("../pages/Library/BookIssuances")
);
const BookIssuanceDetails = React.lazy(
  () => import("../pages/Library/BookIssuances/BookIssuanceDetails/index")
);
const BookReturns = React.lazy(
  () => import("../pages/Library/BookReturns")
);
const BookReturnsDetails = React.lazy(
  () => import("../pages/Library/BookReturns/BookReturnsDetails/index")
);
const BookRenewal = React.lazy(
  () => import("../pages/Library/BookRenewal")
);
const SpecimenBookIssuances = React.lazy(
  () => import("../pages/Library/SpecimenBookIssuances")
);
const SpecimenBookIssuancesDetails = React.lazy(
  () => import("../pages/Library/SpecimenBookIssuances/SpecimenBookIssuancesDetails/index")
);
const SpecimenBookReturns = React.lazy(
  () => import("../pages/Library/SpecimenBookReturns")
);
const SpecimenBookReturnsDetails = React.lazy(
  () => import("../pages/Library/SpecimenBookReturns/SpecimenBookReturnsDetails/index")
);
const LibraryTCRequest = React.lazy(
  () => import("../pages/Library/LibraryTCRequest")
);
const LibraryStock = React.lazy(
  () => import("../pages/Library/LibraryStockVerification")
);
const LibraryDetails = React.lazy(
  () => import("../pages/Library/Settings/LibraryDetails")
);
const LibraryRooms = React.lazy(
  () => import("../pages/Library/Settings/LibraryRooms")
);
const LibraryRoomShelves = React.lazy(
  () => import("../pages/Library/Settings/LibraryRoomShelves")
);
const LibraryRacks = React.lazy(
  () => import("../pages/Library/Settings/LibraryRacks")
);
const LibraryPublishers = React.lazy(
  () => import("../pages/Library/Settings/LibraryPublishers")
);
const LibraryRecords = React.lazy(
  () => import("../pages/Library/Settings/LibraryRecords")
);
const LibraryCategory = React.lazy(
  () => import("../pages/Library/Settings/LibraryCategory")
);
const LibraryLanguageDetails = React.lazy(
  () => import("../pages/Library/Settings/LibraryLanguageDetails")
);

const LibraryUserRecordType = React.lazy(
  () => import("../pages/Library/Settings/LibraryUserRecordType")
);
const LibraryUserType = React.lazy(
  () => import("../pages/Library/Settings/LibraryUserType")
);

const LibraryStockVerificationReport = React.lazy(
  () => import("../pages/Library/LibraryReports")
);
const LibraryBookOverDue = React.lazy(
  () => import("../pages/Library/LibraryBookOverDue")
);
const LibraryBarrowedBooks = React.lazy(
  () => import("../pages/Library/LibraryBarrowedBooks")
);

// LMS
const LMS = React.lazy(
  () => import("../pages/LMS/QuestionPool/QuestionBank")
);
const AddCourseManagement = React.lazy(
  () => import("../pages/LMS/CourseManagement/AddCourseManagement")
);
const AddCourse = React.lazy(
  () => import("../pages/LMS/CourseManagement/AddCourseManagement/AddCourse")
);
const ManageCourse = React.lazy(
  () => import("../pages/LMS/CourseManagement/AddCourseManagement/ManageCourse")
);
const AddQuestion = React.lazy(
  () => import("../pages/LMS/QuestionPool/QuestionBank/QuestionBankUpload/AddQuestion")
);

const CreateAssessment = React.lazy(
  () => import("../pages/LMS/Assessment/CreateAssement")
);
const CreatedAssessmentList = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList"))
const ViewStudentQuestionsList = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList/AssessmentDetails/ViewStudentQuestionsList"))
const AssessmentDetails = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList/AssessmentDetails"))
const StudentAssessmentResult = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList/AssessmentDetails/StudentAssessmenetResult"))
const AssessmentList = React.lazy(() => import("../pages/LMS/Assessment/AssessmentList"))
const LMSSettings = React.lazy(() => import("../pages/LMS/LmsSettings"))
const QuestionPoolSettings = React.lazy(() => import("../pages/LMS/LmsSettings/QuestionPool"))
const DigitalCurriculumSettings = React.lazy(() => import("../pages/LMS/LmsSettings/DigitalCurriculumSettings"))
const GlobalSettings = React.lazy(() => import("../pages/LMS/LmsSettings/GlobalSettings"))
const AssignmentSettings = React.lazy(() => import("../pages/LMS/LmsSettings/AssignmentSettings"))
const LMSDashboard = React.lazy(() => import("../pages/LMS/Dashboard"))

const StudentAssessmenets = React.lazy(() => import("../pages/ParentDetails/StudentLMS/StudentAssessments"))
const AssessmenetResult = React.lazy(() => import("../pages/LMS/StudentAssessmenets/AssessmenetResult"))
const StudentAssessmentList = React.lazy(() => import("../pages/LMS/StudentAssessmenets/StudentAssessmentDashboard/StudentAssessmentList"))
const AssessmentInstructions = React.lazy(() => import("../pages/LMS/AssessmentInstructions"))
const EvaluteAndGrade = React.lazy(() => import("../pages/LMS/Assessment/EvaluteAndGrade"))
const LiveAssessmentMonitor = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList/AssessmentDetails/LiveAssessmentMonitor"))
const StudentAssessment = React.lazy(() => import("../pages/LMS/AssessmentInstructions/StudentAssessment"))
const ViewAssessmentQuestionsDetails = React.lazy(() => import("../pages/LMS/Assessment/CreatedAssessmentList/AssessmentDetails/AssessmentInfo/AssessmentDetails/ViewAssessmentQuestionsDetails"))
const CoursePlannerItem = React.lazy(() => import("../pages/LMS/CourseSetup/CoursePlannerList"))
const HodCoursePlannerList = React.lazy(() => import("../pages/LMS/HodLms/HodCoursePlannerList"))
const ApporveCoursePlannerDetails = React.lazy(() => import("../pages/LMS/HodLms/HodCoursePlannerList/ApporveCoursePlannerDetails"))
const ReviewDigitalCurriculum = React.lazy(() => import("../pages/LMS/HodLms/ReviewDigitalCurriculum"))
const ReviewCurriculumDetails = React.lazy(() => import("../pages/LMS/HodLms/ReviewDigitalCurriculum/ReviewCurriculumDetails"))
const ReviewCoursePlanner = React.lazy(() => import("../pages/LMS/HodLms/ReviewCoursePlanner"))
const ReviewCoursePlannerDetails = React.lazy(() => import("../pages/LMS/HodLms/ReviewCoursePlanner/ReviewCoursePlannerDetails"))
const CourseDirectorySetUp = React.lazy(() => import("../pages/LMS/CourseSetup/CourseDirectorySetUp"))
const BuildCoursePlanner = React.lazy(() => import("../pages/LMS/CourseSetup/BuildCourse"))
const CoursePlanPreview = React.lazy(() => import("../pages/LMS/CourseSetup/BuildCourse/CoursePlanPreview"))
const DigitalCurriculum = React.lazy(() => import("../pages/LMS/DigitalCurriculum/CurriculumPlannerList"))
const DigitalCurriculumSetup = React.lazy(() => import("../pages/LMS/DigitalCurriculum/DigitalCurriulumSetup"))

// LMS MeetingSchedules
const MeetingSchedules = React.lazy(() => import("../pages/LMSMeetingSchedules/MeetingSchedules"))
const MettingLinks = React.lazy(() => import("../pages/LMSMeetingSchedules/Settings/MeetingLinks"))
const AddEditMeetingLinkItem = React.lazy(() => import("../pages/LMSMeetingSchedules/Settings/MeetingLinks/AddEditMeetingItemLink"))
const ViewMeetingDetails = React.lazy(() => import("../pages/LMSMeetingSchedules/MeetingSchedules/ViewMeetingDetails"))
const StdTodayLiveClasses = React.lazy(() => import("../pages/LMSMeetingSchedules/StdTodayLiveClasses"))
const ZoomMeetForTeacher = React.lazy(() => import("../pages/LMSMeetingSchedules/ZoomMeetingSDK/ZoomMeetForTeacher"))
const ZoomMeetForStudent = React.lazy(() => import("../pages/LMSMeetingSchedules/ZoomMeetingSDK/ZoomMeetForStudent"))

// branch-storage
const StorageManagementDashboard = React.lazy(() => import("../pages/LMS/BranchStorage/StorageManagementDashboard"))
const BranchStorageSettings = React.lazy(() => import("../pages/LMS/BranchStorage/BranchStorageSettings"))
const BranchStorageConfiguration = React.lazy(() => import("../pages/LMS/BranchStorage/BranchStorageSettings/BranchStorage/BranchStorageConfiguration"))
const Rooms = React.lazy(() => import("../pages/LMS/BranchStorage/Rooms"))
const AllFilesStorage = React.lazy(() => import("../pages/LMS/BranchStorage/AllFilesStorage"))
const RecentFiles = React.lazy(() => import("../pages/LMS/BranchStorage/RecentFiles"))
const FavoriteFiles = React.lazy(() => import("../pages/LMS/BranchStorage/FavoriteFiles"))
const RoomsDetails = React.lazy(() => import("../pages/LMS/BranchStorage/Rooms/RoomDetails"))
const SharedWithMe = React.lazy(() => import("../pages/LMS/BranchStorage/SharedWithMe"))
const TrashFiles = React.lazy(() => import("../pages/LMS/BranchStorage/TrashFiles"))
// const LoginNew = React.lazy(() => import("../pages/LoginNew"));
const EmployeeAllFilesStorage = React.lazy(() => import("../pages/LMS/BranchStorage/EmployeeLogin/AllFilesStorage"))

//Employee-storage
//CBSE VERIFICATION FORM
const CBSEVerificationForm = React.lazy(() => import("../pages/CBSEVerificationForm"))

const Institutions = React.lazy(() => import("../pages/Institutions"));
const BillingPayments = React.lazy(() => import("../pages/BillingPayments"));
const Communication = React.lazy(() => import("../pages/Communication"));
const WhatsappCampaign = React.lazy(() => import("../pages/Communication/WhatsappCampaign"));
const Reports = React.lazy(() => import("../pages/Reports"));
const HelpDesk = React.lazy(() => import("../pages/HelpDesk"));
const MasterSetup = React.lazy(() => import("../pages/MasterSetup"));
const ModulesSettings = React.lazy(() => import("../pages/ModuleSettings"));

const BranchSettings = React.lazy(() => import("../pages/BranchSettings"));
// const StudentDetails = React.lazy(() => import("../pages/Directory/StudentDetails"));

const InstituteAdminList = React.lazy(
  () => import("../pages/InstitutionAdmin/InstituteList")
);
const BranchList = React.lazy(
  () => import("../pages/InstitutionAdmin/BranchList")
);

const ClassroomManagement = React.lazy(
  () => import("../pages/Academics/ClassManagement")
);



const SubjectManagement = React.lazy(
  () => import("../pages/Academics/SubjectManagement")
);

const AddStudent = React.lazy(() => import("../pages/Directory/AddStudent"));
const DirectoryDashboard = React.lazy(() => import("../pages/Directory/DirectoryDashboard"));

const StudentManagement = React.lazy(() => import("../pages/Directory/StudentManagement"));
const StudentDetails = React.lazy(() => import("../pages/Directory/StudentDetails"));
const BulkUpload = React.lazy(() => import("../pages/Directory/BulkUpload"))
const RawDataTable = React.lazy(() => import("../pages/UpdatedDashboard/Examination/BranchWiseStudentsMarksList"))

const EmployeeManagement = React.lazy(() => import("../pages/Directory/EmployeeManagement"));
const OtherEmployeeManagement = React.lazy(() => import("../pages/Directory/EmployeeManagement/OtherEmployees"));
const ParentManagement = React.lazy(() => import("../pages/Directory/ParentManagement"));

const AddEmployee = React.lazy(() => import("../pages/Directory/AddEmployee"));
const EmployeeDetails = React.lazy(() => import("../pages/Directory/EmployeeDetails"));
const CompanyDetails = React.lazy(() => import("../pages/Directory/CompanyDetails"));
const ProfileDetails = React.lazy(() => import("../pages/Profile"));
const MasterSetupLoginActivity = React.lazy(() => import("../pages/LoginActivities"));
const PublicAuthLayoutNew = React.lazy(() => import("../Layouts/PublicAuthLayoutV1"))
const LoginInfo = React.lazy(() => import("../pages/UserManagement/LoginInfo"));
const EmployeeMonthlyAttendance = React.lazy(() => import("../pages/Directory/EmployeeAttendance"));

// enquiry management
const ManageLeads = React.lazy(() => import("../pages/EnquiryManagement/ManageLeads"))
const ManageLeadsDetails = React.lazy(() => import("../pages/EnquiryManagement/ManageLeads/LeadDetails"))
const LeadsSettings = React.lazy(() => import("../pages/EnquiryManagement/Settings"))
const OrganizationProfile = React.lazy(() => import("../pages/EnquiryManagement/Settings/OrganizationProfile"))
const ManageInstitute = React.lazy(() => import("../pages/EnquiryManagement/Settings/ManageInstitute"))
const ManageLeadStatus = React.lazy(() => import("../pages/EnquiryManagement/Settings/ManageLeadStatus"))
const CampaignSetup = React.lazy(() => import("../pages/EnquiryManagement/Settings/CampaignSetup"))
const ProgressModule = React.lazy(() => import("../pages/Progress"));

const CRMBusinessUnits = React.lazy(() => import("../pages/CRM/Settings/BusinessUnits"));
const CRMIntegrations = React.lazy(() => import("../pages/CRM/Settings/Integrations"));
const CRMUsers = React.lazy(() => import("../pages/CRM/Settings/Users"));
const CRMPayments = React.lazy(() => import("../pages/CRM/Settings/Payments"));
const CRMGoogleSheets = React.lazy(() => import("../pages/CRM/Settings/GoogleSheets"));
const CRMMetaLeadAds = React.lazy(() => import("../pages/CRM/Settings/MetaLeadAds"));
const CRMTemplates = React.lazy(() => import("../pages/CRM/Settings/Templates"));
const CRMEmailConfiguration = React.lazy(() => import("../pages/CRM/Settings/EmailConfiguration"));
const CRMCalling = React.lazy(() => import("../pages/CRM/Settings/Calling"));
const CRMSmartflo = React.lazy(() => import("../pages/CRM/Settings/Smartflo"));
const CRMReports = React.lazy(() => import("../pages/CRM/Reports"));
const BussinessUnitSettings = React.lazy(() => import("../pages/CRM/Settings/BusinessUnits/BussinessUnitSettings"));
const CRMLeadsV2 = React.lazy(() => import("../pages/CRM/LeadsV2"))
const CRMBulkActions = React.lazy(() => import("../pages/CRM/BulkActions"))
const CRMDashboard = React.lazy(() => import("../pages/CRM/Dashboard"))
const Tracker = React.lazy(() => import("../pages/CRM/Tracker"))
const WhatsAppInbox = React.lazy(() => import("../pages/CRM/WhatsApp/Inbox"))
const WhatsAppTemplates = React.lazy(() => import("../pages/CRM/WhatsApp/Templates"))
const Automations = React.lazy(() => import("../pages/CRM/Automations"))


const SchoolPortalDashboard = React.lazy(
  () => import("../pages/SchoolPortalHome")
);

const authProtectedRoutes: any = [
  {
    path: "/progress",
    component: ProgressModule,
    allowedRoles: ['BRANCH_ADMIN']
  },
  {
    path: "/school-portal-dashboard",
    component: SchoolPortalDashboard,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"],
  },
  {
    path: "/branch-dashboard",
    component: BranchSummaryDashboard,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/admission-dashboard",
    component: Dashboard,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/dashboard",
    component: InstituteDashboard,
    allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"]
  },
  {
    path: "/student-dashboard",
    component: BranchAdminDashboard,
    allowedRoles: ["STUDENT_ROLE"],
  },
  {
    path: "/parent-dashboard",
    component: ParentDashboard,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/download-documents",
    component: ParentUploadDocuments,
    allowedRoles: ["PARENT_ROLE"],
  },
  //  Start Enquiry Management Routes

  {
    path: "/manage-leads",
    component: ManageLeads,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/manage-leads/lead-details",
    component: ManageLeadsDetails,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/enquiry-settings",
    component: LeadsSettings,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/enquiry-settings/organization-profile",
    component: OrganizationProfile,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/enquiry-settings/manage-institute",
    component: ManageInstitute,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/enquiry-settings/manage-lead-status",
    component: ManageLeadStatus,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/enquiry-settings/campaign-setup",
    component: CampaignSetup,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },

  // End Enquiry Management Routes

  // Health Records

  {
    path: "/health-records",
    component: HealthRecordsDetails,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },
  {
    path: "/health-records/:route?",
    component: AddHealthRecords,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },
  {
    path: "/mi-room",
    component: MIRoomsDetails,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },
  {
    path: "/student-health-issues",
    component: StudentHealthIssues,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },

  //Comman-Alingments

  {
    path: "/manage-ailments",
    component: SubAlingments,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },

  // Medicen

  {
    path: "/medicine-details",
    component: MedicensDetails,
    allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
  },

  //Academics Routes
  {
    path: "/section-management",
    component: NewAcademics,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/section-management/section-detail",
    component: AcademaicSectionDetails,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/assign-group",
    component: AssignGroup,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/generate-roll-number",
    component: GenerateRollNumbers,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  // { path: "/languages", component: LanguagesCopm },
  {
    path: "/class-subject",
    component: ClassSubjects,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/manage-languages",
    component: ManageLanguages,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },

  {
    path: "/student-subject-allocation",
    component: StudentSubjectAllocation,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },

  {
    path: "/subject-teacher",
    component: SubjectTeachers,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/change-student-subject",
    component: StudentSubject,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/higher-class-eligibility",
    component: HigherClassEligibility,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/time-table",
    component: TimeTable,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/preview-time-table/:id",
    component: PreviewTimeTable,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table/create-time-table",
    component: CreateTimeTable,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table-settings",
    component: TimeTableSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table-settings/class-rooms",
    component: TimeTableSettingsClassRoom,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table-settings/period-category",
    component: TimeTableSettingsPeriodCategory,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table-settings/breaks-type",
    component: TimeTableSettingsTimeTableBreaksType,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/time-table-settings/breaks",
    component: TimeTableSettingsTimeTableBreaks,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  // {
  //   path : "/time-table-settings/assign-teachers",
  //   component:<></>,
  //   allowedRoles: ["BRANCH_ADMIN"]
  // },
  // {
  //   path : "/time-table-settings/substitution-list",
  //   component:<></>,
  //   allowedRoles: ["BRANCH_ADMIN"]
  // },
  // {
  //   path : "/time-table-settings/holidays",
  //   component:<></>,
  //   allowedRoles: ["BRANCH_ADMIN"]
  // },
  // {
  //   path : "/time-table-settings/time-table-type-structure",
  //   component:<></>,
  //   allowedRoles: ["BRANCH_ADMIN"]
  // },
  {
    path: "/health-form-verification-list",
    component: HealthFormVerification,
    allowedRoles: ["TEACHER", "MEDICAL", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/promote-student",
    component: PromoteStudents,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/detention-promotion",
    component: DetentionsPromotions,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/almanac-uploaded",
    component: AlmanacUploaded,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/upload-documents",
    component: UploadDocuments,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/type-of-work",
    component: TypeofWork,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"]
  },

  // Start Fee Routes
  {
    path: "/fee-dashboard",
    component: FeeDashBoard,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/student-fee-ledger",
    component: FeeSummary,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/online-payment-details",
    component: PaymentActiveDetails,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/webhook-logs",
    component: WebhookLogs,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/payment-reconciliation",
    component: PaymentReconciliation,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/student-fee-ledger/fee-details",
    component: FeeSummaryDetails,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-payments-records",
    component: FeePaymentsRecords,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-reversal",
    component: FeeReversals,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-receipts",
    component: FeeReceipts,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-receipts/create-receipt",
    component: NewFeeReceiptPage,
    allowedRoles: ["ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-receipts/preview-receipt/:receiptId",
    component: PreviewFeeReceiptPage,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/student-ledger",
    component: StudentLedger,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-refunds",
    component: FeeRefunds,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-refunds/create-refund",
    component: FeeRefundPage,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/academic-concessions",
    component: StudentConcessionV2,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  // {
  //   path: "/student-concessions-v2",
  //   component: StudentConcessionV2,
  //   allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
  //     "ACCOUNT", "ACCOUNT_HEAD",
  //     "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  // },
  {
    path: "/tution-fee-concessions",
    component: TutionFeeConcessions,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/tution-fee-concessions/create-concession",
    component: TutionFeeConcessionPage,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-particulars",
    component: FeeName,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-concession-type",
    component: FeeConcessionType,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/chronic-parent-type",
    component: ChronicParentType,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-structure",
    component: FeeStructure,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/special-fee",
    component: SpecialFeeSettings,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-concession",
    component: FeeConcession,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/transport-fee-concession",
    component: TransportFeeConcession,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/cheque-history",
    component: ChequeHistory,
    pageProps: { parentModule: "FEE" },
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/academic-concessions/create-concession",
    component: AddStudentConcessionV2,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/payment-testing",
    component: PaymentTesting,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  // {
  //   path: "/student-concessions-v2/create-concession",
  //   component: AddStudentConcessionV2 ,
  //   allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
  //     "ACCOUNT", "ACCOUNT_HEAD",
  //     "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  // },
  {
    path: "/campus-transfer-fee-refund-approvals",
    component: CampusTransferFeeRefundApprovalRequest,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-change-campus",
    component: ChangeCampus,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },
  {
    path: "/transfer-request-approvals",
    component: TransferRequestApprovals,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/admission-withdrawal",
    component: AdmissionWithdrawal,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/it-form-approvals",
    component: ItFormApprovals,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },

  {
    path: "/cash-payment-approvals",
    component: CashPaymentApproval,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },

  {
    path: "/hostelfee-exit-approvals",
    component: HostelExitApprovals,
    pageProps: { parentModule: "ACCOUNTS" },
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },


  {
    path: "/fee-collectors",
    component: FeeCollectors,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fines", component: Fines,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/fee-due-summary",
    component: FeeDueSummary,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-report",
    component: FeeReports,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-status-report",
    component: FeeStatusReport,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-payment-report",
    component: FeePaymentReport,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  // {
  //   path: "/ccavenue-daily-collection-report",
  //   component: CCAvenueReport,
  //   allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
  //     "ACCOUNT", "ACCOUNT_HEAD",
  //     "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  // },
  {
    path: "/fee-concession-report",
    component: FeeConcessionReport,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/fee-calling-report",
    component: FeeCallingReport,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ACCOUNT", "ACCOUNT_HEAD"]
  },
  {
    path: "/class-wise-outstanding-summary",
    component: ClassWiseFeeSummaryReport,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ACCOUNT", "ACCOUNT_HEAD"]
  },
  {
    path: "/unpaid-report",
    component: UnpaidReport,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/cbse-verification-report/update",
    component: UpdateCbseVerification,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/cbse-verification-report",
    component: CbseVerification,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/admission-tracker-report",
    component: AdmissionTrackerReport,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/consolidated-view",
    component: ConsolidatedView,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/consolidated-viewnew",
    component: ConsolidatedViewNew,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/consolidated-viewold",
    component: ConsolidatedViewOld,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/assign-languages",
    component: AssignLanguages,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/not-reporting-students",
    component: NotReportingStudents,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/id-card",
    component: IdCard,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/id-card/add-id-card",
    component: AddStudentIdCard,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR_HEAD", "BRANCH_ADMIN"]
  },

  // END Fee Routes

  // Special Fee Routes

  {
    path: "/special-fee-payments",
    component: SpecialFeePayments,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-category",
    component: SpecialFeeCategory,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-reciepts",
    component: SpecialFeeReceipts,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-reciepts/preview-receipt/:receiptId",
    component: PreviewSpecialFeeReceiptPage,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-reciepts/create-receipt",
    component: AddSpecialFeeReceipt,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-reversal",
    component: FeeReversals,
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/special-fee-cheque-history",
    component: ChequeHistory,
    pageProps: { parentModule: "SPECIAL_FEE" },
    allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },

  // Concern And Feedback Routes

  {
    path: "/my-concerns",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: "/concerns-feedback",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: "/dc-erp-issues",
    component: ConcernsAndFeedback,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/concerns-from-app",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/my-concerns-feedback",
    component: MyConcernsAndFeedback,
    allowedRoles: ["TEACHER", "ACCOUNT", "ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD",
      "CO ORDINATOR", "Driver", "GRIEVANCE", "HOD", "HOSTEL",
      "HR", "HR_HEAD", "PA", "PRINCIPAL", "TEACHER-ADMIN", "TRANSPORT", "TRANSPORT_HEAD", "VICE_PRINCIPAL",
      "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",]
  },
  {
    path: ["/concerns-feedback/add-concerns-feedback",
      "/my-concerns-feedback/add-concerns-feedback",
      "/my-concerns/add-concerns-feedback"
    ],
    component: AddConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: ["/concerns-feedback/view-concerns-feedback",
      "/my-concerns-feedback/view-concerns-feedback",
      "/my-concerns/view-concerns-feedback",
      "/dc-erp-issues/view-concerns-feedback",
      "/concerns-from-app/view-concerns-feedback",
    ],
    component: ViewConcernFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },

  {
    path: "/complaint-department",
    component: ComplaintDepartment,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/master-department",
    component: MasterDepartmentSetting,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/concerns-to-parent",
    component: ConcernToParent,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN",]
  },
  {
    path: "/feedbacks-rating",
    component: FeedbackRating,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN",]
  },
  {
    path: "/concerns-to-parent/add-concern-to-parent",
    component: AddConcernToParent,
    allowedRoles: ["TEACHER",]
  },
  {
    path: "/concerns-to-parent/view-concern-to-parent",
    component: ViewConcernToParent,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN"]
  },
  {
    path: "/concerns-from-school",
    component: ConcernFromSchool,
    allowedRoles: ["PARENT_ROLE",]
  },
  {
    path: "/concerns-from-school/view-concern-from-school",
    component: ViewConcernToParent,
    allowedRoles: ["PARENT_ROLE",]
  },


  //Front Desk Routes
  {
    path: "/admission-management",
    component: AdmissionManagement,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },

  {
    path: "/admission-management/observation-interview-report",
    component: AddObservationAndInterviewReport,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/panel-interview-result",
    component: AddPanelInterviewResult,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/exam/:examScheduleId?",
    component: AddNewExam,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/exam-reschedule/:examScheduleId?",
    component: AddNewExam,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/interview/:interviewId?",
    component: AddNewInterview,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/interview-reschedule/:interviewId?",
    component: AddNewInterview,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/add-registration",
    component: RegistrationModal,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/edit-registration",
    component: RegistrationModal,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/view-registration",
    component: RegistrationModal,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/sibling-verification",
    component: SiblingVerification,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/change-student",
    component: ChangeStudentDetails,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/recommended-campus",
    component: RecommendedCampus,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/mess-registration",
    component: MessRegistration,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/change-transfer-request",
    component: ChangeTransferRequests,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/student-details",
    component: StudentManagement,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-availability",
    component: AdmissionAvailability,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/branch-class-language",
    component: BranchClassLanguage,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-withdrawal-setting",
    component: AdmissionWithdrawalSetting,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/proposed-admission",
    component: ProposedAdmission,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/age-criteria",
    component: AgeCriteria,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/exam-subjects",
    component: ExamSubjects,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/panel-member",
    component: PanelMember,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/evaluation-process",
    component: EvaluationProcess,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/master-documents",
    component: MasterDocuments,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/class-wise-documents",
    component: ClassWiseDocuments,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-facility",
    component: AdmissionFacility,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/optional-subjects",
    component: OptionalSubjects,
    allowedRoles: ["BRANCH_ADMIN"],
  },
  {
    path: "/configuration-settings",
    component: AdmissionConfigurationSettings,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/signature-configuration",
    component: SignatureConfiguration,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/enquiry",
    component: Enquiry,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/admission-management/examination-marks",
    component: ExaminationMarksModal,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/editortest",
    component: EditorTest,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/change-stream",
    component: ChangeStream,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },
  {
    path: "/change-campus",
    component: ChangeCampus,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },
  {
    path: "/change-curriculum",
    component: ChangeCurriculum,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },
  {
    path: "/campus-transfer-requests",
    component: CampusTransferRequests,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },
  {
    path: "/admission-withdrawal-details",
    component: AdmissionWithdrawalDetails,
    allowedRoles: ["BRANCH_ADMIN", "ADM_HEAD", "TRANSPORT_HEAD", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "ADM_HEAD"]
  },

  {
    path: "/transfer-certificate",
    component: TransferCertificate,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/bonafide-certificate",
    component: BonafideCertificate,
    allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
  },

  // student attendance
  {
    path: "/class-wise-attendance-dashboard",
    component: AttandanceDashboard,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/daily-attendance",
    component: DailyAttendance,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/student-long-leaves",
    component: StudentLongLeaves,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "PARENT_ROLE"]
  },
  {
    path: "/month-wise-attendance",
    component: MonthWiseAttendance,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/student-holiday-details",
    component: StudentHolidayDetails,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/schedule-task",
    component: ScheduleTask,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/schedule-log",
    component: ScheduleLogs,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/attendance-report",
    component: AttendanceReport,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/total-noof-working-holidays",
    component: TotalWorkingDaysHolidays,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"]
  },

  // parent details
  {
    path: "/student-profile-details",
    component: ParentProfileDetails,
    allowedRoles: ["PARENT_ROLE"]
  },
  {
    path: "/parent-it-form-request",
    component: ParentITFormRequest,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/bonafide-request",
    component: ParentBonofideRequest,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/tc-request",
    component: TCRequest,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/academic-fee",
    component: ParentFeeDetails,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/school-transport",
    component: SchoolTransportDetails,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/health-form",
    component: HealthForm,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/student-almanac",
    component: AlamanacStudent,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/attendance",
    component: Attendance,
    allowedRoles: ["PARENT_ROLE"],
  },

  // user management
  {
    path: "/manage-user",
    component: ManageUser,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/manage-user/login-activity/:userId",
    component: MasterSetupLoginActivity,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/login-info",
    component: LoginInfo,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/user-login-activity",
    component: LoginActivities,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/module-permission",
    component: ModulePermission,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/role-types",
    component: RoleTypes,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/login-history",
    component: LoginHistory,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/ip-restriction",
    component: IPRestriction,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  // transportation routes
  {
    path: "/transportation-dashboard",
    component: TransportationDashboard,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings",
    component: TransportationSettings,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/live-tracking",
    component: LiveTracking,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-stop",
    component: CreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/all-stops/create-stop",
    component: AllStopCreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession",
    component: TransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession/create-transport-concession",
    component: NewTransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession/edit-transport-concession",
    component: NewTransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-records",
    component: TransportationRecords,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee",
    component: TransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-registration",
    component: TransportRegistration,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee/add",
    component: AddEditTransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee/edit/:employeeId",
    component: AddEditTransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/all-transportation-records",
    component: AllTransportationRecords,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "PA",
      "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/teacher-time-table",
    component: TeacherTimeTable,
    allowedRoles: ["TEACHER"]
  },
  {
    path: "/all-ledgers",
    component: StudentLedgers,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "PA",
      "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/transportation-tcapproval",
    component: TransportationTCRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-change-request",
    component: NewChangeRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-termination-request",
    component: NewTerminationRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-new-request/:transportRequestId?",
    component: AddNewRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-change-request/:transportRequestId?",
    component: NewChangeRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/routes-tab",
    component: RoutesTab,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/all-stops",
    component: AllStops,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/slabs",
    component: Slabs,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/create-stop",
    component: CreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-types",
    component: VehiclesType,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-details",
    component: VehicleDetails,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-manufacture",
    component: VehicleManufacture,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/assign-employee",
    component: AssignEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/slabs-terms",
    component: SlabsTerms,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-management",
    component: TransportManagement,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },

  //Library
  {
    path: "/library-dashboard",
    component: LibraryDashboard,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings",
    component: LibrarySettings,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-collection",
    component: BookCollectionUpload,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-issuance",
    component: BookIssuances,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-issuance/book-issuance-details",
    component: BookIssuanceDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-return",
    component: BookReturns,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-return/book-return-details",
    component: BookReturnsDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-book-renewal",
    component: BookRenewal,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/specimen-book-issuance",
    component: SpecimenBookIssuances,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/specimen-book-issuance/specimen-book-issuance-details",
    component: SpecimenBookIssuancesDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/specimen-book-return",
    component: SpecimenBookReturns,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/specimen-book-return/specimen-book-return-details",
    component: SpecimenBookReturnsDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-stock",
    component: LibraryStock,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-transfer-request-approvals",
    component: TransferRequestApprovals,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-details",
    component: LibraryDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-rooms",
    component: LibraryRooms,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-room-shelves",
    component: LibraryRoomShelves,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-racks",
    component: LibraryRacks,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-publishers",
    component: LibraryPublishers,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-records",
    component: LibraryRecords,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-category",
    component: LibraryCategory,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-language",
    component: LibraryLanguageDetails,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-user-record-type",
    component: LibraryUserRecordType,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-settings/library-user-type",
    component: LibraryUserType,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/library-stock-report",
    component: LibraryStockVerificationReport,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/library-book-overdue",
    component: LibraryBookOverDue,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  {
    path: "/borrowed-library-books",
    component: LibraryBarrowedBooks,
    allowedRoles: ["BRANCH_ADMIN", "LIBRARY"]
  },
  // LMS
  {
    path: "/question-bank",
    component: LMS,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: ["/question-bank/question-builder"
    ],
    component: AddQuestion,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/create-course",
    component: AddCourseManagement,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/create-course/add-course",
    component: AddCourse,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: ["/create-course/manage-course"
    ],
    component: ManageCourse,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/create-assessment",
    component: CreateAssessment,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/created-assessments",
    component: CreatedAssessmentList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/teacher-created-assessments",
    component: CreatedAssessmentList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/student-created-assessments",
    component: CreatedAssessmentList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/view-student-questions-list",
    component: ViewStudentQuestionsList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/assessment-list/assessment-details",
    component: AssessmentDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/student-assessment-results",
    component: StudentAssessmentResult,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/assessment-list",
    component: AssessmentList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/lms-settings",
    component: LMSSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/lms-settings/question-pool",
    component: QuestionPoolSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/lms-settings/digital-curriculum-settings",
    component: DigitalCurriculumSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/lms-settings/assessment-settings",
    component: GlobalSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/lms-settings/assignments",
    component: AssignmentSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/meeting-schedules",
    component: MeetingSchedules,
    allowedRoles: ["BRANCH_ADMIN", "TEACHER"]
  },
  {
    path: "/meeting-schedules/meeting-details",
    component: ViewMeetingDetails,
    allowedRoles: ["BRANCH_ADMIN", "TEACHER"]
  },
  {
    path: "/live-classes",
    component: StdTodayLiveClasses,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE", "TEACHER"]
  },
  {
    path: "/meeting-links",
    component: MettingLinks,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/meeting-links/edit-meeting-links",
    component: AddEditMeetingLinkItem,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/storage-management-dashboard",
    component: StorageManagementDashboard,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/branch-storage-settings",
    component: BranchStorageSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/institute-storage-settings",
    component: BranchStorageSettings,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/branch-storage-settings/branch-storage-configuration",
    component: BranchStorageConfiguration,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/all-files",
    component: AllFilesStorage,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/recent-files",
    component: RecentFiles,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/favorite-files",
    component: FavoriteFiles,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/rooms",
    component: Rooms,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/rooms-details",
    component: RoomsDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/shared-with-me",
    component: SharedWithMe,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/trash-files",
    component: TrashFiles,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/employee-all-files",
    component: EmployeeAllFilesStorage,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD",]
  },
  {
    path: "/lms-dashboard",
    component: LMSDashboard,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/student-assessments",
    component: StudentAssessmenets,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE"]
  },
  {
    path: "/student-assessment-dashboard",
    component: StudentAssessmentList,
    allowedRoles: ["PARENT_ROLE"]
  },
  {
    path: "/assessment-instructions",
    component: AssessmentInstructions,
    allowedRoles: ["PARENT_ROLE", "BRANCH_ADMIN"]
  },
  {
    path: "/course-directory",
    component: CoursePlannerItem,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/course-planner",
    component: HodCoursePlannerList,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/course-planner/approve-course-planner",
    component: ApporveCoursePlannerDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/review-digital-curriculum",
    component: ReviewDigitalCurriculum,
    allowedRoles: ["HOD", "BRANCH_ADMIN"]
  },
  {
    path: "/review-digital-curriculum-details/:id",
    component: ReviewCurriculumDetails,
    allowedRoles: ["HOD", "BRANCH_ADMIN"]
  },
  {
    path: "/review-course-planner",
    component: ReviewCoursePlanner,
    allowedRoles: ["HOD", "BRANCH_ADMIN"]
  },
  {
    path: "/review-course-planner-details/:id",
    component: ReviewCoursePlannerDetails,
    allowedRoles: ["HOD", "BRANCH_ADMIN"]
  },
  {
    path: "/course-directory-setup",
    component: CourseDirectorySetUp,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/build-course-directory",
    component: BuildCoursePlanner,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/course-plan-preview",
    component: CoursePlanPreview,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/digital-curriculum",
    component: DigitalCurriculum,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/digital-curriculum/add-curriculum",
    component: DigitalCurriculumSetup,
    allowedRoles: ["BRANCH_ADMIN"]
  },

  {
    path: "/institute-institution",
    component: Institutions,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/billing-payments",
    component: BillingPayments,
    allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/communication",
    component: Communication,
    allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/whatsapp-campaign",
    component: WhatsappCampaign,
    allowedRoles: ["BRANCH_ADMIN"],
  },
  {
    path: "/reports",
    component: Reports,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/helpdesk",
    component: HelpDesk,
    allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/cbse-verification-form",
    component: CBSEVerificationForm,
    allowedRoles: ["PARENT_ROLE"],
  },
  {
    path: "/general-settings/branch-setting",
    component: BranchSettings,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/general-settings",
    component: MasterSetup,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/general-settings/login-activity/:userId",
    component: MasterSetupLoginActivity,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/modules-settings",
    component: ModulesSettings,
    allowedRoles: ["INSTITUTE_ADMIN"],
  },
  {
    path: "/institute-list",
    component: InstituteAdminList,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    path: "/branch-list",
    component: BranchList,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    path: "/classroom-management",
    component: ClassroomManagement,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/subject-management", component: SubjectManagement,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN"],
  },
  {
    path: "/directory-dashboard", component: DirectoryDashboard,
    allowedRoles: ["BRANCH_ADMIN"],
  },
  {
    path: "/student-management/add-student", component: AddStudent,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "GRIEVANCE"],
  },
  {
    path: "/student-management/edit-student/:studentId/:academicYearId", component: StudentDetails,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "GRIEVANCE"],
  },
  {
    path: "/student-management", component: StudentManagement,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"],
  },
  {
    path: "/bulk-upload",
    component: BulkUpload,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/bulk-upload/raw-data",
    component: RawDataTable,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/employee-management/add-employee", component: AddEmployee,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-management/edit-employee/:employeeId", component: EmployeeDetails,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-monthly-attendance", component: EmployeeMonthlyAttendance,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee/add-other-employee", component: AddEmployee,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee/edit-employee/:employeeId", component: EmployeeDetails,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-management", component: EmployeeManagement,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee", component: OtherEmployeeManagement,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/company-details", component: CompanyDetails,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/parent-management", component: ParentManagement,
    allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"],
  },
  {
    path: "/profile", component: ProfileDetails,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE", "INSTITUTE_ADMIN", "ACCOUNT", "ADM_CONS", "ACCOUNT_HEAD",
      "TRANSPORT_HEAD", "ADM_HEAD", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "HR", "HR_HEAD", "GRIEVANCE",
      "EMPLOYEE", "HOSTEL", "LIBRARY", "MEDICAL"]
  },
  {
    path: "/student-management/:studentId", component: StudentDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/branch-settings", component: BranchSettings,
    allowedRoles: ["BRANCH_ADMIN"]
  },

  //school calendar
  { path: "/calendar-summary", component: CalendarSummary, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/calendar-settings", component: CalendarSetting, allowedRoles: ["BRANCH_ADMIN"] },

  //Communication
  { path: "/events", component: CommunicationEvents, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/events/edit-event", component: AddEvent, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/events/add-event", component: AddEvent, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/events/view-event", component: ViewEvent, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/communication-settings", component: CommunicationSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/communication-reports", component: CommunicationBatchReport, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/manage-notifications", component: ManageAllNotifcations, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/whatsapp-notifications", component: WhatsappNotifcations, allowedRoles: ["BRANCH_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "HOD", "PA", "ADM_CONS", "ADM_HEAD"] },
  { path: "/whatsapp-notifications/compose", component: ComposeWhatsappMessage, allowedRoles: ["BRANCH_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "HOD", "PA", "ADM_CONS", "ADM_HEAD"] },
  { path: "/whatsapp-settings", component: WhatsappSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/notifications-history", component: NotificationHistory, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/feeds", component: Feeds, allowedRoles: ["BRANCH_ADMIN"] },
  {
    path: "/gallery-management", component: StudentGallery, allowedRoles: ["BRANCH_ADMIN"]
  },
  // Examination
  { path: "/examination-settings", component: InstituteSettings, allowedRoles: ["INSTITUTE_ADMIN"] },
  { path: "/examination-dashboard", component: ExaminationDashboard, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-management", component: CbseManagement, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings", component: CbseSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/examination-name", component: ExaminationName, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/examination-weightage", component: ExaminationWeightage, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/coscholastic-grades", component: CoscholasticGrades, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/examination-subjects", component: ExaminationSubjects, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/examination-subjects", component: ExaminationSubjects, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/coscholastic-grades", component: CoscholasticGrades, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/overall-grades", component: OverallGrades, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/overall-grades", component: OverallGrades, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/internal-subject-grades", component: InternalSubjectGrades, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/reportcard-settings", component: ReportCardSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings/reportcard-settings", component: ReportCardSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/reportcard-settings", component: ReportCardSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/skill-attribute-settings", component: SkillAttributeSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/percentage-slabs", component: PercentageSlabs, allowedRoles: ["INSTITUTE_ADMIN"] },
  { path: "/student-performance-metrics", component: StudentReportGradeBook, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/marks-entry-report", component: MarksEntryReport, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings", component: IgseSettings, allowedRoles: ["BRANCH_ADMIN"] },
  {
    path: [
      "/term-name",
      "/igcse-settings/term-name",
      "/cbse-settings/term-name",
      "/early-years-settings/term-name",
    ],
    component: TermName,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"],
  },
  {
    path: [
      "/term-details",
      "/igcse-settings/term-details",
      "/cbse-settings/term-details",
      "/early-years-settings/term-details",
    ],
    component: TermDetails,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"],
  },
  { path: "/igcse-settings/term-wise-examination", component: ExaminationName, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-management", component: IgseManagement, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-management", component: EarlyYearsManagement, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings", component: EarlyYearsSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings/skill-set", component: SkillSet, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/skill-set", component: SkillSet, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings/area-of-strength-focus", component: AreaofStrengthFocus, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings/ao-mapping", component: AoMapping, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/ao-mapping", component: AoMapping, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/ao-selection", component: IGSEAoSelection, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/igcse-settings/signature", component: ExaminationSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/cbse-settings/signature", component: ExaminationSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/early-years-settings/signature", component: ExaminationSettings, allowedRoles: ["BRANCH_ADMIN"] },
  {
    path: "/sports-settings", component: SportsSettings, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/sports-settings/sports", component: Sports, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/sports-settings/sports-attribute", component: SportsAttribute, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/sports-settings/grade", component: SportsGradeSetting, allowedRoles: ["BRANCH_ADMIN"]
  },

  { path: "/sports-settings/map-sports-to-classes", component: SportsClassMapping, allowedRoles: ["BRANCH_ADMIN"] },

  { path: "/sports-settings/sports-sub-attributes", component: SubAttributeSports, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/sports-settings/sports-descriptions", component: SportsDescription, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/sports-settings/asssign-teacher-to-sports", component: TeacherAssign, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/sports-settings/reportcard-settings", component: SportsReportCardSettings, allowedRoles: ["BRANCH_ADMIN"] },

  // green report card
  {
    path: "/green-report-card-settings", component: GreenReportCardSettings, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/green-report-card-settings/manage-category", component: ManageCategory, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/green-report-card-management", component: GreenReportCardManagement, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/green-report-card-settings/grade-configuration", component: GreenGradeConfiguration, allowedRoles: ["BRANCH_ADMIN"]
  },

  // Discipline Report
  {
    path: "/discipline-report-card-settings", component: DisciplineReportSettings, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/discipline-report-card-settings/domains", component: DisciplineReportDomains, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/discipline-report-card-settings/sub-domains", component: DisciplineReportSubDomains, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/discipline-report-card-settings/grade-configuration", component: DisciplineGradeConfiguration, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/discipline-report-card-settings/internal-subject-grades", component: DisciplineInternalSubjectGrades, allowedRoles: ["BRANCH_ADMIN"]
  },


  {
    path: "/sports-management", component: SportsManagement, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/holistic-management", component: HolisticFoundationStage, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/holistic-management/add-activity", component: HolisticActivitiesAdd, allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-management/edit-activity", component: HolisticActivitiesAdd, allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-management/add-holistic", component: HolisticManagement, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/holistic-settings", component: HolisticSettings, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/holistic-settings/domain", component: HolisticDomain, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/holistic-settings/curricular-goals", component: HolisticCurriculum, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/holistic-activity-management", component: HolisticActivities, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-activity-management/add", component: HolisticActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-activity-management/edit", component: HolisticActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-activity-management/copy", component: HolisticActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/holistic-settings/domain-activities", component: DomainActivities, allowedRoles: ["INSTITUTE_ADMIN"]
  },

  //Preparatory Reports
  {
    path: "/preparatory-activity-management", component: PreparatoryActivities, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-activity-management/add", component: PreparatoryActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-activity-management/edit", component: PreparatoryActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-activity-management/copy", component: PreparatoryActivitiesAdd, allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-management", component: PreparatoryManagement, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/preparatory-management/add-activity", component: PreparatoryActivitiesAdd, allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-management/edit-activity", component: PreparatoryActivitiesAdd, allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/preparatory-management/grade-entry", component: PreparatoryGradeEntryAdd, allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/preparatory-settings", component: PreparatorySettings, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/preparatory-settings/domain", component: PreparatoryDomains, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/preparatory-settings/curricular-goals", component: PreparatoryCurriculumGoals, allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },

  //PVA Settings

  { path: "/other-pva-settings", component: CbsePvaSettings, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/other-pva-settings/pva-subjects", component: PvaSubjects, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/other-pva-settings/pva-skill-area", component: PvaSkillArea, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/other-pva-settings/pva-map-subject-classes", component: MapPvaSubjectsClasses, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/other-pva-settings/reportcard-settings", component: ReportCardSettingsIGSE, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/other-pva-settings/pva-grade-configuration", component: GradeConfiguration, allowedRoles: ["BRANCH_ADMIN"] },

  //PVA MAnagement
  { path: "/other-pva-management", component: CbsePvaManagement, allowedRoles: ["BRANCH_ADMIN"] },

  // Examination Parents
  { path: "/examination-admitcard", component: ExaminationParent, allowedRoles: ["PARENT_ROLE"] },
  { path: "/examination-progresscard", component: ProgressCardParent, allowedRoles: ["PARENT_ROLE"] },


  // HostelAdmission
  { path: "/hostel-admissions", component: HostelAdmissions, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/create-hostel-termination", component: NewHostelTerminationReq, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-class-eligibility", component: HostelClassEligibility, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-particulars", component: HostelFeeParticulars, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-structure", component: HostelFeeStructure, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/eligibility-promote", component: EligibilityPromote, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/promote-students", component: HostelPromoteStudents, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-bed-allocation", component: HostelBedAllocation, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-student-ledger", component: HostelStudentLedger, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-student-ledger/ledger-details", component: StudentLedgerDetails, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-concession", component: HostelConcessions, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/cheque-clearance", component: ChequeClearance, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/caution-fee-concessions", component: CautionFeeConcession, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-reversal", component: HostelFeeReversal, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-receipt", component: HostelFeeReceipts, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-refund", component: HostelFeeRefunds, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-refund/create-refund", component: HostelFeeAddRefunds, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  { path: "/hostel-fee-fine", component: HostelFeeFines, allowedRoles: ["BRANCH_ADMIN", "HOSTEL"] },
  {
    path: "/hostel-exit-approvals", component: HostelExitApprovals,
    pageProps: { parentModule: "HOSTEL" },
    allowedRoles: ["BRANCH_ADMIN", "HOSTEL"]
  },
  {
    path: "/hostel-concession/create-concession",
    component: CreateConcession,
    allowedRoles: ["BRANCH_ADMIN", "HOSTEL"]
  },
  {
    path: "/hostel-fee-receipt/create-fee-receipt",
    component: CreateFeeRecipt,
    allowedRoles: ["BRANCH_ADMIN", "HOSTEL"]
  },
  {
    path: "/hostel-fee-receipt/preview-receipt/:receiptId",
    component: PreviewHostelFeeReceipts,
    allowedRoles: ["BRANCH_ADMIN", "HOSTEL"]
  },

  //Hostel-Setup
  {
    path: "/hostel-setup",
    component: HostelSetup,
    allowedRoles: ["BRANCH_ADMIN"]
  },

  {
    path: "/hostel-setup/hostel-details",
    component: HostelDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/hostel-setup/hostel-building",
    component: HostelBuilding,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/hostel-setup/hostel-floor",
    component: HostelFloor,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/hostel-setup/hostel-room-type",
    component: HostelRoom,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/hostel-setup/hostel-room-details",
    component: HostelRoomDetails,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  { path: "/hostel-whatsapp-notifications", component: WhatsappNotifcations, allowedRoles: ["BRANCH_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "HOD", "PA", "ADM_CONS", "ADM_HEAD"] },
  { path: "/hostel-whatsapp-notifications/compose", component: ComposeWhatsappMessage, allowedRoles: ["BRANCH_ADMIN", "PRINCIPAL", "VICE_PRINCIPAL", "HOD", "PA", "ADM_CONS", "ADM_HEAD"] },
  { path: "/hostel-whatsapp-settings", component: WhatsappSettings, allowedRoles: ["BRANCH_ADMIN"] },
  //student id card
  { path: "/student-id-card", component: StudentIdCard, allowedRoles: ["PARENT_ROLE"] },
  { path: "/student-id-card/add-card", component: AddIdCard, allowedRoles: ["PARENT_ROLE"] },
  // {
  //   path: "/",
  //   exact: true,
  //   component: () => <Redirect to="/dashboard" />,
  // },

  // CRM
  {
    path: "/crm-dashboard",
    component: CRMDashboard,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-leads",
    component: CRMLeadsV2,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-whatsapp-inbox",
    component: WhatsAppInbox,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-tracker",
    component: Tracker,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-bulk-actions",
    component: CRMBulkActions,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-reports",
    component: CRMReports,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-automations",
    component: Automations,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-payments",
    component: CRMPayments,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-user-management",
    component: CRMUsers,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-templates",
    component: CRMTemplates,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/crm-whatsapp-templates",
    component: WhatsAppTemplates,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/business-units",
    component: CRMBusinessUnits,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/business-units/:businessUnitId",
    component: BussinessUnitSettings,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations",
    component: CRMIntegrations,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations/google-sheets",
    component: CRMGoogleSheets,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations/meta-lead-ads",
    component: CRMMetaLeadAds,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations/email-configuration",
    component: CRMEmailConfiguration,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations/calling",
    component: CRMCalling,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/integrations/smartflo",
    component: CRMSmartflo,
    allowedRoles: ["INSTITUTE_ADMIN"]
  }
];

const publicRoutes = [
  {
    path: "/meeting-schedules/zoom-meet-for-teacher",
    component: ZoomMeetForTeacher,
  },
  {
    path: "/live-classes/student-meet",
    component: ZoomMeetForStudent,
  },
  {
    path: "/assessement-result",
    component: AssessmenetResult,
  },
  {
    path: "/student-assessment",
    component: StudentAssessment,
  },
  {
    path: "/evalute-grade",
    component: EvaluteAndGrade
  },
  {
    path: "/assessment-list/live-assessment-monitor",
    component: LiveAssessmentMonitor
  },
  // Authentication Page
  { path: "/login-old", component: Login },
  { path: "/forgot-password-old", component: ForgotPassword },
  { path: "/reset-password-old", component: ResetPassword },
  { path: "/validate-otp-old", component: ValidateOtp },
  // { path: "/cambridgeinstruction", component: CambridgeInstruction },
  { path: "/terms-condition", component: Terms },
  // { path: "/cambridgeinternational", component: CambridgeInternational },
  // { path: "/admission", component: Admission },
  // { path: "/forgot-password-old", component: ForgotPassword },
  // { path: "/reset-password-old", component: ResetPassword },
  // { path: "/validate-otp-old", component: ValidateOtp },
  // { path: "/online-application-sale", component: ApplicationSaleParent },
  // { path: "/online-application-sale", component: ApplicationSaleOnline },
  { path: "/paymentstatus/:branchId", component: PaymentStatus },

  // applicationSaleOnelineV2
  // {
  //   path : "/online-application-sale-v2",component : ApplicationSaleOnlineV2
  // },

  // { path: "/online-application-sale", component: ApplicationSaleOnline },  
  { path: "/online-application", component: PallaviApplicationSaleOnline },
  { path: "/feedback-form", component: FeedBackForm },
  { path: "/feedback-thank-you-page", component: FeedbackThankYouPage },
  // { path: "/registration-note", component: RegistrationNote },
  // { path: "/online-application-sale-form", component: ApplicationSaleParent },
  { path: "/online-application-sale", component: ApplicationSaleOnlineV2 },
  { path: "/online-application-sale-form", component: ApplicationSaleLogin },
  // {
  //   path : "/online-application-sale-form-v2",component : ApplicationSaleOnlineV2
  // },
  { path: "/application-tracking", component: ApplicationTracking },
  { path: "/application-tracking/:applicationo", component: ApplicationTracking },
  { path: "/tc-tracking", component: TCTracking },
  { path: "/applicationsuccess/:applicationsaleid", component: ApplicationSuccess },
  //Election-Council
  { path: "/student-council-elections", component: StudentCouncilElections, allowedRoles: ["BRANCH_ADMIN"] },
  { path: "/student-council-elections-new", component: StudentCouncilElectionsNew, allowedRoles: ["BRANCH_ADMIN"] },

  // { path: "/instruction", component: Instruction },
];
const LoginNew = React.lazy(() => import("../pages/LoginNew"));
const ValidateOtpNew = React.lazy(() => import("../pages/ValidateOtpNew"));
const ForgotPasswordNew = React.lazy(() => import("../pages/ForgotPasswordNew"));
const ResetPasswordNew = React.lazy(() => import("../pages/ResetPasswordNew"));

// login v1 screens
const LoginV1 = React.lazy(() => import("../pages/AuthV1/Login"))
const ForgotPasswordV1 = React.lazy(() => import("../pages/AuthV1/ForgotPassword"))
const ValidateOtpV1 = React.lazy(() => import("../pages/AuthV1/ValidateOtp"))
const ResetPasswordV1 = React.lazy(() => import("../pages/AuthV1/ResetPassword"))


const authRoutesV1 = [
  { path: "/login", component: LoginV1 },
  { path: "/forgotpassword", component: ForgotPasswordV1 },
  { path: "/validateotp", component: ValidateOtpV1 },
  { path: "/resetpassword", component: ResetPasswordV1 }
]

const authRoutes = [
  { path: '/loginv1', component: LoginNew },
  { path: '/validateotpv1', component: ValidateOtpNew },
  { path: '/forgotpasswordv1', component: ForgotPasswordNew },
  { path: '/resetpasswordv1', component: ResetPasswordNew }
]

const NewRegistration = React.lazy(() => import("../pages/NewRegistraction"));

const authRoutesBlankLayout = [
  { path: '/new-registration', component: NewRegistration },
  { path: "/thank-you-page", component: ThankYouPage },
  { path: "/registration-note", component: RegistrationNote },
]

const LedgerPaymentSuccess = React.lazy(() => import("../pages/LedgerPaymentSuccess"));
const StudentIdCardPaymentSuccess = React.lazy(() => import("../pages/StudentIdCardPaymentSuccess"));

const authProtectedBlankLayout = [
  { path: "/feeledgersuccess/:studentid", component: LedgerPaymentSuccess, allowedRoles: ["PARENT_ROLE"] },
  { path: "/studentidcardsuccess/:studentid", component: StudentIdCardPaymentSuccess, allowedRoles: ["PARENT_ROLE"] },
]
export { authProtectedRoutes, authProtectedBlankLayout, authRoutesBlankLayout, publicRoutes, authRoutes, authRoutesV1 };
