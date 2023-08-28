// ==UserScript==
// @name        ISOing user's posts Resetera
// @description Adds list of names to ISO at the bottom of the page
// @version 2
// @downloadURL https://raw.githubusercontent.com/Ty4on/ReseteraISO/main/main.js
// @updateURL   https://raw.githubusercontent.com/Ty4on/ReseteraISO/main/main.js
// @match       http*://www.resetera.com/threads/*
// @match       http*://www.resetera.com/threads/*/*
// ==/UserScript==

/*--- Create a named link for every poster.
      Clicking this link will hide every post
      not made by that poster - ISOing poster.
*/

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
const elmEnds = document.getElementsByClassName("breadcrumb"); //breadcrumb p-breadcrumb--bottom
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

const elmEndBottoms = document.getElementsByClassName("breadcrumb p-breadcrumb--bottom"); //breadcrumb p-breadcrumb--bottom
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

// Function that deconstes other posts
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
    // console.log(getUrlNumber());
    const number = parseInt(getUrlNumber()) + 1;
    let url = putUrlNumber(number);
    if (url) {
        // reFetch(url);
    }
    event.preventDefault();
}

const urlIncludesPage = (url) => {
    let end = url.length;
    let string = "page";
    let index = url.indexOf(string);
    // console.log(index)
    if (index === -1 || index + 8 < end) {
        return false;
    }
    return true;
}

const getUrlNumber = () => {
    let url = window.location.href;
    if (!urlIncludesPage(url)) {
        return false;
    }
    let end = url.length;
    let lastDigit;
    while (end > 0) {
        if (!isNaN(parseInt(url[end]))) {
            lastDigit = url[end];
            break;
        } else {
            end--;
        }
    }
    let firstDigit;
    end--;
    while (!isNaN(parseInt(url[end]))) {
        firstDigit = url[end];
        lastDigit = firstDigit + lastDigit;
        end--;
    }
    return lastDigit;
}

const putUrlNumber = (number) => {
    let url = window.location.href;
    if (!url) {
        return false;
    }
    if (!number) {
        let newUrl = url + "page-2";
        return newUrl;
    }
    let end = url.length;
    while (isNaN(parseInt(url[end]))) {
        end--;
    }
    while (!isNaN(parseInt(url[end]))) {
        end--;
    }
    let newUrl = url.slice(0, end + 1);
    return newUrl.concat(number);
}

function reFetch(url) {
    fetch(url)
    .then((response) => response.text())
    .then((result) => console.log(result))
}