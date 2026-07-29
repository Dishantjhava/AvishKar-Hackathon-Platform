
export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email address is required.";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) return "Please enter a valid email format (e.g. user@example.com).";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return "";
};

export const validateUrl = (url) => {
  if (!url || !url.trim()) return "";
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL must start with http:// or https://";
    }
  } catch {
    return "Please enter a valid URL (e.g. https://github.com/org/repo).";
  }
  return "";
};

export const validateDates = (registrationDeadline, startDate, endDate) => {
  if (!registrationDeadline || !startDate || !endDate) return "";
  const regDate = new Date(registrationDeadline);
  const start   = new Date(startDate);
  const end     = new Date(endDate);

  if (isNaN(regDate.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Invalid date format.";
  }

  if (regDate >= start) {
    return "Registration deadline must be before hackathon start date.";
  }

  if (start >= end) {
    return "Start date must be before end date.";
  }

  return "";
};
