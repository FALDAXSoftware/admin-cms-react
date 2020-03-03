// TODO
// Store toaster message const
export const messages = {
  campaign: {
    offer: {
      added: "Offer added successfully",
      updated: "Offer updated successfully"
    }
  },
  notification: {
    thresh_hold: {
      second_gt_third_limit: "Second limit must be greater than Third limit.",
      first_gt_second_limit:
        "First limit must be greater than Second and Third limit.",
      first_required: "First limit is required",
      second_required: "Second limit is required",
      first_second_required: "First and second limit is required"
    },
    limit_Management: {
      min_daily_withdraw_crypto: "Daily Crypto Withdraw limit should be greater then or equal",
      min_monthly_withdraw_crypto:
        "Monthly Crypto Withdraw limit should be greater then or equal",
      min_monthly_max_daily_withdraw_crypto:
      "Monthly withdraw crypto limit should be greater than the Daily withdraw crypto limit",
      min_daily_withdraw_crypto_lte_daily_withdraw_crypto:
      "Daily withdraw limit should be greater than or equal the minimum withdraw crypto limit",
      min_withdraw_crypto_lte_monthly_withdraw_crypto:
      "Monthly withdraw limit should be greater than or equal the minimum withdraw crypto limit",
    }
  }
};
