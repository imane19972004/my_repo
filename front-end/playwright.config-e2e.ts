import { PlaywrightTestConfig } from "playwright/test";

const config : PlaywrightTestConfig ={
    reporter :[['html',{ open :'never', outputFile: 'playwright-report/results.html'}]],
    timeout: 60000,
    testMatch : [
        'e2e/**/*.spec.ts'
    ],
    use : {
        headless: true,
        viewport: {width: 1200, height: 720 },
        ignoreHTTPSErrors: true ,
        video: 'on',
        screenshot: 'on',
        launchOptions:{
            slowMo: 1000,
        }
    },
};
export default config;