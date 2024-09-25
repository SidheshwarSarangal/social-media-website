const BASE_URL = process.env.REACT_APP_BASE_URL

export const endpoints = {
    //SENDOTP_API: BASE_URL + "/auth/sendotp",
    //SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    //RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    //RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
 //   GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
 //   GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}