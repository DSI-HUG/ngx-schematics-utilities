const {
    spawn, schematic, log, logInfo, logWarning, logError, logAction, modifyJsonFile
} = require('../../../dist/src');

exports.default = () => schematic('My Schematic', [
    logInfo('This is an info'),
    log('This is a normal log\n'),
    spawn('npm', ['--version']),
    log(''),
    modifyJsonFile('package.json', ['version'], '1.0.0'),
    modifyJsonFile('package.json', ['version'], undefined),
    logWarning('This is a warning'),
    logError('This is an error'),
    logAction('This is an action')
]);
