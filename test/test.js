const spawn = require('child_process').spawn;
const assert = require('assert');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const { exit } = require('process');
const By = webdriver.By;
const until = webdriver.until;

spawn('node', ['node_modules/http-server/bin/http-server', '-s', '-p', '3000', 'build', '&']);

const chromeOptions = {
    'args': ['--no-sandbox', '--headless']
};

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', chromeOptions);

const browser = new webdriver.Builder()
    .withCapabilities(chromeCapabilities)
    .build();

test.describe('project', () => {
    const go = (target, callback) => {
        browser.findElement(By.linkText(target)).then((element) => {
            element.click();
            callback();
        });
    };

    const urlMatches = (target) => {
        browser.getCurrentUrl().then((url) => {
            assert.ok(url.endsWith(target));
        });
    };

    const hasH2 = async (targets) => {
        if (!Array.isArray(targets))
            targets = [targets];

        let promises = [];
        targets.forEach(async (target) => {
            promises.push(new Promise((resolve) => {
                browser.wait(until.elementsLocated(By.xpath(`//h2[contains(text(), '${target}')]`)), 5000)
                    .then((result) => {
                        assert.ok(result);
                        resolve();
                    })
                    .catch(() => {
                        assert.fail(`h2: ${target} not found`);
                        resolve();
                    });
            }));
        });

        return Promise.all(promises);
    };

    test.beforeEach(function (done) {
        this.timeout(20000);

        browser.get('http://localhost:3000');
        done();
    });

    test.after(function (done) {
        browser.quit();
        done();
        exit(0);
    });

    test.it('should load index', (done) => {
        urlMatches('/');

        done();
    });

    test.it('should go to register through login form', (done) => {
        go('Logga in', () => {
            go('Registrera här', () => {
                urlMatches('/register');
                done();
            });
        });
    });

    test.it('should go list of stocks', (done) => {
        go('Investera', () => {
            urlMatches('/invest');
            done();
        });
    });

    test.it('should go specific stock', (done) => {
        go('Investera', () => {
            go('AMD', () => {
                hasH2('AMD');
                done();
            });
        });
    });

    test.it('should go to index from anywhere', (done) => {
        go('Investera', () => {
            go('AMD', () => {
                hasH2('AMD');
                go('PROJEKT', () => {
                    urlMatches('/');
                    done();
                });
            });
        });
    });
});

