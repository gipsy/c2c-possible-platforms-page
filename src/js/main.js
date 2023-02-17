// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Dropdown, Offcanvas, Popover } from 'bootstrap';

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
