// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Dropdown, Offcanvas, Popover } from 'bootstrap';

// Customized Bootstrap dropdown behaviour to show on hover.
const dropdownEls = document.querySelectorAll('.navbarJS__item')
const dropdownNestedEls = document.querySelectorAll('.navbarJS__item--nested')


let viewportWidth = window.innerWidth;
function dropdownList(els, config = {}) {
    [...els].map(element => {
        const dropdownTrigger = element.children[0]
        const dropdown = Dropdown.getOrCreateInstance(dropdownTrigger, config)
        element.addEventListener('mouseover', () => dropdown.show(), false)
        element.parentNode.addEventListener('mouseout', () => dropdown.hide(), false)

        return dropdown
    })
}
dropdownList(dropdownEls)
dropdownList(dropdownNestedEls)

// Get Platforms JSON
async function getPlatforms() {
    let url = 'https://mocki.io/v1/d08925c8-2864-407d-b63c-34729c81cbee';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Render platform search results
async function renderPlatformSearchResults(target) {
    const inputEl = target.getElementsByTagName('input')[0];
    const inputClearX = target.querySelector('.platformSearchFilter__inputClear');

    inputEl.addEventListener('input', null, false);
    inputClearX.addEventListener('click', () => {
        inputEl.value = '';
        target.classList.remove('show');
    }, false);

    // #TODO in real situation request should be performed on user input, probably by deferred call
    const data = await getPlatforms();
    const renderColumn = (platforms, colIdx, colAmount, input = '') => {
        const perColumn = Math.ceil(platforms.length / colAmount);
        const results = platforms.slice(colIdx * perColumn, (colIdx + 1) * perColumn);

        const highLight = (str, input) => str.replace(input, `<span class="highlight">${input}</span>`)
        return results.map(item => `<a class="platformSearchFilter__item" href="#">${highLight(item, input)}</a>`).join("\n")
    }

    let filteredPlatforms = [];
    const resultHtml = document.createElement('div');
    resultHtml.className = 'platformSearchFilter__results';
    oninput = (event) => {
        const input = event.target.value;
        if (typeof input === 'string' && input.length === 0) {
            target.classList.remove('show')
        } else {
            target.classList.add('show');
        }

        const template = viewportWidth > 575.98 ? `
            <div class="row">
                <div class="col col-3">${renderColumn(filteredPlatforms, 0, 4, input)}</div>
                <div class="col col-3">${renderColumn(filteredPlatforms, 1, 4, input)}</div>
                <div class="col col-3">${renderColumn(filteredPlatforms, 2, 4, input)}</div>
                <div class="col col-3">${renderColumn(filteredPlatforms, 3, 4, input)}</div>
            </div>
            <p class="platformSearchFilter__note">Haven’t found your cart in the list? <a href="#">Go here for more info.</a></p>
        ` : `
            <div class="row">
                <div class="col col-6">${renderColumn(filteredPlatforms, 0, 2, input)}</div>
                <div class="col col-6">${renderColumn(filteredPlatforms, 1, 2, input)}</div>
            </div>
        `;

        filteredPlatforms = data.platforms.filter(platform => platform.toLowerCase().includes(input.toLowerCase()))
        resultHtml.innerHTML = filteredPlatforms.length === 0 ? 'No results' : template
        target.getElementsByTagName('label')[0].after(resultHtml)
    };
}

async function renderPlatformAlphabetResults(target) {
    const data = await getPlatforms();

    const resultHtml = document.createElement('div');
    resultHtml.className = 'platformAlphabetFilter__results';
    let showCompactResults = true;
    function makeChoice(e) {
        const {target} = e;
        const choiceItems = this.getElementsByTagName('li');

        for (let item of choiceItems) {
            item.classList.remove('active')
        }
        if (target.matches('li')) {
            target.className = 'active';
        }

        const choice = target.getElementsByTagName('a')[0].textContent;
        const results = choice.length === 0 || choice === 'All'
            ? data.platforms
            : data.platforms.filter(platform => platform.toUpperCase().startsWith(choice))

        const groupedResults = (results) => results.reduce((store, word) => {
            const letter = word.charAt(0).toUpperCase()
            const keyStore = (
                store[letter] ||     // Does it exist in the object?
                (store[letter] = []) // If not, create it as an empty array
            );
            keyStore.push(word)

            return store
        }, {})

        const renderColumn = (platforms, colIdx, colAmount) => {
            const perColumn = Math.ceil(platforms.length / colAmount);
            const results = platforms.slice(colIdx * perColumn, (colIdx + 1) * perColumn);

            return results.map(item => `<a class="platformAlphabetFilter__item" href="#">${item}</a>`).join("\n")
        }
        const template = (k) => viewportWidth > 575.98 ? `
            <div class="row platformAlphabetFilter__row">
                <div class="col col-3">
                    <div class="platformAlphabetFilter__letter">${k}</div>
                </div>
                <div class="col col-3">
                    ${renderColumn(groupedResults(results)[k], 0, 3)}
                </div>
                <div class="col col-3">
                    ${renderColumn(groupedResults(results)[k], 1, 3)}
                </div>
                <div class="col col-3">
                    ${renderColumn(groupedResults(results)[k], 2, 3)}
                </div>
            </div>
        `: `
            <div class="row platformAlphabetFilter__row">
                <div class="col col-3">
                    <div class="platformAlphabetFilter__letter">${k}</div>
                </div>
                <div class="col col-9">
                    ${renderColumn(groupedResults(results)[k], 0, 1)}
                </div>
            </div>
        `;
        resultHtml.innerHTML = Object.keys(groupedResults(results))
            .map((k, i) => {
                if (showCompactResults) {
                    return i < 3 ? template(k) : null
                }
                return template(k)
            }).sort().join('\n');

        this.parentNode.after(resultHtml)
    }
    target.querySelector('ul').addEventListener('click', makeChoice, false);
    const initChoice = () => target.querySelector('ul')
        .getElementsByTagName('li')[0].click();

    initChoice()
    function toggleShowCompactResults() {
        showCompactResults = !showCompactResults;
        showCompactResults ? this.textContent = 'Load more' : this.textContent = 'Load less';
        initChoice();
    }
    target.querySelector('.buttonJS__showMore')
        .addEventListener('click', toggleShowCompactResults,false);
}


// init
renderPlatformSearchResults(document.querySelector('.platformSearchFilterJS'));
renderPlatformAlphabetResults(document.querySelector('.platformAlphabetFilterJS'));

