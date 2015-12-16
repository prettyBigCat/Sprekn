'use strict'

var app = angular.module("app");

app.controller("sprekn", ["$scope", "cmds", function($scope, cmds) {
  var vm = this;
  vm.chat = [];
  vm.dict = {
    starters: [],
    enders: [],
    punct: ['. ', '! ', '? ']
  };

  vm.markovs = [];
  vm.commands = cmds;
  var wrapper = $("#chatbox");
  wrapper.perfectScrollbar({
    includePadding: true,
    minScrollbarLength: 15
  });
  wrapper.perfectScrollbar('update');



  vm.userchat = function(chat) {

    vm.mess = '';

    vm.chat.push({
      who: 'you',
      message: chat
    });

    if (chat[0] === '/') {
      switch (chat) {
        case '/wordCount':
          respondShort("I currently know " + vm.markovs.length + " words, thanks to you!");
          break;
        case '/help':
           respondShort(commandList());
          break;
        default:
          respondShort("I dont recognize that command. Type /help for a list of things I can do.");
          break;
      }
    } else {
      learn(chat.split(" "));
      respond();
    }
  };

  function respondShort(message){
      vm.chat.push({
      who: 'sprekn text-sm',
      message: message
    });

    wrapper.animate({
      scrollTop: wrapper[0].scrollHeight
    }, 1000);
    wrapper.perfectScrollbar('update');
  };

  function respond() {

    var wordObj = getRandom(vm.dict.starters);
    var pWord = wordObj.word;
    var message = (pWord + ' ');

    for (var i = 0; i < 25; i++) {
      wordObj = _.findWhere(vm.markovs, {
        word: pWord
      });

      if (wordObj.after.length < 1) break;
      var word = getRandom(wordObj.after);
      if (!wordObj) continue;
      if (word === pWord) continue;
      message += (word + ' ');
      pWord = word;
    }

    if (vm.dict.enders.length) {
      var end = getRandom(vm.dict.enders).word;
      if(pWord !== word) message += end;
    }

    vm.chat.push({
      who: 'sprekn',
      message: message
    });

    wrapper.animate({
      scrollTop: wrapper[0].scrollHeight
    }, 1000);
    wrapper.perfectScrollbar('update');
  }


  function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function learn(wordies) {
    
    for (var i = 0; i < wordies.length; i++) {

      var cur = wordies[i];
      var before = wordies[i - 1];
      var after = wordies[i + 1];

      if (i === 0) {
        var start = _.findWhere(vm.dict.starters, {
          word: cur
        });

        if (start) {
          if (wordies.length > 1) {
            start.after.push(after);
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

          if (before) {
            vm.dict.enders.push({
              word: cur,
              before: [before]
            });
          } else {
            vm.dict.enders.push({
              word: cur,
              before: []
            });
          }
        }
      }
      
      var mark = _.findWhere(vm.markovs, {
        word: cur
      });

      if (mark) {
        if (before) {
          if (!_.findWhere(mark.before, {
              word: before
            })) {
            mark.before.push(before);
          }
        }
        if (after) {
          if (!_.findWhere(mark.after, {
              word: after
            })) {
            mark.after.push(after);
          }
        }
      } else {
        if (before && after) {
          vm.markovs.push({
            word: cur,
            before: [before],
            after: [after]
          });
          continue;
        }

        if (before) {
          vm.markovs.push({
            word: cur,
            before: [before],
            after: []
          });
          continue;
        }

        if (after) {
          vm.markovs.push({
            word: cur,
            before: [],
            after: [after]
          });
          continue;
        }
        vm.markovs.push({
          word: cur,
          before: [],
          after: []
        });

      }     
    }   
  }
  
  function commandList(){
    var ret = ""
    
    for(var i = 0; i < vm.commands.length; i++){
      ret += vm.commands[i].Cmd + ': ' + vm.commands[i].Desc + '\n'
    }
    
    return ret;
  }
}]);
