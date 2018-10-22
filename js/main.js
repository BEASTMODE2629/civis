(function () {
	'use strict';

	$('#home-version').text('v0.6.0');
	$('#home-credits').text('© 2013-2018 Daniele Veneroni');

	// locale

	window.STRINGS = {};
	window._ = function(id, placeholders) {
		var string = window.STRINGS && window.STRINGS[id] ? window.STRINGS[id] : id;
		if (placeholders) {
			string = string.replace(/\{\{[a-zA-Z0-9]+\}\}/g, function (x) {
				var prop = x.replace('{{', '').replace('}}', '');
				return placeholders[prop] || x;
			});
		}
		return string;
	};

	// home

	$('#home').on('click', '[data-page]', function () {
		var page = $(this).data('page');
		$('#home').find('.page').hide();
		$('#' + page).show();
	});

	// home - new

	var options = [
		{ label: 'None', value: 'none' },
		{ label: 'Random', value: 'random' }
	];
	Object.keys(DATABASE.civs).sort().forEach(function (civ) {
		options.push({ label: DATABASE.civs[civ].name.en, value: civ });
	});
	var $selects = $('#home-new select').empty();
	options.forEach(function (item) {
		$selects.append('<option value="' + item.value + '">' + item.label + '</option>');
	});
	$selects.val('random');
	$('#home-new-start').on('click', function () {
		var players = {},
			colors = ['#89D8FF', '#78C5D6', '#459BA8', '#79C267', '#C5D647', '#9CFF86', '#FFFA8B', '#F5D63D', '#FFB481', '#F28C33', '#FF7F7F', '#E868A2', '#BF62A6'];
		[1, 2, 3, 4].forEach(function (i) {
			var civ = $('#home-new-player' + i + '-civ').val();
			if (civ !== 'none') {
				if (civ === 'random') {
					var civs = Object.keys(DATABASE.civs);
					civ = civs[Math.floor(Math.random() * civs.length)];
				}
				var dbciv = DATABASE.civs[civ];
				var player = {
					id: 'player' + i,
					type: i === 1 ? 'human' : 'cpu',
					name: 'Player ' + i,
					civ: civ,
					leader: dbciv.leaders[Math.floor(Math.random() * DATABASE.civs[civ].leaders.length)],
					color: dbciv.color || colors[Math.floor(Math.random() * colors.length)],
					research: 0,
					culture: 0,
					trade: 0
				};
				players[player.id] = player;
			}
		});
		var map = Civis.generateMap({ players: players });
		window.MAP = map;
		Civis.renderMap(map);
		$('#home').hide();
	});

	// home - load

	$('#home-load-load').on('click', function () {
		// TODO
		$('#home').hide();
	});

	// home - settings

	$('#home-settings-save').on('click', function () {
		// TODO
	});

	$('#main-sidebar-next').on('click', function () {
		var phases = ['init', 'upkeep', 'trade', 'production', 'movement', 'research'],
			nextPhase = phases.indexOf(MAP.phase) + 1;
		if (!phases[nextPhase]) {
			nextPhase = 0;
		}
		MAP.phase = phases[nextPhase];
		Civis.executePhase(MAP.phase);
	});

	// main - menu
	$('#main-header-menu').on('click', function () {
		var dialog = document.querySelector('#main-menu');
		dialogPolyfill.registerDialog(dialog);
		dialog.showModal();
	});

	$('#main-menu').on('click', 'button', function () {
		var action = $(this).data('action'),
			dialog = document.querySelector('#main-menu');
		if (action === 'save') {
			// TODO
		} else if (action === 'help') {
			// TODO
		} else if (action === 'exit') {
			var r = confirm('Are you sure to exit? Unsaved progress will be lost.');
			if (r) {
				dialog.close();
				window.MAP = null;
				$('#home').find('.page').hide();
				$('#home-menu').show();
				$('#home').show();
			}
		} else if (action === 'cancel') {
			dialog.close();
		}
	});

})();
