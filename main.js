// ==UserScript==
// @name         INE Better Time Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Provides a more accurate calculation of the progress made in INE learning paths.
// @author       Pavel Sushko
// @license      MIT
// @match        https://my.ine.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ine.com
// @grant        none
// ==/UserScript==

(function () {
	let checkExist = setInterval(function () {
		if (document.querySelector('.lphero__name')) {
			console.log('.lphero__name element is loaded!');

			const parseTime = (time) => {
				let parts = time.split(' ');
				let hours = parseInt(parts[0].replace('h', ''));
				let minutes = parseInt(parts[1].replace('m', ''));

				return hours * 60 + minutes;
			};

			let currentTitle = document.querySelector('.lphero__name').innerText; // Gets the title of the current section
			let currentId = currentTitle.toLowerCase().replace(/[:\s]+/g, '-'); // Converts the title to a valid id
			let currentElement = document.getElementById(currentId).parentNode.parentNode; // Gets the current section element
			let currentIndex = Array.prototype.indexOf.call(currentElement.parentNode.children, currentElement); // Gets the index of the current section
			let currentPercentageString = document.querySelector('.lphero__progress-copy--percentage').innerText; // Gets the percentage string of the current section
			let currentPercentage = Number(currentPercentageString.split('%')[0]) / 100; // Converts the percentage to a decimal
			let progressMessage = document.querySelector('.lpsection__group-progress');
			let progressMessageClone = progressMessage.cloneNode(true);

			let times = []; // Array to store the times of each section
			let sections = document.querySelectorAll('.subscriber__header .tile__item-length'); // Gets all the sections

			// Loops through each section and adds the time to the times array
			sections.forEach((section) => {
				times.push(section.innerText);
			});

			// Calculates the total time of all the sections
			let totalMinutesAll = times.reduce((acc, time) => acc + parseTime(time), 0);

			// Calculates the total time of all the sections before the current section
			let totalTimeCompleted = times.slice(0, currentIndex).reduce((acc, time) => acc + parseTime(time), 0);

			// Calculates the total time of the current section
			let partialMinutesCurrent = parseTime(times[currentIndex]) * currentPercentage;

			// Adds the total time of the current section to the total time completed
			totalTimeCompleted += partialMinutesCurrent;

			// Calculates the estimated time left
			let estimatedTimeLeft = totalMinutesAll - totalTimeCompleted;

			// Calculates the percentage completed
			let percentageCompleted = (totalTimeCompleted / totalMinutesAll) * 100;

			// Calculates the percentage left
			let percentageLeft = 100 - percentageCompleted;

			// Calculates the amount of hours and minutes completed
			let hoursCompleted = Math.floor(totalTimeCompleted / 60);
			let minutesCompleted = Math.floor(totalTimeCompleted % 60);
			let timeCompletedString = `${hoursCompleted}h ${minutesCompleted}m`;

			// Calculates the amount of hours and minutes left
			let hoursLeft = Math.floor(estimatedTimeLeft / 60);
			let minutesLeft = Math.floor(estimatedTimeLeft % 60);
			let timeLeftString = `${hoursLeft}h ${minutesLeft}m`;

			// Updates the progress message
			progressMessage.innerText = `${percentageCompleted.toFixed()}% Complete (${timeCompletedString})`;
			progressMessageClone.innerText = `${percentageLeft.toFixed()}% Left (${timeLeftString})`;
			progressMessage.parentElement.appendChild(progressMessageClone);

			clearInterval(checkExist);
		}
	}, 100); // check every 100ms
})();
