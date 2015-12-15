var app = angular.module("app");

app.controller("sprekn", ["$scope", function($scope) {
  var vm = this;
  vm.chat = [];
  vm.dict = {
    starters: [],
    enders: [],
    punct: ['. ', '! ', '? ']
  }

  vm.markovs = []
  vm.userchat = function(chat) {
 
    vm.chat.push("You: " + chat)
    var wordies = chat.split(" ");
    vm.mess = '';
    for (var i = 0; i < wordies.length; i++) {
      var cur = wordies[i]
      var before = wordies[i - 1]
      var after = wordies[i + 1]

      if (i === 0) {
        var start = _.findWhere(vm.dict.starters, {
          word: cur
        });

        if (start) {
          if (wordies.length > 1) {
            start.after.push(after)
          }
        } else {
          if (wordies.length > 1) {
            vm.dict.starters.push({
              word: cur,
              after: [after]
            });
          } else {
            vm.dict.starters.push({
              word: cur,
              after: []
            });
          }
        }
      }

      if (i === (wordies.length - 1)) {
        var end = _.findWhere(vm.dict.enders, {
          word: cur
        });

        if (end) {
          end.before.push(before);
        } else {
			
			if(before){
				 vm.dict.enders.push({
					word: cur,
					before: [before]
				 })
			}
			else{
				vm.dict.enders.push({
					word:cur,
					before:[]
				});
			}        
        }      
      }

      var mark = _.findWhere(vm.markovs, {
        word: cur
      })

      if (mark) {
        if (before){
			if(!_.findWhere(mark.before, {word: before})){
				mark.before.push(before);
			}
		} 
        if (after){
			if(!_.findWhere(mark.after, {word: after})){
				mark.after.push(after);
			}
		}  
      } else {
        if (before && after) {
          vm.markovs.push({
            word: cur,
            before: [before],
            after: [after]
          })
          continue;
        }

        if (before) {
          vm.markovs.push({
            word: cur,
            before: [before],
            after: []
          })
          continue;
        }

        if (after) {
          vm.markovs.push({
            word: cur,
            before: [],
            after: [after]
          })
          continue;
        }
        vm.markovs.push({
          word: cur,
          before: [],
          after: []
        })

      }
    }

    //construct something
    var message = "Sprekn: ";
    var wordObj = getRandom(vm.dict.starters)
    var pWord = wordObj.word;
    message += (pWord + ' ');

    for (var i = 0; i < 25; i++) {
      wordObj = _.findWhere(vm.markovs, {
        word: pWord
      })
      if (wordObj.after.length < 1) break;
      var word = getRandom(wordObj.after)
      if (!wordObj) continue;
      if (word === pWord) continue;
      message +=(word + ' ');
      pWord = word;
    }

    if (vm.dict.enders.length) {
      var end = getRandom(vm.dict.enders).word;
	  if(pWord !== word)  message += end;    
    }

    vm.chat.push(message)
  }

  function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}])
