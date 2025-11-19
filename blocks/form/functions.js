/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Validate a phone number based on selected country
 * @param {string} countryValue value from dropdown (e.g., 'US', 'IN', 'United States', 'India')
 * @param {string} phoneNumber the entered phone number string
 * @returns {boolean} true if the phone number is valid for the country, false otherwise
 */
function validatePhoneNumber(countryValue, phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;

  const raw = phoneNumber.trim();

  // Normalize country key
  const key = (countryValue || '').toString().trim().toUpperCase();

  // Map common country name variants to ISO-like keys
  const aliasMap = {
    'UNITED STATES': 'US',
    'UNITED KINGDOM': 'GB',
    'INDIA': 'IN'
  };

  const normalizedKey = aliasMap[key] || key;

  // Basic regex set per country (not exhaustive, focuses on common national/mobile formats)
  const patterns = {
    // US & Canada: 10 digits, area code cannot start with 0/1 for NANP; allow +1
    US: /^(?:\+1[\s.-]?)?(?:\(?[2-9]\d{2}\)?[\s.-]?)?[2-9]\d{2}[\s.-]?\d{4}$/,

    // United Kingdom (GB) - mobile and typical national formats
    GB: /^(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{6,7}$|^(?:\+44\s?1\d{3}|\(?01\d{3}\)?)\s?\d{6,7}$/,

    // India - 10 digits starting with 6-9, optional +91
    IN: /^(?:\+91[\-\s]?)?[6-9]\d{9}$/
  };

  // Fallback generic E.164-like pattern (up to 15 digits, optional leading +)
  const e164Fallback = /^\+?[1-9]\d{1,14}$/;

  const pattern = patterns[normalizedKey];

  if (pattern) {
    return pattern.test(raw);
  }

  // Try a few heuristics: if includes + and digits, try E.164 fallback
  return e164Fallback.test(raw);
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, validatePhoneNumber };
