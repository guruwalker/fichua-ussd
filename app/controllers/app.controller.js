/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const { menu } = require('../config/menu-builder');

const AuthenticationController = require('./authentication/authentication.controller');
const ReportController = require('./report/report.controller');
const AboutController = require('./about/about.controller');

module.exports = async function AppController(req, res) {
  try {
    /** ------------------------------------------------------
     *  ---------------------------------------
     *  App entry point
     * ---------------------------------------
 ------------------------------------------------------* */
    menu.startState({
      run: async () => {
        try {
          /** ------------------------------------------------------
           *  ---------------------------------------
           *  First screen
           * ---------------------------------------
          ------------------------------------------------------* */
          menu.con('Welcome to Fichua!\n'
              + '\n1. Login to report'
              + '\n2. Report anonymously'
              + '\n3. About Fichua');
        } catch (error) {
          console.error(error);
        }
      },
      /** ------------------------------------------------------
     *  ---------------------------------------
     *  Entry points to other modules
     * ---------------------------------------
     ------------------------------------------------------* */
      next: {
        1: 'entry-point-to-authentication-controller',
        2: 'entry-point-to-report-controller',
        3: 'entry-point-to-about-controller',
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Authentication  controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-authentication-controller', {
      run() {
        AuthenticationController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Report controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-report-controller', {
      run() {
        ReportController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  About controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-about-controller', {
      run() {
        AboutController(req, res);
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
