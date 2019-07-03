import { stat } from "fs";
//const API_URL = "http://192.168.0.213:1337"; // Local (Mansi) URL
//const API_URL = "http://192.168.3.32:1337"; // Local (Krina) URL
//const API_URL = "http://192.168.2.224:1337"; // Local (Kalpit) URL
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
            return fetch(API_URL + "/admin/change-password", {
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
    getAllCount: function (token, startDate, endDate) {
        let url = "/admin/dashboard/get-data";
        if (startDate && endDate) {
            url += "?kyc_start_date=" + startDate + "&kyc_end_date=" + endDate;
        }
        try {
            return fetch(API_URL + url, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
        } catch (error) {
            console.error('dashbiard', error);
        }
    },

    //get all users api
    getAllUsers: function (page, limit, token, searchUser, sorterCol, sortOrder, filterVal) {
        let url = "/admin/get-users?page=" + page + "&limit=" + limit;
        searchUser = encodeURIComponent(searchUser);
        if (sorterCol && sortOrder && searchUser && filterVal) {
            url += "&data=" + searchUser + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&country=" + filterVal;
        } else if (sorterCol && sortOrder && filterVal) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&country=" + filterVal;
        } else if (sorterCol && sortOrder && searchUser) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&data=" + searchUser;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (searchUser && filterVal) {
            url += "&data=" + searchUser + "&country=" + filterVal;
        } else if (filterVal) {
            url += "&country=" + filterVal;
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
            return fetch(API_URL + "/admin/user-activate", {
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
        let url = "/admin/get-coins?page=" + page + "&limit=" + limit;
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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
            return fetch(API_URL + "/admin/forgot-password", {
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
            return fetch(API_URL + "/admin/reset-password", {
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
    getAllUserReferrals: function (page, limit, token, user_id, sorterCol, sortOrder) {
        let url = "/admin/referred-users?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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

    //get all referrals api
    getAllReferrals: function (page, limit, token, searchReferral, sorterCol, sortOrder) {
        let url = "/admin/referred-users?page=" + page + "&limit=" + limit;
        searchReferral = encodeURIComponent(searchReferral);
        if (sorterCol && sortOrder && searchReferral) {
            url += "&data=" + searchReferral + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else {
            url += "&data=" + searchReferral;
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
        let url = "/admin/get-countries-data?page=" + page + "&limit=" + limit + '&legality=' + legality;
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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
            return fetch(API_URL + "/admin/country-activate", {
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
    getAllRoles: function (token, sorterCol, sortOrder, status) {
        let url = "/admin/role/get?status=" + status;
        if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
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
            return fetch(API_URL + "/admin/country-update", {
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
        let url = "/admin/get-state-data?country_id=" + countryId;
        search = encodeURIComponent(search);
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
            return fetch(API_URL + "/admin/state-activate", {
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
            return fetch(API_URL + "/admin/state-update", {
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
        search = encodeURIComponent(search);
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

    //user login history api call
    getUserHistory: function (token, user_id, page, limit, data, startDate, endDate) {
        let url = "/admin/get-user-login-history?page=" + page + "&limit=" + limit;
        data = encodeURIComponent(data);
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

    getAllPairs: function (page, limit, token, searchPair, sorterCol, sortOrder, selectedAsset) {
        let url = "/admin/all-pairs?page=" + page + "&limit=" + limit;
        searchPair = encodeURIComponent(searchPair);
        if (sorterCol && sortOrder && searchPair && selectedAsset) {
            url += "&data=" + searchPair + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&filter_val=" + selectedAsset;
        } else if (sorterCol && sortOrder && selectedAsset) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&filter_val=" + selectedAsset;
        } else if (searchPair && sorterCol && sortOrder) {
            url += "&data=" + searchPair + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (searchPair && selectedAsset) {
            url += "&data=" + searchPair + "&filter_val=" + selectedAsset;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (selectedAsset) {
            url += "&filter_val=" + selectedAsset;
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

    getAllTransaction: function (page, limit, token, search, filterVal, startDate, endDate, sorterCol, sortOrder) {
        let url = "/admin/all-transactions?page=" + page + "&limit=" + limit;
        search = encodeURIComponent(search);
        if (search && filterVal && sorterCol && sortOrder && startDate && endDate) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && sorterCol && sortOrder && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && sorterCol && sortOrder && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder && startDate && endDate) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && search && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
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

    //user wise transaction list api call
    getUserTransaction: function (page, limit, token, search, startDate, endDate, user_id, filterVal, sorterCol, sortOrder) {
        let url = "/admin/all-transactions?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        search = encodeURIComponent(search);
        if (search && filterVal && sorterCol && sortOrder && startDate && endDate) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && sorterCol && sortOrder && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && sorterCol && sortOrder && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder && startDate && endDate) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && search && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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

    getAllTrades: function (page, limit, token, search, filterVal, startDate, endDate, sorterCol, sortOrder) {
        let url = "page=" + page + "&limit=" + limit;
        search = encodeURIComponent(search);
        if (search && filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + search + "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate && sorterCol && sortOrder) {
            url += "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal && startDate && endDate) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && filterVal && sorterCol && sortOrder) {
            url += "&data=" + search + "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal) {
            url += "&t_type=" + filterVal;
        } else {
            url += "&data=" + search;
        }

        try {
            return fetch(API_URL + "/admin/all-trades?" + url, {
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
        search = encodeURIComponent(search);
        if (search && filterVal && sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&data=" + search + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder && filterVal) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&t_type=" + filterVal;
        } else if (sorterCol && sortOrder && search) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder + "&data=" + search;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && search) {
            url += "&data=" + search + "&t_type=" + filterVal;
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

    getAllWithdrawRequests: function (page, limit, token, search, filterVal, startDate, endDate, sorterCol, sortOrder) {
        let url = "/admin/all-withdraw-requests?page=" + page + "&limit=" + limit;
        search = encodeURIComponent(search);
        if (search && filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate && sorterCol && sortOrder) {
            url += "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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
    getUserWithdrawReq: function (page, limit, token, search, startDate, endDate, user_id, filterVal, sorterCol, sortOrder) {
        let url = "/admin/all-withdraw-requests?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        search = encodeURIComponent(search);
        if (search && startDate && endDate && filterVal && sorterCol && sortOrder) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && sorterCol && sortOrder && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate && sorterCol && sortOrder) {
            url += "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (search && sorterCol && sortOrder) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate) {
            url += "&t_type=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&t_type=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
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
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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

    //get all job categories api
    getAllJobCategories: function (token, active) {
        try {
            return fetch(API_URL + "/admin/job-categories?active=" + active, {
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
            return fetch(API_URL + "/admin/get-contact-details", {
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
    getAllJobApplications: function (jobId, page, limit, token, search, sorterCol, sortOrder) {
        let url = "/admin/job-applicants?page=" + page + "&limit=" + limit + "&job_id=" + jobId;
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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

    //get all kyc data api
    getKYCData: function (token, page, limit, search, sorterCol, sortOrder, status) {
        let url = "/admin/get-all-kyc-data?page=" + page + "&limit=" + limit;
        search = encodeURIComponent(search);
        if (sorterCol && sortOrder && search && status) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder + "&status=" + status
        } else if (sorterCol && sortOrder && search) {
            url += "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (sorterCol && sortOrder) {
            url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
        } else if (search && status) {
            url += "&data=" + search + "&status=" + status;
        } else if (status) {
            url += "&status=" + status;
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
        let url = "/admin/get-all-fee";
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

    getPanicBtnDetails: function (token) {
        try {
            return fetch(API_URL + "/get-panic-status", {
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

    //panic button api
    panicBtn: function (token, form) {
        try {
            return fetch(API_URL + "/panic-button", {
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

    //get all news api
    getAllNews: function (page, limit, token, searchNews, filterVal, startDate, endDate, sorterCol, sortOrder) {
        let url = "/admin/get-all-news?page=" + page + "&limit=" + limit;
        searchNews = encodeURIComponent(searchNews);
        if (searchNews && filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + searchNews + "&start_date=" + startDate + "&end_date=" + endDate + "&filter_val=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (searchNews && startDate && endDate && sorterCol && sortOrder) {
            url += "&data=" + searchNews + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
            url += "&filter_val=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && searchNews && sorterCol && sortOrder) {
            url += "&filter_val=" + filterVal + "&data=" + searchNews + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && searchNews && startDate && endDate) {
            url += "&filter_val=" + filterVal + "&data=" + searchNews + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate && sorterCol && sortOrder) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate && sorterCol && sortOrder) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (filterVal && sorterCol && sortOrder) {
            url += "&filter_val=" + filterVal + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (filterVal && startDate && endDate) {
            url += "&filter_val=" + filterVal + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (searchNews && sorterCol && sortOrder) {
            url += "&data=" + searchNews + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (sorterCol && sortOrder) {
            url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
        } else if (searchNews && filterVal) {
            url += "&data=" + searchNews + "&filter_val=" + filterVal;
        } else if (filterVal) {
            url += "&filter_val=" + filterVal;
        } else {
            url += "&data=" + searchNews;
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
            return fetch(API_URL + "/admin/update-user-referal", {
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

    updateSendCoinFee: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update-send-coin-fee", {
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

    //add user api call
    addUser: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-user", {
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

    getWalletCoins: function (token) {
        try {
            return fetch(API_URL + "/coin-list", {
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

    getUserTickets: function (token, form) {
        try {
            return fetch(API_URL + "/admin/get-user-tickets", {
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

    getAllAccountClasses: function (token, sorterCol, sortOrder) {
        let url = "/admin/get-all-account-classes";
        if (sorterCol && sortOrder) {
            url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
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

    addAccountClass: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-account-class", {
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

    updateAccountClass: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update-account-class", {
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

    deleteAccountClass: function (token, form) {
        try {
            return fetch(API_URL + "/admin/delete-account-class", {
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

    getAssetDetails: function (token, coin_id) {
        try {
            return fetch(API_URL + "/admin/coin/get-coin-details?id=" + coin_id, {
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

    getAssetLimits: function (token, coin_id) {
        try {
            return fetch(API_URL + "/admin/all-limits?coin_id=" + coin_id, {
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

    updateAssetLimits: function (token, form) {
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

    getUserLimits: function (token, user_id) {
        try {
            return fetch(API_URL + "/admin/all-user-limits?user_id=" + user_id, {
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

    updateUserLimits: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-user-limit", {
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

    getAllEmailTemplates: function (token) {
        try {
            return fetch(API_URL + "/admin/emailTemplate/get", {
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

    updateEmailTemplate: function (token, form) {
        try {
            return fetch(API_URL + "/admin/emailTemplate/update", {
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

    getAllNewsSources: function (token) {
        try {
            return fetch(API_URL + "/admin/all-new-source", {
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

    updateNewsSource: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-news-source", {
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

    changeWithdrawStaus: function (token, form) {
        try {
            return fetch(API_URL + "/admin/approve-disapprove-withdraw-request", {
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

    getTemplateDetails: function (token, template_id) {
        try {
            return fetch(API_URL + "/admin/emailTemplate/get-by-id?id=" + template_id, {
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

    //edit job category api call
    updateJobCategory: function (token, form) {
        try {
            return fetch(API_URL + "/admin/update-job-category", {
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

    addJobCategory: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-job-category", {
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

    addWhitelistIP: function (token, form) {
        try {
            return fetch(API_URL + "/admin/add-whitelist-ip", {
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

    getAllWhitelistIP: function (token, id) {
        try {
            return fetch(API_URL + "/admin/get-all-whitelist-ip?admin_id=" + id, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

};

export default ApiUtils;
