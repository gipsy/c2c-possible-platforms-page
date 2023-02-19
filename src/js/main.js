// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Dropdown, Offcanvas, Popover } from 'bootstrap';

// Customized Bootstrap dropdown behaviour to show on hover.
const dropdownEls = document.querySelectorAll('.navbarJS__item')
const dropdownNestedEls = document.querySelectorAll('.navbarJS__item--nested')

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

    const data = await getPlatforms();
    const renderColumn = (platforms, colIdx, colAmount, input = '') => {
        const perColumn = Math.ceil(platforms.length / colAmount);
        const results = platforms.slice(colIdx * perColumn, (colIdx + 1) * perColumn);

        const highLight = (str, input) => str.replace(input, `<span class="highlight">${input}</span>`)
        return results.map(item => `<a class="platformSearchFilter__item" href="#">${highLight(item, input)}</a>`).join("\n")
    }

    let filteredPlatforms = [];
    let resultHtml = document.createElement('div');
    resultHtml.className = 'platformSearchFilter__results';
    oninput = (event) => {
        const input = event.target.value;
        if (typeof input === 'string' && input.length === 0) {
            target.classList.remove('show')
        } else {
            target.classList.add('show');
        }

        filteredPlatforms = data.platforms.filter(platform => platform.toLowerCase().includes(input.toLowerCase()))
        resultHtml.innerHTML = filteredPlatforms.length === 0 ? 'No results' : `
        <div class="row">
            <div class="col col-3">${renderColumn(filteredPlatforms, 0, 4, input)}</div>
            <div class="col col-3">${renderColumn(filteredPlatforms, 1, 4, input)}</div>
            <div class="col col-3">${renderColumn(filteredPlatforms, 2, 4, input)}</div>
            <div class="col col-3">${renderColumn(filteredPlatforms, 3, 4, input)}</div>
        </div>
        <p class="platformSearchFilter__note">Haven’t found your cart in the list? <a href="#">Go here for more info.</a></p>`;
        target.getElementsByTagName('label')[0].after(resultHtml)
    };
}


// init
renderPlatformSearchResults(document.querySelector('.platformSearchFilterJS'));

