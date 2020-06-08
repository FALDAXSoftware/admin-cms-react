// const API_URL = "http://e822062b5a07.ngrok.io"; // Local (Mansi) URL
// const API_URL = "http://192.168.0.224:1337"; // Local (Kalpit) URL
// const API_URL = "http://192.168.1.96:1337"; //Local (Jagdish) URL
// const API_URL = "https://dev-backend.faldax.com"; //Live Client URL
// const API_URL = "https://pre-prod-backend.faldax.com"; //Preprod URL
// const API_URL = "https://prod-backend.faldax.com"; //Live Client URL
// const API_URL = "https://mainnet-backend.faldax.com"; //Mainnet URL
const API_URL = process.env.REACT_APP_API_ENDPOINT;
export const SOCKET_HOST = "https://preprod-trading.faldax.com";
// export const SOCKET_HOST = "http://localhost:3011"
const ApiUtils = {
  //super admin sign in api
  adminSignIn: function (form) {
    return fetch(API_URL + "/admin/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //edit profile api
  editProfile: function (token, form) {
    return fetch(API_URL + "/admin/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //change admin password api
  changePassword: function (token, form) {
    return fetch(API_URL + "/admin/change-password", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //change employee password api
  changeEmployeePassword: function (token, form) {
    return fetch(API_URL + "/admin/employee-change-password", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //get all counts for dashboard api
  getAllCount: function (token, startDate, endDate) {
    let url = "/admin/dashboard/get-data";
    if (startDate && endDate) {
      url += "?kyc_start_date=" + startDate + "&kyc_end_date=" + endDate;
    }
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },

  getCampaignUserList: function (token) {
    let url = "/admin/users/list";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },

  // create new campaign
  createCampaign: function (token, formdata) {
    return fetch(API_URL + "/admin/campaigns/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formdata),
    });
  },

  //get all counts for dashboard api
  getMetabase: function () {
    let url = "/metabase-details";
    return fetch(API_URL + url, {
      method: "GET",
      // headers: {
      //   Authorization: "Bearer " + token
      // }
    });
  },

  //get all users api
  getAllUsers: function (
    page,
    limit,
    token,
    searchUser,
    sorterCol,
    sortOrder,
    filterVal,
    startDate,
    endDate
  ) {
    searchUser = encodeURIComponent(searchUser);
    let url = `/admin/get-users?page=${page}&limit=${limit}${
      searchUser ? "&data=" + searchUser : ""
    }${sorterCol ? "&sort_col=" + sorterCol : ""}${
      sortOrder ? "&sort_order=" + sortOrder : ""
    }${filterVal ? "&country=" + filterVal : ""}${
      startDate ? "&start_date=" + startDate : ""
    }${endDate ? "&end_date=" + endDate : ""}`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all in-active users api
  getAllInActiveUsers: function (
    page,
    limit,
    token,
    searchUser,
    sorterCol = "updated_at",
    sortOrder = "descend",
    filterVal,
    startDate,
    endDate
  ) {
    searchUser = encodeURIComponent(searchUser);
    let url = `/admin/get-inactive-users?page=${page}&limit=${limit}${
      searchUser ? "&data=" + searchUser : ""
    }${sorterCol ? "&sort_col=" + sorterCol : ""}${
      sortOrder ? "&sort_order=" + sortOrder : ""
    }${filterVal ? "&country=" + filterVal : ""}${
      startDate ? "&start_date=" + startDate : ""
    }${endDate ? "&end_date=" + endDate : ""}`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all in-active users api
  getAllDeletedUsers: function (
    page,
    limit,
    token,
    searchUser,
    sorterCol = "deleted_at",
    sortOrder = "descend",
    filterVal,
    startDate,
    endDate
  ) {
    searchUser = encodeURIComponent(searchUser);
    let url = `/admin/get-deleted-users?page=${page}&limit=${limit}${
      searchUser ? "&data=" + searchUser : ""
    }${sorterCol ? "&sort_col=" + sorterCol : ""}${
      sortOrder ? "&sort_order=" + sortOrder : ""
    }${filterVal ? "&country=" + filterVal : ""}${
      startDate ? "&start_date=" + startDate : ""
    }${endDate ? "&end_date=" + endDate : ""}`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //activate user api
  activateUser: function (token, form) {
    return fetch(API_URL + "/admin/user-activate", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //delete user api
  deleteUser: function (token, user_id) {
    return fetch(API_URL + "/admin/delete-user?user_id=" + user_id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });
  },

  //get all coins api
  getAllCoins: function (page, limit, token, search, sorterCol, sortOrder) {
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //add coin api
  addCoin: function (token, form) {
    return fetch(API_URL + "/admin/coins/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: form,
    });
  },

  //edit coin api
  editCoin: function (token, form) {
    return fetch(API_URL + "/admin/coins/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //delete coin api
  deleteCoin: function (coinId, token) {
    return fetch(API_URL + "/admin/coins/delete?id=" + coinId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });
  },

  //forgot password api
  forgotPassword: function (form) {
    return fetch(API_URL + "/admin/forgot-password", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //reset password api
  resetPassword: function (form) {
    return fetch(API_URL + "/admin/reset-password", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getUserReferData: function (
    token,
    coin_id = "",
    user_id = "",
    page = "1",
    limit = "50",
    data = ""
  ) {
    let url = `/admin/get-referred-user-data?coin_code=${coin_id}${
      user_id ? "&user_id=" + user_id : ""
    }${page ? "&page=" + page : ""}${limit ? "&limit=" + limit : ""}${
      data ? "&data=" + data : ""
    }`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all referrals api
  getAllUserReferrals: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all referrals api
  getAllReferrals: function (
    page,
    limit,
    token,
    searchReferral,
    sorterCol,
    sortOrder
  ) {
    let url = `/admin/get-referal-list?data=${searchReferral}${
      sorterCol ? "&sort_col=" + sorterCol : ""
    }${sortOrder ? "&sort_order=" + sortOrder : ""}`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all counties api
  getAllCountries: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //Activate-deactivate country api
  activateCountry: function (token, form) {
    return fetch(API_URL + "/admin/country-activate", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //Announce to users api
  announceUser: function (token, form) {
    return fetch(API_URL + "/admin/email-send", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //get all roles api
  getAllRoles: function (token, sorterCol, sortOrder, status) {
    let url = "/admin/role/get?status=" + status;
    if (sorterCol && sortOrder) {
      url += "&sortCol=" + sorterCol + "&sortOrder=" + sortOrder;
    }

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllPermissions: function (token) {
    let url = "/get-all-permissions";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //edit country api call
  editCountry: function (token, form) {
    return fetch(API_URL + "/admin/country-update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //get all states api
  getAllStates: function (
    page,
    countryId,
    limit,
    token,
    search,
    legality,
    sorterCol,
    sortOrder
  ) {
    // let url = "/admin/get-state-data?country_id=" + countryId;
    let url =
      "/admin/get-state-data?page=" +
      page +
      "&country_id=" +
      countryId +
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //Activate-deactivate state api
  activateState: function (token, form) {
    return fetch(API_URL + "/admin/state-activate", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //edit state api call
  editState: function (token, form) {
    return fetch(API_URL + "/admin/state-update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //add role api call
  addRole: function (token, form) {
    return fetch(API_URL + "/admin/role/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //edit role api call
  updateRole: function (token, form) {
    return fetch(API_URL + "/admin/role/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  deleteRole: function (token, roleId) {
    return fetch(API_URL + "/admin/role/delete", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roleId,
      }),
    });
  },

  //get all employee api
  getAllEmployee: function (page, limit, token, sorterCol, sortOrder, search) {
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
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //add employee api call
  addEmployee: function (token, form) {
    return fetch(API_URL + "/admin/add-employee", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //delete employee api call
  deleteEmployee: function (token, roleId) {
    return fetch(API_URL + "/admin/delete-employee", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roleId,
      }),
    });
  },

  //edit employee api call
  editEmployee: function (token, form) {
    return fetch(API_URL + "/admin/update-employee", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //user login history api call
  getUserHistory: function (
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

    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(user_id),
      }),
    });
  },

  //user delete account summary
  getUserAccountSummary: function (token, user_id) {
    let url = "/admin/deleteAccountCheck?user_id=" + user_id;

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllPairs: function (
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
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //add fees api call
  addPair: function (token, form) {
    return fetch(API_URL + "/admin/add-pair", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  //edit pair api call
  updatePair: function (token, form) {
    return fetch(API_URL + "/admin/edit-pair", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllLimit: function (token) {
    return fetch(API_URL + "/admin/all-limits", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //edit limit api call
  updateLimit: function (token, form) {
    return fetch(API_URL + "/admin/edit-limit", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllTransaction: function (
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol,
    sortOrder,
    userid
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
    if (userid) {
      url += "&user_id=" + userid;
    }

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //user wise transaction list api call
  getUserTransaction: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllTrades: function (
    page,
    limit,
    token,
    search,
    filterVal,
    startDate,
    endDate,
    sorterCol = "created_at",
    sortOrder = "descend",
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

    return fetch(API_URL + "/admin/all-trades?" + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllSimplexTrades: function (
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

    return fetch(API_URL + "/admin/all-trades?" + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getUserTrades: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllWithdrawRequests: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //page, limit, token, searchReq, startDate, endDate, user_id, filterVal
  getUserWithdrawReq: function (
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
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAllSellOrders: function (
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

    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });
  },

  getAllPendingOrders: function (
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

    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });
  },

  getAllCancelledOrders: function (
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

    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });
  },

  getAllBuyOrders: function (
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
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });
  },

  //get all jobs api
  getAllJobs: function (page, limit, token, search, sorterCol, sortOrder) {
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all job categories api
  getAllJobCategories: function (token, active) {
    return fetch(API_URL + "/admin/job-categories?active=" + active, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //add job api
  addJob: function (token, form) {
    return fetch(API_URL + "/admin/add-job", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //edit job api call
  updateJob: function (token, form) {
    return fetch(API_URL + "/admin/edit-job", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //delete job api call
  deleteJob: function (jobId, token) {
    return fetch(API_URL + "/admin/delete-job?job_id=" + jobId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //edit contact details api
  editContact: function (token, form) {
    return fetch(API_URL + "/edit-contact-details", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //get contact details api
  getContactDetails: function () {
    return fetch(API_URL + "/admin/get-contact-details", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // get default referral percentage
  getReferPercentage: function (token) {
    return fetch(API_URL + "/admin/get-referal-details", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all jobs api
  getAllJobApplications: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all kyc data api
  getKYCData: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all fees api
  getFeesData: function (token) {
    let url = "/admin/get-all-fee";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get withdrawl fees api
  getWithdrawlFee: function (token) {
    let url = "/admin/get-withdrawl-faldax-fee";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //edit fees api
  updateFees: function (token, form) {
    return fetch(API_URL + "/admin/edit-fee", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getPanicBtnDetails: function (token) {
    return fetch(API_URL + "/get-panic-status", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //panic button api
  panicBtn: function (token, form) {
    return fetch(API_URL + "/toggle-panic-status", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  // get user details api
  getUserDetails: function (token, user_id) {
    return fetch(API_URL + "/admin/get-user-details?user_id=" + user_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  // get employee details api
  getEmployeeDetails: function (token, emp_id) {
    return fetch(API_URL + "/admin/get-employee-details?emp_id=" + emp_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  disableTwoFactor: function (token, form) {
    return fetch(API_URL + "/admin/disable-two-factor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  setupTwoFactor: function (token, form) {
    return fetch(API_URL + "/admin/setup-two-factor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  verifyOTP: function (token, form) {
    return fetch(API_URL + "/admin/verify-two-factor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAdminDetails: function (token, admin_id) {
    return fetch(API_URL + "/admin/get-details?admin_id=" + admin_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //get all news api
  getAllNews: function (
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

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  changeNewsStatus: function (token, form) {
    return fetch(API_URL + "/admin/change-news-status", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getNewsDetails: function (token, news_id) {
    return fetch(API_URL + "/admin/get-news-details?news_id=" + news_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateReferral: function (token, form) {
    return fetch(API_URL + "/admin/update-user-referal", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getKYCDetails: function (token, user_id) {
    return fetch(API_URL + "/admin/get-kyc-detail?user_id=" + user_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getReferredAmounts: function (token, ref_id) {
    return fetch(API_URL + "/admin/get-referred-id-data?id=" + ref_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateSendCoinFee: function (token, form) {
    return fetch(API_URL + "/admin/update-send-coin-fee", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  updateFaldaxFee: function (token, form) {
    return fetch(API_URL + "/admin/update-faldax-fee", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  //add user api call
  addUser: function (token, form) {
    return fetch(API_URL + "/admin/add-user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getWalletCoins: function (token) {
    return fetch(API_URL + "/coin-list", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getUserTickets: function (token, form) {
    return fetch(API_URL + "/admin/get-user-tickets", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllAccountClasses: function (token, sorterCol, sortOrder) {
    let url = "/admin/get-all-account-classes";
    if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    }

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  addAccountClass: function (token, form) {
    return fetch(API_URL + "/admin/add-account-class", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  updateAccountClass: function (token, form) {
    return fetch(API_URL + "/admin/update-account-class", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  deleteAccountClass: function (token, form) {
    return fetch(API_URL + "/admin/delete-account-class", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAssetDetails: function (token, coin_id) {
    return fetch(API_URL + "/admin/coin/get-coin-details?id=" + coin_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAssetLimits: function (token, coin_id) {
    return fetch(API_URL + "/admin/all-limits?coin_id=" + coin_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateAssetLimits: function (token, form) {
    return fetch(API_URL + "/admin/edit-limit", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getUserLimits: function (token, user_id) {
    return fetch(API_URL + "/admin/all-user-limits?user_id=" + user_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateUserLimits: function (token, form) {
    return fetch(API_URL + "/admin/edit-user-limit", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllEmailTemplates: function (token) {
    return fetch(API_URL + "/admin/emailTemplate/get", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateEmailTemplate: function (token, form) {
    return fetch(API_URL + "/admin/emailTemplate/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllNewsSources: function (token) {
    return fetch(API_URL + "/admin/all-new-source", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateNewsSource: function (token, form) {
    return fetch(API_URL + "/admin/edit-news-source", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  changeWithdrawStatus: function (token, form) {
    return fetch(API_URL + "/admin/approve-disapprove-withdraw-request", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getTemplateDetails: function (token, template_id) {
    return fetch(API_URL + "/admin/emailTemplate/get-by-id?id=" + template_id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  //edit job category api call
  updateJobCategory: function (token, form) {
    return fetch(API_URL + "/admin/update-job-category", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  addJobCategory: function (token, form) {
    return fetch(API_URL + "/admin/add-job-category", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  addWhitelistIP: function (token, form) {
    return fetch(API_URL + "/admin/add-whitelist-ip", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllWhitelistIP: function (token, page, limit) {
    return fetch(
      API_URL + "/admin/get-all-whitelist-ip?page=" + page + "&limit=" + limit,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
  },

  deleteProfileWhitelistIP: function (token, id) {
    return fetch(API_URL + "/admin/delete-whitelist-ip?id=" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  addProfileWhitelistIP: function (token, form) {
    return fetch(API_URL + "/admin/add-whitelist-ip", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllUserWhitelistIP: function (token, user_id, page, limit) {
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
          "Content-Type": "application/json",
        },
      }
    );
  },

  deleteEmpWhitelistIP: function (token, id) {
    return fetch(API_URL + "/admin/delete-user-whitelist-ip?id=" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  addEmpWhitelistIP: function (token, form) {
    return fetch(API_URL + "/admin/add-user-ip-whitelist", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  updateUser: function (token, form) {
    return fetch(API_URL + "/admin/update-user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  enableWhitelist: function (token, form) {
    return fetch(API_URL + "/admin/user-whitelist-ip-status-change", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  enableProfileWhitelist: function (token, form) {
    return fetch(API_URL + "/admin/whitelist-ip-status-change", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAll2FARequests: function (
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
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  approve2FARequest: function (token, form) {
    return fetch(API_URL + "/admin/approve-twofactors-request-status", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  rejectRequest: function (token, form) {
    return fetch(API_URL + "/admin/reject-twofactors-request-status", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getWalletDetails: function (token, form) {
    return fetch(API_URL + "/wallet-details", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  generateWalletAddress: function (token, code, userId) {
    return fetch(
      API_URL + "/admin/create-admin-wallet/" + code + "/" + userId,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
  },

  generateUserWalletAddress: function (token, coin, userId) {
    return fetch(API_URL + "/admin/create-wallet/" + coin + "/" + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAdminThresholds: function (token, code) {
    return fetch(API_URL + "/admin/get-admin-thresholds", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getAdminContactDetails: function (token, code) {
    return fetch(API_URL + "/admin/get-admin-thresholds-contacts", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  storeContactDetails: function (token, form) {
    return fetch(API_URL + "/admin/add-admin-thresholds-contacts", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  saveAllNotification: function (token, form) {
    return fetch(API_URL + "/admin/add-admin-thresholds", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllWallets: function (token, search) {
    let url = "/admin-wallet-fees-details";
    if (search) {
      url += "?search=" + search;
    }
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  sendWalletBalance: function (token, form) {
    return fetch(API_URL + "/send-coin-admin", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  sendWalletBalanceTradedesk: function (token, form) {
    return fetch(API_URL + "/admin/wallet-send-coin-tradedesk", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  sendWarmWalletBalance: function (token, form) {
    return fetch(API_URL + "/admin/send-warm-balance", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllBatches: function (token, page, limit) {
    let url = "/admin/batches/list?page=" + page + "&limit=" + limit;
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  createBatch: function (token, form) {
    return fetch(API_URL + "/admin/batches/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  updateBatch: function (token, form) {
    return fetch(API_URL + "/admin/batches/update", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  getAllTierRequirement: function (token) {
    let url = "/admin/get-all-tier-details";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },
  getAllTiers: function (token) {
    let url = "/admin/get-tier-details";
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getSummaryOfBatch: function (token, transactionStart, transactionEnd) {
    let url =
      "/admin/get-batch-value?transaction_start=" +
      transactionStart +
      "&transaction_end=" +
      transactionEnd;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getPurchaseOfBatch: function (token, transactionStart, transactionEnd) {
    let url =
      "/admin/get-each-transaction-value?transaction_start=" +
      transactionStart +
      "&transaction_end=" +
      transactionEnd;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getBatchDetails: function (token, batchId) {
    let url = "/admin/get-batch-detail?id=" + batchId;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  getTierDetails: function (token, tierId) {
    let url = "/admin/get-tier-data?id=" + tierId;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateTier: function (token, form) {
    let url = "/admin/update-tier-list";
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },

  getAllTierRequests: function (
    token,
    tier = "1",
    sortCol = "",
    sortOrder = "",
    limit = 10,
    page = 1,
    id,
    status = 1,
    searchData = "",
    type = ""
  ) {
    let url = `/admin/user-tier-request?step=${tier}&limit=${limit}&page=${page}&status=${status}&data=${searchData}&type=${type}`;
    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  uploadBatchDoc: function (token, form) {
    let url = "/admin/batches/upload";
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: form,
    });
  },

  downloadBatch: function (token, form) {
    let url = "/admin/batches/download";
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  getUserWallets: function (token, user_id) {
    return fetch(
      API_URL + "/admin/get-user-wallet-addresses?user_id=" + user_id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
  },

  getSimplexToken: function (token) {
    return fetch(API_URL + "/get-token-value", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },

  updateSimplexToken: function (token, form) {
    let url = "/update-token-value";
    return fetch(API_URL + url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },

  getNetworkFee: function (token, sorterCol, sortOrder) {
    let url = "/admin/get-coin-fees-coin";
    if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      // url;
    }

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },
  getTradingFees: function (token, sorterCol, sortOrder) {
    let url = "/get-all-fee";
    if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else if (sorterCol && sortOrder) {
      url += "?sort_col=" + sorterCol + "&sort_order=" + sortOrder;
    } else {
      // url;
    }

    return fetch(API_URL + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  },
  updateNetworkFee: function (token, body) {
    const url = "/admin/update-fees-value";
    return fetch(API_URL + url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
  },
  getRolePermissions: function (token, roleId = "") {
    const url = "/admin/get-role-permission";
    return fetch(`${API_URL}${url}?role_id=${roleId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  getPairList: function () {
    const url = "/users/get-all-pair";
    return fetch(`${API_URL}${url}`, {
      method: "GET",
    });
  },
  updatePermissions: function (token, form) {
    let url = "/admin/update-role-permission";
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });
  },
  // Offer Module API's
  offers: function (token) {
    return {
      url: "/admin/campaigns/",
      headers: {
        Authorization: "Bearer " + token,
      },
      getCampaignList: function (
        page,
        limit,
        searchData = "",
        startDate = "",
        endDate = "",
        type = "",
        sortOrder = "",
        sorterCol = ""
      ) {
        let formData = new FormData();
        formData.append("page", page);
        formData.append("limit", limit);
        formData.append("data", searchData);
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
        formData.append("type", type);
        formData.append("sort_order", sortOrder);
        formData.append("sort_col", sorterCol);
        return fetch(`${API_URL}${this.url}list`, {
          method: "POST",
          headers: this.headers,
          body: formData,
        });
      },
      changeStatus: function (id, status = false) {
        let formData = new FormData();
        formData.append("status", status);
        return fetch(`${API_URL}${this.url}change-status?id=${id}`, {
          method: "PUT",
          headers: this.headers,
          body: formData,
        });
      },
      updateCampaign: function (id, data) {
        return fetch(`${API_URL}${this.url}update?id=${id}`, {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(data),
        });
      },
      // get campaign details api
      getById: function (campaign_id) {
        return fetch(API_URL + "/admin/campaigns/get?id=" + campaign_id, {
          method: "GET",
          headers: this.headers,
        });
      },
      checkOfferCode: function (offerCode = "") {
        return fetch(
          `${API_URL}${this.url}verify-offercode?code=${offerCode}`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getOfferCodeHistory: function (
        offerId,
        page,
        limit,
        data = "",
        action_type = ""
      ) {
        let formData = new FormData();
        formData.append("page", page);
        formData.append("data", data);
        formData.append("limit", limit);
        formData.append("action_type", action_type);
        return fetch(`${API_URL}${this.url}offercode-used?id=${offerId}`, {
          method: "POST",
          headers: this.headers,
          body: formData,
        });
      },
    };
  },
  metabase: function (token) {
    return {
      url: "/admin/",
      headers: {
        Authorization: "Bearer " + token,
      },
      getAccountClassMetabase: function () {
        return fetch(`${API_URL}${this.url}get-account-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getWithdrawRequest: function () {
        return fetch(`${API_URL}${this.url}get-withdraw-request-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getUsersRequest: function () {
        return fetch(`${API_URL}${this.url}get-users-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getTwoFactorRequest: function () {
        return fetch(`${API_URL}${this.url}get-two-factor-request-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getTransactionHistory: function () {
        return fetch(`${API_URL}${this.url}get-transaction-history-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getRolesRequest: function () {
        return fetch(`${API_URL}${this.url}get-roles-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getPairsRequest: function () {
        return fetch(`${API_URL}${this.url}get-pairs-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getOffersRequest: function () {
        return fetch(`${API_URL}${this.url}get-offers-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getNewsRequest: function () {
        return fetch(`${API_URL}${this.url}get-news-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getDashboardRequest: function () {
        return fetch(`${API_URL}${this.url}get-dashboard-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getKYCRequest: function () {
        return fetch(`${API_URL}${this.url}get-kyc-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getReferralMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-referral-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getAssetsMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-assets-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getBatchMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-batch-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getCareerMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-career-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getCountryMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-country-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getEmployeeMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-employee-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getFeesMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-fees-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
      getHistoryMetabaseUrl: function () {
        return fetch(`${API_URL}${this.url}get-history-report`, {
          method: "GET",
          headers: this.headers,
        });
      },
    };
  },
  walletDashboard: function (token) {
    return {
      url: "/admin/",
      headers: {
        Authorization: "Bearer " + token,
      },
      getWalletDetailByName: function (
        coin = "",
        page,
        limit,
        sortCol = "created_at",
        sortOrder = "descend",
        searchData = "",
        start_date = null,
        end_date = null,
        walletType = 1,
        transaction_type = ""
      ) {
        return fetch(
          `${API_URL}${this.url}get-wallet-dashboard?${
            walletType == 5 ? "coin" : "coin_code"
          }=${coin.toLowerCase()}&wallet_type=${walletType}${
            sortCol ? "&sort_col=" + sortCol : ""
          }${
            sortOrder ? "&sort_order=" + sortOrder : ""
          }&page=${page}&limit=${limit}${
            searchData ? "&data=" + encodeURIComponent(searchData) : ""
          }${start_date ? "&start_date=" + start_date : ""}${
            end_date ? "&end_date=" + end_date : ""
          }${transaction_type ? "&t_type=" + transaction_type : ""}`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getFaldaxMainWalletDetails: function (
        coin = "",
        page,
        limit,
        sortCol = "created_at",
        sortOrder = "descend",
        searchData = "",
        start_date = null,
        end_date = null,
        walletType = 1,
        transaction_type = ""
      ) {
        return fetch(
          `${API_URL}${
            this.url
          }get-bussiness-wallet-data?coin_code=${coin.toLowerCase()}&wallet_type=${walletType}${
            sortCol ? "&sort_col=" + sortCol : ""
          }${
            sortOrder ? "&sort_order=" + sortOrder : ""
          }&page=${page}&limit=${limit}${
            searchData ? "&data=" + encodeURIComponent(searchData) : ""
          }${start_date ? "&start_date=" + start_date : ""}${
            end_date ? "&end_date=" + end_date : ""
          }${transaction_type ? "&wallet_type=" + transaction_type : ""}`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getWalletWarnDashboard: function (search = "") {
        return fetch(
          `${API_URL}${this.url}get-warm-wallet-data${
            search ? "?search=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getHotSendWallet: function (search = "") {
        return fetch(
          `${API_URL}${this.url}get-hotsend-wallet-data${
            search ? "?search=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getHotReceiveWallet: function (search = "") {
        return fetch(
          `${API_URL}${this.url}get-hotreceive-wallet-data${
            search ? "?search=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getWalletColdDashboard: function (searchData) {
        return fetch(
          `${API_URL}${this.url}get-cold-wallet-data${
            searchData ? "?search=" + searchData : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getWarmWalletDetail: function (coin_code, search) {
        return fetch(
          `${API_URL}${
            this.url
          }get-warm-wallet-transaction?coin_code=${coin_code}${
            search ? "&searchLabel=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getCustodialWalletDetail: function (coin_code, search) {
        return fetch(
          `${API_URL}${
            this.url
          }get-cold-wallet-transaction?coin_code=${coin_code}${
            search ? "&searchLabel=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
      getHotReceiveWalletDetails: function (coin_code, search) {
        return fetch(
          `${API_URL}${
            this.url
          }get-hotreceive-wallet-transaction?coin_code=${coin_code}${
            search ? "&searchLabel=" + search : ""
          }`,
          {
            method: "GET",
            headers: this.headers,
          }
        );
      },
    };
  },
  getHotSendWalletDetails: function (coin_code, search) {
    return fetch(
      `${API_URL}${
        this.url
      }get-hotsend-wallet-transaction?coin_code=${coin_code}${
        search ? "&searchLabel=" + search : ""
      }`,
      {
        method: "GET",
        headers: this.headers,
      }
    );
  },
  getPolicyUrl: function (token) {
    return fetch(`${API_URL}/admin/get-static-page-links`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  setPolicyDocs: function (token, formData) {
    return fetch(`${API_URL}/admin/update-static-page-pdf`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      body: formData,
    });
  },
  getAssetFeesAndLimits: function (token) {
    return fetch(`${API_URL}/admin/list-asset-fees-limits`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  editAssetFeesAndLimits: function (token, form) {
    return fetch(API_URL + "/admin/update-asset-fees-limits", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  sendResetPasswordLink: function (token, form) {
    return fetch(API_URL + "/admin/forgot-user-password", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  getResidualTransactions: function (
    token,
    page = 1,
    limit = 50,
    data = "",
    startDate = "",
    endDate = "",
    txType = ""
  ) {
    return fetch(
      API_URL +
        `/admin/get-residual-lists?page=${page}&limit=${limit}${
          data ? "&data=" + data : ""
        }${txType ? "&t_type=" + txType : ""}${
          startDate ? "&start_date=" + startDate : ""
        }${endDate ? "&end_date=" + endDate : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  getWalletNetworkFee: function (token, form) {
    return fetch(API_URL + "/admin/wallet/get-network-fee", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  },
  getAvailableBalance: function (token, asset = "tbtc") {
    return fetch(API_URL + `/admin/get-admin-available-balance?coin=${asset}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  getAvailableWarmBalance: function (token, asset = "tbtc") {
    return fetch(API_URL + `/admin/get-warm-available-balance?coin=${asset}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  getFaldaxMainWallet: function (token, search = "") {
    let url = "/admin-business-wallet-details";
    if (search) {
      url += "?search=" + search;
    }
    return fetch(API_URL + url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  getPanicBtnHistory: function (
    token,
    searchData = "",
    startDate = "",
    endDate = "",
    sortCol = "",
    sortOrder = "",
    page = 1,
    limit = 50
  ) {
    let url = `${API_URL}/admin/get-panic-history?page=${page}${
      sortOrder ? "&sort_order=" + sortOrder : ""
    }${startDate ? "&start_date=" + startDate : ""}${
      endDate ? "&end_date=" + endDate : ""
    }${searchData ? "&data=" + searchData : ""}${
      sortCol ? "&sort_col=" + sortCol : ""
    }&limit=${limit}`;
    return fetch(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  approveRejectRequest: function (
    token,
    tier,
    id,
    status,
    request_id,
    private_note = "",
    public_note = ""
  ) {
    let url = `${API_URL}/admin/upgrade-user-tier?tier_step=${tier}&id=${id}&status=${status}&request_id=${request_id}`;
    return fetch(url, {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        private_note,
        public_note,
      }),
    });
  },
  uploadDoc: function (token, formData) {
    let url = `${API_URL}/admin/upload-user-documents`;
    return fetch(url, {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
  },
  getTierDocuments: function (token) {
    let url = `${API_URL}/admin/get-tier-pdf`;
    return fetch(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  },
  setTierDocument: function (token, formData) {
    return fetch(`${API_URL}/admin/upload-tier-pdf`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      body: formData,
    });
  },
  executeTrade: function (url, token, formData) {
    return fetch(`${SOCKET_HOST}${url}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  },
  cancleOrder: function (token, formData) {
    return fetch(`${SOCKET_HOST}/api/v1/tradding/cancel-pending-order`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  },
  forceApproveRejectTierRequest: function (
    token,
    id,
    status,
    public_note,
    private_note
  ) {
    let url = `${API_URL}/admin/force-change-status?id=${id}&status=${status}`;
    return fetch(url, {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_note, private_note }),
    });
  },
  getTierTierRequirement(token, id) {
    return fetch(`${API_URL}/admin/get-tier-data?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  getTierDetails: function (token, id, tier) {
    return fetch(`${API_URL}/admin/get-tier-details`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      body: JSON.stringify({
        request_id: id,
        tier_step: tier,
      }),
    });
  },
  getSpreadData: function (token) {
    return fetch(`${SOCKET_HOST}/api/v1/tradding/get-spread-value`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      // body: JSON.stringify({})
    });
  },
  getTradeDeskBalance: function (token) {
    return fetch(`${SOCKET_HOST}/api/v1/tradding/get-tradedesk-user-balances`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      // body: JSON.stringify({})
    });
  },
  getPairsForBot: function (token) {
    return fetch(`${SOCKET_HOST}/api/v1/tradding/get-pairs-value`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        // "Content-Type": 'multipart/form-data',
      },
      // body: JSON.stringify({})
    });
  },
  updatePairsForBot: function (token, data) {
    return fetch(`${SOCKET_HOST}/api/v1/tradding/update-pairs-value`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
  },
  checkTierUpgradeStatus: function (token, user_id, tier) {
    return fetch(
      `${API_URL}/admin/user-tier-unlock-check?user_id=${user_id}&tier_step=${tier}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  },
  tierUnlock: function (token, user_id, tier) {
    return fetch(
      `${API_URL}/admin/user-tier-unlock?user_id=${user_id}&tier_step=${tier}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  },
  getUserTierValue: function (token, user_id) {
    return fetch(`${API_URL}/admin/get-user-tier-value?user_id=${user_id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
};
export default ApiUtils;
