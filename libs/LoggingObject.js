var moment = require('moment'),
    functions = require('libs/functions');

//
// Custom built logger
//
var log =
{
    colors:
    {
        black   :'\u001b[1;30m',
        red     :'\u001b[1;31m',
        green   :'\u001b[1;32m',
        yellow  :'\u001b[1;33m',
        blue    :'\u001b[1;34m',
        purple  :'\u001B[1;35m',
        cyan    :'\u001B[1;36m',
        white   :'\u001B[1;37m',
    },

    backgrounds:
    {
        black   :'\u001b[1;40m',
        red     :'\u001b[1;41m',
        green   :'\u001b[1;42m',
        yellow  :'\u001b[1;43m',
        blue    :'\u001b[1;44m',
        purple  :'\u001B[1;45m',
        cyan    :'\u001B[1;46m',
        white   :'\u001B[1;47m',
    },

    formatting:
    {
        // Spacer
        reset:      '\u001b[1;0m',
        space:      '   ',
        bold:       '\u001b[1;1m',
        italic:     '\u001b[1;3m',
        underline:  '\u001b[1;4m',
    },

    //
    // echo something to the log
    //
    echo: function(string, params)
    {
        // Parse {stuff}
        var data = string.match(/[^{}]+(?=\})/g)
        if (data)
        {
            // Loop through to format it
            for (var i in data)
            {
                var value = data[i];

                if (value == '-')
                {
                    var newValue = log.formatting.space;
                }
                else
                {
                    context = value.split(':');

                    // The context
                    var text = context[0];

                    // Real text
                    var realText = params[text];

                    // Get the color to use
                    var color = context[1] ? log.colors[context[1]] : log.colors['white'];

                    var style = '';
                    if (context[2] == 'bold') { style = log.formatting.bold; }
                    if (context[2] == 'italic') { style = log.formatting.italic; }
                    if (context[2] == 'underline') { style = log.formatting.underline; }

                    // Get new value
                    var newValue = color + style + realText + log.formatting.reset;
                }

                string = functions.replaceAll(string, '{' + value + '}', newValue);
            }
        }

        // print
        var date = moment().format('HH:mm:ss') +'  '+ moment().format('x').slice(-3),
            diff = (global.TIMESTAMP > 0) ? moment().format('x') - global.TIMESTAMP : 0,
            diff = (diff == 0) ? '' : diff;

        // if diff increased, highlight the time
        if (diff > 0) {
            date = log.colors.yellow + date + log.formatting.reset;
        }

        // diff visual
        var diffVisual = functions.padding(Array(12).join(' '), diff, true);
            diffVisual = log.colors.yellow + diffVisual + log.formatting.reset;

        // print timestamp
        console.log('    [%s]  %s%s    %s', global.SPAWN ? global.SPAWN : 'core', date, diffVisual, string);

        // update global timestamp
        global.TIMESTAMP = moment().format('x');
    },

    //
    // Print a title (line before and after)
    //
    title: function()
    {
        log.line();
        log.echo('{msg:purple}', {
            msg: 'XIVSync Cronjob'
        });
        log.line();
    },

    //
    // Print a line!
    //
    line: function()
    {
        console.log('    ------------------------------------------------------------');
    },

    //
    // Add a space
    //
    space: function()
    {
        log.echo('');
    },

    //
    // Alias for console log
    //
    console: function()
    {
        console.log(arguments);
    }
}

// Export it
module.exports = log;
