// ==UserScript==
// @name        ISOing user's posts Resetera
// @description Adds list of names to ISO at the bottom of the page
// @version     2.4.1
// @namespace   https://github.com/Ty4on/ReseteraISO
// @updateURL   https://github.com/Ty4on/ReseteraISO/raw/main/main.user.js
// @downloadURL https://github.com/Ty4on/ReseteraISO/raw/main/main.user.js
// @license     MIT
// @homepageURL https://github.com/Ty4on/ReseteraISO
// @author      Ty4on
// @match       http*://www.resetera.com/threads/*
// @match       http*://www.resetera.com/threads/*/*
// @match       http*://www.outermafia.com/threads/*
// @match       http*://www.outermafia.com/threads/*/*
// ==/UserScript==

/*--- Create a named link for every poster.
      Clicking this link will hide every post
      not made by that poster - ISOing poster.
*/

// Define possible sites
const ResetEra = "www.resetera.com";
const OuterMafia = "www.outermafia.com";

// Find current site
const currentSite = window.location.hostname;

let topBreadcrumbArea = "breadcrumb";
let bottomBreadcrumbArea = "breadcrumb p-breadcrumb--bottom";

if (currentSite == ResetEra) {
    topBreadcrumbArea = "breadcrumb";
    bottomBreadcrumbArea = "breadcrumb p-breadcrumb--bottom";
} else if (currentSite == OuterMafia) {
    topBreadcrumbArea = "p-breadcrumbs";
    bottomBreadcrumbArea = "p-breadcrumbs p-breadcrumbs--bottom";
} else {
    console.log("oh no where am I?");
    console.log(currentSite);
}

// Find post start
const elmPosts = document.getElementsByClassName("message   message--post");
// Raw namelist
const nameListUn = [];

// Find all posters, put into namelist
let tryings = 0;
while (tryings < elmPosts.length) {
    const name = elmPosts[tryings].getAttribute("data-author");
    nameListUn.push(name);
    tryings++;
}

// Object with postcounts of posters
const nameCounts = {};
nameListUn.forEach(function(x) { nameCounts[x] = (nameCounts[x] || 0)+1; });

// Deletes duplicate names
// AND SORTS THEM PROPERLY HALLELUJAH
const nameList = [...new Set(nameListUn)].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

// Finds place to put links
const elmEnds = document.getElementsByClassName(topBreadcrumbArea);
const elmEnd = elmEnds[0];

const elmContainer = document.createElement('div');
elmContainer.style.display = 'grid';
elmContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
elmContainer.style.gridTemplateColumns = 'repeat(6, 1fr)';
elmContainer.style.gridAutoFlow = 'row';
elmEnd.parentNode.insertBefore(elmContainer, elmEnd);


// Goes through every name to create link
for (const name in nameList) {
    const elmNewContent = document.createElement('a');
    elmNewContent.href = '#';
    const person = nameList[name];
    // Adds number of posts to name
    const personNum = person.concat(' (', nameCounts[person], ')');
    elmNewContent.data = person;
    elmNewContent.appendChild(document.createTextNode(personNum));
    //elmEnd.parentNode.insertBefore(elmNewContent, elmEnd);

    // Function runs when name clicked
    elmNewContent.addEventListener ("click", nameClick.bind(this, person), false);
    elmContainer.appendChild(elmNewContent);
}

const elmEndBottoms = document.getElementsByClassName(bottomBreadcrumbArea);
const elmEndBottom = elmEndBottoms[0];

const elmContainerTwo = document.createElement('div');
elmContainerTwo.style.display = 'grid';
elmContainerTwo.style.gridTemplateRows = 'repeat(3, 1fr)';
elmContainerTwo.style.gridTemplateColumns = 'repeat(6, 1fr)';
elmContainerTwo.style.gridAutoFlow = 'row';
elmEndBottom.parentNode.insertBefore(elmContainerTwo, elmEndBottom);

// Goes through every name to create link
for (const name in nameList) {
    const elmNewContent = document.createElement('a');
    elmNewContent.href = '#';
    const person = nameList[name];
    // Adds number of posts to name
    const personNum = person.concat(' (', nameCounts[person], ')');
    elmNewContent.data = person;
    elmNewContent.appendChild(document.createTextNode(personNum));
    //elmEnd.parentNode.insertBefore(elmNewContent, elmEnd);

    // Function runs when name clicked
    elmNewContent.addEventListener ("click", nameAdd.bind(this, person), false);
    elmContainerTwo.appendChild(elmNewContent);
}

// Default link resets posts to normal
const defaultButton = () => {
    const elmNewContent = document.createElement('a');
    elmNewContent.href = '#';
    const text = "Reset ISO";
    //elmNewContent.data = text;
    elmNewContent.appendChild(document.createTextNode(text));
    elmEnd.parentNode.insertBefore(elmNewContent, elmEnd);
    // Function runs when name clicked
    elmNewContent.addEventListener ("click", defaultClick.bind(this), false);
}

defaultButton();

// Function that deletes other posts
function nameClick(person) {
    for (let element in elmContainerTwo.children) {
        if (elmContainerTwo.children[element].tagName === 'A' && elmContainerTwo.children[element].innerText !== event.target.innerText) {
            elmContainerTwo.children[element].style.color = '';
        } else if (elmContainerTwo.children[element].innerText === event.target.innerText) {
            elmContainerTwo.children[element].style.color = 'red';
        }
    }
    let index = 0;
    while (index < elmPosts.length) {
        const test = elmPosts[index].getAttribute("data-author");
        if (test !== person) {
            elmPosts[index].style.display = 'none';
        } else {
            elmPosts[index].style.display = '';
        }
        index++;
    }
    event.preventDefault();
}

function nameAdd(person) {
    let index = 0;
    event.target.style.color = 'red';
    while (index < elmPosts.length) {
        const test = elmPosts[index].getAttribute("data-author");
        if (test === person) {
            elmPosts[index].style.display = '';
        }
        index++;
    }
    event.preventDefault();
}

function defaultClick() {
    for (let element in elmContainerTwo.children) {
        if (elmContainerTwo.children[element].tagName === 'A') {
            elmContainerTwo.children[element].style.color = '';
        }
    }
    let index = 0;
    while (index < elmPosts.length) {
        elmPosts[index].style.display = '';
        index++;
    }
}