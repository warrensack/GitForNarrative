/*
 * initial
 * 
 * A set of initial tasks and facts to demonstrate the
 * output of spinner.js.  Six example stories are
 * represented.
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 */

function initializeConditions() {

  //
  // initial tasks for story 1
  //
  var initialTasksForStory1 =
    [
     {"tasks": {"ordered": [{"dcont": {"character": "joe", "desire": "honey"}},
                            {"eats": {"ingestor": "joe", "ingestibles": "honey"}}]}}
     ];

  //
  // initial facts for story 1
  //
  // output:
  /*
    "once upon a time . . ."
    "joe was at the cave ."
    "irving was at the oak tree ."
    "joe believed that joe was at the cave ."
    "irving believed that joe was at the cave ."
    "irving believed that irving was at the oak tree ."
    "joe believed that irving was at the oak tree ."
    "joe believed that irving owned the honey ."
    "joe was a bear ."
    "joe was a character ."
    "irving was a bird ."
    "irving was a character ."
    "honey was a food ."
    "cave was a place ."
    "oak tree was a place ."
    "joe needed joe to carry the honey so that it would be possible for joe to eat the honey ."
    "joe needed joe to carry the berries so that it would be possible for joe to eat the berries ."
    "joe needed joe to carry the fish so that it would be possible for joe to eat the fish ."
    "joe needed joe to carry the water so that it would be possible for joe to drink the water ."
    "irving needed irving to carry the worm so that it would be possible for irving to eat the worm ."
    "irving needed irving to carry the fish so that it would be possible for irving to eat the fish ."
    "irving needed irving to carry the water so that it would be possible for irving to drink the water ."
    "it was within the capabilities of irving for irving to fly from the something to the something ."
    "irving owned the feathers ."
    "irving owned the honey ."
    "irving carried the honey ."
    "joe was hungry ."
    "joe was dishonest ."
    "joe dominated irving ."
    "one day . . ."
    "joe wanted to have the honey ."
    "joe wanted to go to irving ."
    "joe moved from the cave to the oak tree ."
    "joe walked from the cave to the oak tree ."
    "joe was at the oak tree ."
    "joe believed that joe was at the oak tree ."
    "joe robbed irving of the honey ."
    "joe carried the honey ."
    "joe ate the honey ."
  */
  var initialFactsForStory1 =
    [
     {"positioned": {"theme": "joe", "goal": "cave"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"positioned": {"theme": "irving", "goal": "oak tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"is": {"performer": "joe", "role": "bear"}},
     {"is": {"performer": "irving", "role": "bird"}},
     {"possesses": {"owner": "irving", "possession": "honey"}},
     {"is": {"performer": "honey", "role": "food"}},
     {"is": {"performer": "cave", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"possesses": {"owner": "irving", "possession": "honey"}}}},
     {"carries": {"agent": "irving", "theme": "honey"}},
     {"dishonest": {"character": "joe"}},
     {"dominates": {"agent": "joe", "patient": "irving"}},
     {"hungry": {"experiencer": "joe"}}
     ];

  //
  // initialization for story 1: Joe robs Irving of the honey
  //
  var story1 = initialFactsForStory1.concat(initialTasksForStory1);



  //
  // initial tasks for story 2
  //
  var initialTasksForStory2 = initialTasksForStory1;

  //
  // initial facts for story 2
  //
  // output:
  /*
    "once upon a time . . ."
    "joe was at the cave ."
    "irving was at the oak tree ."
    "honey was at the elm tree ."
    "joe believed that joe was at the cave ."
    "irving believed that joe was at the cave ."
    "irving believed that irving was at the oak tree ."
    "joe believed that irving was at the oak tree ."
    "irving believed that honey was at the elm tree ."
    "joe believed that honey was at the elm tree ."
    "joe believed that irving owned the honey ."
    "joe was a bear ."
    "joe was a character ."
    "irving was a bird ."
    "irving was a character ."
    "honey was a food ."
    "cave was a place ."
    "oak tree was a place ."
    "elm tree was a place ."
    "joe needed joe to carry the honey so that it would be possible for joe to eat the honey ."
    "joe needed joe to carry the berries so that it would be possible for joe to eat the berries ."
    "joe needed joe to carry the fish so that it would be possible for joe to eat the fish ."
    "joe needed joe to carry the water so that it would be possible for joe to drink the water ."
    "irving needed irving to carry the worm so that it would be possible for irving to eat the worm ."
    "irving needed irving to carry the fish so that it would be possible for irving to eat the fish ."
    "irving needed irving to carry the water so that it would be possible for irving to drink the water ."
    "joe owned the fur ."
    "joe owned the claws ."
    "joe owned the teeth ."
    "irving owned the feathers ."
    "irving owned the beak ."
    "irving owned the honey ."
    "it was within the capabilities of irving for irving to fly from the something to the something ."
    "joe was hungry ."
    "joe was dishonest ."
    "one day . . ."
    "joe wanted to have the honey ."
    "joe wanted to go to honey ."
    "joe wanted to learn the answer to this question: is honey at the elm tree ."
    "joe moved from the cave to the elm tree ."
    "joe walked from the cave to the elm tree ."
    "joe was at the elm tree ."
    "joe believed that joe was at the elm tree ."
    "joe stole the honey from irving ."
    "joe carried the honey ."
    "joe ate the honey ."
  */
  var initialFactsForStory2 =
    [
     {"positioned": {"theme": "joe", "goal": "cave"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"positioned": {"theme": "irving", "goal": "oak tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"positioned": {"theme": "honey", "goal": "elm tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "honey", "goal": "elm tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "honey", "goal": "elm tree"}}}},
     {"is": {"performer": "joe", "role": "bear"}},
     {"is": {"performer": "irving", "role": "bird"}},
     {"possesses": {"owner": "irving", "possession": "honey"}},
     {"is": {"performer": "honey", "role": "food"}},
     {"is": {"performer": "cave", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"is": {"performer": "elm tree", "role": "place"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"possesses": {"owner": "irving", "possession": "honey"}}}},
     {"hungry": {"experiencer": "joe"}},
     {"dishonest": {"character": "joe"}},
     ];

  //
  // initialization for story 2: Joe steals the honey from Irving
  //
  var story2 = initialFactsForStory2.concat(initialTasksForStory2);



  //
  // initial tasks for story 3
  //
  var initialTasksForStory3 = initialTasksForStory1;

  //
  // initial facts for story 3
  //
  // output:
  /*
    "once upon a time . . ."
    "joe was at the cave ."
    "irving was at the oak tree ."
    "joe believed that joe was at the cave ."
    "irving believed that joe was at the cave ."
    "irving believed that irving was at the oak tree ."
    "joe believed that irving was at the oak tree ."
    "joe believed that joe liked irving ."
    "joe believed that irving liked joe ."
    "irving believed that irving liked joe ."
    "irving believed that joe liked irving ."
    "joe believed that irving was truthful ."
    "irving believed that joe was truthful ."
    "joe believed that irving owned the honey ."
    "irving believed that irving was truthful ."
    "joe was a bear ."
    "joe was a character ."
    "irving was a bird ."
    "irving was a character ."
    "honey was a food ."
    "cave was a place ."
    "oak tree was a place ."
    "joe needed joe to carry the honey so that it would be possible for joe to eat the honey ."
    "joe needed joe to carry the berries so that it would be possible for joe to eat the berries ."
    "joe needed joe to carry the fish so that it would be possible for joe to eat the fish ."
    "joe needed joe to carry the water so that it would be possible for joe to drink the water ."
    "irving needed irving to carry the worm so that it would be possible for irving to eat the worm ."
    "irving needed irving to carry the fish so that it would be possible for irving to eat the fish ."
    "irving needed irving to carry the water so that it would be possible for irving to drink the water ."
    "it was within the capabilities of irving for irving to fly from the something to the something ."
    "irving owned the feathers ."
    "irving owned the honey ."
    "joe and irving were friends ."
    "irving and joe were friends ."
    "irving carried the honey ."
    "joe was hungry ."
    "one day . . ."
    "joe wanted to have the honey ."
    "joe wanted to go to irving ."
    "joe moved from the cave to the oak tree ."
    "joe walked from the cave to the oak tree ."
    "joe was at the oak tree ."
    "joe believed that joe was at the oak tree ."
    "joe requested irving that irving gave the honey to joe ."
    "irving believed that joe desired irving to give the honey to joe ."
    "irving gave the honey to joe ."
    "joe owned the honey ."
    "joe carried the honey ."
    "joe ate the honey ."
  */
  var initialFactsForStory3 =
    [
     {"positioned": {"theme": "joe", "goal": "cave"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"positioned": {"theme": "irving", "goal": "oak tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"is": {"performer": "joe", "role": "bear"}},
     {"is": {"performer": "irving", "role": "bird"}},
     {"possesses": {"owner": "irving", "possession": "honey"}},
     {"is": {"performer": "honey", "role": "food"}},
     {"is": {"performer": "cave", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"friends": {"friend1": "joe", "friend2": "irving"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"possesses": {"owner": "irving", "possession": "honey"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"truthful": {"character": "irving"}}}},
     {"carries": {"agent": "irving", "theme": "honey"}},
     {"hungry": {"experiencer": "joe"}},
     ];

  //
  // initialization for story 3: Irving gives Joe the honey because they are friends
  //
  var story3 = initialFactsForStory3.concat(initialTasksForStory3);



  //
  // initial tasks for story 4
  //
  var initialTasksForStory4 = initialTasksForStory1;

  //
  // initial facts for story 4
  //
  // output:
  /*
    "once upon a time . . ."
    "joe was at the cave ."
    "irving was at the oak tree ."
    "joe believed that joe was at the cave ."
    "irving believed that joe was at the cave ."
    "irving believed that irving was at the oak tree ."
    "joe believed that irving was at the oak tree ."
    "irving believed that joe owned the worm ."
    "joe believed that irving owned the honey ."
    "joe was a bear ."
    "joe was a character ."
    "irving was a bird ."
    "irving was a character ."
    "honey was a food ."
    "worm was a food ."
    "cave was a place ."
    "oak tree was a place ."
    "joe needed joe to carry the honey so that it would be possible for joe to eat the honey ."
    "joe needed joe to carry the berries so that it would be possible for joe to eat the berries ."
    "joe needed joe to carry the fish so that it would be possible for joe to eat the fish ."
    "joe needed joe to carry the water so that it would be possible for joe to drink the water ."
    "irving needed irving to carry the worm so that it would be possible for irving to eat the worm ."
    "irving needed irving to carry the fish so that it would be possible for irving to eat the fish ."
    "irving needed irving to carry the water so that it would be possible for irving to drink the water ."
    "joe owned the worm ."
    "irving owned the feathers ."
    "irving owned the honey ."
    "it was within the capabilities of irving for irving to fly from the something to the something ."
    "joe was honest ."
    "irving was honest ."
    "irving carried the honey ."
    "joe carried the worm ."
    "joe was hungry ."
    "one day . . ."
    "joe wanted to have the honey ."
    "joe wanted to bargain with irving for the honey ."
    "joe and irving set up a deal ."
    "joe wanted to go to irving ."
    "joe moved from the cave to the oak tree ."
    "joe walked from the cave to the oak tree ."
    "joe was at the oak tree ."
    "joe believed that joe was at the oak tree ."
    "joe told irving joe desired joe to carry the honey ."
    "joe informed irving that joe desired joe to carry the honey ."
    "irving believed that joe desired joe to carry the honey ."
    "irving told joe irving desired irving to carry the worm ."
    "irving informed joe that irving desired irving to carry the worm ."
    "joe believed that irving desired irving to carry the worm ."
    "joe promised irving that irving carries the worm ."
    "joe made a commitment to irving that irving carries the worm ."
    "irving promised joe that joe carries the honey ."
    "irving made a commitment to joe that joe carries the honey ."
    "joe gave the worm to irving ."
    "irving owned the worm ."
    "irving carried the worm ."
    "irving gave the honey to joe ."
    "joe owned the honey ."
    "joe carried the honey ."
    "joe ate the honey ."
  */
  var initialFactsForStory4 =
    [
     {"positioned": {"theme": "joe", "goal": "cave"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"positioned": {"theme": "irving", "goal": "oak tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"is": {"performer": "joe", "role": "bear"}},
     {"possesses": {"owner": "joe", "possession": "worm"}},
     {"is": {"performer": "irving", "role": "bird"}},
     {"possesses": {"owner": "irving", "possession": "honey"}},
     {"is": {"performer": "honey", "role": "food"}},
     {"is": {"performer": "worm", "role": "food"}},
     {"is": {"performer": "cave", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"possesses": {"owner": "joe", 
					   "possession": "worm"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"possesses": {"owner": "irving", 
					   "possession": "honey"}}}},
     {"honest": {"character": "joe"}},
     {"honest": {"character": "irving"}},
     {"carries": {"agent": "irving", "theme": "honey"}},
     {"carries": {"agent": "joe", "theme": "worm"}},
     {"hungry": {"experiencer": "joe"}},
     ];

  //
  // initialization for story 4: Joe and Irving barter
  //
  var story4 = initialFactsForStory4.concat(initialTasksForStory4);



  //
  // initial tasks for story 5
  //
  var initialTasksForStory5 = initialTasksForStory1;

  //
  // initial facts for story 5
  //
  // output:
  /*
    "once upon a time . . ."
    "joe was at the cave ."
    "irving was at the oak tree ."
    "joe believed that joe was at the cave ."
    "irving believed that joe was at the cave ."
    "irving believed that irving was at the oak tree ."
    "joe believed that irving was at the oak tree ."
    "joe believed that irving owned the honey ."
    "joe was a bear ."
    "joe was a character ."
    "irving was a bird ."
    "irving was a character ."
    "honey was a food ."
    "cave was a place ."
    "oak tree was a place ."
    "joe was a bully ."
    "joe needed joe to carry the honey so that it would be possible for joe to eat the honey ."
    "joe needed joe to carry the berries so that it would be possible for joe to eat the berries ."
    "joe needed joe to carry the fish so that it would be possible for joe to eat the fish ."
    "joe needed joe to carry the water so that it would be possible for joe to drink the water ."
    "irving needed irving to carry the worm so that it would be possible for irving to eat the worm ."
    "irving needed irving to carry the fish so that it would be possible for irving to eat the fish ."
    "irving needed irving to carry the water so that it would be possible for irving to drink the water ."
    "joe owned the fur ."
    "joe owned the claws ."
    "joe owned the teeth ."
    "irving owned the feathers ."
    "irving owned the beak ."
    "irving owned the honey ."
    "it was within the capabilities of irving for irving to fly from the something to the something ."
    "joe dominated irving ."
    "irving carried the honey ."
    "joe was hungry ."
    "one day . . ."
    "joe wanted to have the honey ."
    "joe wanted to go to irving ."
    "joe told irving joe desired joe to carry the honey ."
    "joe informed irving that joe desired joe to carry the honey ."
    "irving believed that joe desired joe to carry the honey ."
    "joe threatened irving that joe kills irving ."
    "joe made a commitment to irving that joe kills irving ."
    "irving surrendered the honey to joe ."
    "joe carried the honey ."
    "joe ate the honey ."
  */
  var initialFactsForStory5 =
    [
     {"positioned": {"theme": "joe", "goal": "cave"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "joe", "goal": "cave"}}}},
     {"positioned": {"theme": "irving", "goal": "oak tree"}},
     {"believes": {"cognizer": "irving", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"positioned": {"theme": "irving", "goal": "oak tree"}}}},
     {"is": {"performer": "joe", "role": "bear"}},
     {"is": {"performer": "irving", "role": "bird"}},
     {"possesses": {"owner": "irving", "possession": "honey"}},
     {"is": {"performer": "honey", "role": "food"}},
     {"is": {"performer": "cave", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"believes": {"cognizer": "joe", 
		   "topic": {"possesses": {"owner": "irving", 
					   "possession": "honey"}}}},
     {"dominates": {"agent": "joe", "patient": "irving"}},
     {"is": {"performer": "joe", "role": "bully"}},
     {"carries": {"agent": "irving", "theme": "honey"}},
     {"hungry": {"experiencer": "joe"}},
     ];

  //
  // initialization for story 5: Joe threats Irving
  //
  var story5 = initialFactsForStory5.concat(initialTasksForStory5);



  //
  // initial tasks for story 6
  //
  var initialTasksForStory6 =
    [
     {"tasks": {"ordered": [{"dcont": {"character": "master reynard", "desire": "cheese"}},
                            {"eats": {"ingestor": "master reynard", "ingestibles": "cheese"}}]}}
     ];

  //
  // initial facts for story 6
  //
  // output:
  /*
    "once upon a time . . ."
    "master reynard was at the elm tree ."
    "crow was at the oak tree ."
    "master reynard believed that master reynard was at the elm tree ."
    "crow believed that master reynard was at the elm tree ."
    "crow believed that crow was at the oak tree ."
    "master reynard believed that crow was at the oak tree ."
    "master reynard believed that crow owned the cheese ."
    "master reynard was a fox ."
    "master reynard was a character ."
    "crow was a bird ."
    "crow was a character ."
    "cheese was a food ."
    "elm tree was a place ."
    "oak tree was a place ."
    "crow was a vain bird ."
    "master reynard needed master reynard to carry the cheese so that it would be possible for master reynard to eat the cheese ."
    "master reynard needed master reynard to carry the meat so that it would be possible for master reynard to eat the meat ."
    "master reynard needed master reynard to carry the water so that it would be possible for master reynard to drink the water ."
    "crow needed crow to carry the worm so that it would be possible for crow to eat the worm ."
    "crow needed crow to carry the fish so that it would be possible for crow to eat the fish ."
    "crow needed crow to carry the water so that it would be possible for crow to drink the water ."
    "crow needed crow to sing something to something so that it would be possible for crow to believe that crow owns the self esteem ."
    "master reynard owned the fur ."
    "master reynard owned the claws ."
    "master reynard owned the teeth ."
    "crow owned the feathers ."
    "crow owned the beak ."
    "crow owned the cheese ."
    "it was within the capabilities of crow for crow to fly from the something to the something ."
    "crow carried the cheese ."
    "master reynard was dishonest ."
    "crow dominated master reynard ."
    "master reynard was hungry ."
    "one day . . ."
    "master reynard wanted to have the cheese ."
    "master reynard wanted to go to crow ."
    "master reynard moved from the elm tree to the oak tree ."
    "master reynard walked from the elm tree to the oak tree ."
    "master reynard was at the oak tree ."
    "master reynard believed that master reynard was at the oak tree ."
    "master reynard requested crow for crow to sing something to something ."
    "crow believed that master reynard desired crow to sing something to something ."
    "crow sang something to something ."
    "crow dropped the cheese ."
    "cheese was at the oak tree ."
    "crow informed master reynard that something ."
    "master reynard believed that something ."
    "master reynard stole the cheese from crow ."
    "master reynard carried the cheese ."
    "master reynard ate the cheese ."
  */
  var initialFactsForStory6 =
    [
     {"positioned": {"theme": "master reynard", "goal": "elm tree"}},
     {"believes": {"cognizer": "master reynard", 
		   "topic": {"positioned": {"theme": "master reynard", "goal": "elm tree"}}}},
     {"believes": {"cognizer": "crow", 
		   "topic": {"positioned": {"theme": "master reynard", "goal": "elm tree"}}}},
     {"positioned": {"theme": "crow", "goal": "oak tree"}},
     {"believes": {"cognizer": "crow", 
		   "topic": {"positioned": {"theme": "crow", "goal": "oak tree"}}}},
     {"believes": {"cognizer": "master reynard", 
		   "topic": {"positioned": {"theme": "crow", "goal": "oak tree"}}}},
     {"is": {"performer": "master reynard", "role": "fox"}},
     {"is": {"performer": "crow", "role": "bird"}},
     {"possesses": {"owner": "crow", "possession": "cheese"}},
     {"is": {"performer": "cheese", "role": "food"}},
     {"is": {"performer": "elm tree", "role": "place"}},
     {"is": {"performer": "oak tree", "role": "place"}},
     {"believes": {"cognizer": "master reynard", 
		   "topic": {"possesses": {"owner": "crow", 
					   "possession": "cheese"}}}},
     {"carries": {"agent": "crow", "theme": "cheese"}},
     {"is": {"performer": "crow", "role": "vain bird"}},
     {"dishonest": {"character": "master reynard"}},
     {"dominates": {"agent": "crow", "patient": "master reynard"}},
     {"hungry": {"experiencer": "master reynard"}},
     ];

  //
  // initialization for story 6: Master Reynard tricks Crow out of his cheese
  //
  var story6 = initialFactsForStory6.concat(initialTasksForStory6);

  //
  // Initial conditions for six demo stories
  //
  return({ story1 : story1,
  	   story2 : story2,
	   story3 : story3,
	   story4 : story4,
	   story5 : story5,
	   story6 : story6});

}

module.exports = initializeConditions;




