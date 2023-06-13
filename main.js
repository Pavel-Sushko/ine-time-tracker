// ==UserScript==
// @name         INE Better Time Calculator
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Provides a more accurate calculation of the progress made in INE learning paths.
// @author       Pavel Sushko
// @license      MIT
// @match        https://my.ine.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ine.com
// @grant        none
// ==/UserScript==

(async function () {
	let heroAnchorSelector = '.lphero__cta-wrapper a';
	let heroAnchor = document.querySelector(heroAnchorSelector);

	while (!heroAnchor) {
		await new Promise((r) => setTimeout(r, 100));

		heroAnchor = document.querySelector(heroAnchorSelector);
	}

	const parseCookie = (str) =>
		str
			.split(';')
			.map((v) => v.split('='))
			.reduce((acc, v) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});

	let regex = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i;
	let match = heroAnchor.href.match(regex);

	let result = await fetch(`https://content-api.rmotr.com/api/v1/learning-paths/${match[0]}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${parseCookie(document.cookie).ine_access_token}`,
		},
	});

	let resultJson = await result.json();

	document.querySelector('.lpsection__group-progress').innerText = ` ${
		resultJson.user_status.progress * 100
	}% Complete`;
})();
