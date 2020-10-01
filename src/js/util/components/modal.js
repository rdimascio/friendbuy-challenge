import validateEmail from '../helpers/validateEmail';
import createElement from '../helpers/createElement';

export default (function () {
	const MODAL = document.querySelector('.modal-root');

	const destroy = () => {
		MODAL.innerHTML = '';
	};

	const setup = () => {
		destroy();
		return document.createDocumentFragment();
	};

	const buildTitle = (title = '', subTitle = '') => {
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

	const buildGate = () => {
		const GATE_WRAPPER = setup();

		GATE_WRAPPER.append(
			buildTitle(
				'Get $X for every friend you refer',
				'Your friends get $X and you get $X after their first purchase of $X+'
			)
		);
		MODAL.append(GATE_WRAPPER);
	};

	const buildEmail = () => {
		const EMAIL_WRAPPER = setup();
	};

	const buildFacebook = () => {
		const FB_WRAPPER = setup();
	};

	const buildThanks = () => {
		const THANKS_WRAPPER = setup();
	};

	return {
		setup,
		destroy,
		buildGate,
		buildEmail,
		buildFacebook,
	};
})();
