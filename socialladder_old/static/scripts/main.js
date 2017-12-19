/* Single ajax requests:
 * Makes sure only one request identified by a requestId is active at a time.
 * If a previous ajax request with the same id is running, it's canceled
 */
var currentAjaxRequests = {};

function singleAjaxRequest(requestId, ajaxParams) {
	if ( requestId in currentAjaxRequests ) {
		currentAjaxRequests[requestId].abort();
		delete currentAjaxRequests[requestId];
	}

	currentAjaxRequests[requestId] = $.ajax(ajaxParams);
}

perfectScrollbarOptions = {
	suppressScrollX: true,
	useSelectionScroll: true,
	useKeyboard: true,
};

function applyDefaultBarChartOptions(data) {
	data['options'] = {
		'legend': {'display': false},
		'gridlines': {'display': false},
		'scales': {
			'xAxes': [{'gridLines': {'display': false}, 'ticks': {'fontSize': 14}, 'stacked': true}],
			'yAxes': [{'stacked': true}],
		},
		'maintainAspectRatio': false,
	}
}
