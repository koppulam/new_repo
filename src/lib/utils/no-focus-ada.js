(() => {
    const selectors = {
        container: '.general-aem > *',
        btn: 'button'
    };
    const classes = {
        containerHasFocus: 'keyboard--focussed'
    };

    // Add the focus class to the container if the keyboard
    // event is an element within the container
    document.addEventListener('keyup', (e) => {
        const allContainers = Array.prototype.slice.call(document.querySelectorAll(selectors.container));

        allContainers.forEach(container => {
            if (container.contains(e.target)) {
                container.classList.add(classes.containerHasFocus);
            } else {
                container.classList.remove(classes.containerHasFocus);
            }
        });
    });

    // Remove the focus class on mouse click
    document.addEventListener('mousedown', (e) => {
        const allContainers = Array.prototype.slice.call(document.querySelectorAll(selectors.container));

        allContainers.forEach(container => {
            if (container.contains(e.target)) {
                container.classList.remove(classes.containerHasFocus);
            }
        });
    });
})();
