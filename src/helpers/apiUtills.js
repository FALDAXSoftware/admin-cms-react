import { stat } from "fs";
// const API_URL = "http://192.168.0.213:1337"; // Local (Mansi) URL
//const API_URL = "http://192.168.3.32:1337"; // Local (Krina) URL
//const API_URL = "http://192.168.2.224:1337"; // Local (Kalpit) URL
// const API_URL = "http://192.168.1.96:1337"; //Local Jagdish URL
// const API_URL = "https://dev-backend.faldax.com"; //Live Client URL
const API_URL = "https://pre-prod-backend.faldax.com"; //Preprod URL
//const API_URL = "https://prod-backend.faldax.com"; //Live Client URL

const ApiUtils = {
  //super admin sign in api
  adminSignIn: function(form) {
    try {
      return fetch(API_URL + "/admin/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit profile api
  editProfile: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //change admin password api
  changePassword: function(token, form) {
    try {
      return fetch(API_URL + "/admin/change-password", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //change employee password api
  changeEmployeePassword: function(token, form) {
    try {
      return fetch(API_URL + "/admin/employee-change-password", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all counts for dashboard api
  getAllCount: function(token, startDate, endDate) {
    let url = "/admin/dashboard/get-data";
    if (startDate && endDate) {
      url += "?kyc_start_date=" + startDate + "&kyc_end_date=" + endDate;
    }
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      });
    } catch (error) {
      console.error("dashbiard", error);
    }
  },

  getCampaignUserList: function(token) {
    let url = "/admin/users/list";
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      });
    } catch (error) {
      console.error("dashbiard", error);
    }
  },

  //get all counts for dashboard api
  getMetabase: function() {
    let url = "/metabase-details";
    try {
      return fetch(API_URL + url, {
        method: "GET"
        // headers: {
        //   Authorization: "Bearer " + token
        // }
      });
    } catch (error) {
      console.error("dashbiard", error);
    }
  },

  //get all users api
  getAllUsers: function(
    page,
    limit,
    token,
    searchUser,
    sorterCol,
    sortOrder,
    filterVal
  ) {
    let url = "/admin/get-users?page=" + page + "&limit=" + limit;
    searchUser = encodeURIComponent(searchUser);
    if (sorterCol && sortOrder && searchUser && filterVal) {
      url +=
        "&data=" +
        searchUser +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && filterVal) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && searchUser) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&data=" +
        searchUser;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all in-active users api
  getAllInActiveUsers: function(
    page,
    limit,
    token,
    searchUser,
    sorterCol,
    sortOrder,
    filterVal
  ) {
    let url = "/admin/get-inactive-users?page=" + page + "&limit=" + limit;
    searchUser = encodeURIComponent(searchUser);
    if (sorterCol && sortOrder && searchUser && filterVal) {
      url +=
        "&data=" +
        searchUser +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && filterVal) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && searchUser) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&data=" +
        searchUser;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all in-active users api
  getAllDeletedUsers: function(
    page,
    limit,
    token,
    searchUser,
    sorterCol,
    sortOrder,
    filterVal
  ) {
    let url = "/admin/get-deleted-users?page=" + page + "&limit=" + limit;
    searchUser = encodeURIComponent(searchUser);
    if (sorterCol && sortOrder && searchUser && filterVal) {
      url +=
        "&data=" +
        searchUser +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && filterVal) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&country=" +
        filterVal;
    } else if (sorterCol && sortOrder && searchUser) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&data=" +
        searchUser;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //activate user api
  activateUser: function(token, form) {
    try {
      return fetch(API_URL + "/admin/user-activate", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //delete user api
  deleteUser: function(token, user_id) {
    try {
      return fetch(API_URL + "/admin/delete-user?user_id=" + user_id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all coins api
  getAllCoins: function(page, limit, token, search, sorterCol, sortOrder) {
    let url = "/admin/get-coins?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add coin api
  addCoin: function(token, form) {
    try {
      return fetch(API_URL + "/admin/coins/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: form
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit coin api
  editCoin: function(token, form) {
    try {
      return fetch(API_URL + "/admin/coins/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //delete coin api
  deleteCoin: function(coinId, token) {
    try {
      return fetch(API_URL + "/admin/coins/delete?id=" + coinId, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //forgot password api
  forgotPassword: function(form) {
    try {
      return fetch(API_URL + "/admin/forgot-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //reset password api
  resetPassword: function(form) {
    try {
      return fetch(API_URL + "/admin/reset-password", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all referrals api
  getAllUserReferrals: function(
    page,
    limit,
    token,
    user_id,
    sorterCol,
    sortOrder
  ) {
    let url =
      "/admin/referred-users?page=" +
      page +
      "&limit=" +
      limit +
      "&user_id=" +
      user_id;
    if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all referrals api
  getAllReferrals: function(
    page,
    limit,
    token,
    searchReferral,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/get-referal-list";
    searchReferral = encodeURIComponent(searchReferral);
    // if (sorterCol && sortOrder && searchReferral) {
    //     url += "&data=" + searchReferral + "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    // } else if (sorterCol && sortOrder) {
    //     url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    // } else {
    //     url += "&data=" + searchReferral;
    // }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all counties api
  getAllCountries: function(
    page,
    limit,
    token,
    search,
    legality,
    sorterCol,
    sortOrder
  ) {
    let url =
      "/admin/get-countries-data?page=" +
      page +
      "&limit=" +
      limit +
      "&legality=" +
      legality;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //Activate-deactivate country api
  activateCountry: function(token, form) {
    try {
      return fetch(API_URL + "/admin/country-activate", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //Announce to users api
  announceUser: function(token, form) {
    try {
      return fetch(API_URL + "/admin/email-send", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all roles api
  getAllRoles: function(token, sorterCol, sortOrder, status) {
    let url = "/admin/role/get?status=" + status;
    if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllPermissions: function(token) {
    let url = "/get-all-permissions";
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit country api call
  editCountry: function(token, form) {
    try {
      return fetch(API_URL + "/admin/country-update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all states api
  getAllStates: function(token, countryId, search, sorterCol, sortOrder) {
    let url = "/admin/get-state-data?country_id=" + countryId;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //Activate-deactivate state api
  activateState: function(token, form) {
    try {
      return fetch(API_URL + "/admin/state-activate", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit state api call
  editState: function(token, form) {
    try {
      return fetch(API_URL + "/admin/state-update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add role api call
  addRole: function(token, form) {
    try {
      return fetch(API_URL + "/admin/role/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit role api call
  updateRole: function(token, form) {
    try {
      return fetch(API_URL + "/admin/role/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  deleteRole: function(token, roleId) {
    try {
      return fetch(API_URL + "/admin/role/delete", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: roleId })
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all employee api
  getAllEmployee: function(page, limit, token, sorterCol, sortOrder, search) {
    let url = "/admin/get-employees?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else {
      url += "&data=" + search;
    }
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add employee api call
  addEmployee: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-employee", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //delete employee api call
  deleteEmployee: function(token, roleId) {
    try {
      return fetch(API_URL + "/admin/delete-employee", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: roleId })
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit employee api call
  editEmployee: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-employee", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //user login history api call
  getUserHistory: function(
    token,
    user_id,
    page,
    limit,
    data,
    startDate,
    endDate
  ) {
    let url = "/admin/get-user-login-history?page=" + page + "&limit=" + limit;
    data = encodeURIComponent(data);
    if (data && startDate && endDate) {
      url +=
        "&data=" + data + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (startDate && endDate) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else {
      url += "&data=" + data;
    }

    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: parseInt(user_id) })
      });
    } catch (error) {
      console.error(error);
    }
  },

  //user delete account summary
  getUserAccountSummary: function(token, user_id) {
    let url = "/admin/deleteAccountCheck?user_id=" + user_id;

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllPairs: function(
    page,
    limit,
    token,
    searchPair,
    sorterCol,
    sortOrder,
    selectedAsset
  ) {
    let url = "/admin/all-pairs?page=" + page + "&limit=" + limit;
    searchPair = encodeURIComponent(searchPair);
    if (sorterCol && sortOrder && searchPair && selectedAsset) {
      url +=
        "&data=" +
        searchPair +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&filter_val=" +
        selectedAsset;
    } else if (sorterCol && sortOrder && selectedAsset) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&filter_val=" +
        selectedAsset;
    } else if (searchPair && sorterCol && sortOrder) {
      url +=
        "&data=" +
        searchPair +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add fees api call
  addPair: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-pair", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit pair api call
  updatePair: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-pair", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllLimit: function(token) {
    try {
      return fetch(API_URL + "/admin/all-limits", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit limit api call
  updateLimit: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-limit", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllTransaction: function(
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-transactions?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (search && filterVal && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && filterVal && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&t_type=" +
        filterVal;
    } else if (sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && search && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (startDate && endDate) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (search && filterVal) {
      url += "&data=" + search + "&t_type=" + filterVal;
    } else if (filterVal) {
      url += "&t_type=" + filterVal;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //user wise transaction list api call
  getUserTransaction: function(
    page,
    limit,
    token,
    search,
    startDate,
    endDate,
    user_id,
    filterVal,
    sorterCol,
    sortOrder
  ) {
    let url =
      "/admin/all-transactions?page=" +
      page +
      "&limit=" +
      limit +
      "&user_id=" +
      user_id;
    search = encodeURIComponent(search);
    if (search && filterVal && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && search && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllTrades: function(
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder,
    trade_type
  ) {
    let url = "page=" + page + "&limit=" + limit + "&trade_type=" + trade_type;
    search = encodeURIComponent(search);
    if (search && filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && filterVal && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && filterVal && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllSimplexTrades: function(
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder,
    trade_type,
    simplex_payment_status
  ) {
    let url = "page=" + page + "&limit=" + limit + "&trade_type=" + trade_type;
    search = encodeURIComponent(search);
    if (search && filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (
      Number.isInteger(simplex_payment_status) &&
      search &&
      startDate &&
      endDate &&
      sorterCol &&
      sortOrder
    ) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && filterVal && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && filterVal && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (
      Number.isInteger(simplex_payment_status) &&
      filterVal &&
      startDate &&
      endDate &&
      sorterCol &&
      sortOrder
    ) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (
      Number.isInteger(simplex_payment_status) &&
      startDate &&
      endDate &&
      sorterCol &&
      sortOrder
    ) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (
      Number.isInteger(simplex_payment_status) &&
      startDate &&
      endDate
    ) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (
      Number.isInteger(simplex_payment_status) &&
      sorterCol &&
      sortOrder
    ) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && filterVal) {
      url += "&data=" + search + "&t_type=" + filterVal;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (startDate && endDate) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (Number.isInteger(simplex_payment_status) && filterVal) {
      url +=
        "&simplex_payment_status=" +
        simplex_payment_status +
        "&t_type=" +
        filterVal;
    } else if (Number.isInteger(simplex_payment_status) && search) {
      url +=
        "&simplex_payment_status=" + simplex_payment_status + "&data=" + search;
    } else if (Number.isInteger(simplex_payment_status)) {
      url += "&simplex_payment_status=" + simplex_payment_status;
    } else if (filterVal) {
      url += "&t_type=" + filterVal;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + "/admin/all-trades?" + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getUserTrades: function(
    page,
    limit,
    token,
    search,
    user_id,
    filterVal,
    sorterCol,
    sortOrder,
    trade_type,
    simplex_payment_status
  ) {
    let url =
      "/admin/all-trades?page=" +
      page +
      "&limit=" +
      limit +
      "&user_id=" +
      user_id +
      "&trade_type=" +
      trade_type;
    search = encodeURIComponent(search);
    if (
      search &&
      filterVal &&
      sorterCol &&
      sortOrder &&
      simplex_payment_status
    ) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&simplex_payment_status=" +
        simplex_payment_status;
    } else if (search && sorterCol && sortOrder && filterVal) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&t_type=" +
        filterVal;
    } else if (sorterCol && sortOrder && filterVal && simplex_payment_status) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&t_type=" +
        filterVal +
        "&simplex_payment_status=" +
        simplex_payment_status;
    } else if (sorterCol && sortOrder && search) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&data=" +
        search;
    } else if (sorterCol && sortOrder && simplex_payment_status) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&simplex_payment_status=" +
        simplex_payment_status;
    } else if (sorterCol && sortOrder && filterVal) {
      url +=
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder +
        "&t_type=" +
        filterVal;
    } else if (search && simplex_payment_status) {
      url +=
        "&data=" + search + "&simplex_payment_status=" + simplex_payment_status;
    } else if (filterVal && simplex_payment_status) {
      url +=
        "&t_type=" +
        filterVal +
        "&simplex_payment_status=" +
        simplex_payment_status;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (filterVal && search) {
      url += "&data=" + search + "&t_type=" + filterVal;
    } else if (simplex_payment_status) {
      url += "&simplex_payment_status=" + simplex_payment_status;
    } else if (filterVal) {
      url += "&t_type=" + filterVal;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllWithdrawRequests: function(
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-withdraw-requests?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (search && filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && filterVal) {
      url += "&data=" + search + "&t_type=" + filterVal;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //page, limit, token, searchReq, startDate, endDate, user_id, filterVal
  getUserWithdrawReq: function(
    page,
    limit,
    token,
    search,
    startDate,
    endDate,
    user_id,
    filterVal,
    sorterCol,
    sortOrder
  ) {
    let url =
      "/admin/all-withdraw-requests?page=" +
      page +
      "&limit=" +
      limit +
      "&user_id=" +
      user_id;
    search = encodeURIComponent(search);
    if (search && startDate && endDate && filterVal && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate && filterVal) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && sorterCol && sortOrder && filterVal) {
      url +=
        "&data=" +
        search +
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (search && startDate && endDate) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (search && sorterCol && sortOrder) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&t_type=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&t_type=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (search && filterVal) {
      url += "&data=" + search + "&t_type=" + filterVal;
    } else if (filterVal) {
      url += "&t_type=" + filterVal;
    } else {
      url += "&data=" + search;
    }
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllSellOrders: function(
    page,
    limit,
    token,
    search,
    user_id,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-sell-orders?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id })
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllPendingOrders: function(
    page,
    limit,
    token,
    search,
    user_id,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-pending-orders?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id })
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllCancelledOrders: function(
    page,
    limit,
    token,
    search,
    user_id,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-cancelled-orders?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id })
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllBuyOrders: function(
    page,
    limit,
    token,
    search,
    user_id,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/all-buy-orders?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id })
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all jobs api
  getAllJobs: function(page, limit, token, search, sorterCol, sortOrder) {
    let url = "/admin/all-jobs?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all job categories api
  getAllJobCategories: function(token, active) {
    try {
      return fetch(API_URL + "/admin/job-categories?active=" + active, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add job api
  addJob: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-job", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit job api call
  updateJob: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-job", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //delete job api call
  deleteJob: function(jobId, token) {
    try {
      return fetch(API_URL + "/admin/delete-job?job_id=" + jobId, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit contact details api
  editContact: function(token, form) {
    try {
      return fetch(API_URL + "/edit-contact-details", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get contact details api
  getContactDetails: function() {
    try {
      return fetch(API_URL + "/admin/get-contact-details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all jobs api
  getAllJobApplications: function(
    jobId,
    page,
    limit,
    token,
    search,
    sorterCol,
    sortOrder
  ) {
    let url =
      "/admin/job-applicants?page=" +
      page +
      "&limit=" +
      limit +
      "&job_id=" +
      jobId;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "&sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all kyc data api
  getKYCData: function(
    token,
    page,
    limit,
    search,
    sorterCol,
    sortOrder,
    startDate,
    endDate,
    status
  ) {
    let url = "/admin/get-all-kyc-data?page=" + page + "&limit=" + limit;
    search = encodeURIComponent(search);
    if (sorterCol && sortOrder && search && startDate && endDate && status) {
      url +=
        "&data=" +
        search +
        "&sortCol=" +
        sorterCol +
        "&sortOrder=" +
        sortOrder +
        "&status=" +
        status +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (sorterCol && sortOrder && search && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&sortCol=" +
        sorterCol +
        "&sortOrder=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (sorterCol && sortOrder && search) {
      url +=
        "&data=" + search + "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else if (startDate && endDate && search) {
      url +=
        "&data=" + search + "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (sorterCol && sortOrder && startDate && endDate) {
      url +=
        "&sortCol=" +
        sorterCol +
        "&sortOrder=" +
        sortOrder +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && status && startDate && endDate) {
      url +=
        "&data=" +
        search +
        "&status=" +
        status +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (status && startDate && endDate) {
      url +=
        "&status=" +
        status +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (search && status) {
      url += "&data=" + search + "&status=" + status;
    } else if (startDate && endDate) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    } else if (status) {
      url += "&status=" + status;
    } else {
      url += "&data=" + search;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all fees api
  getFeesData: function(token) {
    let url = "/admin/get-all-fee";
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //edit fees api
  updateFees: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-fee", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getPanicBtnDetails: function(token) {
    try {
      return fetch(API_URL + "/get-panic-status", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //panic button api
  panicBtn: function(token, form) {
    try {
      return fetch(API_URL + "/toggle-panic-status", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  // get user details api
  getUserDetails: function(token, user_id) {
    try {
      return fetch(API_URL + "/admin/get-user-details?user_id=" + user_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  // get employee details api
  getEmployeeDetails: function(token, emp_id) {
    try {
      return fetch(API_URL + "/admin/get-employee-details?emp_id=" + emp_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  disableTwoFactor: function(token, form) {
    try {
      return fetch(API_URL + "/admin/disable-two-factor", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  setupTwoFactor: function(token, form) {
    try {
      return fetch(API_URL + "/admin/setup-two-factor", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  verifyOTP: function(token, form) {
    try {
      return fetch(API_URL + "/admin/verify-two-factor", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAdminDetails: function(token, admin_id) {
    try {
      return fetch(API_URL + "/admin/get-details?admin_id=" + admin_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  //get all news api
  getAllNews: function(
    page,
    limit,
    token,
    searchNews,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder
  ) {
    let url = "/admin/get-all-news?page=" + page + "&limit=" + limit;
    searchNews = encodeURIComponent(searchNews);
    if (
      searchNews &&
      filterVal &&
      startDate &&
      endDate &&
      sorterCol &&
      sortOrder
    ) {
      url +=
        "&data=" +
        searchNews +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&filter_val=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (searchNews && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&data=" +
        searchNews +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate && sorterCol && sortOrder) {
      url +=
        "&filter_val=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && searchNews && sorterCol && sortOrder) {
      url +=
        "&filter_val=" +
        filterVal +
        "&data=" +
        searchNews +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && searchNews && startDate && endDate) {
      url +=
        "&filter_val=" +
        filterVal +
        "&data=" +
        searchNews +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (startDate && endDate && sorterCol && sortOrder) {
      url += "&start_date=" + startDate + "&end_date=" + endDate;
    } else if (filterVal && sorterCol && sortOrder) {
      url +=
        "&filter_val=" +
        filterVal +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
    } else if (filterVal && startDate && endDate) {
      url +=
        "&filter_val=" +
        filterVal +
        "&start_date=" +
        startDate +
        "&end_date=" +
        endDate;
    } else if (searchNews && sorterCol && sortOrder) {
      url +=
        "&data=" +
        searchNews +
        "&sort_col=" +
        sorterCol +
        "&sort_order=" +
        sortOrder;
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
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  changeNewsStatus: function(token, form) {
    try {
      return fetch(API_URL + "/admin/change-news-status", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getNewsDetails: function(token, news_id) {
    try {
      return fetch(API_URL + "/admin/get-news-details?news_id=" + news_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateReferral: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-user-referal", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getKYCDetails: function(token, user_id) {
    try {
      return fetch(API_URL + "/admin/get-kyc-detail?user_id=" + user_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getReferredAmounts: function(token, ref_id) {
    try {
      return fetch(API_URL + "/admin/get-referred-id-data?id=" + ref_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateSendCoinFee: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-send-coin-fee", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  //add user api call
  addUser: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-user", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getWalletCoins: function(token) {
    try {
      return fetch(API_URL + "/coin-list", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getUserTickets: function(token, form) {
    try {
      return fetch(API_URL + "/admin/get-user-tickets", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllAccountClasses: function(token, sorterCol, sortOrder) {
    let url = "/admin/get-all-account-classes";
    if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  addAccountClass: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-account-class", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateAccountClass: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-account-class", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  deleteAccountClass: function(token, form) {
    try {
      return fetch(API_URL + "/admin/delete-account-class", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAssetDetails: function(token, coin_id) {
    try {
      return fetch(API_URL + "/admin/coin/get-coin-details?id=" + coin_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAssetLimits: function(token, coin_id) {
    try {
      return fetch(API_URL + "/admin/all-limits?coin_id=" + coin_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateAssetLimits: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-limit", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getUserLimits: function(token, user_id) {
    try {
      return fetch(API_URL + "/admin/all-user-limits?user_id=" + user_id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateUserLimits: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-user-limit", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllEmailTemplates: function(token) {
    try {
      return fetch(API_URL + "/admin/emailTemplate/get", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateEmailTemplate: function(token, form) {
    try {
      return fetch(API_URL + "/admin/emailTemplate/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllNewsSources: function(token) {
    try {
      return fetch(API_URL + "/admin/all-new-source", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateNewsSource: function(token, form) {
    try {
      return fetch(API_URL + "/admin/edit-news-source", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  changeWithdrawStatus: function(token, form) {
    try {
      return fetch(API_URL + "/admin/approve-disapprove-withdraw-request", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getTemplateDetails: function(token, template_id) {
    try {
      return fetch(
        API_URL + "/admin/emailTemplate/get-by-id?id=" + template_id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

  //edit job category api call
  updateJobCategory: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-job-category", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  addJobCategory: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-job-category", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  addWhitelistIP: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-whitelist-ip", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllWhitelistIP: function(token, page, limit) {
    try {
      return fetch(
        API_URL +
          "/admin/get-all-whitelist-ip?page=" +
          page +
          "&limit=" +
          limit,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

  deleteProfileWhitelistIP: function(token, id) {
    try {
      return fetch(API_URL + "/admin/delete-whitelist-ip?id=" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  addProfileWhitelistIP: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-whitelist-ip", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllWhitelistIP: function(token, user_id, page, limit) {
    try {
      return fetch(
        API_URL +
          "/admin/get-user-whitelist-ip?user_id=" +
          user_id +
          "&page=" +
          page +
          "&limit=" +
          limit,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

  deleteEmpWhitelistIP: function(token, id) {
    try {
      return fetch(API_URL + "/admin/delete-user-whitelist-ip?id=" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  addEmpWhitelistIP: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-user-ip-whitelist", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateUser: function(token, form) {
    try {
      return fetch(API_URL + "/admin/update-user", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  enableWhitelist: function(token, form) {
    try {
      return fetch(API_URL + "/admin/user-whitelist-ip-status-change", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  enableProfileWhitelist: function(token, form) {
    try {
      return fetch(API_URL + "/admin/whitelist-ip-status-change", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAll2FARequests: function(
    token,
    page,
    limit,
    search,
    type,
    sort_col,
    sort_order
  ) {
    let url = "/admin/get-twofactors-requests?page=" + page + "&limit=" + limit;
    if (type && search && sort_col && sort_order) {
      url +=
        "&r_type=" +
        type +
        "&data=" +
        search +
        "&sort_col=" +
        sort_col +
        "&sort_order=" +
        sort_order;
    } else if (type && sort_col && sort_order) {
      url +=
        "&r_type=" +
        type +
        "&sort_col=" +
        sort_col +
        "&sort_order=" +
        sort_order;
    } else if (search && sort_col && sort_order) {
      url +=
        "&data=" +
        search +
        "&sort_col=" +
        sort_col +
        "&sort_order=" +
        sort_order;
    } else if (sort_col && sort_order) {
      url += "&sort_col=" + sort_col + "&sort_order=" + sort_order;
    } else if (type && search) {
      url += "&r_type=" + type + "&data=" + search;
    } else if (type) {
      url += "&r_type=" + type;
    } else {
      url += "&data=" + search;
    }
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  approve2FARequest: function(token, form) {
    try {
      return fetch(API_URL + "/admin/approve-twofactors-request-status", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  rejectRequest: function(token, form) {
    try {
      return fetch(API_URL + "/admin/reject-twofactors-request-status", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getWalletDetails: function(token, form) {
    try {
      return fetch(API_URL + "/wallet-details", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  generateWalletAddress: function(token, code) {
    try {
      return fetch(API_URL + "/users/create-wallet/" + code, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  generateUserWalletAddress: function(token, coin, userId) {
    try {
      return fetch(API_URL + "/admin/create-wallet/" + coin + "/" + userId, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAdminThresholds: function(token, code) {
    try {
      return fetch(API_URL + "/admin/get-admin-thresholds", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAdminContactDetails: function(token, code) {
    try {
      return fetch(API_URL + "/admin/get-admin-thresholds-contacts", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  storeContactDetails: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-admin-thresholds-contacts", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  saveAllNotification: function(token, form) {
    try {
      return fetch(API_URL + "/admin/add-admin-thresholds", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllWallets: function(token, search) {
    let url = "/admin-wallet-fees-details";
    if (search) {
      url += "?search=" + search;
    }
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  sendWalletBalance: function(token, form) {
    try {
      return fetch(API_URL + "/send-coin-admin", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllBatches: function(token, page, limit) {
    let url = "/admin/batches/list?page=" + page + "&limit=" + limit;
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  createBatch: function(token, form) {
    try {
      return fetch(API_URL + "/admin/batches/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateBatch: function(token, form) {
    try {
      return fetch(API_URL + "/admin/batches/update", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllTiers: function(token) {
    let url = "/admin/get-tier-details";
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getSummaryOfBatch: function(token, transactionStart, transactionEnd) {
    let url =
      "/admin/get-batch-value?transaction_start=" +
      transactionStart +
      "&transaction_end=" +
      transactionEnd;
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getPurchaseOfBatch: function(token, transactionStart, transactionEnd) {
    let url =
      "/admin/get-each-transaction-value?transaction_start=" +
      transactionStart +
      "&transaction_end=" +
      transactionEnd;
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getBatchDetails: function(token, batchId) {
    let url = "/admin/get-batch-detail?id=" + batchId;
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  getTierDetails: function(token, tierId) {
    let url = "/admin/get-tier-data?id=" + tierId;
    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateTier: function(token, form) {
    let url = "/admin/update-tier-list";
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getAllTierRequests: function(token, id, status) {
    let url = "/admin/user-tier-request";
    if (id && status) {
      url += "?id=" + id + "&status=" + status;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  uploadBatchDoc: function(token, form) {
    let url = "/admin/batches/upload";
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: form
      });
    } catch (error) {
      console.error(error);
    }
  },

  downloadBatch: function(token, form) {
    let url = "/admin/batches/download";
    try {
      return fetch(API_URL + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getUserWallets: function(token, user_id) {
    try {
      return fetch(
        API_URL + "/admin/get-user-wallet-addresses?user_id=" + user_id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

  getSimplexToken: function(token) {
    try {
      return fetch(API_URL + "/get-token-value", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  updateSimplexToken: function(token, form) {
    let url = "/update-token-value";
    try {
      return fetch(API_URL + url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(form)
      });
    } catch (error) {
      console.error(error);
    }
  },

  getNetworkFee: function(token, sorterCol, sortOrder) {
    let url = "/admin/get-coin-fees-coin";
    if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      url;
    }

    try {
      return fetch(API_URL + url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
  updateNetworkFee: function(token, body) {
    const url = "/admin/update-fees-value";
    return fetch(API_URL + url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(body)
    });
  }
};
export default ApiUtils;
