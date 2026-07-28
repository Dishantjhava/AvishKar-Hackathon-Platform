const mongoose = require("mongoose");

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const isStrongPassword = (password) => {
  if (!password || typeof password !== "string") return false;
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

const isValidObjectId = (id) => {
  if (!id || typeof id !== "string") return false;
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const validateHackathonDates = (registrationDeadline, startDate, endDate) => {
  const regDate = new Date(registrationDeadline);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(regDate.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: "Invalid date format provided." };
  }

  if (regDate >= start) {
    return { valid: false, message: "Registration deadline must be before the hackathon start date." };
  }

  if (start >= end) {
    return { valid: false, message: "Hackathon start date must be before the end date." };
  }

  return { valid: true };
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidObjectId,
  isValidUrl,
  validateHackathonDates,
};
