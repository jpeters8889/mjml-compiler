const http = require('http');
const mjml2html = require('mjml');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

const server = http.createServer(function (req, res) {

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    res.setHeader('Content-Type', 'application/json');

    req.on('end', () => {

        try {
            body = JSON.parse(body);

            if (!body || !body['mjml']) {
                res.statusCode = 400;

                return res.end(JSON.stringify({
                    message: 'Missing parameter: mjml'
                }));
            }

            const mjml = mjml2html(body['mjml'], {
                keepComments: false
            });

            return res.end(JSON.stringify(mjml));

        } catch (err) {
            res.statusCode = 500;

            return res.end(JSON.stringify({
                message: err.message
            }));
        }
    });
});

server.listen(args.port || 8080);
