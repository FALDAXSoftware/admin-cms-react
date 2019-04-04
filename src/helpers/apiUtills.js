//const API_URL = "http://192.168.1.211:1337"; // Local (Mansi) URL
//const API_URL = "http://192.168.3.32:1337"; // Local (Krina) URL
//const API_URL = "http://18.191.87.133:8084"; //Live URL
const API_URL = "https://dev-backend.faldax.com"; //Live Client URL
//const API_URL = "https://prod-backend.faldax.com"; //Live Client URL

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
    getAllUsers: function (page, limit, token, searchUser, sorterCol, sortOrder) {
        let url = "/admin/getUsers?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && searchUser) {
            url += "&data=" + searchUser + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + searchUser;
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
    getAllCoins: function (page, limit, token, search, sorterCol, sortOrder) {
        let url = "/admin/getCoins?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + search;
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
                },
                body: form,
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
                },
                body: form,
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
            console.log('>>>>>>>>>>>>>>>>>>>>>>', error)
            console.error(error);
        }
    },

    //get all referrals api
    getAllReferrals: function (page, limit, token, search) {
        let url = "/admin/referredUsers?page=" + page + "&limit=" + limit;
        if (search) {
            url += "&data=" + search;
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

    //get all counties api
    getAllCountries: function (page, limit, token, search, legality, sorterCol, sortOrder) {
        let url = "/admin/getCountriesData?page=" + page + "&limit=" + limit + '&legality=' + legality;
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + search;
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

    //Announce to users api 
    announceUser: function (token, form) {
        try {
            return fetch(API_URL + "/admin/email-send", {
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

    //get all roles api
    getAllRoles: function (token, sorterCol, sortOrder) {
        let url = "/admin/role/get";
        if (sorterCol && sortOrder) {
            url += "?sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
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

    //edit country api call
    editCountry: function (token, form) {
        try {
            return fetch(API_URL + "/admin/countryUpdate", {
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

    //get all states api
    getAllStates: function (token, countryId, search, sorterCol, sortOrder) {
        let url = "/admin/getStateData?country_id=" + countryId;
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + search;
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

    //Activate-deactivate state api 
    activateState: function (token, form) {
        try {
            return fetch(API_URL + "/admin/stateActivate", {
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

    //edit state api call
    editState: function (token, form) {
        try {
            return fetch(API_URL + "/admin/stateUpdate", {
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

    //add role api call
    addRole: function (token, form) {
        try {
            return fetch(API_URL + "/admin/role/create", {
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

    //edit role api call
    updateRole: function (token, form) {
        try {
            return fetch(API_URL + "/admin/role/update", {
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

    deleteRole: function (token, roleId) {
        try {
            return fetch(API_URL + "/admin/role/delete", {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: roleId })
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all employee api
    getAllEmployee: function (token, sorterCol, sortOrder, search) {
        let url = "/admin/get-employees";
        if (sorterCol && sortOrder && search) {
            url += "?data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "?sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "?data=" + search;
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

    //add employee api call
    addEmployee: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-employee", {
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

    //delete employee api call
    deleteEmployee: function (token, roleId) {
        try {
            return fetch(API_URL + "/admin/delete-employee", {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: roleId })
            });
        } catch (error) {
            console.error(error);
        }
    },

    //edit employee api call
    editEmployee: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update-employee", {
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

    getUserHistory: function (token, user_id, page, limit, data, startDate, endDate) {
        let url = "/admin/getUserloginHistory?page=" + page + "&limit=" + limit;
        if (data && startDate && endDate) {
            url += "&data=" + data + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else {
            url += "&data=" + data;
        }

        try {
            return fetch(API_URL + url, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: parseInt(user_id) })
            });
        } catch (error) {
            console.error(error);
        }
    },

    getAllPairs: function (page, limit, token, searchPair, sorterCol, sortOrder) {
        let url = "/admin/all-pairs?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && searchPair) {
            url += "&data=" + searchPair + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + searchPair;
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

    //add fees api call
    addPair: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-pair", {
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

    //edit pair api call
    updatePair: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-pair", {
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

    getAllLimit: function (token) {
        try {
            return fetch(API_URL + "/admin/all-limits", {
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

    //edit limit api call
    updateLimit: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-limit", {
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

    getAllTransaction: function (page, limit, token, search, filterVal, startDate, endDate) {
        let url = "/admin/all-transactions?page=" + page + "&limit=" + limit;
        if (search && filterVal && startDate) {
            url += "&search=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && filterVal) {
            url += "&search=" + search + "&t_type=" + filterVal;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&search=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&search=" + search
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
    //page, limit, token, searchTransaction, startDate, endDate, user_id, filterVal
    getUserTransaction: function (page, limit, token, search, startDate, endDate, user_id, filterVal) {
        console.log('>>>>>>', page, limit, token, search, startDate, endDate, user_id, filterVal)
        let url = "/admin/all-transactions?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        if (search && filterVal) {
            url += "&search=" + search + "&t_type=" + filterVal;
        } else if (search && startDate) {
            url += "&search=" + search + "&start_date=" + startDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&search=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&search=" + search
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

    getAllTrades: function (page, limit, token, search, filterVal, startDate, endDate) {
        let url = "/admin/all-trades?page=" + page + "&limit=" + limit;
        if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&data=" + search;
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

    getUserTrades: function (page, limit, token, search, user_id, filterVal, sorterCol, sortOrder) {
        let url = "/admin/all-trades?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        if (search && filterVal && sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder + "&data=" + search + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder && filterVal) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder && search) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder + "&data=" + search;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&data=" + search;
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

    getAllWithdrawRequests: function (page, limit, token, search, filterVal, startDate, endDate) {
        let url = "/admin/all-withdraw-requests?page=" + page + "&limit=" + limit;
        if (search && filterVal && startDate && endDate) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&data=" + search;
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

    //page, limit, token, searchReq, startDate, endDate, user_id, filterVal
    getUserWithdrawReq: function (page, limit, token, search, startDate, endDate, user_id, filterVal) {
        console.log('>>>>>>', page, limit, token, search, startDate, endDate, user_id, filterVal)
        let url = "/admin/all-withdraw-requests?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (search && startDate) {
            url += "&data=" + search + "&start_date=" + startDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&data=" + search
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

    getAllSellOrders: function (page, limit, token, search, user_id, sorterCol, sortOrder) {
        let url = "/admin/all-sell-orders?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + search;
        }

        try {
            return fetch(API_URL + url, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });
        } catch (error) {
            console.error(error);
        }
    },

    getAllBuyOrders: function (page, limit, token, search, user_id, sorterCol, sortOrder) {
        let url = "/admin/all-buy-orders?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "&data=" + search;
        }
        try {
            return fetch(API_URL + url, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all jobs api
    getAllJobs: function (page, limit, token, search, sorterCol, sortOrder) {
        let url = "/admin/all-jobs?page=" + page + "&limit=" + limit;
        if (sorterCol && sortOrder && search) {
            url += "?data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "?sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else {
            url += "?data=" + search;
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

    //get all job categories api
    getAllJobCategories: function (token) {
        try {
            return fetch(API_URL + "/admin/job-categories", {
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

    //add job api
    addJob: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-job", {
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

    //edit job api call
    updateJob: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-job", {
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

    //delete job api call
    deleteJob: function (jobId, token) {
        try {
            return fetch(API_URL + "/admin/delete-job?job_id=" + jobId, {
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

    //edit contact details api
    editContact: function (token, form) {
        try {
            return fetch(API_URL + "/edit-contact-details", {
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

    //get contact details api
    getContactDetails: function () {
        try {
            return fetch(API_URL + "/get-contact-details", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all jobs api
    getAllJobApplications: function (jobId, page, limit, token, search) {
        let url = "/job-applicants?page=" + page + "&limit=" + limit + "&job_id=" + jobId;
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

    //get all kyc data api
    getKYCData: function (token, page, limit, search) {
        let url = "/admin/get-all-kyc-data?page=" + page + "&limit=" + limit;
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

    //edit kyc status api
    updateKYCStatus: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update-kyc-status", {
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

    //get all fees api
    getFeesData: function (token) {
        let url = "/get-all-fee";
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

    //edit fees api
    updateFees: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-fee", {
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

    //panic button api
    panicBtn: function (token) {
        try {
            return fetch(API_URL + "/panic-button", {
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

    // get user details api
    getUserDetails: function (token, user_id) {
        try {
            return fetch(API_URL + "/admin/get-user-details?user_id=" + user_id, {
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

    // get employee details api
    getEmployeeDetails: function (token, emp_id) {
        try {
            return fetch(API_URL + "/admin/get-employee-details?emp_id=" + emp_id, {
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

    disableTwoFactor: function (token, form) {
        try {
            return fetch(API_URL + "/admin/disable-two-factor", {
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

    setupTwoFactor: function (token, form) {
        try {
            return fetch(API_URL + "/admin/setup-two-factor", {
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

    verifyOTP: function (token, form) {
        try {
            return fetch(API_URL + "/admin/verify-two-factor", {
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

    getAdminDetails: function (token, admin_id) {
        try {
            return fetch(API_URL + "/admin/get-details?admin_id=" + admin_id, {
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

    getAllNews: function (page, limit, token, searchNews, filterVal, startDate, endDate) {
        let url = "/admin/get-all-news?page=" + page + "&limit=" + limit;
        if (searchNews && filterVal && startDate && endDate) {
            url += "&data=" + searchNews + "&start_date=" + startDate + "&end_date=" + endDate + "&filterVal=" + filterVal;
        } else if (searchNews && startDate && endDate) {
            url += "&data=" + searchNews + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && startDate && endDate) {
            url += "&filterVal=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && searchNews) {
            url += "&filterVal=" + filterVal + "&search=" + searchNews;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&filterVal=" + filterVal;
        } else {
            url += "&search=" + searchNews;
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

    changeNewsStatus: function (token, form) {
        try {
            return fetch(API_URL + "/admin/change-news-status", {
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

    getNewsDetails: function (token, news_id) {
        try {
            return fetch(API_URL + "/admin/get-news-details?news_id=" + news_id, {
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

    updateReferral: function (token, form) {
        try {
            return fetch(API_URL + "/admin/updateUserReferal", {
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

    getKYCDetails: function (token, user_id) {
        try {
            return fetch(API_URL + "/admin/get-kyc-detail?user_id=" + user_id, {
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

    getReferredAmounts: function (token, ref_id) {
        try {
            return fetch(API_URL + "/admin/get-referred-amount-details?id=" + ref_id, {
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
};

export default ApiUtils;
