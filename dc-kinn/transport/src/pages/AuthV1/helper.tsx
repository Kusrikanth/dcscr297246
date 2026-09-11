export const getRoleForUser = (userRole: string) => {
    let role = "", redirectUrl = "";
    switch (userRole.toUpperCase()) {
        case "PLATFORM_ADMIN": {
            role = "SUPER_ADMIN";
            redirectUrl = "/institute-list";
            break;
        }
        case "BRANCH_ADMIN": {
            role = "BRANCH_ADMIN";
            redirectUrl = "/branch-dashboard";
            break;
        }
        case "INSTITUTE_ADMIN": {
            role = "INSTITUTE_ADMIN";
            redirectUrl = "/dashboard";
            break;
        }
        case "STUDENT": {
            role = "STUDENT_ROLE";
            redirectUrl = "/student-dashboard";
            break;
        }
        case "PARENT": {
            role = "PARENT_ROLE";
            redirectUrl = "/student-profile-details";
            break;
        }
        case "ADM_CONS": {
            role = "ADM_CONS";
            redirectUrl = "/admission-dashboard";
            break;
        } case "ADM_HEAD": {
            role = "ADM_HEAD";
            redirectUrl = "/admission-dashboard";
            break;
        } case "TEACHER": {
            role = "TEACHER";
            redirectUrl = "/section-management";
            break;
        }
        case "TRANSPORT_HEAD": {
            role = "TRANSPORT_HEAD";
            redirectUrl = "/transportation-dashboard";
            break;
        }
        case "ACCOUNT_HEAD": {
            role = "ACCOUNT_HEAD";
            redirectUrl = "/student-management";
            break;
        }
        case "ACCOUNT": {
            role = "ACCOUNT";
            redirectUrl = "/fee-dashboard";
            break;
        }
        case "TRANSPORT": {
            role = "TRANSPORT";
            redirectUrl = "/transportation-dashboard";
            break;
        }
        case "PRINCIPAL": {
            role = "PRINCIPAL";
            redirectUrl = "/section-management";
            break;
        }
        case "VICE_PRINCIPAL": {
            role = "VICE_PRINCIPAL";
            redirectUrl = "/section-management";
            break;
        }
        case "PA": {
            role = "PA";
            redirectUrl = "/section-management";
            break;
        }
        case "HR": {
            role = "HR";
            redirectUrl = "/student-management";
            break;
        }
        case "HR_HEAD": {
            role = "HR_HEAD";
            redirectUrl = "/student-management";
            break;
        }
        case "GRIEVANCE": {
            role = "GRIEVANCE";
            redirectUrl = "/student-management";
            break;
        }
        case "EMPLOYEE": {
            role = "EMPLOYEE";
            redirectUrl = "/my-concerns-feedback";
            break;
        }
        case "HOSTEL": {
            role = "HOSTEL";
            redirectUrl = "/hostel-admissions";
            break;
        }
        case "MEDICAL": {
            role = "MEDICAL";
            redirectUrl = "/health-records";
            break;
        }
        case "LIBRARY": {
            role = "LIBRARY";
            redirectUrl = "/library-book-collection";
            break;
        }
        case "EXAMINATION": {
            role = "EXAMINATION";
            redirectUrl = "/examination-dashboard";
            break;
        }
        case "ACCESS_ADMIN": {
            role = "ACCESS_ADMIN";
            redirectUrl = "/roletype-management";
            break;
        }
        default: {
            //
        }
    }
    return { role, redirectUrl }
}
