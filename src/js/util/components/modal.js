import validateEmail from '../helpers/validateEmail';
import createElement from '../helpers/createElement';
import createForm from '../helpers/createForm';
import ClipboardJS from 'clipboard';
import feather from 'feather-icons';

export default (function () {
	const STATE = {
		email: null,
		error: false,
	};
	const TABS = ['email', 'messenger', 'facebook'];
	const GATE_ERROR_MESSAGE = 'Please enter a valid email address';

	/**
	 * Modal accessor.
	 * 
	 * @returns {HTMLElement}
	 */
	const MODAL = () => document.querySelector('.modal');

	/**
	 * Root accessor.
	 * 
	 * @returns {HTMLElement}
	 */
	const ROOT = () => MODAL().querySelector('.modal-root');

	/**
	 * Clear the modal view.
	 *
	 * @returns {void}
	 */
	const destroy = () => {
		ROOT().innerHTML = '';
	};

	/**
	 * Reset the modal view.
	 *
	 * Returns a new Document Fragment for the new view to append elements to.
	 *
	 * @returns {HTMLElement}
	 */
	const setup = () => {
		destroy();
		return document.createDocumentFragment();
	};

	/**
	 * Build the title for a view.
	 *
	 * @param {string} title - Heading element content.
	 * @param {string} subTitle Paragraph element content.
	 * @returns {HTMLElement}
	 */
	const buildTitle = (
		title = 'Get $X for every</br>friend you refer',
		subTitle = 'Your friends get $X and you get</br>$X after their first purchase of $X+'
	) => {
		const titleEl = createElement('h2', {
			children: title,
		});
		const subTitleEl = subTitle
			? createElement('p', {
					children: subTitle,
			  })
			: null;

		return createElement('div', {
			className: 'modal-content__content-wrapper',
			children: [titleEl, subTitleEl].filter(Boolean),
		});
	};

	/**
	 * Build the tabs for the modal.
	 *
	 * @returns {HTMLElement}
	 */
	const buildTabs = (activeTab) => {
		return createElement('ul', {
			className:
				'modal-content__tab-wrapper flex justify-center full-width',
			children: TABS.map((tab) =>
				createElement('li', {
					className: `modal-content__tab${
						tab === activeTab ? ' active' : ''
					}`,
					children: [
						createElement('a', {
							attrs: {
								'data-target': tab,
								href: '#',
							},
							children: tab,
						}),
					],
				})
			),
		});
	};

	/**
	 * Build the share component.
	 * 
	 * @returns {HTMLElement}
	 */
	const buildShare = () => {
		const SHARE = createElement('button', {
			className: 'flex align-center justify-between',
			attrs: {
				'data-clipboard-text': 'http://fbuy.me/abc123',
			},
			children: [
				'http://fbuy.me/abc123',
				feather.icons.copy.toSvg({
					height: '14',
					width: '14',
				}),
			],
		});

		SHARE.addEventListener('click', (event) => {
			const text = event.target.innerHTML;
			event.target.textContent = 'Copied!';
			event.target.classList.remove('justify-between');
			event.target.classList.add('justify-center');

			setTimeout(() => {
				event.target.innerHTML = text;
				event.target.classList.remove('justify-center');
				event.target.classList.add('justify-between');
			}, 1000);
		});

		new ClipboardJS(SHARE);

		return createElement('div', {
			className: 'modal-share flex text-left',
			children: ['And share your link wherever:', SHARE],
		});
	};

	/**
	 * Click event handler for tabs.
	 * 
	 * @param {Object} event
	 * @returns {void}
	 */
	const handleTabClick = (event) => {
		event.preventDefault();
		const target = event.target.getAttribute('data-target');

		if (event.target.parentNode.classList.contains('active')) {
			return;
		}

		switch (target) {
			case 'email':
				MODAL().classList.remove('thanks');
				buildEmail();
				break;
			case 'facebook':
				MODAL().classList.remove('thanks');
				buildFacebook();
				break;
			default:
				return;
		}
	};

	/**
	 * Adds click event listeners to the modal tabs.
	 *
	 * @returns {void}
	 */
	const addTabEventListeners = () => {
		ROOT().querySelectorAll('.modal-content__tab a').forEach((tab) => {
			tab.addEventListener('click', handleTabClick);
		});
	};

	/**
	 * Update the Email Gate status.
	 *
	 * @param {boolean} error - The form state. True is error.
	 * @param {HTMLElement} el - The input element to invalidate.
	 * @returns {void}
	 */
	const updateEmailGateErrorMessage = (error, el) => {
		const action = error ? 'add' : 'remove';
		const messageEl = ROOT().querySelector('.modal-error');

		el.classList[action]('invalid');
		messageEl.textContent = error
			? GATE_ERROR_MESSAGE
			: null;
	};

	/**
	 * Event handler for the Email Gate form submit.
	 *
	 * If the email is valid, we'll save it to `STATE.email` so that
	 * we can prepopulate the form in the Email modal view.
	 *
	 * @param {Object} event
	 */
	const handleEmailGateSubmit = (event) => {
		event.preventDefault();
		const input = event.target.elements.emailAddress;
		const isValidEmail = validateEmail(input.value);

		switch (Boolean(isValidEmail)) {
			case true:
				STATE.email = input.value;
				STATE.error = false;
				MODAL().classList.remove('gated');
				buildEmail();
				break;
			case false:
				STATE.error = true;
				updateEmailGateErrorMessage(STATE.error, input);
				break;
			default:
				return;
		}
	};

	/**
	 * Event handler for the Email Gate form submit.
	 *
	 * If the email is valid, we'll save it to `STATE.email` so that
	 * we can prepopulate the form in the Email modal view.
	 *
	 * @param {Object} event
	 */
	const handleEmailGateChange = (event) => {
		const {value} = event.target;
		const isValidEmail = validateEmail(value);

		if (STATE.error)
			updateEmailGateErrorMessage(!Boolean(isValidEmail), event.target);
	};

	/**
	 * Build the Email Gate modal view.
	 *
	 * @returns {void}
	 */
	const buildGate = () => {
		const WRAPPER = setup();
		const INPUT = createElement('input', {
			attrs: {
				id: 'emailAddress',
				type: 'text',
				name: 'emailAddress',
				placeholder: 'Email address...',
			},
		});
		const FORM = createElement('form', {
			className: 'flex column full-width',
			attrs: {
				id: 'email-gate',
			},
			children: [
				INPUT,
				createElement('div', {
					className: 'modal-error',
					attrs: {
						role: 'alert',
						style: 'color: red'
					},
					children: '',
				}),
				createElement('button', {
					children: 'Start Sharing',
					attrs: {
						type: 'submit',
					},
				}),
			],
		});

		INPUT.addEventListener('input', handleEmailGateChange);
		FORM.addEventListener('submit', handleEmailGateSubmit);
		WRAPPER.append(buildTitle());
		WRAPPER.append(
			createElement('p', {
				className: 'email-gate-message',
				children: 'Enter your email to start sharing with friends:',
			})
		);
		WRAPPER.append(FORM);
		ROOT().append(WRAPPER);
	};

	/**
	 * Build the Email modal view.
	 *
	 * @returns {void}
	 */
	const buildEmail = () => {
		const WRAPPER = setup();
		const FORM = createForm({
			className: 'flex column full-width',
			attrs: {
				id: 'email',
			},
			children: [
				{
					type: 'div',
					className: 'input-icon',
					children: [
						{
							type: 'input',
							className: 'full-width',
							attrs: {
								type: 'email',
								name: 'to',
								placeholder: 'To',
							},
						},
						feather.icons.book.toSvg({
							height: 12,
							width: 12,
						}),
					],
				},
				{
					type: 'input',
					attrs: {
						type: 'email',
						name: 'email',
						value: STATE.email,
					},
				},
				{
					type: 'textarea',
					attrs: {
						name: 'text',
						rows: 5,
					},
					children:
						"Hey, check out [COMPANY NAME]! I love their products and I think you will too. I'm giving you $X to spend. You can thank me later :)",
				},
				{
					type: 'div',
					className: 'flex align-center',
					children: [
						{
							type: 'input',
							attrs: {
								type: 'checkbox',
								checked: 'true',
								name: 'reminder',
							},
						},
						{
							type: 'label',
							className: 'text-left',
							attrs: {
								for: 'reminder',
								style: 'font-size: 12px',
							},
							children: 'Send my friend a reminder in 3 days',
						},
					],
				},
				{
					type: 'div',
					className: 'flex align-center',
					children: [
						{
							type: 'input',
							attrs: {
								type: 'checkbox',
								checked: 'true',
								name: 'emails',
							},
						},
						{
							type: 'label',
							className: 'text-left',
							attrs: {
								for: 'emails',
								style: 'font-size: 12px',
							},
							children: 'Sign up for our emails',
						},
					],
				},
				{
					type: 'button',
					attrs: {
						type: 'submit',
					},
					children: 'Send',
				},
			],
		});

		FORM.addEventListener('submit', (event) => {
			event.preventDefault();
			buildThanks();
		});
		WRAPPER.append(buildTitle());
		WRAPPER.append(buildTabs('email'));
		WRAPPER.append(FORM);
		WRAPPER.append(buildShare());
		ROOT().append(WRAPPER);
		addTabEventListeners();
	};

	/**
	 * Build the Facebook modal view.
	 *
	 * @returns {void}
	 */
	const buildFacebook = () => {
		const WRAPPER = setup();
		const FORM = createForm({
			className: 'flex column full-width',
			attrs: {
				id: 'facebook',
			},
			children: [
				{
					type: 'textarea',
					attrs: {
						name: 'text',
						rows: 5,
						placeholder: 'Add a personal message...',
					},
				},
				{
					type: 'div',
					className: 'share-preview flex align-center',
					children: [
						{
							type: 'div',
							className: 'featured-image',
							attrs: {
								style:
									"background-image: url('https://friendbuy-challenge.s3-us-west-1.amazonaws.com/facebook.jpg')",
							},
						},
						{
							type: 'p',
							className: 'caption',
							attrs: {
								style: 'margin-bottom: 0',
							},
							children:
								"Here's $X to spend at [COMPANY NAME]! <span>Hey, check out [COMPANY NAME]! I love their products and I think you will too. I'm giving you $X to spend. You can thank me later :)</span>",
						},
					],
				},
				{
					type: 'button',
					className: 'flex align-center justify-center',
					children: [
						feather.icons.facebook.toSvg({
							height: 12,
							width: 12,
						}),
						'Share',
					],
				},
			],
		});

		FORM.addEventListener('submit', (event) => {
			event.preventDefault();
			buildThanks();
		});
		WRAPPER.append(buildTitle());
		WRAPPER.append(buildTabs('facebook'));
		WRAPPER.append(FORM);
		WRAPPER.append(buildShare());
		ROOT().append(WRAPPER);
		addTabEventListeners();
	};

	/**
	 * Build the Thanks modal view.
	 *
	 * @returns {void}
	 */
	const buildThanks = () => {
		MODAL().classList.add('thanks');
		const WRAPPER = setup();
		const BUTTON = createElement('button', {
			children: 'Share again',
		});

		BUTTON.addEventListener('click', (event) => {
			event.preventDefault();
			MODAL().classList.remove('thanks');
			buildEmail();
		});
		WRAPPER.append(buildTitle('Thanks for sharing</br>Company Name', null));
		WRAPPER.append(buildTabs());
		WRAPPER.append(
			createElement('div', {
				children: [
					createElement('p', {
						children:
							"Once your friend makes their first purchase you'll find your $X reward in your inbox.",
					}),
					createElement('p', {
						children:
							"Don't stop there! The more you share,</br>the more rewards you'll get!",
					}),
				],
			})
		);
		WRAPPER.append(BUTTON);
		WRAPPER.append(buildShare());
		ROOT().append(WRAPPER);
		addTabEventListeners();
	};

	return {
		setup,
		destroy,
		buildGate,
		buildEmail,
		buildFacebook,
		GATE_ERROR_MESSAGE,
	};
})();
