import createElement from './createElement';

/**
 * Create a form component from a JSON object
 * 
 * @param {Object} options - The children elements of the form, expressed as JSON
 * @see {@link createElement} for more information on the `options` object format.
 * @returns {HTMLElement}
 */
export default (options) =>
	createElement('form', {
		attrs: options.attrs || {},
		className: options.className || null,
		children: options.children.map((el) =>
			createElement(el.type, {
				attrs: el.attrs || {},
				className: el.className || null,
				children:
					typeof el.children == 'string'
						? el.children
						: el.children?.map((el) =>
								typeof el === 'string'
									? el
									: createElement(el.type, {
										attrs: el.attrs,
										className: el.className,
										children: el.children,
									})
						  ) || [],
			})
		),
	});
