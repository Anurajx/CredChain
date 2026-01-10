const crypto = require("crypto");

/**
 * Generates a deterministic unique 10-character ID
 * Format: [3_LETTERS][7_DIGITS]
 * First 3 letters derived from State name
 *
 * @param {Object} input - Object containing district, state, and random number
 * @param {number} input.districtId - District ID (numeric)
 * @param {string} input.state - State name (string)
 * @param {string|number} input.randomNumber - Random number for uniqueness
 * @returns {string} A unique 10-character ID (3 letters + 7 digits)
 */
function generateDistrictID(input) {
  const { districtId, state, randomNumber } = input;

  // Validate inputs
  if (
    districtId === undefined ||
    districtId === null ||
    !state ||
    randomNumber === undefined ||
    randomNumber === null ||
    randomNumber === ""
  ) {
    throw new Error(
      "All fields are required: districtId (number), state (string), and randomNumber"
    );
  }

  // Convert all inputs to strings and normalize
  const normalizedDistrict = String(districtId).trim();
  const normalizedState = String(state).replace(/\s+/g, "").toUpperCase();
  const normalizedRandom = String(randomNumber).trim();

  // Generate 3-letter prefix from state name only
  const threeLetterPrefix = generateThreeLetterCode(normalizedState);

  // Create a deterministic string by combining all inputs
  const combinedString = `${normalizedDistrict}|${normalizedState}|${normalizedRandom}`;

  // Generate SHA-256 hash (deterministic)
  const hash = crypto.createHash("sha256").update(combinedString).digest("hex");

  // Convert hash to a numeric string
  let numericString = "";

  for (let i = 0; i < hash.length && numericString.length < 7; i += 2) {
    const hexPair = hash.substr(i, 2);
    const decimalValue = parseInt(hexPair, 16);
    numericString += decimalValue.toString();
  }

  // Take exactly 7 digits
  const sevenDigits = numericString.substr(0, 7);

  // Combine 3-letter prefix with 7 digits
  return `${threeLetterPrefix}${sevenDigits}`;
}

/**
 * Generates a 3-letter code from state name only
 * @param {string} state - State name
 * @returns {string} 3-letter code
 */
function generateThreeLetterCode(state) {
  // Remove non-alphabetic characters
  const cleanState = state.replace(/[^A-Z]/g, "");

  if (cleanState.length === 0) {
    return "XXX";
  }

  let code = "";

  // Take first 3 letters from state
  if (cleanState.length >= 3) {
    code = cleanState.substr(0, 3);
  } else if (cleanState.length === 2) {
    code = cleanState + "X";
  } else if (cleanState.length === 1) {
    code = cleanState + "XX";
  }

  return code.toUpperCase();
}

/**
 * Validates if the generated ID format is correct
 * @param {string} id - The ID to validate
 * @returns {boolean} True if valid format
 */
function validateDistrictIDFormat(id) {
  const pattern = /^[A-Z]{3}\d{7}$/;
  return pattern.test(id);
}

/**
 * Extracts the 3-letter prefix from an ID
 * @param {string} id - The generated ID
 * @returns {string} The 3-letter prefix
 */
function getPrefixFromID(id) {
  if (!validateDistrictIDFormat(id)) {
    throw new Error("Invalid ID format");
  }
  return id.substr(0, 3);
}

/**
 * Batch generate IDs for multiple entries
 * @param {Array} entries - Array of objects with districtId, state, randomNumber
 * @returns {Array} Array of generated IDs
 */
function batchGenerateDistrictIDs(entries) {
  return entries.map((entry) => {
    try {
      return {
        input: entry,
        id: generateDistrictID(entry),
        success: true,
      };
    } catch (error) {
      return {
        input: entry,
        error: error.message,
        success: false,
      };
    }
  });
}

// Export functions
module.exports = {
  generateDistrictID,
  validateDistrictIDFormat,
  getPrefixFromID,
  batchGenerateDistrictIDs,
};

// Example usage (only runs if file is executed directly)
if (require.main === module) {
  console.log("=== District-Based ID Generator (10 Characters) ===\n");

  // Example 1: Delhi district with numeric ID
  const delhi = {
    districtId: 101,
    state: "Delhi",
    randomNumber: 1234567890,
  };

  const delhiID = generateDistrictID(delhi);
  console.log("Delhi ID:", delhiID);
  console.log("ID Length:", delhiID.length);
  console.log("Valid Format:", validateDistrictIDFormat(delhiID));
  console.log("Prefix:", getPrefixFromID(delhiID));
  console.log("");

  // Example 2: Mumbai district with numeric ID
  const mumbai = {
    districtId: 202,
    state: "Maharashtra",
    randomNumber: 9876543210,
  };

  const mumbaiID = generateDistrictID(mumbai);
  console.log("Mumbai ID:", mumbaiID);
  console.log("ID Length:", mumbaiID.length);
  console.log("Valid Format:", validateDistrictIDFormat(mumbaiID));
  console.log("Prefix:", getPrefixFromID(mumbaiID));
  console.log("");

  // Example 3: Bangalore district with numeric ID
  const bangalore = {
    districtId: 303,
    state: "Karnataka",
    randomNumber: "5555555555",
  };

  const bangaloreID = generateDistrictID(bangalore);
  console.log("Bangalore ID:", bangaloreID);
  console.log("ID Length:", bangaloreID.length);
  console.log("Valid Format:", validateDistrictIDFormat(bangaloreID));
  console.log("Prefix:", getPrefixFromID(bangaloreID));
  console.log("");

  // Example 4: Gurugram (your location) with numeric ID
  const gurugram = {
    districtId: 404,
    state: "Haryana",
    randomNumber: 1122334455,
  };

  const gurugramID = generateDistrictID(gurugram);
  console.log("Gurugram ID:", gurugramID);
  console.log("ID Length:", gurugramID.length);
  console.log("Valid Format:", validateDistrictIDFormat(gurugramID));
  console.log("Prefix:", getPrefixFromID(gurugramID));
  console.log("");

  // Demonstration: Same inputs always generate same ID
  console.log("=== Consistency Test ===");
  const id1 = generateDistrictID(delhi);
  const id2 = generateDistrictID(delhi);
  const id3 = generateDistrictID(delhi);
  console.log("Attempt 1:", id1);
  console.log("Attempt 2:", id2);
  console.log("Attempt 3:", id3);
  console.log("All IDs identical:", id1 === id2 && id2 === id3);
  console.log("");

  // Demonstration: Different random numbers generate different IDs
  console.log("=== Uniqueness Test ===");
  const sameDistrict1 = generateDistrictID({
    districtId: 101,
    state: "Delhi",
    randomNumber: 1111111111,
  });
  const sameDistrict2 = generateDistrictID({
    districtId: 101,
    state: "Delhi",
    randomNumber: 2222222222,
  });
  console.log("Same District, Random 1:", sameDistrict1);
  console.log("Same District, Random 2:", sameDistrict2);
  console.log("IDs are different:", sameDistrict1 !== sameDistrict2);
  console.log("");

  // Batch processing example
  console.log("=== Batch Processing ===");
  const batchEntries = [
    {
      districtId: 501,
      state: "West Bengal",
      randomNumber: 1010101010,
    },
    {
      districtId: 502,
      state: "Tamil Nadu",
      randomNumber: 2020202020,
    },
    {
      districtId: 503,
      state: "Rajasthan",
      randomNumber: 3030303030,
    },
  ];

  const batchResults = batchGenerateDistrictIDs(batchEntries);
  batchResults.forEach((result, index) => {
    if (result.success) {
      console.log(
        `Entry ${index + 1}: ${result.id} (Prefix: ${getPrefixFromID(
          result.id
        )})`
      );
    } else {
      console.log(`Entry ${index + 1}: Error - ${result.error}`);
    }
  });
}
