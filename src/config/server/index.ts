import * as http from 'http';
import * as serverHandlers from './serverHandlers';
import server from './server';
import notificationService from '../../components/Notification';

const Server: http.Server = http.createServer(server);

notificationService.init(Server);

/**
 * Binds and listens for connections on the specified host
 */
Server.listen(server.get('port'), () => {
  console.log('listening on port:', server.get('port'));
});

/**
 * Server Events
 */
Server.on('error', (error: Error) =>
  serverHandlers.onError(error, server.get('port'))
);
Server.on('listening', serverHandlers.onListening.bind(Server));
