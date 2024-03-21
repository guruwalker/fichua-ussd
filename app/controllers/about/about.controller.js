/* eslint-disable no-console */
const { menu } = require('../../config/menu-builder');

module.exports = async function ManualController(req, res) {
  try {
    /** ---------------------------------------------------
     *   ──────┤ Entry ├──────    ***********
     ---------------------------------------------------* */
    menu.state('entry-point-to-about-controller', {
      run: () => {
        menu.end('Fichua is Nairobi\'s new crime reporting system. It is an initiative by the DCI to allow people to make official reports to the police in a fast, cheap and convenient manner');
      },
      next: {
        '*': 'emergency-controller',
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
