type ValidationResult = true | Record<string, string>;

export function validateFormFields(
  data: Record<string, string>,
  extraFields?: { password?: string }
): ValidationResult {
  const errors: Record<string, string> = {};

  const validators: Record<string, (value: string) => string | null> = {
    email: (value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? null : "Invalid email";
    },
    password: (value) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?!.*\s).{12,}$/;
      return regex.test(value) ? null : "Invalid Password";
    },
    confirmPassword: (value) => {
      if (!extraFields?.password) return "Password required first.";
      return value === extraFields.password ? null : "Passwords do not match.";
    },
    otp: (value) => {
      console.log("OTP Value", value);
      const regex = /^[0-9A-Z]{6}$/;
      return regex.test(value) ? null : "OTP must be 6 characters (0-9, A-Z).";
    },
    phoneNumber: (value) => {
      const regex = /^\d{10}$/;
      return regex.test(value) ? null : "Phone number must be 10 digits.";
    },
    designation: (value) =>
      value.trim().length >= 3
        ? null
        : "Designation must be at least 3 characters.",
    name: (value) =>
      value.trim().length >= 4 ? null : "Name must be at least 4 characters.",
  };

  for (const [key, value] of Object.entries(data)) {
    const validator = validators[key];
    if (validator) {
      const error = validator(value);
      if (error) errors[key] = error;
    }
  }

  return Object.keys(errors).length === 0 ? true : errors;
}
