/*
 * mumbler
 * 
 * A simple JSON to English transcoder.  One text template
 * is defined for each rule, method, and action used in 
 * spinner.  The top-level rule in this file is 
 * {"narrate": {"tense": "?tense"}}.  It is called on
 * the output from the shop planner after spinner has
 * been run.
 *
 * Warren Sack <wsack@ucsc.edu>
 * July 2025
 *
 */

const textTemplatesAndRules =
  [
   
   ////
   //// Text templates
   ////

   {"positioned": 
    {"theme": "?theme", "goal": "?goal",
     "past": {"list": ["?theme","was at the","?goal"]},
     "present": {"list": ["?theme","is at the","?goal"]},
     "infinitive": {"list": ["?theme","to be at the","?goal"]},
     "interrogative": {"list": ["is","?theme","at the","?goal"]}}},

   {"believes": 
    {"cognizer": "?cognizer", "topic": "?topic",
     "past": {"list": ["?cognizer","believed that",{"past": {"assertion": "?topic"}}]},
     "present": {"list": ["?cognizer","believes that",{"present": {"assertion": "?topic"}}]},
     "infinitive": {"list": ["?cognizer","to believe that",{"present": {"assertion": "?topic"}}]},
     "interrogative": {"list": ["will","?cognizer","believe that", {"present": {"assertion": "?topic"}}]}}},

   {"carries": 
    {"agent": "?agent", "theme": "?theme",
     "past": {"list": ["?agent","carried the","?theme"]},
     "present": {"list": ["?agent","carries the","?theme"]},
     "infinitive": {"list": ["?agent","to carry the","?theme"]},
     "interrogative": {"list": ["will","?agent","carry the","?theme"]}}},

   {"desires": 
    {"experiencer": "?experiencer", "theme": "?theme",
     "past": {"list": ["?experiencer","desired",{"infinitive": {"assertion": "?theme"}}]},
     "present": {"list": ["?experiencer","desires",{"infinitive": {"assertion": "?theme"}}]},
     "infinitive": {"list": ["?experiencer","to desire",{"infinitive": {"assertion": "?theme"}}]},
     "interrogative": {"list": ["will","?experiencer","desire",{"infinitive": {"assertion": "?theme"}}]}}},

   {"tells": 
    {"speaker": "?speaker", "addressee": "?addressee", "message": "?message",
     "past": {"list": ["?speaker","told","?addressee",{"past": {"assertion": "?message"}}]},
     "present": {"list": ["?speaker","tells","?addressee",{"present": {"assertion": "?message"}}]},
     "infinitive": {"list": ["?speaker","to tell","?addressee",{"present": {"assertion": "?message"}}]},
     "interrogative": {"list": ["will","?speaker","tell","?addressee",{"present": {"assertion": "?message"}}]}}},

   {"commits": 
    {"speaker": "?speaker", "addressee": "?addressee", "message": "?message",
     "past": {"list": ["?speaker","made a commitment to","?addressee",
		       "that",{"present": {"assertion": "?message"}}]},
     "present": {"list": ["?speaker","makes a commitment to","?addressee",
			  "that",{"present": {"assertion": "?message"}}]},
     "infinitive": {"list": ["?speaker","to make a commitment to","?addressee",
			     "that",{"present": {"assertion": "?message"}}]},
     "interrogative": {"list": ["will","?speaker","make a commitment to","?addressee",
				"that",{"present": {"assertion": "?message"}}]}}},

   {"is": 
    {"performer": "?performer", "role": "?role",
     "past": {"list": ["?performer","was a","?role"]},
     "present": {"list": ["?performer","is a","?role"]},
     "infinitive": {"list": ["?performer","to be a","?role"]},
     "interrogative": {"list": ["is","?performer","a","?role"]}}},

   {"family": 
    {"person1": "?person1", "person2": "?person2",
     "past": {"list": ["?person1","and", "?person2","were members of the same family"]},
     "present": {"list": ["?person1","and", "?person2","are members of the same family"]},
     "infinitive": {"list": ["?person1","and", "?person2","to be members of the same family"]},
     "interrogative": {"list": ["will","?person1","and", "?person2","be members of the same family"]}}},

   {"possesses": 
    {"owner": "?owner", "possession": "?possession",
     "past": {"list": ["?owner","owned the","?possession"]},
     "present": {"list": ["?owner","owns the","?possession"]},
     "infinitive": {"list": ["?owner","to own the","?possession"]},
     "interrogative": {"list": ["will","?owner","own the","?possession"]}}},

   {"capability": 
    {"entity": "?entity", "event": "?event",
     "past": {"list": ["it was within the capabilities of","?entity",
		       "for",{"infinitive": {"assertion": "?event"}}]},
     "present": {"list": ["it is within the capabilities of","?entity",
			  "for",{"infinitive": {"assertion": "?event"}}]},
     "infinitive": {"list": ["to be within the capabilities of","?entity",
			     "for",{"infinitive": {"assertion": "?event"}}]},
     "interrogative": {"list": ["is it within the capabilities of","?entity",
				"for",{"infinitive": {"assertion": "?event"}}]}}},

    {"friends": 
     {"friend1": "?friend1", "friend2": "?friend2",
      "past": {"list": ["?friend1","and","?friend2","were friends"]},
      "present": {"list": ["?friend1","and","?friend2","are friends"]},
      "infinitive": {"list": ["?friend1","and","?friend2","to be friends"]},
      "interrogative": {"list": ["are","?friend1","and","?friend2","friends"]}}},

   {"hungry": 
    {"experiencer": "?experiencer",
     "past": {"list": ["?experiencer","was hungry"]},
     "present": {"list": ["?experiencer","is hungry"]},
     "infinitive": {"list": ["?experiencer","to be hungry"]},
     "interrogative": {"list": ["is","?experiencer","hungry"]}}},

    {"thirsty": 
     {"experiencer": "?experiencer",
      "past": {"list": ["?experiencer","was thirsty"]},
      "present": {"list": ["?experiencer","is thirsty"]},
      "infinitive": {"list": ["?experiencer","to be thirsty"]},
      "interrogative": {"list": ["is","?experiencer","thirsty"]}}},

   {"dead": 
     {"experiencer": "?experiencer",
      "past": {"list": ["?experiencer","was dead"]},
      "present": {"list": ["?experiencer","is dead"]},
      "infinitive": {"list": ["?experiencer","to be dead"]},
      "interrogative": {"list": ["is","?experiencer","dead"]}}},

   {"dishonest": 
    {"character": "?character",
     "past": {"list": ["?character","was dishonest"]},
     "present": {"list": ["?character","is dishonest"]},
     "infinitive": {"list": ["?character","to be dishonest"]},
     "interrogative": {"list": ["is","?character","dishonest"]}}},

   {"honest": 
    {"character": "?character",
     "past": {"list": ["?character","was honest"]},
     "present": {"list": ["?character","is honest"]},
     "infinitive": {"list": ["?character","to be honest"]},
     "interrogative": {"list": ["is","?character","honest"]}}},

   {"truthful": 
    {"character": "?character",
     "past": {"list": ["?character","was truthful"]},
     "present": {"list": ["?character","is truthful"]},
     "infinitive": {"list": ["?character","to be truthful"]},
     "interrogative": {"list": ["is","?character","truthful"]}}},

    {"dominates":
     {"agent": "?agent", "patient": "?patient",
      "past": {"list": ["?agent","dominated","?patient"]},
      "present": {"list": ["?agent","dominates","?patient"]},
      "infinitive": {"list": ["?agent","to dominate","?patient"]},
      "interrogative": {"list": ["will","?agent","dominate","?patient"]}}},

   {"likes": 
    {"agent": "?agent", "patient": "?patient",
     "past": {"list": ["?agent","liked","?patient"]},
     "present": {"list": ["?agent","likes","?patient"]},
     "infinitive": {"list": ["?agent","to like","?patient"]},
     "interrogative": {"list": ["will","?agent","like","?patient"]}}},

   {"needs": 
    {"cognizer": "?cognizer", "requirement": "?requirement",
     "dependent": "?dependent",
     "past": {"list": ["?cognizer","needed",{"infinitive": {"assertion": "?requirement"}},
		       "so that it would be possible for",{"infinitive": {"assertion": "?dependent"}}]},
     "present": {"list": ["?cognizer","needs",{"infinitive": {"assertion": "?requirement"}},
			  "so that it would be possible for",{"infinitive": {"assertion": "?dependent"}}]},
     "infinitive": {"list": ["?cognizer","to need",{"infinitive": {"assertion": "?requirement"}},
			     "so that it will be possible for",{"infinitive": {"assertion": "?dependent"}}]},
     "interrogative": {"list": ["will","?cognizer","need",{"infinitive": {"assertion": "?requirement"}},
				"so that it will be possible for",{"infinitive": {"assertion": "?dependent"}}]}}},

   {"brotherOf": 
    {"person": "?person",
     "past": {"list": ["was the brother of","?person"]},
     "present": {"list": ["is the brother of","?person"]},
     "infinitive": {"list": ["to be the brother of","?person"]},
     "interrogative": {"list": ["is","?person","the brother"]}}},

   {"sisterOf": 
    {"person": "?person",
     "past": {"list": ["was the sister of","?person"]},
     "present": {"list": ["is the sister of","?person"]},
     "infinitive": {"list": ["to be the sister of","?person"]},
     "interrogative": {"list": ["is","?person","the sister"]}}},

   {"fatherOf": 
    {"person": "?person",
     "past": {"list": ["was the father of","?person"]},
     "present": {"list": ["is the father of","?person"]},
     "infinitive": {"list": ["to be the father of","?person"]},
     "interrogative": {"list": ["is","?person","the father"]}}},

   {"motherOf": 
    {"person": "?person",
     "past": {"list": ["was the mother of","?person"]},
     "present": {"list": ["is the mother of","?person"]},
     "infinitive": {"list": ["to be the mother of","?person"]},
     "interrogative": {"list": ["is","?person","the mother"]}}},

    {"siblingOf": 
     {"person": "?person",
      "past": {"list": ["was the sibling of","?person"]},
      "present": {"list": ["is the sibling of","?person"]},
      "infinitive": {"list": ["to be the sibling of","?person"]},
      "interrogative": {"list": ["is","?person","the sibling"]}}},

    {"parentOf": 
     {"person": "?person",
      "past": {"list": ["was the parent of","?person"]},
      "present": {"list": ["is the parent of","?person"]},
      "infinitive": {"list": ["to be the parent of","?person"]},
      "interrogative": {"list": ["is","?person","the parent"]}}},

   {"constantGoal": 
    {"character": "?character", "goal": "?goal",
     "past": {"list": ["?character","always needed for",{"infinitive": {"assertion": "?goal"}}]},
     "present": {"list": ["?character","always needs for",{"infinitive": {"assertion": "?goal"}}]},
     "infinitive": {"list": ["?character","to always need for",{"infinitive": {"assertion": "?goal"}}]},
     "interrogative": {"list": ["will","?character",
				"always need for",{"infinitive": {"assertion": "?goal"}}]}}},

   {"isReadyToMove": 
    {"character": "?character", "source": "?source", "goal": "?goal",
     "past": {"list": ["?character","knew the current position (",
		       "?source",") and where to go (","?goal",")"]},
     "present": {"list": ["?character","knows the current position (",
			  "?source",") and where to go (","?goal",")"]},
     "infinitive": {"list": ["?character","to know the current position (",
			     "?source",") and where to go (","?goal",")"]},
     "interrogative": {"list": ["will","?character","know the current position (",
				"?source",") and where to go (","?goal",")"]}}},

   {"ownerIsKnown": 
    {"cognizer": "?cognizer", "owner": "?owner", "object": "?object",
     "past": {"list": ["?cognizer","knew","?owner","possessed the","?object"]},
     "present": {"list": ["?cognizer","knows","?owner","possesses the","?object"]},
     "infinitive": {"list": ["?cognizer","to know","?owner","possesses the","?object"]},
     "interrogative": {"list": ["will","?cognizer","know","?owner","possesses the","?object"]}}},

   {"goalRequiresDropping": 
    {"goal": "?goal",
     "past": {"list": ["everything had to be dropped for", {"infinitive": {"assertion": "?goal"}}]},
     "present": {"list": ["everything has to be dropped for", {"infinitive": {"assertion": "?goal"}}]},
     "infinitive": {"list": ["everything is to be dropped for", {"infinitive": {"assertion": "?goal"}}]},
     "interrogative": {"list": ["will everything be dropped for", {"infinitive": {"assertion": "?goal"}}]}}},

   {"isSeriousThreat": 
    {"speaker": "?speaker", 
     "addressee": "?addressee", 
     "threat": {"kills": {"killer": "?speaker", "victim": "?addressee"}},
     "past": {"list": ["it was a serious threat when","?speaker","threatened to kill","?addressee"]},
     "present": {"list": ["it is a serious threat when","?speaker","threatens to kill","?addressee"]},
     "infinitive": {"list": ["to be a serious threat when","?speaker","threatens to kill","?addressee"]},
     "interrogative": {"list": ["is it a serious threat when","?speaker","threatens to kill","?addressee"]}}},

   {"isSeriousThreat": 
    {"speaker": "?speaker", 
     "addressee": "?addressee", 
     "threat": {"robs": {"perpetrator": "?speaker", "goods": "?goods", 
			 "victim": "?addressee", "place": "?place"}},
     "past": {"list": ["it was a serious threat when","?speaker",
		       "threatened to rob","?addressee","of","?goods"]},
     "present": {"list": ["it is a serious threat when","?speaker",
			  "threatens to rob","?addressee","of","?goods"]},
     "infinitive": {"list": ["to be a serious threat when","?speaker",
			     "threatens to rob","?addressee","of","?goods"]},
     "interrogative": {"list": ["is it a serious threat when","?speaker",
				"threatens to rob","?addressee","of","?goods"]}}},

   {"isThreat": 
    {"speaker": "?speaker", "addressee": "?addressee", "action": "?action",
     "past": {"list": ["it was a threat when","?speaker",
		       "threatened",{"infinitive": {"assertion": "?action"}}]},
     "present": {"list": ["it is a threat when","?speaker",
			  "threatens",{"infinitive": {"assertion": "?action"}}]},
     "infinitive": {"list": ["to be a threat when","?speaker",
			     "threatens",{"infinitive": {"assertion": "?action"}}]},
     "interrogative": {"list": ["is it a threat when","?speaker",
				"threatens",{"infinitive": {"assertion": "?action"}}]}}},

   {"preconditionsForGiving": 
    {"donor": "?donor", "theme": "?theme", "recipient": "?recipient",
     "past": {"list": ["?donor","owned and was carrying the","?theme"]},
     "present": {"list": ["?donor","owns and is carrying the","?theme"]},
     "infinitive": {"list": ["?donor","to own and carry the","?theme"]},
     "interrogative": {"list": ["will","?donor","own and carry the","?theme"]}}},

   {"dprox": 
    {"character": "?character", "objective": "?objective", "place": "?place",
     "past": {"list": ["?character","wanted to go to","?objective"]},
     "present": {"list": ["?character","wants to go to","?objective"]},
     "infinitive": {"list": ["?character","to want to go to","?objective"]},
     "interrogative": {"list": ["will","?character","want to go to","?objective"]}}},

   {"dknow": 
    {"character": "?character", "query": "?query",
     "past": {"list": ["?character","wanted to learn the answer to this",
		       "question:",{"interrogative": {"assertion": "?query"}}]},
     "present": {"list": ["?character","wants to learn the answer to this", 
			  "question:",{"interrogative": {"assertion": "?query"}}]},
     "infinitive": {"list": ["?character","to want to learn the answer to this", 
			     "question:",{"interrogative": {"assertion": "?query"}}]},
     "interrogative": {"list": ["will","?character","want to learn the answer to this", 
				"question:",{"interrogative": {"assertion": "?query"}}]}}},
   {"dcont": 
    {"character": "?character", "desire": "?desire",
     "past": {"list": ["?character","wanted to have the","?desire"]},
     "present": {"list": ["?character","wants to have the","?desire"]},
     "infinitive": {"list": ["?character","to want to have the ","?desire"]},
     "interrogative": {"list": ["will","?character","want to have the","?desire"]}}},

   {"setUpADeal": 
    {"buyer": "?buyer", "seller": "?seller",
     "desireOfSeller": "?desireOfSeller", "desireOfBuyer": "?desireOfBuyer",
     "place": "?place",
     "past": {"list": ["?buyer","and","?seller","set up a deal"]},
     "present": {"list": ["?buyer","and","?seller","are setting up a deal"]},
     "infinitive": {"list": ["?buyer","and","?seller","to set up a deal"]},
     "interrogative": {"list": ["will","?buyer","and","?seller","set up a deal"]}}},

   {"persuades": 
    {"persuader": "?persuader", "persuadee": "?persuadee", "query": "?query",
     "past": {"list": ["?persuader","tried to persuade","?persuadee",
		       "to answer this question:", {"interrogative": {"assertion": "?query"}}]},
     "present": {"list": ["?persuader","tries to persuade","?persuadee",
			  "to answer this question:", {"interrogative": {"assertion": "?query"}}]},
     "infinitive": {"list": ["?persuader","to try to persuade","?persuadee",
			     "to answer this question:", {"interrogative": {"assertion": "?query"}}]},
     "interrogative": {"list": ["will","?persuader","try to persuade","?persuadee",
				"to answer this question:", {"interrogative": {"assertion": "?query"}}]}}},

   {"barter": 
    {"buyer": "?buyer", "seller": "?seller", "goods": "?goodsOfSeller",
     "past": {"list": ["?buyer","wanted to bargain with","?seller","for the","?goodsOfSeller"]},
     "present": {"list": ["?buyer","wants to bargain with","?seller","for the","?goodsOfSeller"]},
     "infinitive": {"list": ["?buyer","to want to bargain with","?seller","for the","?goodsOfSeller"]},
     "interrogative": {"list": ["will","?buyer","want to bargain with","?seller","for the","?goodsOfSeller"]}}},

   {"cheat": 
    {"buyer": "?buyer", "seller": "?seller", "goods": "?goodsOfSeller",
     "past": {"list": ["?buyer","cheated","?seller","out of the","?goodsOfSeller"]},
     "present": {"list": ["?buyer","cheats","?seller","out of the","?goodsOfSeller"]},
     "infinitive": {"list": ["?buyer","to cheat","?seller","out of the","?goodsOfSeller"]},
     "interrogative": {"list": ["will","?buyer","cheat","?seller","out of the","?goodsOfSeller"]}}},

   {"moves": 
    {"character": "?character", "source": "?source", "goal": "?goal",
     "past": {"list": ["?character","moved from the","?source","to the","?goal"]},
     "present": {"list": ["?character","moves from the","?source","to the","?goal"]},
     "infinitive": {"list": ["?character","to move from the","?source","to the","?goal"]},
     "interrogative": {"list": ["will","?character","move from the","?source","to the","?goal"]}}},

   {"races": 
    {"self_mover": "?self_mover", "source": "?source", "goal": "?goal",
     "past": {"list": ["?self_mover","raced from the","?source","to the","?goal"]},
     "present": {"list": ["?self_mover","races from the","?source","to the","?goal"]},
     "infinitive": {"list": ["?self_mover","to race from the","?source","to the","?goal"]},
     "interrogative": {"list": ["will","?self_mover","race from the","?source","to the","?goal"]}}},

   {"sings": 
    {"singer": "?singer", "addressee": "?addressee", "message": "?message",
     "past": {"list": ["?singer","sang",{"past": {"assertion": "?message"}},"to","?addressee"]},
     "present": {"list": ["?singer","sings",{"past": {"assertion": "?message"}},"to","?addressee"]},
     "infinitive": {"list": ["?singer","to sing",{"past": {"assertion": "?message"}},"to","?addressee"]},
     "interrogative": {"list": ["will","?singer","sing",{"past": {"assertion": "?message"}},"to","?addressee"]}}},

   {"takes": 
    {"agent": "?agent", "theme": "?theme", "source": "?source",
     "past": {"list": ["?agent","took the","?theme","from","?source"]},
     "present": {"list": ["?agent","takes the","?theme","from","?source"]},
     "infinitive": {"list": ["?agent","to take the","?theme","from","?source"]},
     "interrogative": {"list": ["will","?agent","take the","?theme","from","?source"]}}},

   {"requests": 
    {"speaker": "?speaker", "addressee": "?addressee", "message": "?event",
     "past": {"list": ["?speaker","requested","?addressee","for",{"infinitive": {"assertion": "?event"}}]},
     "present": {"list": ["?speaker","requests","?addressee","for",{"infinitive": {"assertion": "?event"}}]},
     "infinitive": {"list": ["?speaker","to request","?addressee","for",{"infinitive": {"assertion": "?event"}}]},
     "interrogative": {"list": ["will","?speaker","request","?addressee",
				"for",{"infinitive": {"assertion": "?event"}}]}}},

   {"gives": 
    {"donor": "?donor", "theme": "?theme", "recipient": "?recipient",
     "past": {"list": ["?donor","gave the","?theme","to","?recipient"]},
     "present": {"list": ["?donor","gives the","?theme","to","?recipient"]},
     "infinitive": {"list": ["?donor","to give the","?theme","to","?recipient"]},
     "interrogative": {"list": ["will","?donor","give the","?theme","to","?recipient"]}}},

   {"surrenders": 
    {"donor": "?donor", "theme": "?theme", "recipient": "?recipient",
     "past": {"list": ["?donor","surrendered the","?theme","to","?recipient"]},
     "present": {"list": ["?donor","surrenders the","?theme","to","?recipient"]},
     "infinitive": {"list": ["?donor","to surrend the","?theme","to","?recipient"]},
     "interrogative": {"list": ["will","?donor","surrender the","?theme","to","?recipient"]}}},

   {"informs": 
    {"informer": "?informer", "addressee": "?addressee", "message": "?message",
     "past": {"list": ["?informer","informed","?addressee","that",{"past": {"assertion": "?message"}}]},
     "present": {"list": ["?informer","informs","?addressee","that",{"present": {"assertion": "?message"}}]},
     "infinitive": {"list": ["?informer","to inform","?addressee","that", {"present": {"assertion": "?message"}}]},
     "interrogative": {"list": ["will","?informer","inform",
				"?addressee","that",{"present": {"assertion": "?message"}}]}}},

   {"promises": 
    {"speaker": "?speaker", "addressee": "?addressee", "message": "?event",
     "past": {"list": ["?speaker","promised","?addressee","that",{"present": {"assertion": "?event"}}]},
     "present": {"list": ["?speaker","promises","?addressee","that",{"present": {"assertion": "?event"}}]},
     "infinitive": {"list": ["?speaker","to promise","?addressee","that",{"present": {"assertion": "?event"}}]},
     "interrogative": {"list": ["will","?speaker","promise",
				"?addressee","that",{"present": {"assertion": "?event"}}]}}},

   {"threatens": 
    {"speaker": "?speaker", "addressee": "?addressee", "message": "?event",
     "past": {"list": ["?speaker","threatened","?addressee","that",{"present": {"assertion": "?event"}}]},
     "present": {"list": ["?speaker","threatens","?addressee","that",{"present": {"assertion": "?event"}}]},
     "infinitive": {"list": ["?speaker","to threaten","?addressee","that",{"present": {"assertion": "?event"}}]},
     "interrogative": {"list": ["will","?speaker","threaten",
				"?addressee","that",{"present": {"assertion": "?event"}}]}}},

   {"robs": 
    {"perpetrator": "?perpetrator", 
     "goods": "?goods", "victim": "?victim", "place": "?place",
     "past": {"list": ["?perpetrator","robbed","?victim","of the","?goods"]},
     "present": {"list": ["?perpetrator","robs","?victim","of the","?goods"]},
     "infinitive": {"list": ["?perpetrator","to rob","?victim","of the","?goods"]},
     "interrogative": {"list": ["will","?perpetrator","rob","?victim","of the","?goods"]}}},

   {"steals": 
    {"perpetrator": "?perpetrator", 
     "goods": "?goods", "victim": "?victim", "place": "?place",
     "past": {"list": ["?perpetrator","stole the","?goods","from","?victim"]},
     "present": {"list": ["?perpetrator","steals the","?goods","from","?victim"]},
     "infinitive": {"list": ["?perpetrator","to steal the","?goods","from","?victim"]},
     "interrogative": {"list": ["will","?perpetrator","steal the","?goods","from","?victim"]}}},

   {"kills": 
    {"killer": "?killer", "victim": "?victim",
     "past": {"list": ["?killer","killed","?victim"]},
     "present": {"list": ["?killer","kills","?victim"]},
     "infinitive": {"list": ["?killer","to kill","?victim"]},
     "interrogative": {"list": ["will","?killer","kill","?victim"]}}},

   {"drops": 
    {"agent": "?bearer", "theme": "?thing",
     "past": {"list": ["?bearer","dropped the","?thing"]},
     "present": {"list": ["?bearer","drops the","?thing"]},
     "infinitive": {"list": ["?bearer","to drop the","?thing"]},
     "interrogative": {"list": ["will","?bearer","drop the","?thing"]}}},

   {"eats": 
    {"ingestor": "?ingestor", "ingestibles": "?ingestibles",
     "past": {"list": ["?ingestor","ate the","?ingestibles"]},
     "present": {"list": ["?ingestor","eats the","?ingestibles"]},
     "infinitive": {"list": ["?ingestor","to eat the","?ingestibles"]},
     "interrogative": {"list": ["will","?ingestor","eat the","?ingestibles"]}}},

   {"drinks": 
    {"ingestor": "?ingestor", "ingestibles": "?ingestibles",
     "past": {"list": ["?ingestor","drank the","?ingestibles"]},
     "present": {"list": ["?ingestor","drinks the","?ingestibles"]},
     "infinitive": {"list": ["?ingestor","to drink the","?ingestibles"]},
     "interrogative": {"list": ["will","?ingestor","drink the","?ingestibles"]}}},

   {"walks": 
    {"self_mover": "?self_mover", "source": "?source", "goal": "?goal",
     "past": {"list": ["?self_mover","walked from the","?source","to the","?goal"]},
     "present": {"list": ["?self_mover","walks from the","?source","to the","?goal"]},
     "infinitive": {"list": ["?self_mover","to walk from the","?source","to the","?goal"]},
     "interrogative": {"list": ["will","?self_mover","walk from the","?source","to the","?goal"]}}},

   {"runs": 
    {"self_mover": "?self_mover", "source": "?source", "goal": "?goal",
     "past": {"list": ["?self_mover","ran from the","?source","to the","?goal"]},
     "present": {"list": ["?self_mover","runs from the","?source","to the","?goal"]},
     "infinitive": {"list": ["?self_mover","to run from the","?source","to the","?goal"]},
     "interrogative": {"list": ["will","?self_mover","run from the","?source","to the","?goal"]}}},

   {"flies": 
    {"self_mover": "?self_mover", "source": "?source", "goal": "?goal",
     "past": {"list": ["?self_mover","flew from the","?source","to the","?goal"]},
     "present": {"list": ["?self_mover","flies from the","?source","to the","?goal"]},
     "infinitive": {"list": ["?self_mover","to fly from the","?source","to the","?goal"]},
     "interrogative": {"list": ["will","?self_mover","fly from the","?source","to the","?goal"]}}},


   ////
   //// Rules for selection, arrangement and instantiation of assertions and templates
   ////


   // getTextTemplate: Given an assertion and a tense, fetch the appropriate text template
   {"<--": {"getTextTemplate": {"assertion": "?assertion", "tense": "?tense", "template": "?template"},
	    "and": [{"univ": ["?assertion","?assertionAsList"]},
                    {"same": {"thing1": "?conjugationsList",
			      "thing2": {"list": [{"past": "?past"},
                                                  {"present": "?present"}, 
                                                  {"infinitive": "?infinitive"},
                                                  {"interrogative": "?interrogative"}]}}},
                    {"append": {"list1": "?assertionAsList", 
				"list2": "?conjugationsList",
				"result": "?queryAsList"}},
                    {"univ": ["?query", "?queryAsList"]},
                    {"call": ["?query"]},
                    {"selectConjugation": {"conjugations": "?conjugationsList", 
					   "tense": "?tense", 
					   "template": "?template"}}]}},

   // selectConjugation
   {"<--": {"selectConjugation": {"conjugations": "?conjugationsList", 
				  "tense": "past", 
				  "template": "?template"},
	    "and": [{"member": {"target": {"past": "?template"}, "list": "?conjugationsList"}},
                    {"not": {"var": ["?template"]}}]}},
   {"<--": {"selectConjugation": {"conjugations": "?conjugationsList", 
				  "tense": "present", 
				  "template": "?template"},
	    "and": [{"member": {"target": {"present": "?template"}, "list": "?conjugationsList"}},
                    {"not": {"var": ["?template"]}}]}},
   {"<--": {"selectConjugation": {"conjugations": "?conjugationsList", 
				  "tense": "infinitive", 
				  "template": "?template"},
	    "and": [{"member": {"target": {"infinitive": "?template"}, "list": "?conjugationsList"}},
                    {"not": {"var": ["?template"]}}]}},
   {"<--": {"selectConjugation": {"conjugations": "?conjugationsList", 
				  "tense": "interrogative", 
				  "template": "?template"},
	    "and": [{"member": {"target": {"interrogative": "?template"}, "list": "?conjugationsList"}},
                    {"not": {"var": ["?template"]}}]}},

   // same
   {"<--": {"same": {"thing1": "?thing", "thing2": "?thing"}}},

   // append
   {"<--": {"append": {"list1": "nil", "list2": "?result", "result": "?result"}}},
   {"<--": {"append": {"list1": {"cons": {"first": "?headOfList1",
					  "rest": "?restOfList1"}},
		       "list2": "?list2",
		       "result": {"cons": {"first": "?headOfList1",
					   "rest": "?restOfResult"}}},
	    "and": [{"append": {"list1": "?restOfList1", "list2": "?list2", 
				"result": "?restOfResult"}}]}},

   // member
   {"<--": {"member": {"target": "?target", "list": {"cons": {"first": "?target",
							      "rest": "?restOfList"}}}}},
   {"<--": {"member": {"target": "?target", "list": {"cons": {"first": "?firstOfList",
							      "rest": "?restOfList"}}},
	    "and": [{"member": {"target": "?target", "list": "?restOfList"}}]}},

   // flatten
   // Works only if no variables are in the input.
   {"<--": {"flatten": {"input": {"cons": {"first": "?first", "rest": "?rest"}}, "result": "?result"},
	    "and": [{"flatten": {"input": "?first", "result": "?firstResult"}},
                    {"flatten": {"input": "?rest", "result": "?restResult"}},
                    {"append": {"list1": "?firstResult", "list2": "?restResult", "result": "?result"}}]}},
   {"<--": {"flatten": {"input": "?input", "result": {"cons": {"first": "?input", "rest": "nil"}}},
	    "and": [{"string": ["?input"]},
                    {"not": {"same": {"thing1": "?input", "thing2": "nil"}}}]}},
   {"<--": {"flatten": {"input": "nil", "result": "nil"}}},

   // isConjugation
   {"<--": {"isConjugation": {"conjugation": {"past": {"assertion": "?assertion"}}, 
			      "tense": "past", "assertion": "?assertion"}}},
   {"<--": {"isConjugation": {"conjugation": {"present": {"assertion": "?assertion"}}, 
			      "tense": "present", "assertion": "?assertion"}}},
   {"<--": {"isConjugation": {"conjugation": {"infinitive": {"assertion": "?assertion"}}, 
			      "tense": "infinitive", "assertion": "?assertion"}}},
   {"<--": {"isConjugation": {"conjugation": {"interrogative": {"assertion": "?assertion"}}, 
			      "tense": "interrogative", "assertion": "?assertion"}}},
     
   // templateToStatement
   {"<--": {"templateToStatement": {"template": "nil", "statement": "nil"}}},
   {"<--": {"templateToStatement": {"template": {"cons": {"first": "?tFirst", "rest": "?tRest"}},
				    "statement": {"cons": {"first": "?sFirst", "rest": "?sRest"}}},
	    "and": [{"not": {"var": ["?tFirst"]}},
                    {"isConjugation": {"conjugation": "?tFirst", "tense": "?tense", "assertion": "?assertion"}},
                    {"assertionToStatement": {"input": "?assertion", "output": "?sFirst", "tense": "?tense"}},
                    {"templateToStatement": {"template": "?tRest", "statement": "?sRest"}}]}},
   {"<--": {"templateToStatement": {"template": {"cons": {"first": "?tFirst", "rest": "?tRest"}},
				    "statement": {"cons": {"first": "?tFirst", "rest": "?sRest"}}},
	    "and": [{"not": {"var": ["?tFirst"]}},
                    {"not": {"isConjugation": {"conjugation": "?tFirst", "tense": "?_", "assertion": "?_"}}},
                    {"templateToStatement": {"template": "?tRest", "statement": "?sRest"}}]}},
   {"<--": {"templateToStatement": {"template": {"cons": {"first": "?tFirst", "rest": "?tRest"}},
				    "statement": {"cons": {"first": "something", "rest": "?sRest"}}},
	    "and": [{"var": ["?tFirst"]},
                    {"templateToStatement": {"template": "?tRest", "statement": "?sRest"}}]}},
			
   // assertionToStatement
   {"<--": {"assertionToStatement": {"input": "?assertion", "output": "?statement", "tense": "?tense"},
	    "and": [{"not": {"var": ["?assertion"]}},
                    {"getTextTemplate": {"assertion": "?assertion", "tense": "?tense", "template": "?template"}},
                    {"templateToStatement": {"template": "?template", "statement": "?statement"}},
		    ]}},
   {"<--": {"assertionToStatement": {"input": "?assertion", "output": "something", "tense": "?tense"},
	    "and": [{"var": ["?assertion"]}]}},

   // printStatement
   {"<--": {"printStatement": {"input": "?input", "output": "?list"},
	    "and": [{"flatten": {"input": "?input", "result": "?list"}},
                    {"append": {"list1": "?list", 
				"list2": {"cons": {"first": ".", "rest": "nil"}}, 
				"result": "?statementAsList"}},
                    {"print": ["list","?statementAsList"]}]}},

   // simplePrint
   {"<--": {"simplePrint": {"input": "?input", "output": "?input"},
	    "and": [{"print": ["?input"]}]}},

   // narrateInitialState
   {"<--": {"narrateInitialState": {"tense": "?tense"},
	    "and": [{"state": {"id": "1", "assertions": "?assertions", "tasks": "?tasks"}},
                    {"map": [{"assertionToStatement": {"input": "?assertion", "output": "?statement", "tense": "?tense"}},
	                     "?assertions",
		             "?statements"]},
                    {"map": [{"printStatement": {"input": "?input", "output": "?output"}},
			     "?statements",
			     "?outputStatements1"]}]}},
	
   // currentActionOrMethodTaskAndAdditions
   {"<--": {"currentActionOrMethodTaskAndAdditions": {"input": "?stateID", 
						      "output": {"cons": {"first": "?task", "rest": "?additions"}}},
	    "and": [{"state": {"id": "?stateID", 
			       "currentActionOrMethod": {"action": {"description": "?_", 
								    "task": "?task", 
								    "preconditions": "?_", 
								    "additions": "?additions"}}}}]}},
   {"<--": {"currentActionOrMethodTaskAndAdditions": {"input": "?stateID", 
						      "output": {"cons": {"first": "?task", "rest": "nil"}}},
	    "and": [{"state": {"id": "?stateID", 
			       "currentActionOrMethod": {"method": {"description": "?_", 
								    "task": "?task", 
								    "preconditions": "?_", 
								    "subtasks": "?_"}}}}]}},

   // getTaskAndAdditions
   {"<--": {"getTasksAndAdditions": {"stateIDs": "nil", "assertions": "nil"}}},
   {"<--": {"getTasksAndAdditions": {"stateIDs": {"cons": {"first": "?stateID", "rest": "?stateIDs"}},
				     "assertions": "?assertions"},
	    "and": [{"currentActionOrMethodTaskAndAdditions": {"input": "?stateID", "output": "?taskAndAdditions"}},
                    {"append": {"list1": "?taskAndAdditions", "list2": "?restAssertions", "result": "?assertions"}},
                    {"getTasksAndAdditions": {"stateIDs": "?stateIDs", "assertions": "?restAssertions"}}]}},
   
   
   // narratePathToSuccess
   {"<--": {"narratePathToSuccess": {"tense": "?tense"},
	    "and": [{"stateIDsToSuccess": {"stateIDs": {"cons": {"first": "?initialStateID", "rest": "?stateIDs"}}}},
                    {"getTasksAndAdditions": {"stateIDs": "?stateIDs", "assertions": "?assertions"}},
                    //{"map": [{"simplePrint": {"input": "?i", "output": "?o"}},
		    //         "?assertions",
		    //         "?stuff"]},
                    {"map": [{"assertionToStatement": {"input": "?tAssertion", "output": "?tStatement", "tense": "?tense"}},
			     "?assertions",
			     "?aStatements"]},
                    {"map": [{"printStatement": {"input": "?tInput", "output": "?tOutput"}},
			     "?aStatements",
			     "?outputStatements"]}]}},

   // narrate
   {"<--": {"narrate": {"tense": "?tense"},
	    "and": [{"print": ["list",{"cons": {"first": "once upon a time . . .", "rest": "nil"}}]},
                    {"narrateInitialState": {"tense": "?tense"}},
                    {"print": ["list",{"cons": {"first": "one day . . .", "rest": "nil"}}]},
                    {"narratePathToSuccess": {"tense": "?tense"}}]}},

   // stateIDsToSuccess
   // Find the state where success == true, follow the predecessor links back to the initial state
   {"<--": {"stateIDsToSuccess": {"stateIDs": "?stateIDs"},
	    "and": [{"state": {"id": "?id", "success": "true", "predecessor": "?predecessor"}},
                    {"fromSuccessToInitialState": {"current": {"state": {"id": "?id", "predecessor": "?predecessor"}}, 
						   "stateIDsSoFar": "nil", 
						   "stateIDs": "?stateIDs"}}]}},

   // fromSuccessToInitialState
   // Base case: The initial state (id == 1) has been reached.  
   {"<--": {"fromSuccessToInitialState": {"current": {"state": {"id": "1"}},
					  "stateIDsSoFar": "?stateIDsSoFar",
					  "stateIDs": {"cons": {"first": "1", "rest": "?stateIDsSoFar"}}}}},
   // Recursive case: Add the current state's ID to the list of ?stateIDsSoFar, recur on the parent state
   {"<--": {"fromSuccessToInitialState": {"current": {"state": {"id": "?id", "predecessor": "?parentID"}},
					  "stateIDsSoFar": "?stateIDsSoFar", 
					  "stateIDs": "?stateIDs"},
	    "and": [{"not": {"same": {"thing1": "?id", "thing2": "1"}}},
                    {"state": {"id": "?parentID", "predecessor": "?grandparentID"}}, 
                    {"fromSuccessToInitialState": {"current": {"state": {"id": "?parentID", "predecessor": "?grandparentID"}}, 
						   "stateIDsSoFar": {"cons": {"first": "?id", "rest": "?stateIDsSoFar"}},
						   "stateIDs": "?stateIDs"}}]}},

   ];
module.exports = textTemplatesAndRules;

