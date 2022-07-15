const express = require('express');
const debug = require('debug');
const config = require('./config');

debug.enable('*');
const log = debug('APP');
const rlog = debug('REQUEST');

log('Starting...');

const app = express();

app.set('view engine', 'ejs');

log('Port: ' + config.port);
log('Theme: ' + config.theme);

app.use((req, res, next) => {
    rlog(`${req.method} ${req.path}`);
    return next();
});

var themeDir = __dirname + `/public/${config.theme}`;
app.set('views', themeDir);
app.use('/assets',express.static(themeDir + '/assets'));

app.get('*', (req, res) => {
    var pa = req.path;
    if (pa == '/') pa = 'index';
    try {
    res.render(pa, (err, html) => {
        if (err) {
            return res.render('404');
        } else {
            return res.send(html);
        }
    });
    } catch(e) {
        res.send('Error: ' + String(e))
    }
    //res.send('try/catch failed?');
});  

app.listen(config.port, () => {
    log(`Online at port ${config.port}!`);
});