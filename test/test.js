const spawn = require('child_process').spawn;
const assert = require('assert');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

let server;

const chromeOptions = {
    'args': ['--no-sandbox', '--headless']
};

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', chromeOptions);

const browser = new webdriver.Builder()
    .withCapabilities(chromeCapabilities)
    .build();

test.describe('jsramverk me', () => {
    const urlMatches = (target) => {
        browser.getCurrentUrl().then((url) => {
            assert.ok(url.endsWith(target));
        });
    };

    test.beforeEach(function (done) {
        this.timeout(20000);

        console.log('SPAWNING SERVER');
        server = spawn('node_modules/http-server/bin/http-server', ['-s', '-p 3000', 'build']);

        browser.get('http://localhost:3000');
        done();
    });

    test.after(function (done) {
        browser.quit();

        console.log('KILLING SERVER');
        server.kill();
        done();
    });

    test.it('should load index', (done) => {
        console.log('SHOULD GET INDEX TEST');
        urlMatches('/');

        done();
    });
});

