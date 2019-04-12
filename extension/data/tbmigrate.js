// This should only be part of toolbox as long as v4.x and v3.x can be installed next to each other.
// The only goal is to try and make sure that if v4 is active v3 will not activate on the same page.
// In order to do that we load this script first, do a quick check if v4 is going to activate and set a session storage key.
const start = performance.now();
let previousName = 'start';
let previous = start;

function profileResults (name, number) {
    if (name === 'start') {
        console.log('   ');
        console.log('performance start:', number);
        console.log('--------------------------');
        console.log('ms:', start);
        console.log('sec:', Math.round(start / 1000));
    } else {
        const secs = Math.round((number - start) / 1000);
        const secsPrevious = Math.round((number - previous) / 1000);
        console.log('   ');
        console.log(`Profile: ${name}`);
        console.log('--------------------------');
        console.log('ms:', number - start);
        console.log('sec:', secs);
        console.log(`Profile: ${name} since ${previousName}`);
        console.log('---');
        console.log('ms:', number - previous);
        console.log('sec:', secsPrevious);
        console.log('   ');

        previousName = name;
        previous = number;
    }
}

profileResults('start', start);

document.addEventListener('readystatechange', event => {
    console.log(event);
    console.log(`readystate: ${document.readyState}`, Date.now());
});

if (location.host === 'mod.reddit.com') {
    sessionStorage.setItem('v4active', 'true');
} else {
    chrome.storage.local.get('tbsettings', sObject => {
        if (sObject.tbsettings && sObject.tbsettings['Toolboxv4.oldreddit.enabled']) {
            sessionStorage.setItem('v4active', 'true');
        } else {
            sessionStorage.removeItem('v4active');
        }
    });
}
window.addEventListener('unload', () => {
    sessionStorage.removeItem('v4active');
});
