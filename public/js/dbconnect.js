const pg = require('pg');
var dbUrl = process.env.DATABASE_URL || 'postgres://Karen:password@localhost/imageboard';
dbUrl = require('url').parse(dbUrl);
var dbUser = dbUrl.auth.split(':');

var dbConfig = {
    user: dbUser[0],
    database: dbUrl.pathname.slice(1),
    password: dbUser[1],
    host: dbUrl.hostname,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(dbConfig);
pool.on('error', function(err){
    console.log(err);
});

exports.pgConnect = function(call, params){
    return new Promise(function(resolve,reject){
        pool.connect(function(err,client,done){
            if (err) {
                reject(err);
                return;
            }
            client.query(call, params || [], function(err, data){
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                } else {
                    resolve(data);
                }
                done();
            });
        }).catch(function(err){
            throw err;
        });
    });
};
