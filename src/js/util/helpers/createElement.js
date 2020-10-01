export default (el = 'div', {
    className = '',
    attrs = {},
    children = '',
} = {}) => {
    const element = document.createElement(el);
    element.className = className;

    if (
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
                element.innerHTML += children;
            }
        });
    } else {
        element.innerHTML = children;
    }

    return element;
};
