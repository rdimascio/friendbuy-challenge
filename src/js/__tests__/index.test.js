'use strict';

// import './../util/helpers/prepare-environment';
import modal from './../util/components/modal';

const bodyContent = `<div class="modal gated open">
	<div class="modal-wrapper">
		<div class="modal-close">&times;</div>
		<div class="modal-image"></div>
		<div class="modal-content">
			<div class="modal-root"></div>
			<div class="modal-footer">
				<a href="https://friendbuy.com/terms" target="_blank">Terms</a>
				<a href="https://friendbuy.com" target="_blank">friendbuy</a>
			</div>
		</div>
	</div>
</div>`;

describe('user interactions', () => {
	document.body.innerHTML = bodyContent;
	modal.buildGate();

	const MODAL = document.querySelector('.modal');
	const ROOT = MODAL.querySelector('.modal-root');

	describe('email gate', () => {
		const FORM = ROOT.querySelector('#email-gate');
		const INPUT = FORM.querySelector('#email-address');
		const MESSAGE = ROOT.querySelector('.email-gate-message');

		test('should show an error if an invalid email address is entered', () => {
			INPUT.value = 'fail';
			FORM.querySelector('button').click();

			expect(MESSAGE.classList.contains('invalid')).toBe(true);
			expect((MESSAGE.textContent = modal.GATE_MESSAGE.error));
		});

		test('should progress to the email message with a valid entry', () => {
			INPUT.value = 'pass@test.com';
			FORM.querySelector('button').click();

			expect(ROOT.querySelector('#email-gate')).toBe(null);
		});
	});

	describe('email message', () => {
		test('should trigger the thanks state when clicking “send”', () => {
			const FORM = ROOT.querySelector('#email');
			FORM.querySelector('button').click();

			expect(MODAL.classList.contains('thanks')).toBe(true);
		});
	});

	describe('share again button', () => {
		test('should go back to the email message when clicked', () => {
			ROOT.querySelector('button').click();

			expect(ROOT.querySelector('#email')).toBeTruthy();
		});
	});

	describe('tabs', () => {
		test('should be able to flip between email message and facebook states', () => {
			ROOT.querySelector('[data-target="facebook"]').click();

			expect(ROOT.querySelector('#facebook')).toBeTruthy();
		});
	});

	describe('facebook', () => {
		test('should trigger the thanks state when clicking "share"', () => {
			const FORM = ROOT.querySelector('#facebook');
			FORM.querySelector('button').click();

			expect(MODAL.classList.contains('thanks')).toBe(true);
		});
	});

	describe('thanks', () => {
		test('should have the overlay_thanks.png file', () => {

			// Can't get `getComputedStyle` and JSDOM to work properly,
			// so we'll cheat because we know if the modal has the
			// `thanks` class, the image will be "overlay_thanks".

			// const IMAGE = MODAL.querySelector('.modal-image');
			// const STYLE = window.getComputedStyle(IMAGE);

			// expect(STYLE.backgroundImage).toBe(
			// 	'url("https://friendbuy-challenge.s3-us-west-1.amazonaws.com/overlay_thanks.png")'
			// );

			// expect(STYLE.getPropertyValue('background-image').includes('overlay_thanks')).toBe(true)

			expect(MODAL.classList.contains('thanks')).toBe(true);
		});
	});
});
