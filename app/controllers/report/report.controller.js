/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { sms } = require('../../config/africastalking');
const { menu } = require('../../config/menu-builder');

let incidentLocation = '';
let incidentStatement = '';
let incidentType = '';

const clearState = () => {
  incidentLocation = '';
  incidentType = '';
  incidentStatement = '';
};

module.exports = async function ManualController(req, res) {
  try {
    menu.state('entry-point-to-report-controller', {
      run: () => {
        clearState();
        menu.con('Please provide all required answers to complete the report.\n1. What crime happened?');
      },
      next: {
        '*': 'get-statement',
      },
    });

    menu.state('get-statement', {
      run: () => {
        incidentType = menu.val;
        menu.con('Please provide all required answers to complete the report.\n1. Where did the incident happen?');
      },
      next: {
        '*': 'get-location',
      },
    });

    menu.state('get-location', {
      run: async () => {
        incidentLocation = menu.val;
        menu.con('2. Provide a brief description of what happened');
      },
      next: {
        '*': 'final-output',
      },
    });

    menu.state('final-output', {
      run: async () => {
        menu.end('Thank you for your report. We will get back to you shortly.');
        // Your final output logic goes here
        // Clear state after processing
        clearState();
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
