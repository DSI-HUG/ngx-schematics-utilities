const { chain } = require('@angular-devkit/schematics');
const {
    spawn, schematic, log, logInfo, logWarning, logError, logAction, modifyJsonFile,
    runAtEnd, rule, workspace
} = require('../../../dist/src');

exports.default = () => schematic('My Schematic', [
    log('This is a normal log\n'),
    logInfo('This is an info\n'),
    logWarning('This is a warning\n'),
    logError('This is an error\n'),
    logAction('This is an action\n'),

    modifyJsonFile('package.json', ['version'], '1.0.0'),
    modifyJsonFile('package.json', ['version'], undefined),

    spawn('npm', ['--version']),
    log(''),

    rule(() => {
        // do something..
        log('Custom rule\n');
    }),

    runAtEnd(chain([
        rule(() => {
            // do something..
            console.log('\nDo something at the end...\n');
        }),
        logInfo('Run at the end\n')
    ])),

    workspace()
        .rule(() =>
            // do something...
            log('Custom rule from chainable\n')
        )
        .log('Log from workspace\n')
        .runAtEnd(logAction('Have a look at `./package.json` file and make modifications as needed.'))
        .toRule()
]);
