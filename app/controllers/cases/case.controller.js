/* eslint-disable max-len */
const axios = require('axios');

module.exports = {
  /**
   * POST /api/v1/cases
   *
   * @param caseData
   * @returns {Promise<{success: boolean, message: string, data: any}|{success: boolean, message: *, data: *}>}
   */
  createCase: async (caseData) => {
    try {
      const response = await axios.post('http://localhost:3333/api/v1/cases', caseData);
      return {
        success: true,
        message: 'Successfully created the case',
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  },
};
