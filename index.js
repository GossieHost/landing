const express = require('express');
const debug = require('debug');
const config = require('./config');

debug.enable('*');
const log = debug('APP');
const rlog = debug('REQUEST');

log('Starting...');
var c = 0;

const app = express();

app.set('view engine', 'ejs');

log('Port: ' + config.port);
log('Theme: ' + config.theme);

app.use((req, res, next) => {
    c++;
    rlog(`${String(c).padStart(5, ' ')}   -   ${req.method} ${req.path}`);
    return next();
});

var themeDir = __dirname + `/public/${config.theme}`;
app.set('views', themeDir);
app.use('/assets', express.static(themeDir + '/assets'));

app.get('*', (req, res) => {
    var pa = req.path;
    if (pa == '/') pa = 'index';

    pa = pa.replace('/', '');

    // console.log(pa);

    try {
        res.render(pa, {
            config,
            app,
            req,
            res
        }, (err, html) => {
            if (err) {
                res.status(404);
                return res.render('404', {err});
            } else {
                return res.send(html);
            }
        });
    } catch(e) {
        res.status(500);
        res.send('Error: ' + String(e))
    }
    //res.send('try/catch failed?');
});  

app.listen(config.port, () => {
    log(`Online at port ${config.port}!`);
});