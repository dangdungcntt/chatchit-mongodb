module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'CHATCHIT',
      script    : 'index.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'dangdungcntt',
      host : '35.186.159.152',
      ref  : 'origin/production',
      repo : 'git@github.com:dangdungcntt/chatchit-mongodb.git',
      path : '/home/dangdungcntt/chatchit',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};
