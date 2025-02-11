const toggleSwitches = document.querySelectorAll(".toggleInput-switch");

toggleSwitches.forEach(toggleSwitch => {

    document.getElementById(toggleSwitch.dataset.left).classList.add("active");
    document.getElementById(toggleSwitch.dataset.thumb).style.left = "10px";

    toggleSwitch.addEventListener("click", () => {

        let thumb = document.getElementById(toggleSwitch.dataset.thumb);
        let leftOption = toggleSwitch.dataset.left;
        let rightOption = toggleSwitch.dataset.right;
        
        if(toggleSwitch.dataset.selectedValue == leftOption) {
            toggleSwitch.dataset.selectedValue = rightOption;
            thumb.style.left = "10px";
            document.getElementById(rightOption).classList.toggle("active");
            document.getElementById(leftOption).classList.toggle("active");
            
        } else {
            toggleSwitch.dataset.selectedValue = leftOption;
            thumb.style.left = "calc(100% - 40% - 10px)";
            document.getElementById(leftOption).classList.toggle("active");
            document.getElementById(rightOption).classList.toggle("active");
        }

    });
});

