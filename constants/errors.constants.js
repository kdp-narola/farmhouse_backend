module.exports = {
    ERRORS: {
        MISSING_EMAIL_FIRSTNAME: 'Missing email or Full name',
        MISSING_TOKENS_PARAMS: 'Missing userId in Tokens class',
        MISSING_AUTHENTICATION_PARAMS: 'Missing userModel or tokenModel in the Authentication class',
        MISSING_MAIL_OPTIONS_PARAMS: 'Missing to, templateName or data in mailOptions',
        MISSING_EMAIL_PASSWORD: 'Missing email or password',
        MISSING_USERID_OLD_OR_NEW_PASSWORD: 'Missing userId, oldPassword or password',
        MISSING_USERID_PASSWORD: 'Missing userId or password',
        MISSING_USERID_OTP: 'Missing userId or OTP',
        MISSING_USERID: 'Missing userId',
        MISSING_EMAIL: 'Missing Email',
        MISSING_REGISTER_EMAIL: 'Missing required information. Please provide First Name and OTP.',
        MISSING_FORGETPASSWORD_EMAIL: 'Missing required information. Please provide First Name and Token.',
        MISSING_TO_ADDRESS: 'Missing required information. Plese provide TO Addreess.',

        UNVERIFIED: 'Please Complete Your Verification First',
        NOT_ALLOWED_RESEND_OTP: 'Resend OTP not allowed for verified users',
        OTP_EXPIRED: 'OTP not found or expired ',
        INVALID_OTP: 'Invalid OTP, Please try again, Remaining attempts',
        INVALID_PASSWORD: 'Invalid old Password',
        INVALID_CREDENTIALS: 'Invalid Email or Password, Remaining attempts',
        NO_PASSWORD: 'Password not set, Please complete Your Registration Process',
        SAME_NEW_PASSWORD: 'New password must be different from Your Current Password',


        USER_NOT_FOUND: 'User not Found',
        TOKEN_EXPIRED: 'Token Expired',
        SESSION_EXPIRED: 'Session Expired, Please Login Again',
        USER_EXISTS: 'User Already Exists, Please Login',
        USER_NOT_EXISTS: 'User with this email does not exists',
        ACCOUNT_LOCKED: 'Your account is Locked until ',
        MAIL_ERROR: 'Error while sending Mail',
        NOT_ENABLED: 'Access Denined : Your account must be verified to proceed further',
        ENABLED: 'Bad Request: Your account is enabled. Please login to proceed further',

        AMENITIES_EXIST: 'Amenities already exist.',
        AMENITIES_NOTEXIST: 'Amenities not found.',
        CATEGORY_EXIST: 'Category already exists.',
        HOUSERULE_EXIST: 'House rule already exists.',
        HOUSERULE_NOTEXIST: 'House rule not found.',
        RESERVATION_NOTEXIST: 'Reservation data not found.',
        PROPERTY_NOT_DELETE: 'Upcoming bookings exist. This property cannot be deleted.',

        // ADMIN:
        ADMIN_ONLY: 'This feature is accessible only to admins.',
        ADMIN_OWNER_ONLY: 'This feature is accessible only to partner users and admins.',

        PROPERTY_NOTEXIST: 'Property not found.',
        WISHLIST_EXIST: 'This property is already in your wishlist.',
        WISHLIST_NOTEXIST: 'This property is not in your wishlist.',
        AVAILBLITYCHECK_MISSING_PARAM: 'Property ID, check-in, and check-out times are required.',

        PAYMENT_GATWAY_ERROR: 'Payment Not Verified.',
        ACCOUT_VALIDATION_MISSING_PARAM: 'Benificary Name, IFSC code and Account Number is required.',
        ACCOUNT_VALDATION_CONTACT_MISSING: 'Name and Email is required'
    }
};