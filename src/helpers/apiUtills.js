//const API_URL = "http://18.203.31.131:8084"; // Local (Krina) URL
const API_URL = "http://192.168.3.32:1337"; // Local (Krina) URL
//const API_URL = "http://18.191.87.133:8084"; //Live URL
//const API_URL = "https://dev-backend.faldax.com"; //Live Client URL
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
            console.log('>>>>>>>>>>>>>>>>>>>>>>', error)
            console.error(error);
        }
    },

    //get all referrals api
    getAllReferrals: function (page, limit, token, userId) {
        let url = "/admin/referredUsers?id=" + userId + "&page=" + page + "&limit=" + limit;
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

    //get all announcement emails api
    getEmailTemplates: function (token) {
        try {
            return fetch(API_URL + "/admin/announcement/getAnnouncementTemplate", {
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

    //add announcement email api
    addTemplate: function (token, form) {
        try {
            return fetch(API_URL + "/admin/announcement/create", {
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

    //edit announcement email api
    editTemplate: function (token, form) {
        try {
            return fetch(API_URL + "/admin/announcement/update", {
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

    //delete announcement  email api
    deleteTemplate: function (token, templateId) {
        try {
            return fetch(API_URL + "/admin/announcement/delete?id=" + templateId, {
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
    getAllRoles: function (token) {
        try {
            return fetch(API_URL + "/admin/role/get", {
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
    getAllStates: function (token, countryId, search) {
        let url = "/admin/getStateData?country_id=" + countryId;
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
    getAllEmployee: function (token) {
        try {
            return fetch(API_URL + "/admin/get-employees", {
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

    //get all blogs api
    getAllBlogs: function (page, limit, token) {
        try {
            return fetch(API_URL + "/admin/all-blogs?page=" + page + "&limit=" + limit, {
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

    //add blog api call
    addBlog: function (token, form) {
        try {
            return fetch(API_URL + "/admin/create-blog", {
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

    //edit blog api call
    editBlog: function (token, form) {
        try {
            return fetch(API_URL + "/admin/edit-blog", {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                body: form,
            });
        } catch (error) {
            console.error(error);
        }
    },

    //delete blog api call
    deleteBlog: function (token, blogId) {
        try {
            return fetch(API_URL + "/admin/delete-blog", {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: blogId })
            });
        } catch (error) {
            console.error(error);
        }
    },

    getUserHistory: function (token, user_id) {
        try {
            return fetch(API_URL + "/admin/getUserloginHistory", {
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

    getAllPairs: function (page, limit, token) {
        try {
            return fetch(API_URL + "/admin/all-pairs?page=" + page + "&limit=" + limit, {
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

    getUserTrades: function (page, limit, token, search, user_id, filterVal) {
        let url = "/admin/all-trades?page=" + page + "&limit=" + limit + "&user_id=" + user_id;
        if (search && filterVal) {
            url += "&data=" + search + "&t_type=" + filterVal;
        } else if (search) {
            url += "&data=" + search;
        } else {
            url += "&t_type=" + filterVal;
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

    getAllSellOrders: function (page, limit, token, search, userId) {
        let url = "/admin/all-sell-orders?page=" + page + "&limit=" + limit;
        if (search) {
            url += "&data=" + search;
        }
        try {
            return fetch(API_URL + url, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
        } catch (error) {
            console.error(error);
        }
    },

    getAllBuyOrders: function (page, limit, token, search, userId) {
        let url = "/admin/all-buy-orders?page=" + page + "&limit=" + limit;
        if (search) {
            url += "&data=" + search;
        }
        try {
            return fetch(API_URL + url, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
        } catch (error) {
            console.error(error);
        }
    },

    //get all coins api
    getAllCoinRequests: function (page, limit, token, search, startDate, endDate) {
        let url = "/admin/coin-requests?page=" + page + "&limit=" + limit;
        if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
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

    //get all jobs api
    getAllJobs: function (page, limit, token, search) {
        let url = "/admin/all-jobs?page=" + page + "&limit=" + limit;
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

    //get all subscribers api
    getAllSubscribers: function (page, limit, token, search, startDate, endDate) {
        let url = "/admin/get-all-subscribers?page=" + page + "&limit=" + limit;

        if (search && startDate && endDate) {
            url += "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
        } else if (startDate && endDate) {
            url += "&start_date=" + startDate + "&end_date=" + endDate;
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

    //delete subscriber api call
    deleteSubscriber: function (token, subscriber_id) {
        try {
            return fetch(API_URL + "/admin/delete-subscriber", {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriber_id })
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

    //set featured blog api
    setFeatureBlog: function (token, form) {
        try {
            return fetch(API_URL + "/admin/set-featured-blog", {
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
};

export default ApiUtils;
