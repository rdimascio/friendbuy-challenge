/**
 * Build an HTML element.
 * 
 * @param {string} el - HTML element type.
 * @param {Object=} object
 * @param {string=} object.className - Class names of the element.
 * @param {?Object=} object.attrs - Attributes of the element.
 * @param {(string|Array)=} object.children - Child elements of `el`.
 */
export default (el = 'div', {
    className = '',
    attrs = {},
    children = '',
} = {}) => {
    const element = document.createElement(el);
    
    if (className) {
        element.className = className;
    }

    if (
        attrs &&
        typeof attrs == 'object' &&
        Object.keys(attrs).length
    ) {
        Object.keys(attrs).forEach(attr => {
            element.setAttribute(attr, attrs[attr]);
        })
    }
    
    if (
        typeof children == 'object' &&
        Array.isArray(children) &&
        children.length
    ) {
        children.forEach(el => {
            if (el instanceof Node) {
                element.append(el);
            } else {
                element.innerHTML += el;
            }
        });
    } else {
        element.innerHTML = children;
    }

    return element;
};
