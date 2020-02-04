// Openxcell Internal
//export const BUCKET_URL = "https://s3.ap-south-1.amazonaws.com/varshalteamprivatebucket/";

//Client Production 
export const BUCKET_URL = "https://s3.us-east-2.amazonaws.com/production-static-asset/";
// page size
export const PAGESIZE=50
// page size options
// export const PAGE_SIZE_OPTIONS=["20", "30", "40", "50"];
export const PAGE_SIZE_OPTIONS=["10", "25", "50", "100", "200", "500", "1000"];

export const S3BucketImageURL = "https://s3.us-east-2.amazonaws.com/production-static-asset/";
// export const S3BucketImageURL = 'https://s3.ap-south-1.amazonaws.com/varshalteamprivatebucket/';
export const SIMPLEX_PAYMENT_URL="https://payment-status.simplex.com/#/payment/"
export const TABLE_SCROLL_HEIGHT={x:"max-content",y:"70vh"}
export const SYSTEM_IDLE_TIME=1000 * 60 * 30; //System idle time in milliseconds 
export const THROTTLING=1000 * 60 * 2; // throttling will execute the function only one time in 2 minutes
export const BITGO_MIN_LIMIT={
    "BTC":0.00002750,
    "XRP":20,
    "ETH":50,
    "LTC":0.0001
}
