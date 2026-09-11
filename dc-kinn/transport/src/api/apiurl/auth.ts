// const apiUrl = 'http://43.205.46.211:8060';

// export const authUrl = {
//     user_login: `http://43.205.46.211:8012/settings-service/api/v1/institutes`,
//     login_user: `${apiUrl}/main/auth/010/login`,
//     forgot_password: ({ email }: any) => `${apiUrl}/main/auth/010/gfpotp?email=${email}`,
//     validate_otp: `${apiUrl}/main/auth/010/vfgotp`,
//     reset_password: `${apiUrl}/main/auth/010/rp`,
// }

export const authUrl = {
    login_user: ({ instituteId, branchId = "" }: any) => `/auth-service/api/auth/login?instituteId=${instituteId}&branchId=${branchId}`,
    login_user_v2: `/auth-service/v2/auth/login`,

    get_user_me: `/auth-service/api/auth/user/me`,
    get_user_me_v2: `/auth-service/v2/auth/me`,
    forgot_password: `/auth-service/api/auth/forgotPassword`,
    // validate_otp: `/main/auth/010/vfgotp`,
    validate_otp: `/auth-service/api/auth/enterOtp/`,
    reset_password: `/auth-service/api/auth/resetPassword`,
    change_password: `/auth-service/api/auth/changePassword`,
    change_password_v2: ({ isSuperAdmin }: any) => `/auth-service/v2/user/profile/change-password?isSuperAdmin=${isSuperAdmin}`,
    loggedin_user_details: ({ roleType, userId }: any) => `/auth-service/api/auth/user/${roleType}/${userId}`,
    update_user_detail: ({ roleType, userId }: any) => `/auth-service/api/auth/user/${roleType}/${userId}`,
    update_user_detail_v2: `/auth-service/v2/user/profile/update`,
    logout_user: ({ sessionId }: any) => `/auth-service/api/auth/logout?sessionId=${sessionId}`,
    logout_user_v2: `/auth-service/v2/auth/initiate-logout`,
    get_user_settings: `/auth-service/api/auth/user-settings`,
    save_user_settings: `/auth-service/api/auth/user-settings`,
}