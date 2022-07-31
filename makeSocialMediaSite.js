/* For any of the javascript to work the following must be placed inside the Header of the survey

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script><script src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
	<link href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css" rel="stylesheet" />
	<link href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick-theme.css" rel="stylesheet" />
	
	
	This script should be placed in the first block of the Qualtrics survey. Additionally, that block must be BEFORE the mock social media site. I wanted people to land on the social media site, so the way around this I found was just to have a block with a text statement that said "Loading" and then Qualtrics automatically moved them to the next block after two seconds. I then put this script with the loading screen.
	
	Script automatically creates a social media feed of 36 posts consisting of 6 posts each from 6  topics.
	*/


Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
		//BASE DATA
	
	var topics = ['Topic1','Topic2','Topic3','Topic4','Topic5','Topic6'];
	
	var allImages = {
		'Topic1' :{
			'T1':[] //Place URLs to images of the variations of your posts in between brackets seperated by commas as part of Javascript array, can have up to 10 posts in each topic
			'T2':[]
			'T3':[]
			'T4':[]
			'T5':[]
			'T6':[]
			'T7':[]
			'T8':[]
			'T9':[]
			'T0':[]
		},
		'Topic2' :{
			'E1':[]
			'E2':[]
			'E3':[]
			'E4':[]
			'E5':[]
			'E6':[]
			'E7':[]
			'E8':[]
			'E9':[]
		},
		'Topic3' :{
			'F1':[]
			'F2':[]
			'F3':[]
			'F4':[]
			'F5':[]
			'F6':[]
			'F7':[]
			'F8':[]
			'F9':[]
		},
		'Topic4' :{
			'L1':[]
			'L2':[]
			'L3':[]
			'L4':[]
			'L5':[]
			'L6':[]
		},
		'Topic5' :{
			'S1':[]
			'S2':[]
			'S3':[]
			'S4':[]
			'S5':[]
			'S6':[]
		},
		'Topic6' :{
			'H1':[]
			'H2':[]
			'H3':[]
			'H4':[]
			'H5':[]
			'H6':[]
		}
	};
	
	

	
	var Topic1Images = {
		'Pos':{
			'T1':[]
			'T2':[]
			'T3':[]
			'T4':[]
			'T5':[]
		},
		'Neg':{
			'T6':[]
			'T7':[]
			'T8':[]
			'T9':[]
			'T0':[]
		}
	};
	
	//key for figuring out number of posts and possible images. First number is number of posts, second is number of images.
	var numPosts = {
		'Topic1':[10,6],
		'Topic2':[9,6],
		'Topic3':[9,6],
		'Topic4':[6,1],
		'Topic5':[6,1],
		'Topic6':[6,1]
	};
	
	var sourceLib = { //put the sources you want to use for each topic here
		'Topic1':[],	
		'Topic2':[],
		'Topic3':[],
		'Topic4':[],
		'Topic5':[],
		'Topic6':[],
	};
	
	

	//FUNCTIONS
	
	//Random shuffle Function
	/*&
	function shuffle(array) {
	  var currentIndex = array.length,  randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		  array[randomIndex], array[currentIndex]];
	  }
	  return array;
	}*/
	
	//Trying a new shuffle functin that may be ES5 compliant
	function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
	return array
}
	
	
	//Get Source function
	function  getSource(topic,post,postNum) {
		console.log(topic,post);
		source = sourceLib[topic].shift();
		}
		//console.log(source);
		Qualtrics.SurveyEngine.setEmbeddedData("source"+postNum,source);
	}
	
		
	
	//EARLY ACTIONS
	
	//Create base vars
	var postDrawPile = {}; //will contain shuffled and sampled posts seperated by topic
	var postDrawPileKeys = {};
	var postDrawPileImgs = {};
	var includedPostKeys = []; //List of keys that used on the post
	
	//Find the condition of the user
	var condition = "${e://Field/cond}";
	//console.log(condition);
	
	//GRAB ALL POSTS AND ADD THEM TO AN ARRAY 
	var arrayOfAllKeys = [];
	for (var topic in allImages) {
		for (var key in allImages[topic]) {
			arrayOfAllKeys.push(key); //add the key to the array
		}
	}
	
	
	//SORT OUT POSTS WITHIN TOPICS AND DRAW ORDER
	//Decide what order posts will be drawn in for each topic
	for (var topic in allImages) {
		postDrawPile[topic] = [];
		postDrawPileKeys[topic] = [];
		postDrawPileImgs[topic] = [];
		if (topic != 'Topic1') { //Skip Topic1 topic, process that one seperately
			if (numPosts[topic][1] === 1) {
				imageDraw = [0,0,0,0,0,0];
			} else if (numPosts[topic][1] === 6) {
				imageDraw = shuffle([0,1,2,3,4,5]);
			}
			postKeys = shuffle(Object.keys(allImages[topic]));
			for (var i = 0; i < 6; i++) {
				//console.log(allImages[topic][postKeys[i]][imageDraw[i]]);
				postDrawPile[topic].push(allImages[topic][postKeys[i]][imageDraw[i]]);
				postDrawPileKeys[topic].push(postKeys[i]);
				postDrawPileImgs[topic].push(i);
			}
		}
	}
	

	
	
	//Now to draw for Topic1 topics
	var imageDraw = shuffle([0,1,2,3,4,5]); //shuffle the image numbers
	var Topic1PostKeysPos = shuffle(Object.keys(Topic1Images.Pos)); //Need a list of just positive keys to check against later
	//console.log("positive Topic1 keys"+Topic1PostKeysPos.toString());
	var Topic1PostsShuffledKeys = Topic1PostKeysPos; //Create a variable of shuffled keys of the positive post keys
	Topic1PostsShuffledKeys.pop(); //remove the last two posts from the shuffled keys list so there are only three
	Topic1PostsShuffledKeys.pop();
	Topic1PostsShuffledKeys = Topic1PostsShuffledKeys.concat(shuffle(Object.keys(Topic1Images.Neg))); //Now add shuffled negative keys to the list
	Topic1PostsShuffledKeys.pop(); //remove the last two items - should now only be six
	Topic1PostsShuffledKeys.pop();
	Topic1PostsShuffledKeys = shuffle(Topic1PostsShuffledKeys); //shuffle the finalized keys
	//console.log("SHUFFLED Topic1 KEYS: "+Topic1PostsShuffledKeys.toString()); //should have a list of six keys - 3 pos, 3 neg - in random order
	for (var i = 0; i < 6; i++) {
		if (Topic1PostKeysPos.indexOf(Topic1PostsShuffledKeys[i]) > -1) {
			//console.log(Topic1PostsShuffledKeys[i]+" is in "+Topic1PostKeysPos+", so is positive");
			group = 'Pos';
		} else {
			//console.log(Topic1PostsShuffledKeys[i]+" is not in "+Topic1PostKeysPos+", so is negative");
			group = 'Neg';
		}
		postDrawPile.Topic1.push(Topic1Images[group][Topic1PostsShuffledKeys[i]][imageDraw[i]]);
		postDrawPileKeys.Topic1.push(Topic1PostsShuffledKeys[i]);
		postDrawPileImgs.Topic1.push(i);
	}
	//console.log("As we start drawing, top1 keys are: "+postDrawPileKeys.Topic1);
	
	//Send Topic2 and Topic3 to post-test
	var sendToPostTest = postDrawPileKeys.Topic2.concat(postDrawPileKeys.Topic3,postDrawPileKeys.Topic1)
	//console.log(sendToPostTest.toString())
	Qualtrics.SurveyEngine.setEmbeddedData("pk",sendToPostTest.toString());

	//SORT OUT SOURCE ORDERS
	
	//First need to create two lists for Topic1 sources sources
	top1Sources.Industry = shuffle(top1Sources.Industry);
	top1Sources.Gov = shuffle(top1Sources.Gov); //shuffle existing order	
	
	//Decide if pos or neg Topic1 posts get two gov sources
	var order;
	if (Math.random() < 0.5) { //get random number and decide which group to draw from first
		order = [0,1];
	} else {
		order = [1,0];
	}
	var top1SourceValenceArrays = {'Pos':[],'Neg':[]};
	top1SourceValenceArrays.Pos = shuffle(Topic1SourceTypeBase[order[0]]);
	top1SourceValenceArrays.Neg = shuffle(Topic1SourceTypeBase[order[1]]);
	//console.log(top1SourceValenceArrays.Pos.toString());
	//console.log(top1SourceValenceArrays.Neg.toString());
	
	//Draw the Topic1 sources based on key
	var Topic1Sources = {'Pos':[],'Neg':[]};
	for (var i = 0; i < 3; i++) {
		Topic1Sources['Pos'].push(top1Sources[top1SourceValenceArrays['Pos'][i]].pop());
		Topic1Sources['Neg'].push(top1Sources[top1SourceValenceArrays['Neg'][i]].pop());
	}
	console.log("Topic1 sources: "+Topic1Sources.toString());

	
	//shuffle the other topics
	for (var topic in sourceLib) {
		sourceLib[topic] = shuffle(sourceLib[topic]);
	}
	
	
	//SHOULD NOW HAVE ALL POSTS IN RANDOMIZED ORDER. NEXT STEP IS TO DRAW DEPENDENT ON CONDITION AND ASSIGN SOURCES
		//BUILD POSTS & SOURCES
	//If condition if high
	var postNum = 1; //Increment this by one as each post is added
	if (condition === "high") {
		//console.log("condition is high");
		for (var i = 0; i < 6; i++) { //Loop through six blocks
			shuffle(topics);
			for (var j = 0; j < 6; j++) { //Loop through each topic and add the post and source
				postToPush = postDrawPileKeys[topics[j]].shift();
				//console.log("postToPush");
				//console.log(postToPush);
				Qualtrics.SurveyEngine.setEmbeddedData("post"+postNum,postDrawPile[topics[j]].shift());
				Qualtrics.SurveyEngine.setEmbeddedData("postKey"+postNum,postToPush);
				Qualtrics.SurveyEngine.setEmbeddedData("imageNum"+postNum,postDrawPileImgs[topics[j]].shift());
				getSource(topics[j],postToPush,postNum); //Add the source
				includedPostKeys.push(postToPush);
				postNum += 1;
			}
		}
	} else { //If condition is low
		//console.log("condition is low");
		shuffle(topics); // shuffle the topics
		//loop through each topic and within each post within each topic
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 6; j++) {
				postToPush = postDrawPileKeys[topics[i]].shift();
				Qualtrics.SurveyEngine.setEmbeddedData("post"+postNum,postDrawPile[topics[i]].shift());
				Qualtrics.SurveyEngine.setEmbeddedData("postKey"+postNum,postToPush);
				Qualtrics.SurveyEngine.setEmbeddedData("imageNum"+postNum,postDrawPileImgs[topics[i]].shift());
				getSource(topics[i],postToPush,postNum); //Add the source
				includedPostKeys.push(postToPush);
				postNum += 1;
			}
		}
	}




	
	
	
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});

///TO FIX = need to strip from Topic1 valance thingy