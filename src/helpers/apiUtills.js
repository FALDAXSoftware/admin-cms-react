const API_URL = "http://192.168.2.224:1337"; //Live URL
//const API_URL = "http://18.191.87.133:8084"; //Local URL

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
    getAllUsers: function (page, limit, token) {
        try {
            return fetch(API_URL + "/admin/getUsers?page=" + page + "&limit=" + limit, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all coins api
    getAllCoins: function (page, limit, token) {
        try {
            return fetch(API_URL + "/admin/getCoins?page=" + page + "&limit=" + limit, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //add coin api
    addCoin: function (token, form) {
        try {
            return fetch(API_URL + "/admin/coins/create", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
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

    //edit coin api
    editCoin: function (token, form) {
        try {
            return fetch(API_URL + "/admin/coins/update", {
                method: 'PUT',
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

    //delete coin api
    deleteCoin: function (coinId, token) {
        try {
            return fetch(API_URL + "/admin/coins/delete?id=" + coinId, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept': 'application/json'
                }
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
                    Authorization: isLoggedIn,
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
                    Authorization: isLoggedIn,
                    adminId,
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //change admin password api
    changePassword: function (token, form) {
        try {
            return fetch(API_URL + "/admin/changePassword", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    // userId,
                },
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
                    Authorization: isLoggedIn,
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