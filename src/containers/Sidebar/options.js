const options = [
  {
    key: "dashboard",
    label: "sidebar.dashboard",
    leftIcon: "ion-android-apps"
  },
  {
    key: "users",
    label: "sidebar.users",
    leftIcon: "ion-android-people"
  },
  {
    key: "coins",
    label: "sidebar.coins",
    leftIcon: "ion-logo-usd"
  },
  {
    key: "static-pages",
    label: "sidebar.staticPages",
    leftIcon: "ion-document"
  },
  {
    key: "email-templates",
    label: "sidebar.emailTemplates",
    leftIcon: "ion-android-mail"
  },
  {
    key: "referral",
    label: "sidebar.referral",
    leftIcon: "ion-document"
  },
  {
    key: "charts",
    label: "sidebar.charts",
    leftIcon: "ion-arrow-graph-up-right",
    children: [
      {
        key: "googleChart",
        label: "sidebar.googleCharts"
      },
      {
        key: "reecharts",
        label: "sidebar.recharts"
      },
      {
        key: "reactVis",
        label: "sidebar.reactVis"
      },
      {
        key: "reactChart2",
        label: "sidebar.reactChart2"
      },
      {
        key: "reactTrend",
        label: "sidebar.reactTrend"
      },
      {
        key: "frappeChart",
        label: "sidebar.frappeChart"
      }
    ]
  },
];

export default options;
