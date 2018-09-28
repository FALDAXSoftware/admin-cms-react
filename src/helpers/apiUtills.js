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

    //change admin password api
    changePassword: function (token, form) {
        try {
            return fetch(API_URL + "/admin/changePassword", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all counts for dashboard api
    getAllCount: function (token) {
        try {
            return fetch(API_URL + "/admin/dashboard/getData", {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all users api
    getAllUsers: function (page, limit, token, searchUser) {
        let url = "/admin/getUsers?page=" + page + "&limit=" + limit;
        if (searchUser) {
            url = url + "&data=" + searchUser;
        }
        try {
            return fetch(API_URL + url, {
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

    //edit user api
    editUser: function (token, form) {
        try {
            return fetch(API_URL + "/rest/editprofile-customer", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //activate user api
    activateUser: function (token, form) {
        try {
            return fetch(API_URL + "/admin/userActivate", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all coins api
    getAllCoins: function (page, limit, token, search) {
        let url = "/admin/getCoins?page=" + page + "&limit=" + limit;
        if (search) {
            url = url + "&data=" + search;
        }
        try {
            return fetch(API_URL + url, {
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

    //get all static pages api
    getStaticPages: function (token) {
        try {
            return fetch(API_URL + "/admin/static/getStaticPage", {
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

    //add static pages api
    addPage: function (token, form) {
        try {
            return fetch(API_URL + "/admin/static/create", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit static pages api
    editPage: function (token, form) {
        try {
            return fetch(API_URL + "/admin/static/update", {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } catch (error) {
            console.error(error);
        }
    },

    //delete static pages api
    deleteStaticPage: function (token, pageId) {
        try {
            return fetch(API_URL + "/admin/static/delete?id=" + pageId, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //forgot password api
    forgotPassword: function (form) {
        try {
            return fetch(API_URL + "/admin/forgotPassword", {
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
            return fetch(API_URL + "/admin/resetPassword", {
                method: 'PUT',
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

    //get all referrals api
    getAllReferrals: function (token, userId) {
        let url = "/admin/referredUsers?id=" + userId;
        try {
            return fetch(API_URL + url, {
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

    //get all email templates api
    getEmailTemplates: function (token) {
        try {
            return fetch(API_URL + "/admin/email-template/getEmailTemplate", {
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

    //add email template api
    addTemplate: function (token, form) {
        try {
            return fetch(API_URL + "/admin/email-template/create", {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit email template api
    editTemplate: function (token, form) {
        try {
            return fetch(API_URL + "/admin/email-template/update", {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } catch (error) {
            console.error(error);
        }
    },

    //delete email template api
    deleteTemplate: function (token, templateId) {
        try {
            return fetch(API_URL + "/admin/email-template/delete?id=" + templateId, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all counties api
    getAllCountries: function (page, limit, token, search) {
        let url = "/admin/getCountriesData?page=" + page + "&limit=" + limit;
        if (search) {
            url += '&data=' + search;
        }
        try {
            return fetch(API_URL + url, {
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

    //Activate-deactivate country api 
    activateCountry: function (token, form) {
        try {
            return fetch(API_URL + "/admin/countryActivate", {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(form),
            });
        } catch (error) {
            console.error(error);
        }
    },

};

export default ApiUtils;