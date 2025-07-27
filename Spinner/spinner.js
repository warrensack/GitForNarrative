/*
 * spinner
 * 
 * Production rules, deduction rules, planning methods and actions
 * defined for a Tale-Spin-like story generator.
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 * Sample usage in a webpage:
 	<script type="text/javascript" src="./Utilities/utilities.js"></script>
    <script type="text/javascript" src="./Logic/llpl.js"></script>
  	<script type="text/javascript" src="./Planner/shop.js"></script>
    <script type="text/javascript" src="./Spinner/qa.js"></script>
    <script type="text/javascript" src="./Spinner/initial.js"></script>
    <script type="text/javascript" src="./Spinner/spinner.js"></script>
    <script type="text/javascript" src="./Spinner/mumbler.js"></script>
    <script type="text/javascript">

		<!-- insert the JavaScript code from below here -->

* Sample usage in node.js
 	const makeUtilities = require('./Utilities/utilities.js');
 	const makeInterpreter = require('./Logic/llpl.js');
	const makePlanner = require('./Planner/shop.js');
	const makeQA = require('./Spinner/qa.js');
	const initializeConditions = require('./Spinner/initial.js');
	const spinner = require('./Spinner/spinner.js');
	const textTemplatesAndRules = require('./Spinner/mumbler.js');

 * JavaScript code for both a webpage and node.js

	const utils = makeUtilities();
    // Create a version of llpl for spinner
    const llplv1 = makeInterpreter(utils);
    const initialConditions = initializeConditions();
    // If desired, change to story1, story2, story3,
    // story4, story5, or story6
    let db = initialConditions.story2;     
    db = db.concat(spinner); 
    // Create a version of llpl for mumbler
    const llplv2 = makeInterpreter(utils);
    llplv2.initializeDatabase(textTemplatesAndRules);
    // Redefine conjoin if you want the story to be interactive.
//  const qa = makeQA(llplv1,llplv2,utils);
//  const p = makePlanner(db,llplv1,utils,qa.conjoin);
    // Otherwise, use llplv1.conjoin as a parameter to makePlanner
    // for spinner.
    let p = makePlanner(db,llplv1,utils,llplv1.conjoin);
    // Plan out the story
    let storyPlan = p.plan();
    let statesAsAssertions = p.statesToAssertions();
    let ttdb = textTemplatesAndRules.concat(statesAsAssertions);
    llplv2.initializeDatabase(ttdb);
    // Narrate the story using the past tense
    llplv2.query({"narrate": {"tense": "past"}});

	// Change the tense to interrogative
	llplv2.query({"narrate": {"tense": "interrogative"}});

	// Change the tense to present
	llplv2.query({"narrate": {"tense": "present"}});
	
	// Change the story
	db = initialConditions.story6; // change story# here  
    db = db.concat(spinner); 
	p = makePlanner(db,llplv1,utils,llplv1.conjoin);
	storyPlan = p.plan();
	statesAsAssertions = p.statesToAssertions();
	ttdb = textTemplatesAndRules.concat(statesAsAssertions);
	llplv2.initializeDatabase(ttdb);
	llplv2.query({"narrate": {"tense": "past"}});

 */


////
//// Production Rules
////
const spinnerProductionRules =
	[

		// Bears drink water and eat honey, berries, and fish. Bears can be characters.
		// Bears have fur and claws.
		{
			"-->": {
				"is": { "performer": "?bear", "role": "bear" },
				"consequents": [{
					"needs": {
						"cognizer": "?bear",
						"requirement": {
							"carries": {
								"agent": "?bear",
								"theme": "honey"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?bear",
								"ingestibles": "honey"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?bear",
						"requirement": {
							"carries": {
								"agent": "?bear",
								"theme": "berries"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?bear",
								"ingestibles": "berries"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?bear",
						"requirement": {
							"carries": {
								"agent": "?bear",
								"theme": "fish"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?bear",
								"ingestibles": "fish"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?bear",
						"requirement": {
							"carries": {
								"agent": "?bear",
								"theme": "water"
							}
						},
						"dependent": {
							"drinks": {
								"ingestor": "?bear",
								"ingestibles": "water"
							}
						}
					}
				},
				{ "possesses": { "owner": "?bear", "possession": "fur" } },
				{ "possesses": { "owner": "?bear", "possession": "claws" } },
				{ "possesses": { "owner": "?bear", "possession": "teeth" } },
				{ "is": { "performer": "?bear", "role": "character" } }]
			}
		},

		// Foxes drink water and eat cheese and meat. Foxs can be characters.
		// Foxs have fur and claws.
		{
			"-->": {
				"is": { "performer": "?fox", "role": "fox" },
				"consequents": [{
					"needs": {
						"cognizer": "?fox",
						"requirement": {
							"carries": {
								"agent": "?fox",
								"theme": "cheese"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?fox",
								"ingestibles": "cheese"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?fox",
						"requirement": {
							"carries": {
								"agent": "?fox",
								"theme": "meat"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?fox",
								"ingestibles": "meat"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?fox",
						"requirement": {
							"carries": {
								"agent": "?fox",
								"theme": "water"
							}
						},
						"dependent": {
							"drinks": {
								"ingestor": "?fox",
								"ingestibles": "water"
							}
						}
					}
				},
				{ "possesses": { "owner": "?fox", "possession": "fur" } },
				{ "possesses": { "owner": "?fox", "possession": "claws" } },
				{ "possesses": { "owner": "?fox", "possession": "teeth" } },
				{ "is": { "performer": "?fox", "role": "character" } }]
			}
		},

		// Birds drink water, eat fish and worms, can fly, and have feathers. Birds can be characters.
		{
			"-->": {
				"is": { "performer": "?bird", "role": "bird" },
				"consequents": [{
					"needs": {
						"cognizer": "?bird",
						"requirement": {
							"carries": {
								"agent": "?bird",
								"theme": "worm"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?bird",
								"ingestibles": "worm"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?bird",
						"requirement": {
							"carries": {
								"agent": "?bird",
								"theme": "fish"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?bird",
								"ingestibles": "fish"
							}
						}
					}
				},
				{
					"needs": {
						"cognizer": "?bird",
						"requirement": {
							"carries": {
								"agent": "?bird",
								"theme": "water"
							}
						},
						"dependent": {
							"drinks": {
								"ingestor": "?bird",
								"ingestibles": "water"
							}
						}
					}
				},
				{
					"capability": {
						"entity": "?bird",
						"event": {
							"flies": {
								"self_mover": "?bird",
								"source": "?source",
								"goal": "?goal",
								"?path": "?path"
							}
						}
					}
				},
				{ "possesses": { "owner": "?bird", "possession": "feathers" } },
				{ "possesses": { "owner": "?bird", "possession": "beak" } },
				{ "is": { "performer": "?bird", "role": "character" } }]
			}
		},

		// Vain birds need to sing to validate their self esteem.
		{
			"-->": {
				"is": { "performer": "?bird", "role": "vain bird" },
				"consequents": [{
					"needs": {
						"cognizer": "?bird",
						"requirement": {
							"sings": {
								"singer": "?bird",
								"addressee": "?addressee",
								"message": "?message"
							}
						},
						"dependent": {
							"believes": {
								"cognizer": "?bird",
								"topic": {
									"possesses": {
										"owner": "?bird",
										"possession": "self esteem"
									}
								}
							}
						}
					}
				}]
			}
		},

		// Competitive characters need to race to validate their self esteem.
		{
			"-->": {
				"is": { "performer": "?character", "role": "competitive" },
				"consequents": [{
					"needs": {
						"cognizer": "?character",
						"requirement": {
							"races": {
								"self_mover": "?character",
								"source": "?source",
								"goal": "?goal"
							}
						},
						"dependent": {
							"believes": {
								"cognizer": "?character",
								"topic": {
									"possesses": {
										"owner": "?character",
										"possession": "self esteem"
									}
								}
							}
						}
					}
				}]
			}
		},

		// Friends like one another and believe that the other likes them; friends believe that their
		// friends are truthful; friends have a set of standing commitments to one another (coded in the
		// definition of the deduction rule for "commits"
		{
			"-->": {
				"friends": { "friend1": "?friend1", "friend2": "?friend2" },
				"consequents": [{
					"believes": {
						"cognizer": "?friend1",
						"topic": {
							"likes": {
								"agent": "?friend1",
								"patient": "?friend2"
							}
						}
					}
				},
				{
					"believes": {
						"cognizer": "?friend1",
						"topic": {
							"likes": {
								"agent": "?friend2",
								"patient": "?friend1"
							}
						}
					}
				},
				{
					"believes": {
						"cognizer": "?friend2",
						"topic": {
							"likes": {
								"agent": "?friend2",
								"patient": "?friend1"
							}
						}
					}
				},
				{
					"believes": {
						"cognizer": "?friend2",
						"topic": {
							"likes": {
								"agent": "?friend1",
								"patient": "?friend2"
							}
						}
					}
				},
				{
					"believes": {
						"cognizer": "?friend1",
						"topic": { "truthful": { "character": "?friend2" } }
					}
				},
				{
					"believes": {
						"cognizer": "?friend2",
						"topic": { "truthful": { "character": "?friend1" } }
					}
				}]
			}
		},

		// friends(x,y) if friends(y,x); i.e., friends is a reflexive relationship
		{
			"-->": {
				"friends": { "friend1": "?x", "friend2": "?y" },
				"consequents": [{ "friends": { "friend1": "?y", "friend2": "?x" } }]
			}
		},

		// rules of family relations

		// brothers(x,y) implies siblings(x,y)
		{
			"-->": {
				"brothers": { "person1": "?person1", "person2": "?person2" },
				"consequents": [{ "siblings": { "person1": "?person1", "person2": "?person2" } }]
			}
		},

		// sisters(x,y) implies siblings(x,y)
		{
			"-->": {
				"sisters": { "person1": "?person1", "person2": "?person2" },
				"consequents": [{ "siblings": { "person1": "?person1", "person2": "?person2" } }]
			}
		},

		// siblings(x,y) implies siblings(y,x)
		{
			"-->": {
				"sisters": { "person1": "?person1", "person2": "?person2" },
				"consequents": [{ "siblings": { "person1": "?person2", "person2": "?person1" } }]
			}
		},

		// father(x,y) implies parent(x,y)
		{
			"-->": {
				"father": { "parent": "?parent", "child": "?child" },
				"consequents": [{ "parent": { "parent": "?parent", "child": "?child" } }]
			}
		},

		// mother(x,y) implies parent(x,y)
		{
			"-->": {
				"mother": { "parent": "?parent", "child": "?child" },
				"consequents": [{ "parent": { "parent": "?parent", "child": "?child" } }]
			}
		},

		// parent(x,y) implies child(y,x)
		{
			"-->": {
				"parent": { "parent": "?parent", "child": "?child" },
				"consequents": [{ "child": { "parent": "?parent", "child": "?child" } }]
			}
		}
	];


////
//// Deduction Rules
////
const spinnerDeductionRules =
	[

		// Two entities are the same if they can be unified
		{ "<--": { "same": { "entity1": "?x", "entity2": "?x" } } },

		// One can neither sing nor race while carrying something
		{ "<--": { "goalRequiresDropping": { "goal": { "sings": { "singer": "?singer", "addressee": "?addressee", "message": "?message" } } } } },
		{ "<--": { "goalRequiresDropping": { "goal": { "races": { "self_mover": "?self_mover", "source": "?source", "goal": "?goal" } } } } },

		// If a character needs something for a certain purpose (e.g., needs to
		// have something in order to eat it), then that something is a constant goal
		// for that type of character.
		{
			"<--": {
				"constantGoal": { "character": "?character", "goal": "?goal" },
				"and": [{ "is": { "performer": "?character", "role": "character" } },
				{
					"needs": {
						"cognizer": "?character",
						"requirement": "?goal",
						"dependent": "?dependent"
					}
				}]
			}
		},


		// A character can know the position of someone or something if they are collocated.
		{
			"<--": {
				"believes": {
					"cognizer": "?character",
					"topic": { "positioned": { "theme": "?x", "goal": "?place" } }
				},
				"and": [{ "is": { "performer": "?character", "role": "character" } },
				{ "is": { "performer": "?place", "role": "place" } },
				{ "not": { "same": { "entity1": "?character", "entity2": "?x" } } },
				{ "positioned": { "theme": "?x", "goal": "?place" } },
				{ "positioned": { "theme": "?character", "goal": "?place" } }]
			}
		},

		// If a character is carrying something, that something is positioned at the same
		// place as the character.
		{
			"<--": {
				"positioned": { "theme": "?x", "goal": "?place" },
				"and": [{ "carries": { "agent": "?character", "theme": "?x" } },
				{ "positioned": { "theme": "?character", "goal": "?place" } }]
			}
		},


		// isReadyToMove
		// A ?character is ready to move if s/he is a character, the ?source and the ?goal are places,
		// the ?character is currently positioned at the ?source, and the ?character knows his/her
		// current position.
		{
			"<--": {
				"isReadyToMove": { "character": "?character", "source": "?source", "goal": "?goal" },
				"and": [{ "is": { "performer": "?character", "role": "character" } },
				{ "is": { "performer": "?source", "role": "place" } },
				{ "positioned": { "theme": "?character", "goal": "?source" } },
				{
					"believes": {
						"cognizer": "?character",
						"topic": {
							"positioned": {
								"theme": "?character",
								"goal": "?source"
							}
						}
					}
				},
				{ "is": { "performer": "?goal", "role": "place" } }]
			}
		},

		// The ?owner of an ?object is known to the ?cognizer
		{
			"<--": {
				"ownerIsKnown": { "cognizer": "?cognizer", "owner": "?owner", "object": "?object" },
				"and": [{
					"believes": {
						"cognizer": "?cognizer",
						"topic": {
							"possesses": {
								"owner": "?owner",
								"possession": "?object"
							}
						}
					}
				},
				{ "possesses": { "owner": "?owner", "possession": "?object" } },
				{ "not": { "same": { "entity1": "?cognizer", "entity2": "?owner" } } }]
			}
		},

		// A threat is serious if the ?speaker dominates the ?addressee and the ?speaker has
		// vowed to kill the ?addressee
		{
			"<--": {
				"isSeriousThreat": {
					"speaker": "?speaker",
					"addressee": "?addressee",
					"threat": { "kills": { "killer": "?speaker", "victim": "?addressee" } }
				},
				"and": [{ "dominates": { "agent": "?speaker", "patient": "?addressee" } }]
			}
		},

		// A threat is serious if the ?speaker dominates the ?addressee and the ?speaker has
		// vowed to rob the ?addressee of something the ?addressee needs
		{
			"<--": {
				"isSeriousThreat": {
					"speaker": "?speaker",
					"addressee": "?addressee",
					"threat": {
						"robs": {
							"perpetrator": "?speaker", "goods": "?goods",
							"victim": "?addressee", "place": "?place"
						}
					}
				},
				"and": [{ "dominates": { "agent": "?speaker", "patient": "?addressee" } },
				{
					"constantGoal": {
						"character": "?character",
						"goal": { "carries": { "agent": "?addressee", "theme": "?goods" } }
					}
				}]
			}
		},

		// A serious threat is a threat
		{
			"<--": {
				"isThreat": { "speaker": "?speaker", "addressee": "?addressee", "action": "?action" },
				"and": [{ "isSeriousThreat": { "speaker": "?speaker", "addressee": "?addressee", "threat": "?action" } }]
			}
		},
		// other types of threat could be listed here

		// preconditionsForGiving is used in both the gives and the surrenders actions
		{
			"<--": {
				"preconditionsForGiving": { "donor": "?donor", "theme": "?theme", "recipient": "?recipient" },
				"and": [{ "is": { "performer": "?donor", "role": "character" } },
				{ "is": { "performer": "?recipient", "role": "character" } },
				{ "possesses": { "owner": "?donor", "possession": "?theme" } },
				{ "carries": { "agent": "?donor", "theme": "?theme" } },
				{
					"not": {
						"same": {
							"entity1": "?donor",
							"entity2": "?recipient"
						}
					}
				}]
			}
		},


		// Commitments are usually made on a case-by-case basis, but two characters who are declared friends
		// can be assumed to have committed to do anything for one another (not *to* one another).  This
		// declaration needs to distinguish between commitments made as potential promises and commitments
		// made as actual or implied threats.
		{
			"<--": {
				"commits": { "speaker": "?friend1", "addressee": "?friend2", "message": "?message" },
				"and": [{ "friends": { "friend1": "?friend1", "friend2": "?friend2" } },
				{ "not": { "isThreat": { "speaker": "?friend1", "addressee": "?friend2", "action": "?message" } } }]
			}
		},

		// rules of family relations

		// ancestorOf
		//
		// One's parent is one's ancestor
		{
			"<--": {
				"ancestor": { "ancestor": "?parent", "descendant": "?child" },
				"and": [{ "parent": { "parent": "?parent", "child": "?child" } }]
			}
		},
		// If ?a is the ancestor of one's parent, ?a is one's ancestor too.
		{
			"<--": {
				"ancestor": { "ancestor": "?a", "descendant": "?child" },
				"and": [{ "parent": { "parent": "?parent", "child": "?child" } },
				{ "ancestor": { "ancestor": "?a", "descendant": "?parent" } }]
			}
		},


		// family
		//
		// family(x,y) if siblings(x,y)
		{
			"<--": {
				"family": { "person1": "?person1", "person2": "?person2" },
				"and": [{ "siblings": { "person1": "?person1", "person2": "?person2" } }]
			}
		},
		// family(x,y) if ancestor(x,y)
		{
			"<--": {
				"family": { "person1": "?person1", "person2": "?person2" },
				"and": [{ "ancestor": { "ancestor": "?person1", "descendant": "?person2" } }]
			}
		},
		// family(x,y) if ancestor(y,x)
		{
			"<--": {
				"family": { "person1": "?person1", "person2": "?person2" },
				"and": [{ "ancestor": { "ancestor": "?person2", "descendant": "?person1" } }]
			}
		},
	];


////
//// Methods
////
const spinnerMethods =
	[

		//
		// dprox
		//
		// dprox / if the character and the objective are known to be in the same place, do nothing
		{
			"method": {
				"description": "stay in current position",
				"task": { "dprox": { "character": "?character", "objective": "?objective", "place": "?place" } },
				"preconditions": [{ "positioned": { "theme": "?character", "goal": "?place" } },
				{ "positioned": { "theme": "?objective", "goal": "?place" } }],
				"subtasks": []
			}
		},
		// dprox / move between two places in the world
		{
			"method": {
				"description": "move from one place to a known destination",
				"task": { "dprox": { "character": "?character", "objective": "?objective", "place": "?place" } },
				"preconditions": [
					{ "positioned": { "theme": "?character", "goal": "?start" } },
					{ "positioned": { "theme": "?objective", "goal": "?place" } },
					{ "not": { "same": { "entity1": "?start", "entity2": "?place" } } },
					{
						"believes": {
							"cognizer": "?character",
							"topic": { "positioned": { "theme": "?character", "goal": "?start" } }
						}
					},
					{
						"believes": {
							"cognizer": "?character",
							"topic": { "positioned": { "theme": "?objective", "goal": "?place" } }
						}
					},
					//{"print": [{"dprox": {"character": "?character", "objective": "?objective", "place": "?place"}}]}
				],
				"subtasks": { "ordered": [{ "moves": { "character": "?character", "source": "?start", "goal": "?place" } }] }
			}
		},
		// dprox / move between two places in the world
		{
			"method": {
				"description": "move from one place to a potentially unknown destination",
				"task": { "dprox": { "character": "?character", "objective": "?objective", "place": "?place" } },
				"preconditions": [{ "positioned": { "theme": "?character", "goal": "?start" } },
				{ "positioned": { "theme": "?objective", "goal": "?place" } },
				{ "not": { "same": { "entity1": "?start", "entity2": "?place" } } },
				{
					"believes": {
						"cognizer": "?character",
						"topic": { "positioned": { "theme": "?character", "goal": "?start" } }
					}
				},
					//{"print": [{"dprox": {"character": "?character", "objective": "?objective", "place": "?place"}}]}
				],
				"subtasks": {
					"ordered": [{
						"dknow": {
							"character": "?character",
							"query": { "positioned": { "theme": "?objective", "goal": "?place" } }
						}
					},
					{ "moves": { "character": "?character", "source": "?currentPosition", "goal": "?place" } }]
				}
			}
		},


		//
		// dknow
		//
		// dknow / base case / the character already knows the answer
		{
			"method": {
				"description": "find the answer to a question",
				"task": { "dknow": { "character": "?character", "query": "?query" } },
				"preconditions": [{ "is": { "performer": "?character", "role": "character" } },
				{ "believes": { "cognizer": "?character", "topic": "?query" } },
					//                                 {"print": ["?character"," knows ","?query"]}
				],
				"subtasks": []
			}
		},
		// dknow / ask a knowledgable friend
		{
			"method": {
				"description": "find the answer to a question",
				"task": { "dknow": { "character": "?character", "query": "?query" } },
				"preconditions": [{ "not": { "believes": { "cognizer": "?character", "topic": "?query" } } },
				{ "friends": { "friend1": "?character", "friend2": "?friend" } },
				{ "believes": { "cognizer": "?friend", "topic": "?query" } },
				{ "positioned": { "theme": "?character", "goal": "?start" } },
				{ "positioned": { "theme": "?friend", "goal": "?place" } },
					//{"print": ["?character"," to ask a friend ","?friend"," this query ","?query"]}
				],
				"subtasks": {
					"ordered": [{
						"dprox": {
							"character": "?character",
							"objective": "?friend",
							"place": "?place"
						}
					},
					{
						"tells": {
							"speaker": "?character",
							"addressee": "?friend",
							"message": {
								"desires": {
									"experiencer": "?character",
									"theme": "?query"
								}
							}
						}
					},
					{ "tells": { "speaker": "?friend", "addressee": "?character", "message": "?query" } }]
				}
			}
		},
		// dknow / persuade someone to answer the question: the persuaded someone will need something in return
		{
			"method": {
				"description": "find the answer to a question",
				"task": { "dknow": { "character": "?character", "query": "?query" } },
				"preconditions": [{ "not": { "believes": { "cognizer": "?character", "topic": "?query" } } },
				{ "believes": { "cognizer": "?someone", "topic": "?query" } },
				{ "not": { "same": { "entity1": "?someone", "entity2": "?character" } } },
				{ "not": { "friends": { "friend1": "?character", "friend2": "?someone" } } },
					//{"print": ["?character"," to persuade ","?someone"," to tell them ","?query"]}
				],
				"subtasks": { "unordered": [{ "persuades": { "persuader": "?character", "persuadee": "?someone", "query": "?query" } }] }
			}
		},

		//
		// dcont
		//
		// dcont / base case / character already owns the desired thing
		{
			"method": {
				"description": "acquisition of something",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "is": { "performer": "?character", "role": "character" } },
				{ "possesses": { "owner": "?character", "possession": "?desire" } },
					// {"print": [{"dcont": {"character": "?character", "desire": "?desire"}}]}
				],
				"subtasks": []
			}
		},
		// dcont / find / the character does not know where the desired thing is, but it happens to be where they are
		{
			"method": {
				"description": "acquisition of something",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "positioned": { "theme": "?character", "goal": "?place" } },
				{ "positioned": { "theme": "?desire", "goal": "?place" } },
					// {"print": [{"dcont": {"character": "?character", "desire": "?desire"}}]}
				],
				"subtasks": { "ordered": [{ "takes": { "agent": "?character", "theme": "?desire", "source": "?place" } }] }
			}
		},
		// dcont / base case / character knows where the desired thing can be found / go there and take it
		{
			"method": {
				"description": "acquisition of something",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{
					"believes": {
						"cognizer": "?character",
						"topic": {
							"positioned": {
								"theme": "?desire",
								"goal": "?place"
							}
						}
					}
				},
					// {"print": [{"dcont": {"character": "?character", "desire": "?desire"}}]}
				],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?desire", "place": "?place" } },
					{ "takes": { "agent": "?character", "theme": "?desire", "source": "?place" } }]
				}
			}
		},

		// dcont / base case / character knows who owns the desired thing /
		// request that the owner give it to the character
		{
			"method": {
				"description": "acquisition of something via a gift",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "ownerIsKnown": { "cognizer": "?character", "owner": "?owner", "object": "?desire" } },
					// {"print": [{"dcont": {"character": "?character", "desire": "?desire"}}]}
				],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?owner", "place": "?place" } },
					{
						"requests": {
							"speaker": "?character",
							"addressee": "?owner",
							"message": {
								"gives": {
									"donor": "?owner",
									"theme": "?desire",
									"recipient": "?character"
								}
							}
						}
					},
					{ "gives": { "donor": "?owner", "theme": "?desire", "recipient": "?character" } }]
				}
			}
		},
		// dcont / character knows who owns the desired thing /
		// barter with the owner to get the desired thing
		{
			"method": {
				"description": "acquisition of something through bartering",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "ownerIsKnown": { "cognizer": "?character", "owner": "?owner", "object": "?desire" } },
					//{"print": [{"dcont": {"character": "?character", "desire": "?desire"}}]}
				],
				"subtasks": { "ordered": [{ "barter": { "buyer": "?character", "seller": "?owner", "goods": "?desire" } }] }
			}
		},
		// dcont / steal if owner is not carrying the item
		{
			"method": {
				"description": "acquisition of something through theft",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "positioned": { "theme": "?desire", "goal": "?place" } },
				{
					"believes": {
						"cognizer": "?character",
						"topic": {
							"positioned": {
								"theme": "?desire",
								"goal": "?place"
							}
						}
					}
				},
				{ "dishonest": { "character": "?character" } }],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?desire", "place": "?place" } },
					{
						"steals": {
							"perpetrator": "?character", "goods": "?desire",
							"victim": "?owner", "place": "?place"
						}
					}]
				}
			}
		},
		// dcont / rob if owner is carrying the item
		{
			"method": {
				"description": "acquisition of something through robbery",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "ownerIsKnown": { "cognizer": "?character", "owner": "?owner", "object": "?desire" } },
				{ "carries": { "agent": "?owner", "theme": "?desire" } },
				{ "dishonest": { "character": "?character" } }],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?owner", "place": "?place" } },
					{
						"robs": {
							"perpetrator": "?character", "goods": "?desire", "victim": "?owner",
							"place": "?place"
						}
					}]
				}
			}
		},
		// dcont / threaten / threatening creates a commitment between the speaker and the addressee 
		// that then enables other methods; e.g., an alternative form of "give," namely "surrender" 
		{
			"method": {
				"description": "acquisition of something by threatening",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "ownerIsKnown": { "cognizer": "?character", "owner": "?owner", "object": "?desire" } },
				{ "dominates": { "agent": "?character", "patient": "?owner" } },
				{ "carries": { "agent": "?owner", "theme": "?desire" } },
				{ "is": { "performer": "?character", "role": "bully" } }],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?owner", "place": "?place" } },
					{
						"tells": {
							"speaker": "?character",
							"addressee": "?owner",
							"message": {
								"desires": {
									"experiencer": "?character",
									"theme": {
										"carries": {
											"agent": "?character",
											"theme": "?desire"
										}
									}
								}
							}
						}
					},
					{ "threatens": { "speaker": "?character", "addressee": "?owner", "message": "?message" } },
					{ "surrenders": { "donor": "?owner", "theme": "?desire", "recipient": "?character" } }]
				}
			}
		},

		// dcont / trick
		// Some actions (like singing and racing) require a character to put down what they
		// are carrying.  Tricking entails a request that the character do one of these actions, followed by 
		// stealing what the character had to put down in order to engage in the requested action.
		{
			"method": {
				"description": "acquisition of something by trickery",
				"task": { "dcont": { "character": "?character", "desire": "?desire" } },
				"preconditions": [{ "ownerIsKnown": { "cognizer": "?character", "owner": "?owner", "object": "?desire" } },
				{ "carries": { "agent": "?owner", "theme": "?desire" } },
				{ "positioned": { "theme": "?owner", "goal": "?place" } },
				{ "constantGoal": { "character": "?owner", "goal": "?goal" } },
				// {"print": [{"constantGoal": {"character": "?owner", "goal": "?goal"}}]},
				{ "goalRequiresDropping": { "goal": "?goal" } },
				],
				"subtasks": {
					"ordered": [{ "dprox": { "character": "?character", "objective": "?owner", "place": "?place" } },
					{ "requests": { "speaker": "?character", "addressee": "?owner", "message": "?goal" } },
						"?goal",
					{
						"steals": {
							"perpetrator": "?character", "goods": "?desire",
							"victim": "?owner", "place": "?place"
						}
					}]
				}
			}
		},

		// setUpADeal / incorporates all of the preconditions and subtasks common to bartering and cheating and persuading
		{
			"method": {
				"description": "set up a deal",
				"task": {
					"setUpADeal": {
						"buyer": "?buyer", "seller": "?seller",
						"desireOfSeller": "?desireOfSeller", "desireOfBuyer": "?desireOfBuyer",
						"place": "?place"
					}
				},
				"preconditions": [{ "is": { "performer": "?buyer", "role": "character" } },
				{ "is": { "performer": "?seller", "role": "character" } },
				{ "not": { "same": { "entity1": "?buyer", "entity2": "?seller" } } },
				{ "positioned": { "theme": "?buyer", "goal": "?start" } },
				{ "positioned": { "theme": "?seller", "goal": "?place" } },
					//{"print": [{"setUpADeal": {"buyer": "?buyer", "seller": "?seller",
					//			    "desireOfSeller": "?desireOfSeller", "desireOfBuyer": "?desireOfBuyer",
					//			    "place": "?place"}}]},
				],
				"subtasks": {
					"ordered": [{
						"dprox": {
							"character": "?buyer",
							"objective": "?seller",
							"place": "?place"
						}
					},
					{
						"tells": {
							"speaker": "?buyer",
							"addressee": "?seller",
							"message": {
								"desires": {
									"experiencer": "?buyer",
									"theme": "?desireOfBuyer"
								}
							}
						}
					},
					{
						"tells": {
							"speaker": "?seller",
							"addressee": "?buyer",
							"message": {
								"desires": {
									"experiencer": "?seller",
									"theme": "?desireOfSeller"
								}
							}
						}
					},
					{
						"promises": {
							"speaker": "?buyer",
							"addressee": "?seller",
							"message": "?desireOfSeller"
						}
					},
					{
						"promises": {
							"speaker": "?seller",
							"addressee": "?buyer",
							"message": "?desireOfBuyer"
						}
					},
					]
				}
			}
		},


		// persuade with words
		{
			"method": {
				"description": "persuade someone to tell you something",
				"task": { "persuades": { "persuader": "?persuader", "persuadee": "?persuadee", "query": "?query" } },
				"preconditions": [{ "honest": { "character": "?persuader" } },
				{ "honest": { "character": "?persuadee" } }],
				"subtasks": {
					"ordered": [{
						"setUpADeal": {
							"buyer": "?persuader", "seller": "?persuadee",
							"desireOfBuyer": {
								"believes": {
									"cognizer": "?persuader",
									"topic": "?query"
								}
							},
							"desireOfSeller": {
								"believes": {
									"cognizer": "?persuadee",
									"topic": "?queryOfPersuadee"
								}
							},
							"place": "?place"
						}
					},
					{ "tells": { "speaker": "?persuader", "addressee": "?persuadee", "message": "?queryOfPersuadee" } },
					{ "tells": { "speaker": "?persuadee", "addressee": "?persuader", "message": "?query" } }]
				}
			}
		},

		// persuade with goods
		{
			"method": {
				"description": "persuade someone to tell you something",
				"task": { "persuades": { "persuader": "?persuader", "persuadee": "?persuadee", "query": "?query" } },
				"preconditions": [{ "honest": { "character": "?persuader" } },
				{ "honest": { "character": "?persuadee" } }],
				"subtasks": {
					"ordered": [{
						"setUpADeal": {
							"buyer": "?persuader", "seller": "?persuadee",
							"desireOfBuyer": {
								"believes": {
									"cognizer": "?persuader",
									"topic": "?query"
								}
							},
							"desireOfSeller": {
								"carries": {
									"agent": "?persuadee",
									"theme": "?goodsOfPersuader"
								}
							},
							"place": "?place"
						}
					},
					{ "gives": { "donor": "?persuader", "theme": "?goodsOfPersuader", "recipient": "?persuadee" } },
					{ "tells": { "speaker": "?persuadee", "addressee": "?persuader", "message": "?query" } }]
				}
			}
		},


		// barter
		{
			"method": {
				"description": "barter for an item",
				"task": { "barter": { "buyer": "?buyer", "seller": "?seller", "goods": "?goodsOfSeller" } },
				"preconditions": [{ "honest": { "character": "?buyer" } },
				{ "honest": { "character": "?seller" } },
				{ "carries": { "agent": "?seller", "theme": "?goodsOfSeller" } },
				{ "carries": { "agent": "?buyer", "theme": "?goodsOfBuyer" } },
				{
					"same": {
						"entity1": "?desireOfBuyer",
						"entity2": { "carries": { "agent": "?buyer", "theme": "?goodsOfSeller" } }
					}
				},
				{
					"same": {
						"entity1": "?desireOfSeller",
						"entity2": { "carries": { "agent": "?seller", "theme": "?goodsOfBuyer" } }
					}
				},
				{ "not": { "same": { "entity1": "?desireOfBuyer", "entity2": "?desireOfSeller" } } },
				{ "constantGoal": { "character": "?buyer", "goal": "?desireOfBuyer" } },
				{ "constantGoal": { "character": "?seller", "goal": "?desireOfSeller" } },
					//{"print": [{"barter": {"buyer": "?buyer", "seller": "?seller", "goods": "?goodsOfSeller"}}]},
				],
				"subtasks": {
					"ordered": [{
						"setUpADeal": {
							"buyer": "?buyer", "seller": "?seller",
							"desireOfBuyer": "?desireOfBuyer",
							"desireOfSeller": "?desireOfSeller",
							"place": "?place"
						}
					},
					{ "gives": { "donor": "?buyer", "theme": "?goodsOfBuyer", "recipient": "?seller" } },
					{ "gives": { "donor": "?seller", "theme": "?goodsOfSeller", "recipient": "?buyer" } }]
				}
			}
		},

		//
		// cheat
		//
		// cheat / the ?buyer cheats the ?seller by not fulfilling their promise to the ?seller
		// instead of fulfilling the promise, the ?buyer tells the ?seller to get lost.
		{
			"method": {
				"description": "cheat the seller out of the goods by making a false promise",
				"task": { "cheat": { "buyer": "?buyer", "seller": "?seller", "goods": "?goodsOfSeller" } },
				"preconditions": [{ "dishonest": { "character": "?buyer" } }],
				"subtasks": {
					"ordered": [{
						"setUpADeal": {
							"buyer": "?buyer", "seller": "?seller",
							"desireOfBuyer": { "carries": { "agent": "?buyer", "theme": "?goodsOfSeller" } },
							"desireOfSeller": { "carries": { "agent": "?seller", "theme": "?goodsOfBuyer" } },
							"place": "?place"
						}
					},
					{ "gives": { "donor": "?seller", "theme": "?goodsOfSeller", "recipient": "?buyer" } },
					{
						"tells": {
							"speaker": "?buyer",
							"addressee": "?seller",
							"message": {
								"dprox": {
									"character": "?seller",
									"object": "?seller",
									"place": "lost"
								}
							}
						}
					}]
				}
			}
		},

		//
		// moves
		//
		// moves / character already in position
		{
			"method": {
				"description": "no movement is necessary if the character is already in position",
				"task": { "moves": { "character": "?character", "source": "?source", "goal": "?source" } },
				"preconditions": [{ "isReadyToMove": { "character": "?character", "source": "?source", "goal": "?source" } },
					// {"print": [{"stays": {"character": "?character", "source": "?source", "goal": "?source"}}]}
				],
				"subtasks": []
			}
		},
		// moves / walk from ?source to ?goal
		{
			"method": {
				"description": "walk from one place to another",
				"task": { "moves": { "character": "?character", "source": "?source", "goal": "?goal" } },
				"preconditions": [{ "isReadyToMove": { "character": "?character", "source": "?source", "goal": "?goal" } },
				{ "not": { "same": { "entity1": "?source", "entity2": "?goal" } } },
					// {"print": [{"moves/walks": {"character": "?character", "source": "?source", "goal": "?goal"}}]}
				],
				"subtasks": { "ordered": [{ "walks": { "self_mover": "?character", "source": "?source", "goal": "?goal" } }] }
			}
		},
		// moves / run from ?source to ?goal
		{
			"method": {
				"description": "run from one place to another",
				"task": { "moves": { "character": "?character", "source": "?source", "goal": "?goal" } },
				"preconditions": [{ "isReadyToMove": { "character": "?character", "source": "?source", "goal": "?goal" } },
				{ "not": { "same": { "entity1": "?source", "entity2": "?goal" } } },
					// {"print": [{"moves/runs": {"character": "?character", "source": "?source", "goal": "?goal"}}]}
				],
				"subtasks": { "ordered": [{ "runs": { "self_mover": "?character", "source": "?source", "goal": "?goal" } }] }
			}
		},
		// moves / fly from ?source to ?goal
		{
			"method": {
				"description": "fly from one place to another",
				"task": { "moves": { "character": "?character", "source": "?source", "goal": "?goal" } },
				"preconditions": [{ "isReadyToMove": { "character": "?character", "source": "?source", "goal": "?goal" } },
				{ "not": { "same": { "entity1": "?source", "entity2": "?goal" } } },
					// {"print": [{"moves/flies": {"character": "?character", "source": "?source", "goal": "?goal"}}]}
				],
				"subtasks": { "ordered": [{ "flies": { "self_mover": "?character", "source": "?source", "goal": "?goal" } }] }
			}
		},

		//
		// races 
		//
		// races / the ?character is carrying something 
		// drop what is being carried and move from ?source to ?goal
		{
			"method": {
				"description": "race from one place to another",
				"task": { "races": { "self_mover": "?character", "source": "?source", "goal": "?goal" } },
				"preconditions": [{ "carries": { "agent": "?character", "theme": "?thing" } },
				{ "positioned": { "theme": "?character", "goal": "?source" } },
				{ "is": { "performer": "?goal", "role": "place" } },
				{ "not": { "same": { "entity1": "?source", "entity2": "?goal" } } }],
				"subtasks": {
					"ordered": [{ "drops": { "agent": "?character", "theme": "?thing" } },
					{ "moves": { "character": "?character", "source": "?source", "goal": "?goal" } }]
				}
			}
		},
		// races / the ?character is not carrying anything
		{
			"method": {
				"description": "race from one place to another",
				"task": { "races": { "self_mover": "?character", "source": "?source", "goal": "?goal" } },
				"preconditions": [{ "not": { "carries": { "agent": "?character", "theme": "?thing" } } },
				{ "positioned": { "theme": "?character", "goal": "?source" } },
				{ "is": { "performer": "?goal", "role": "place" } },
				{ "not": { "same": { "entity1": "?source", "entity2": "?goal" } } }],
				// {"print": [{"races/nothing dropped": {"self_mover": "?character", "source": "?source", "goal": "?goal"}}]}
				"subtasks": { "ordered": [{ "moves": { "character": "?character", "source": "?source", "goal": "?goal" } }] }
			}
		},


		//
		// tells
		//
		{
			"method": {
				"description": "tell someone something",
				"task": { "tells": { "speaker": "?speaker", "addressee": "?addressee", "message": "?message" } },
				"preconditions": [],
				//"preconditions": [{"print": [{"tells": {"speaker": "?speaker", "addressee": "?addressee", "message": "?message"}}]}],
				"subtasks": {
					"ordered": [{
						"informs": {
							"informer": "?speaker",
							"addressee": "?addressee",
							"message": "?message"
						}
					}]
				}
			}
		},

		//
		// sings 
		//
		// sings / singer is not carrying anything
		{
			"method": {
				"description": "sing someone something",
				"task": { "sings": { "singer": "?singer", "addressee": "?addressee", "message": "?message" } },
				"preconditions": [{ "not": { "carries": { "agent": "?singer", "theme": "?thing" } } }],
				"subtasks": { "ordered": [{ "informs": { "informer": "?singer", "addressee": "?addressee", "message": "?message" } }] }
			}
		},
		// sings / singer is carrying something and so must drop it first.
		{
			"method": {
				"description": "sing someone something",
				"task": { "sings": { "singer": "?singer", "addressee": "?addressee", "message": "?message" } },
				"preconditions": [{ "carries": { "agent": "?singer", "theme": "?thing" } }],
				"subtasks": {
					"ordered": [{ "drops": { "agent": "?singer", "theme": "?thing" } },
					{ "informs": { "informer": "?singer", "addressee": "?addressee", "message": "?message" } }]
				}
			}
		},
	];


////
//// Actions
////
const spinnerActions =
	[

		// takes
		{
			"action": {
				"description": "take something from a known location if it is not possessed by anyone",
				"task": { "takes": { "agent": "?agent", "theme": "?theme", "source": "?source" } },
				"preconditions": [{ "not": { "possesses": { "owner": "?owner", "possession": "?theme" } } }],
				"additions": [{ "carries": { "agent": "?agent", "theme": "?theme" } },
				{ "possesses": { "owner": "?agent", "possession": "?theme" } }],
				"deletions": [{ "positioned": { "theme": "?theme", "goal": "?source" } },
				{
					"believes": {
						"cognizer": "?agent",
						"topic": {
							"positioned": {
								"theme": "?theme",
								"goal": "?source"
							}
						}
					}
				}]
			}
		},


		// requests
		{
			"action": {
				"description": "request that something be done",
				"task": { "requests": { "speaker": "?speaker", "addressee": "?addressee", "message": "?event" } },
				"preconditions": [{ "is": { "performer": "?speaker", "role": "character" } },
				{ "is": { "performer": "?addressee", "role": "character" } },
				{
					"not": {
						"same": {
							"entity1": "?speaker",
							"entity2": "?addressee"
						}
					}
				}],
				"additions": [{
					"believes": {
						"cognizer": "?addressee",
						"topic": {
							"desires": {
								"experiencer": "?speaker",
								"theme": "?event"
							}
						}
					}
				}],
				"deletions": []
			}
		},


		//
		// gives
		//
		// gives /  the ?donor is fulfilling a previous commitment made to the ?recipient
		{
			"action": {
				"description": "give someone something to fulfill a previous commitment",
				"task": { "gives": { "donor": "?donor", "theme": "?theme", "recipient": "?recipient" } },
				"preconditions": [{
					"preconditionsForGiving": {
						"donor": "?donor",
						"theme": "?theme",
						"recipient": "?recipient"
					}
				},
				{ "not": { "dominates": { "agent": "?recipient", "patient": "?donor" } } },
				{
					"commits": {
						"speaker": "?donor",
						"addressee": "?recipient",
						"message": { "carries": { "agent": "?recipient", "theme": "?theme" } }
					}
				}],
				"additions": [{ "possesses": { "owner": "?recipient", "possession": "?theme" } },
				{ "carries": { "agent": "?recipient", "theme": "?theme" } }],
				"deletions": [{ "possesses": { "owner": "?donor", "possession": "?theme" } },
				{ "carries": { "agent": "?donor", "theme": "?theme" } },
				{
					"commits": {
						"speaker": "?donor",
						"addressee": "?recipient",
						"message": {
							"gives": {
								"donor": "?donor",
								"theme": "?theme",
								"recipient": "?recipient"
							}
						}
					}
				}]
			}
		},

		// surrender /  give the ?recipient the ?theme because the ?recipient dominates the ?donor
		// and the the ?recipient has threatened the ?donor; the commitment is not discharged
		// since the commitment is a threat that is not carried out by the recipient
		{
			"action": {
				"description": "surrender something to someone because of coercion",
				"task": { "surrenders": { "donor": "?donor", "theme": "?theme", "recipient": "?recipient" } },
				"preconditions": [{
					"preconditionsForGiving": {
						"donor": "?donor",
						"theme": "?theme",
						"recipient": "?recipient"
					}
				},
				{
					"believes": {
						"cognizer": "?donor",
						"topic": {
							"desires": {
								"experiencer": "?recipient",
								"theme": {
									"carries": {
										"agent": "?recipient",
										"theme": "?theme"
									}
								}
							}
						}
					}
				},
				{ "dominates": { "agent": "?recipient", "patient": "?donor" } },
				{
					"commits": {
						"speaker": "?recipient", "addressee": "?donor",
						"message": "?threat"
					}
				},
				{
					"isSeriousThreat": {
						"speaker": "?recipient",
						"addressee": "?donor",
						"threat": "?threat"
					}
				}],
				"additions": [{ "carries": { "agent": "?recipient", "theme": "?theme" } }],
				"deletions": [{ "carries": { "agent": "?donor", "theme": "?theme" } }]
			}
		},

		//
		// informs
		//
		// informs / ?informer is fulfilling a commitment made to the ?addressee
		{
			"action": {
				"description": "inform someone of something",
				"task": { "informs": { "informer": "?informer", "addressee": "?addressee", "message": "?message" } },
				"preconditions": [{ "is": { "performer": "?informer", "role": "character" } },
				{ "is": { "performer": "?addressee", "role": "character" } },
				{ "commits": { "informer": "?informer", "addressee": "?addressee", "message": "?message" } }],
				"additions": [{ "believes": { "cognizer": "?addressee", "topic": "?message" } }],
				"deletions": [{ "commits": { "speaker": "?informer", "addressee": "?addressee", "message": "?message" } }]
			}
		},
		// informs / ?informer is telling ?addressee the ?message without discharging a commitment
		{
			"action": {
				"description": "inform someone of something",
				"task": { "informs": { "informer": "?informer", "addressee": "?addressee", "message": "?message" } },
				"preconditions": [{ "is": { "performer": "?informer", "role": "character" } },
				{ "is": { "performer": "?addressee", "role": "character" } }],
				"additions": [{ "believes": { "cognizer": "?addressee", "topic": "?message" } }],
				"deletions": []
			}
		},


		// promises
		// ?speaker is making a commitment to do something *for* the ?addressee
		{
			"action": {
				"description": "promise to do something",
				"task": { "promises": { "speaker": "?speaker", "addressee": "?addressee", "message": "?event" } },
				"preconditions": [{ "not": { "isThreat": { "speaker": "?speaker", "addressee": "?addressee", "action": "?event" } } },
					// {"print": [{"promises": {"speaker": "?speaker", "addressee": "?addressee", "message": "?event"}}]}
				],
				"additions": [{ "commits": { "speaker": "?speaker", "addressee": "?addressee", "message": "?event" } }],
				"deletions": []
			}
		},


		// threatens
		// ?speaker is making a commitment to do something *to* the ?addressee
		{
			"action": {
				"description": "threaten to do something",
				"task": { "threatens": { "speaker": "?speaker", "addressee": "?addressee", "message": "?event" } },
				"preconditions": [{ "isThreat": { "speaker": "?speaker", "addressee": "?addressee", "action": "?event" } },
					// {"print": [{"threatens": {"speaker": "?speaker", "addressee": "?addressee", "message": "?event"}}]}
				],
				"additions": [{ "commits": { "speaker": "?speaker", "addressee": "?addressee", "message": "?event" } }],
				"deletions": []
			}
		},

		// robs
		{
			"action": {
				"description": "rob something from someone at some place",
				"task": {
					"robs": {
						"perpetrator": "?perpetrator", "goods": "?goods",
						"victim": "?victim", "place": "?place"
					}
				},
				"preconditions": [{ "is": { "performer": "?perpetrator", "role": "character" } },
				{ "is": { "performer": "?victim", "role": "character" } },
				{ "carries": { "agent": "?victim", "theme": "?goods" } },
				{ "possesses": { "owner": "?victim", "possession": "?goods" } },
				{ "positioned": { "theme": "?perpetrator", "goal": "?place" } },
				{ "positioned": { "theme": "?victim", "goal": "?place" } },
				{ "dominates": { "agent": "?perpetrator", "patient": "?victim" } },
				{ "dishonest": { "character": "?perpetrator" } }],
				"additions": [{ "carries": { "agent": "?perpetrator", "theme": "?goods" } }],
				"deletions": [{ "carries": { "agent": "?victim", "theme": "?goods" } }]
			}
		},


		// steals 
		// the difference between robbing and stealing is that, one can steal only if the
		// character who possesss the object is not currently carrying that object; and,
		// to rob one must dominate the victim.
		{
			"action": {
				"description": "steal something from someone at some place",
				"task": {
					"steals": {
						"perpetrator": "?perpetrator", "goods": "?goods",
						"victim": "?victim", "place": "?place"
					}
				},
				"preconditions": [{ "is": { "performer": "?perpetrator", "role": "character" } },
				{ "is": { "performer": "?victim", "role": "character" } },
				{ "not": { "carries": { "agent": "?victim", "theme": "?goods" } } },
				{ "possesses": { "owner": "?victim", "possession": "?goods" } },
				{ "positioned": { "theme": "?perpetrator", "goal": "?place" } },
				{ "positioned": { "theme": "?goods", "goal": "?place" } },
				{ "dishonest": { "character": "?perpetrator" } },
					// {"print": [{"steals": {"perpetrator": "?perpetrator", "goods": "?goods", 
					//   		           "victim": "?victim", "place": "?place"}}]}
				],
				"additions": [{ "carries": { "agent": "?perpetrator", "theme": "?goods" } }],
				"deletions": [{ "positioned": { "theme": "?goods", "goal": "?place" } },
				{
					"believes": {
						"cognizer": "?perpetrator",
						"topic": {
							"positioned": {
								"theme": "?goods",
								"goal": "?place"
							}
						}
					}
				}]
			}
		},

		// 
		// kills
		//
		// kills /  killer kills a victim, the victim is then dead
		{
			"action": {
				"description": "killer kills a victim",
				"task": { "kills": { "killer": "?killer", "victim": "?victim" } },
				"preconditions": [{ "is": { "performer": "?victim", "role": "character" } },
				{ "is": { "performer": "?killer", "role": "character" } },
				{ "carries": { "agent": "?victim", "theme": "?thing" } }],
				"additions": [{ "dead": { "agent": "?victim" } }],
				"deletions": [{ "is": { "performer": "?victim", "role": "character" } }]
			}
		},
		// kills / The killer creates a commitment by the family of the victim to kill a member of the 
		// killer's family (like in the Icelandic Sagas).
		{
			"action": {
				"description": "killer kills a victim / Icelandic Sagas version",
				"task": { "kills": { "killer": "?killer", "victim": "?victim" } },
				"preconditions": [{ "is": { "performer": "?victim", "role": "character" } },
				{ "is": { "performer": "?killer", "role": "character" } },
				{ "carries": { "agent": "?victim", "theme": "?thing" } },
				{ "family": { "person1": "?vRelative", "person2": "?victim" } },
				{ "family": { "person1": "?kRelative", "person2": "?killer" } }],
				"additions": [{ "dead": { "agent": "?victim" } },
				{
					"commits": {
						"speaker": "?vRelative",
						"addressee": "?kRelative",
						"message": {
							"kills": {
								"killer": "?vRelative",
								"victim": "?kRelative"
							}
						}
					}
				}],
				"deletions": [{ "is": { "performer": "?victim", "role": "character" } }]
			}
		},

		// drops
		{
			"action": {
				"description": "drop something that is being carried",
				"task": { "drops": { "agent": "?bearer", "theme": "?thing" } },
				"preconditions": [{ "is": { "performer": "?bearer", "role": "character" } },
				{ "is": { "performer": "?place", "role": "place" } },
				{ "positioned": { "theme": "?bearer", "goal": "?place" } },
				{ "carries": { "agent": "?bearer", "theme": "?thing" } }],
				"additions": [{ "positioned": { "theme": "?thing", "goal": "?place" } }],
				"deletions": [{ "carries": { "agent": "?bearer", "theme": "?thing" } }]
			}
		},


		// eats
		{
			"action": {
				"description": "someone eats something",
				"task": { "eats": { "ingestor": "?ingestor", "ingestibles": "?ingestibles" } },
				"preconditions": [{ "is": { "performer": "?ingestor", "role": "character" } },
				{ "is": { "performer": "?ingestibles", "role": "food" } },
				{
					"needs": {
						"cognizer": "?ingestor",
						"requirement": {
							"carries": {
								"agent": "?ingestor",
								"theme": "?ingestibles"
							}
						},
						"dependent": {
							"eats": {
								"ingestor": "?ingestor",
								"ingestibles": "?ingestibles"
							}
						}
					}
				},
				{ "carries": { "agent": "?ingestor", "theme": "?ingestibles" } },
				{ "hungry": { "experiencer": "?ingestor" } }],
				"additions": [],
				"deletions": [{ "is": { "performer": "?ingestibles", "role": "food" } },
				{ "hungry": { "experiencer": "?ingestor" } },
				{ "carries": { "agent": "?ingestor", "theme": "?ingestibles" } }]
			}
		},

		// drinks
		{
			"action": {
				"description": "someone drinks something",
				"task": { "drinks": { "ingestor": "?ingestor", "ingestibles": "?ingestibles" } },
				"preconditions": [{ "is": { "performer": "?ingestor", "role": "character" } },
				{ "is": { "performer": "?ingestibles", "role": "potable" } },
				{
					"needs": {
						"cognizer": "?ingestor",
						"requirement": {
							"carries": {
								"agent": "?ingestor",
								"theme": "?ingestibles"
							}
						},
						"dependent": {
							"drinks": {
								"ingestor": "?ingestor",
								"ingestibles": "?ingestibles"
							}
						}
					}
				},
				{ "carries": { "agent": "?ingestor", "theme": "?ingestibles" } },
				{ "thirsty": { "experiencer": "?ingestor" } }],
				"additions": [],
				"deletions": [{ "is": { "performer": "?ingestibles", "role": "potable" } },
				{ "thirsty": { "experiencer": "?ingestor" } },
				{ "carries": { "agent": "?ingestor", "theme": "?ingestibles" } }]
			}
		},

		// walks / character walks from ?source to ?goal
		// The move method checks all necessary preconditions.
		{
			"action": {
				"description": "walk from one place to another",
				"task": { "walks": { "self_mover": "?self_mover", "source": "?source", "goal": "?goal" } },
				"preconditions": [],
				"additions": [{ "positioned": { "theme": "?self_mover", "goal": "?goal" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?goal"
							}
						}
					}
				}],
				"deletions": [{ "positioned": { "theme": "?self_mover", "goal": "?source" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?source"
							}
						}
					}
				}]
			}
		},

		// flies / character moves from ?source to ?goal
		// The move method checks most of the necessary preconditions.
		{
			"action": {
				"description": "fly from one place to another",
				"task": { "flies": { "self_mover": "?self_mover", "source": "?source", "goal": "?goal" } },
				"preconditions": [{
					"capability": {
						"entity": "?self_mover",
						"event": {
							"flies": {
								"self_mover": "?self_mover",
								"source": "?source",
								"goal": "?goal"
							}
						}
					}
				}],
				"additions": [{ "positioned": { "theme": "?self_mover", "goal": "?goal" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?goal"
							}
						}
					}
				}],
				"deletions": [{ "positioned": { "theme": "?self_mover", "goal": "?source" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?source"
							}
						}
					}
				}]
			}
		},

		// runs / character runs from ?source to ?goal
		// The move method checks all necessary preconditions.
		{
			"action": {
				"description": "run from one place to another",
				"task": { "runs": { "self_mover": "?self_mover", "source": "?source", "goal": "?goal" } },
				"preconditions": [],
				"additions": [{ "positioned": { "theme": "?self_mover", "goal": "?goal" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?goal"
							}
						}
					}
				}],
				"deletions": [{ "positioned": { "theme": "?self_mover", "goal": "?source" } },
				{
					"believes": {
						"cognizer": "?self_mover",
						"topic": {
							"positioned": {
								"theme": "?self_mover",
								"goal": "?source"
							}
						}
					}
				}]
			}
		},

	];


const spinner = spinnerProductionRules.concat(spinnerDeductionRules.concat(spinnerMethods.concat(spinnerActions)));
module.exports = spinner;
