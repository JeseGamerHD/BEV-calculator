

function toggleDropdown(dropdownID) {
    let dropdown = document.getElementById(dropdownID);
    dropdown.style.display = dropdown.style.display != "none" ? "none" : "flex";
}

function setDropdownValue(dropdownID, dropdownFieldID, newValue) {

    let dropdownField = document.getElementById(dropdownFieldID);
    dropdownField.value = newValue;
    toggleDropdown(dropdownID);
}