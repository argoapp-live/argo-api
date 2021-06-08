import * as express from 'express';
import * as http from 'http';
import * as passportConfig from '../config/middleware/passport';
import * as swaggerUi from 'swagger-ui-express';
import AuthRouter from './AuthRouter';
import ProfileRouter from './ProfileRouter';
import OrganizationRouter from './OrganizationRouter';
import ProjectRouter from './ProjectRouter';
import InvitationRouter from './InvitationRouter';
import WebHookRouter from './WebHookRouter';

import LogsRouter from './DeploymentsRouter';
import WalletRouter from './WalletRouter';
import DomainRouter from './DomainRouter';
import ConfigurationRouter from './ConfigurationRouter';

let swaggerDoc: Object;

try {
    swaggerDoc = require('../../swagger.json');
} catch (error) {
    console.log('***************************************************');
    console.log('  Seems like you doesn\`t have swagger.json file');
    console.log('  Please, run: ');
    console.log('  $ swagger-jsdoc -d swaggerDef.js -o swagger.json');
    console.log('***************************************************');
}

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();

    app.use('/profile', passportConfig.isAuthenticated, ProfileRouter);
    app.use('/organization', passportConfig.isAuthenticated, OrganizationRouter);
    app.use('/project', passportConfig.isAuthenticated, ProjectRouter);
    app.use('/webhook', WebHookRouter);
    app.use('/auth', AuthRouter);
    app.use('/invite', passportConfig.isAuthenticated, InvitationRouter);
    app.use('/domain', passportConfig.isAuthenticated, DomainRouter);
    app.use('/logs', LogsRouter);
    app.use('/wallet', WalletRouter);
    app.use('/configuration', ConfigurationRouter);

    
    /**
     * @description
     *  If swagger.json file exists in root folder, shows swagger api description
     *  else send commands, how to get swagger.json file
     * @constructs
     */
    if (swaggerDoc) {
        app.use('/docs', swaggerUi.serve);
        app.get('/docs', swaggerUi.setup(swaggerDoc));
    } else {
        app.get('/docs', (req, res) => {
            res.send('<p>Seems like you doesn\'t have <code>swagger.json</code> file.</p>' +
                '<p>For generate doc file use: <code>swagger-jsdoc -d swaggerDef.js -o swagger.json</code> in terminal</p>' +
                '<p>Then, restart your application</p>');
        });
    }

    /** 
     * @description No results returned mean the object is not found
     * @constructs
     */
    app.use((req, res, next) => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    /**
     * @constructs all routes
     */
    app.use(router);
}
