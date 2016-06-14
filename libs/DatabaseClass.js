var mysql = require('mysql'),
    config = require('config'),

    // libs
    functions = require('libs/functions.js'),
    log = require('libs/LoggingObject');

//
// Simple mysql query builder
// - XIVSync
//
class DatabaseClass
{
    constructor()
    {
        this.QueryBuilder = require('libs/QueryBuilderClass');

        // if persistent disabled, don't do anything
        if (!config.persistent) {
            return;
        }

        // Setup Server
        this.connection = mysql.createPool(
        {
            host:       config.db.host,
            user:       config.db.user,
            password:   config.db.pass,
            database:   config.db.table,
            debug:      config.db.debug,
            //socketPath  : '/var/run/mysqld/mysqld.sock',
        });
    }

    //
    // run an sql query
    //
    sql(sql, binds, callback)
    {
        var randomId = functions.randomNumber(0, 99999);

        // if persistent disabled, don't do anything
        if (!config.persistent) {
            return;
        }

        // Get the connection
        this.connection.getConnection(function(error, connection)
        {
            // If any errors, throw the exception
            if (error) {
                throw error;
            }

            log.echo("[DB] [{id:red}] SQL: {sql:purple}", {
                id: randomId,
                sql: config.settings.sqlStatementTruncate ? sql.substring(0, config.settings.sqlStatementTruncate) + '...' : sql
            });

            // Run the query
            connection.query(sql, binds, function(error, rows, fields)
            {
                // If any errors, throw the exception
                if (error)
                {
                    log.echo("[DB] [{id:red}] {arrow:green} {error:red}", {
                        id: randomId,
                        arrow: '>>',
                        error: error
                    });

                    // Return, if specific function exists, call that,
                    // otherwise its an inline function and does not require
                    // the client to be sent back
                    if (typeof callback !== 'undefined')
                    {
                        callback(error);
                    }
                }
                else
                {
                    // Disconnect this query
                    connection.release();
                    log.echo("[DB] [{id:red}] {arrow:green} Database query complete", {
                        id: randomId,
                        arrow: '>>'
                    });

                    // Setup a return object
                    var obj = {
                        length: rows.length,
                        rows: rows,
                    }

                    // Return, if specific function exists, call that,
                    // otherwise its an inline function and does not require
                    // the client to be sent back
                    if (typeof callback !== 'undefined')
                    {
                        callback(obj);
                    }
                }
            });
        });
    }
}

// Export it
module.exports = new DatabaseClass();
