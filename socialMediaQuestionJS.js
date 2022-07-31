//This script goes in the question that acts as your social media feed.

Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function(){
	
	
	//console.log("check");
	//PRE-LOAD LIBRARIES
	
	
	
	var sourceLib = {
		//Put key/values of the names of your sources and a link to the source image here
	};
	
	var keyArray = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T0','E1','E2','E3','E4','E5','E6','E7','E8','E9','F1','F2','F3','F4','F5','F6','F7','F8','F9',	
	'L1','L2','L3','L4','L5','L6','S1','S2','S3','S4','S5','S6','H1','H2','H3','H4','H5','H6'];

	
	
	var postTopicKey = {
		'T':'Topic1',
		'E':'Topic2',
		'F':'Topic3',
		'L':'Topic4',
		'S':'Topic5',
		'H':'Topic6'
	};

	var sourceEmbeds = ['${e://Field/source1}',
		'${e://Field/source2}',
		'${e://Field/source3}',
		'${e://Field/source4}',
		'${e://Field/source5}',
		'${e://Field/source6}',
		'${e://Field/source7}',
		'${e://Field/source8}',
		'${e://Field/source9}',
		'${e://Field/source10}',
		'${e://Field/source11}',
		'${e://Field/source12}',
		'${e://Field/source13}',
		'${e://Field/source14}',
		'${e://Field/source15}',
		'${e://Field/source16}',
		'${e://Field/source17}',
		'${e://Field/source18}',
		'${e://Field/source19}',
		'${e://Field/source20}',
		'${e://Field/source21}',
		'${e://Field/source22}',
		'${e://Field/source23}',
		'${e://Field/source24}',
		'${e://Field/source25}',
		'${e://Field/source26}',
		'${e://Field/source27}',
		'${e://Field/source28}',
		'${e://Field/source29}',
		'${e://Field/source30}',
		'${e://Field/source31}',
		'${e://Field/source32}',
		'${e://Field/source33}',
		'${e://Field/source34}',
		'${e://Field/source35}',
		'${e://Field/source36}'];
	
	var postEmbeds = ['${e://Field/postKey1}',
		'${e://Field/postKey2}',
		'${e://Field/postKey3}',
		'${e://Field/postKey4}',
		'${e://Field/postKey5}',
		'${e://Field/postKey6}',
		'${e://Field/postKey7}',
		'${e://Field/postKey8}',
		'${e://Field/postKey9}',
		'${e://Field/postKey10}',
		'${e://Field/postKey11}',
		'${e://Field/postKey12}',
		'${e://Field/postKey13}',
		'${e://Field/postKey14}',
		'${e://Field/postKey15}',
		'${e://Field/postKey16}',
		'${e://Field/postKey17}',
		'${e://Field/postKey18}',
		'${e://Field/postKey19}',
		'${e://Field/postKey20}',
		'${e://Field/postKey21}',
		'${e://Field/postKey22}',
		'${e://Field/postKey23}',
		'${e://Field/postKey24}',
		'${e://Field/postKey25}',
		'${e://Field/postKey26}',
		'${e://Field/postKey27}',
		'${e://Field/postKey28}',
		'${e://Field/postKey29}',
		'${e://Field/postKey30}',
		'${e://Field/postKey31}',
		'${e://Field/postKey32}',
		'${e://Field/postKey33}',
		'${e://Field/postKey34}',
		'${e://Field/postKey35}',
		'${e://Field/postKey36}'];



	

	//console.log("check");
	var oldTimeCheck = '${e://Field/T1}';
	//console.log("oldTime: "+oldTimeCheck);
	
	
	//BASE VARS

	var presentSlide = 1;
	var numSlides;
	var hiddenQuestionID = "QID82"; //replace with whatever the question ID is for the dropdown menu
	var nextTriggerShow = "QID41"; //replace with whatever question ID triggers the showing of the next button
	var timeSequence = [];
	var postViewOrder = [];
	var sourceViewOrder = [];
	var slidesViewed = [1]; //used internally to track if it's time to show the next page button
	var timePerPost = {};
	var reactStatuses = {};
	var reactCSS = [['likeNotClicked','followNotClicked'],['likeClicked','followClicked']];
	
	//HTML ELEMENTS
	
	var container = jQuery('.question-wrapper');
	var sourceLogo = jQuery('.sourceLogo');
	var sourceName = jQuery('.sourceName');
	var topicLabel = jQuery('.topicLabel');
	var slideCounter = jQuery('.slideCounter');
	var topicCSS = jQuery('.topicLabel');
	var likeButton = jQuery('#likeButton');
	var followButton = jQuery('#followButton');
	var likeFollowToShow = jQuery( "select[name='QR\~"+hiddenQuestionID+"']" );
	var qobj = this;
	
	//JQUERY CAROUSEL SETTINGS
	
	var $carousel = jQuery('.carousel');

	$carousel.on('beforeChange', function(event, slick, currentSlide, newSlide) {
		if (newSlide !== currentSlide) {
			$('.item-content').animate({ opacity: 0}, 150);
		}
	}).on('afterChange', function(event, slick, currentSlide) {
		$('.item-content').animate({ opacity: 1}, 150);
	}).on('init', function(event, slick) {
		numSlides = slick.slideCount;
	});

	$carousel.slick({
		infinite: true,
		vertical: true,
		verticalSwiping: false,
		centerPadding: '40px',
		speed: 200,
		focusOnSelect: true,
		arrows: false
	});
	
	//DISABLE PAGE SCROLLING
	var keys = {};
	window.addEventListener("keydown",
		function(e){
			keys[e.keyCode] = true;
			switch(e.keyCode){
				case 37: case 39: case 38:  case 40: // Arrow keys
				case 32: e.preventDefault(); break; // Space
				default: break; // do not block other keys
			}
		},
	false);
	window.addEventListener('keyup',
		function(e){
			keys[e.keyCode] = false;
		},
	false);
	
	//FUNCTIONS 
	
	//Function to change shown number, questions and sources
	
	function editReacts(postNum,react)  { //change the reacts to match what is in the DB
		//console.log("Editing react statuses for post number "+postNum+" for the '"+react+"' reaction");
		//console.log("Current status: "+reactStatuses[postNum]);
		if (react === 'like') {
			cssToChange = likeButton;
			refNum = 0;
		}
		else if (react === 'follow') {
			cssToChange = followButton;
			refNum = 1;
		}
		if (reactStatuses[postNum][refNum] === 0) { //If currently 0 want to change from the first listed CSS (0) to second (1). Otherwise, the reverse.
			changeFromTo = [1,0];
		} else {
			changeFromTo = [0,1];
		}
		//console.log("From: "+reactCSS[changeFromTo[0]][refNum]+" - to: "+reactCSS[changeFromTo[1]][refNum]); //Now we can do the changing
		cssToChange.removeClass(reactCSS[changeFromTo[0]][refNum]);
		cssToChange.addClass(reactCSS[changeFromTo[1]][refNum]);
	}
	
	function slideChange(change) { //change should be a +1 or -1
		//console.log("Slide change function with value "+change);
		oldSlide = presentSlide; //Set the value of the old slide
		//Set new slide amount based on current values (have to cope with looping)
		if (presentSlide === 36 && change > 0) {
			presentSlide = 1;
		} else if (presentSlide === 1 && change < 0) {
			presentSlide = 36;
		} else {
			presentSlide += change;
		}
		
		//Alter text
		//console.log("Present slide: "+presentSlide);
		//console.log("Present slide key: "+posts[presentSlide]);
		jQuery( "select[name='"+hiddenQuestionID+"']" ).val(presentSlide); //Set the value of the hidden question
		slideCounter.text(presentSlide+"/36"); //Set the counter to new value
		sourceLogo.html("<img src ='"+sources[presentSlide-1][1]+"' /img>"); //Set the source logo
		sourceName.text(sources[presentSlide-1][0]);	 //Set the source Name
		topicLabel.text(postTopicKey[posts[presentSlide-1].charAt(0)]); //Set the topic label
		topicCSS.removeClass(postTopicKey[posts[oldSlide-1].charAt(0)]); //remove the old class for the topic 
		topicCSS.addClass(postTopicKey[posts[presentSlide-1].charAt(0)]); //add the new class for the topic
		
		//Check and set the reacts
		//console.log("Present slide status: "+reactStatuses[presentSlide]+" - Old slide status: "+reactStatuses[oldSlide]);
		if (reactStatuses[presentSlide][0] != reactStatuses[oldSlide][0]) {
			editReacts(presentSlide,'like');
		}
		if (reactStatuses[presentSlide][1] != reactStatuses[oldSlide][1]) {
			editReacts(presentSlide,'follow');
		}
		
		//Set question response value
		//likeFollowToShow.val(presentSlide);
		
		//Record time
		timeChange = Date.now() - timeRef;
		timeRef = Date.now();
		//console.log("Time change: "+(timeChange/1000));
		timePerPost[posts[oldSlide-1]] += timeChange;
		timeSequence.push(timeChange);

		//Record the posts and sources viewed
		postViewOrder.push(posts[oldSlide-1]);
		sourceViewOrder.push(sources[oldSlide-1][0]);
		
		//if not already present, add new slide number to button
		if (slidesViewed.indexOf(presentSlide) < 0) {
			slidesViewed.push(presentSlide);
		} 
		//console.log("Currently viewed "+slidesViewed.length+" slides. Slides viewed are: "+slidesViewed);
		//If all slides have been viewed, show next page button
		if (slidesViewed.length > 35) {
			//console.log("Hit length of 36, showing next page button.");
			jQuery( "select[name='QR\~"+nextTriggerShow+"']").val(2);
		}
	
		
	}
		
	console.log("check");
	//ALWAYS DO ACTIONS
	
	console.log("Starting post load actions");
	//Grab embedded data
	
	var sources = [];
	var posts = [];
	
	for (var i = 0; i < 36; i++) {
		//Grab the pre-set sources and posts
		embeddedSource = sourceEmbeds[i];
		//console.log(embeddedSource);
		sources.push([embeddedSource,sourceLib[embeddedSource]]);
		embeddedPost = postEmbeds[i];
		//console.log(embeddedPost);
		posts.push(embeddedPost);
		
		//Set the react statuses
		reactStatuses[i+1] = [0,0];
	}
	
	//console.log("Have "+posts.length+" posts recorded");
	
	//Fill items with initial values
	sourceName.text(sources[0][0]);	 //Set the source Name
	sourceLogo.html("<img src ='"+sources[0][1]+"' /img>"); //Set the source logo
	topicLabel.text(postTopicKey[posts[0].charAt(0)]); //Set the topic label
	topicCSS.addClass(postTopicKey[posts[0].charAt(0)]);
	likeFollowToShow.val(1);
	
	var timeRef = Date.now(); //Set initial time value
	jQuery('NextButton').hide(); //hide next and previous buttons
	
	//Loop through keys and set times
	for (var i = 0; i < keyArray.length; i++) {
		if (posts.indexOf(keyArray[i]) > -1) {
			timePerPost[keyArray[i]] = 0;
		} else {
			timePerPost[keyArray[i]] = -999;
		}
	}
	
	//USER ACTIONS
	
	//Prev/Next buttons
	jQuery('#PrevArrow').on('click',function(){
	  $carousel.slick("slickPrev");
	  slideChange(-1);
	});
	jQuery('#NextArrow').on('click',function(){
	  $carousel.slick("slickNext");
	  slideChange(1);
	});

	// Up/down arrows
	$('html').keydown(function(event) {
		var currentSlide = $carousel.slick('slickCurrentSlide');
		
		// Down
		if (event.keyCode === 40) {
			$carousel.slick("slickNext");
			slideChange(1);
		}
		// Up
		else if (event.keyCode === 38) {
			$carousel.slick("slickPrev");
			slideChange(-1);
		}
	});
	
	//Like/Follow Buttons
	jQuery('#likeButton').on('click',function(){
		if (reactStatuses[presentSlide][0] === 0) { //If current slide is set to 0
			reactStatuses[presentSlide][0] = 1;
			likeButton.removeClass('likeNotClicked');
			likeButton.addClass('likeClicked');
		} else  {
			reactStatuses[presentSlide][0] = 0;
			likeButton.removeClass('likeClicked');
			likeButton.addClass('likeNotClicked');
		}
	});
	jQuery('#followButton').on('click',function(){
		if (reactStatuses[presentSlide][1] === 0) {
			reactStatuses[presentSlide][1]  = 1;
			followButton.removeClass('followNotClicked');
			followButton.addClass('followClicked');
		} else  {
			reactStatuses[presentSlide][1] = 0;
			followButton.removeClass('followClicked');
			followButton.addClass('followNotClicked');
		}
	});
	
	
	
	//When clicking the next button
	jQuery('#CustomNextButton').on('click',function(){
		//Record Time
		timeChange = Date.now() - timeRef;
		timePerPost[posts[presentSlide-1]] += timeChange;
		timeSequence.push(Date.now() - timeRef);
		
		//Record the posts and sources viewed
		postViewOrder.push(posts[presentSlide-1]);
		sourceViewOrder.push(sources[presentSlide-1][0]);
		
		//Record the post times to embedded data
		for (var key in timePerPost) {
				Qualtrics.SurveyEngine.setEmbeddedData(key,timePerPost[key].toString());
			}
		
		//Set values as embedded data
		Qualtrics.SurveyEngine.setEmbeddedData('timeSequence',timeSequence.toString());
		Qualtrics.SurveyEngine.setEmbeddedData('postViewOrder',postViewOrder.toString());
		Qualtrics.SurveyEngine.setEmbeddedData('sourceViewOrder',sourceViewOrder.toString());
		
		//Set embedded data for likes/follows
		for (var i = 1; i < 37; i++) {
			console.log(reactStatuses[i][0],reactStatuses[i][1])
			likeVar = 'like'+(i)
			followVar = 'follow'+(i)
			Qualtrics.SurveyEngine.setEmbeddedData(likeVar,reactStatuses[i][0])
			Qualtrics.SurveyEngine.setEmbeddedData(followVar,reactStatuses[i][1])
		};

		//Trigger next button		
		qobj.clickNextButton();
	});



});
                                  
Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});