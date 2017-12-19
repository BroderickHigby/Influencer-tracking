var maxInfluencerLevel = 2;
var influencerLists = []; // One list for each level obtained

function resetMainContent() {
	$('#influencers-main-content').empty();
}

function resetInfluencersList() {
	$('#influencers-list').empty();
}

function drawInitialInfluencerSummaryBox(level) {
	var summaryContainer = $('<div class="influencer-summary-container"><div id="influencer-summary-box-'+level+'" class="influencer-summary-box"><h2>Level</h2><img style="margin: 20px auto;" src="/images/loading.gif"><div class="influencer-summary-level">'+level+'</div></div></div>');

	summaryContainer.hide().appendTo($('#influencer-summaries')).fadeIn('slow');

	//TODO: (Last) reset scroll bar
}

function drawFinalInfluencerSummaryBox(level) {
	var summaryBox = $('#influencer-summary-box-'+level);
	summaryBox.find('img').remove(); // get rid of loading gif

	var influencers = influencerLists[level-1];
	var idx;

	for (var idx = 0; idx < influencers.length && idx < 5; idx++) {
		var influencer = influencers[idx];

		summaryBox.append('<img src="'+influencer['picture_url']+'" onclick="drawInfluencerDetail(\''+influencer['urlkey']+'\')">');
	}

	if (idx < influencers.length) {
		var more = influencers.length - idx;
		summaryBox.append('<div class="influencer-more-box" onclick="drawInfluencers('+level+')">+'+more+'</div>');
	}

	$('#influencers-list').perfectScrollbar('destroy');
	$('#influencers-list').perfectScrollbar(perfectScrollbarOptions);
}

function drawInfluencers(level) {
	resetMainContent();

	var mainContent = $('#influencers-main-content');
	var influencersContainer = $('<div style="text-align: center;"></div>');
	mainContent.append('<h1>Level '+level+' Influencers</h1>');
	mainContent.append(influencersContainer);

	for (var i=0; i < influencerLists[level-1].length; i++) {
		var influencer = influencerLists[level-1][i];

		var influencerBox = $('<div class="influencer"><div class="influencer-number">'+(i+1)+'</div><img src="'+influencer['picture_url']+'"></div>');
		var influencerInfo = $('<div class="info"><p class="name"><a onclick="drawInfluencerDetail(\''+influencer['urlkey']+'\')" href="#">'+influencer['name']+'</a></p><p class="twitter"><a href="http://twitter.com/'+influencer['screen_name']+'">@'+influencer['screen_name']+'</a></p><p class="description">'+influencer['description']+'</p></div>');

		influencerBox.append(influencerInfo);
		influencerBox.append('<p class="social-authority">Social Authority: '+influencer['social_authority']+'</p>');

		influencersContainer.append(influencerBox);
	}

	mainContent.perfectScrollbar('destroy');
	mainContent.perfectScrollbar(perfectScrollbarOptions);
}

function getInfluencerLevel(level) {
	level = (typeof level !== 'undefined') ? level : 1;
	var influencerIds = [];

	if (level == 1) {
		resetMainContent();
		resetInfluencersList();
		influencerLists = [];
	} else { // Prepare previous level influencer id list
		for (var i=0; i < influencerLists[level-2].length; i++) {
			influencerIds.push(influencerLists[level-2][i].external_id);
		}
	}

	var search_term = $('#id_search_term').val();
	if (search_term == '') { return; };

	drawInitialInfluencerSummaryBox(level);

	singleAjaxRequest('influencers', {
		type: 'POST',
		url: '/influencers/',
		data: {'search_term': search_term, 'influencer_ids': JSON.stringify(influencerIds), 'level': level},
		dataType: 'json',
		success: function(data) {
			if (!data['success']) {
				//TODO: alert(data['error']);
				return;
			}

			influencerLists.push(data['influencers']);

			drawFinalInfluencerSummaryBox(level);

			if (level == 1) {
				drawInfluencers(1);
			}

			if (level < maxInfluencerLevel) {
				getInfluencerLevel(level+1);
			}
		},
	});
}

function drawInfluencerDetail(urlkey) {
	var content = $('#influencers-main-content');

	content.html('<p style="text-align: center;"><img src="/images/loading.gif"></p>');

	singleAjaxRequest('influencer-detail', {
		type: 'GET',
		url: '/influencer/'+urlkey+'/',
		dataType: 'html',
		success: function(data) {
			content.html(data);
		},
	});
}

$(document).ready(function() {
	getInfluencerLevel();

	$('influencers-list').perfectScrollbar(perfectScrollbarOptions);
	$('influencers-main-content').perfectScrollbar(perfectScrollbarOptions);
});
