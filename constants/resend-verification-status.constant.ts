export const ResendVerificationStatus = {
  UNDEFINED: null,
  NO_USER:"no-user",
  REGISTER:"register",
  LOGIN_CAN_RESEND_VERIFICATION_EMAIL:"check-verification-can-resend-verification-email",
  LOGIN_CANNOT_RESEND_VERIFICATION_EMAIL:"check-verification-cannot-resend-verification-email",
  CHECK_VERIFICATION_CAN_RESEND_VERIFICATION_EMAIL:"check-verification-can-resend-verification-email",
  CHECK_VERIFICATION_CANNOT_RESEND_VERIFICATION_EMAIL:"check-verification-cannot-resend-verification-email",
  MAIL_SENDING:"mail-sending",
  ELSE:"else",
} as const;