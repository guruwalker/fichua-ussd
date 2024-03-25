/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { sms } = require('../../config/africastalking');
const { menu } = require('../../config/menu-builder');

const { createCase } = require('../cases/case.controller');

let incidentLocation = '';
let incidentStatement = '';
let incidentType = '';

const clearState = () => {
  incidentLocation = '';
  incidentType = '';
  incidentStatement = '';
};

const generateShortUUID = () => {
  const uuidLength = 16;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';

  for (let i = 0; i < uuidLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters.charAt(randomIndex);
  }
  return uuid;
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
        menu.con('2. Where did the incident happen?');
      },
      next: {
        '*': 'get-location',
      },
    });

    menu.state('get-location', {
      run: async () => {
        incidentLocation = menu.val;
        menu.con('3. Provide a brief description of what happened');
      },
      next: {
        '*': 'final-output',
      },
    });

    menu.state('final-output', {
      run: async () => {
        incidentStatement = menu.val;

        // try {
        const payload = {
          case_uuid: generateShortUUID(),
          reported_by: null,
          crime_type: incidentType,
          statement: incidentStatement,
          is_anonymous: false,
          location: incidentLocation,
          status: 'reported',
          assigned_officer: null,
          priority: 'unknown',
          date_closed: '',
          created_at: null,
          updated_at: null,
        };

        const creationResult = await createCase(payload);

        if (creationResult.success) {
          menu.end('Thank you for your report. We will get back to you shortly.');
          await sms.send({
            to: menu.args.phoneNumber,
            message: `Your case has been reported successfully. Your case ID is ${payload.case_uuid}.`,
          });
          clearState();
        } else {
          // Handle creation failure
          console.error('Failed to create case:', creationResult.message);
          menu.end('Failed to submit the report. Please try again later.');
        }
        // } catch (error) {
        //   console.error('Error in final-output state:', error);
        //   menu.con('An unexpected error occurred. Please try again later.');
        // }
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
