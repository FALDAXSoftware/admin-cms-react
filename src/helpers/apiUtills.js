//const API_URL = "http://18.188.71.98:9000"; //Live URL
const API_URL = "http://18.191.87.133:8084"; //Local URL

const ApiUtils = {
    //super admin sign in api
    adminSignIn: function (form) {
        try {
            return fetch(API_URL + "/admin/login", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //add user api
    addUser: function (token, form) {
        try {
            return fetch(API_URL + "/users/create", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept': 'application/json',
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all users api
    getAllUsers: function (page, token, userId, form) {
        try {
            return fetch(API_URL + "/rest/count", {
                method: 'POST',
                headers: {
                    Authorisation: 'Bearer ' + token,
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit profile api
    editProfile: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //forgot password api
    forgotPassword: function (form) {
        try {
            return fetch(API_URL + "/forgot-password-admin", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //reset password api
    resetPassword: function (form) {
        try {
            return fetch(API_URL + "/reset-password-admin", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all users api
    getAllCount: function (isLoggedIn) {
        try {
            return fetch(API_URL + "/rest/count", {
                method: 'POST',
                mode: "cors",
                headers: {
                    Authorisation: isLoggedIn,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit admin profile api
    editAdminProfile: function (isLoggedIn, adminId, form) {
        try {
            return fetch(API_URL + "/rest/editprofile-admin", {
                method: 'POST',
                headers: {
                    Authorisation: isLoggedIn,
                    adminId,
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //change admin password api
    changePassword: function (isLoggedIn, adminId, form) {
        const myHeaders = new Headers();

        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorisation', isLoggedIn);
        if (adminId === 1) {
            myHeaders.append('adminId', adminId);
        } else {
            myHeaders.append('barOwnerId', adminId);
        }

        try {
            return fetch(API_URL + "/rest/change-password-admin", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit user api
    editUser: function (isLoggedIn, customerId, form) {
        try {
            return fetch(API_URL + "/rest/editprofile-customer", {
                method: 'POST',
                headers: {
                    Authorisation: isLoggedIn,
                    customerId
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

};

export default ApiUtils;