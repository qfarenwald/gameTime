import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/feud_title.png';
import './images/feud_subtitle.png';
import './images/feud_splash_bkgd.png';
import './images/feud_modal_bkgd.png';
import './images/feud_vs.png';

import data from './data.js';

import Game from './Game.js';
import domUpdates from './domUpdates';


let game, timer, timeLeft, timerId;

$(document).ready(() => {
  $('#start-game, #submit-guess').prop('disabled', true);
  $('#game-page, #player2-carrot, #start-modal').hide();
  // include all elements that should be hidded on page load, then we can show as/when needed

$('.name-inputs').keyup(() => {
  if ($('#player1-input').val() !== '' && $('#player2-input').val() !== '') {
    $('#start-game').prop('disabled', false);
  }
})

$('#start-game').click(() => {
  let player1 = $('#player1-input').val();
  let player2 = $('#player2-input').val();
  fetch('https://fe-apps.herokuapp.com/api/v1/gametime/1903/family-feud/data')
  .then(response => response.json())
  .then(data =>  startGame(player1, player2, data.data.surveys, data.data.answers))
  .catch(err => console.log(err));
});

const startGame = (p1, p2, surveys, answers) => {
  game = new Game(surveys, answers);
  game.addPlayers(p1, p2);
  domUpdates.appendPlayerNames(p1, p2);
  $('#splash-page').hide();
  $('#game-page').show();
  game.startRound();
};

$('#guess-input').keyup(() => {
  if ($('#guess-input').val() !== '') {
      $('#submit-guess').prop('disabled', false);
    }
})

$('#submit-guess').click(() => {
    if (game.roundCounter <= 2) {
      game.currentRound.submitGuess($('#guess-input').val())
      $('#guess-input').val('')
      $('#submit-guess').prop('disabled', true)
      $('#aside-player2, #aside-player1').toggleClass('innactive')
      $('#player2-carrot, #player1-carrot').toggle();
    } else {
      // game.currentRound.fastMoneyMethod
    }
})

$('.help').click(showHelpModal);
$('.endgame').click(showEndGameModal)

$('#game-page').click((e) => {
  if(e.target.classList.contains('close-modal')) {
    $('#answer1').text('1');
    $('#answer2').text('2');
    $('#answer3').text('3');
    $('#score1', '#score2', '#score3').text('#');
    game.startRound();
    game.currentRound.turnCounter++;
    startRound2();
    startTimer();
  }
  if(e.target.classList.contains('close-modal-start')) {
    $('.round-modal').remove();
  }
  if (e.target.classList.contains('end-modal')) {
    window.location.reload();
  }
  // console.log(this);
  // $('#close-modal').remove('#round-modal');
});



function startRound2() {
  $('#aside-player2').removeClass('innactive');
  $('#aside-player1').addClass('innactive');
  $('#player1-carrot').hide();
  $('.round-modal').remove();
  $('#player2-carrot').show();
}

function startTimer() {
	timer = document.getElementById('timer');
  timeLeft = 30;
  timerId = setInterval(countdown, 1000);
};

function countdown() {
  timer.style.color = 'black';
  if (timeLeft == -1) {
    clearTimeout(timerId);
//  showFinalModal();
    timer.innerHTML = 'TIME: 30 SEC'
  } else if(timeLeft <= 5) {
    timer.style.color = '#F05355';
    timer.innerHTML = `TIME: ${timeLeft} SEC`;
    timeLeft--;
  } else {
    timer.innerHTML = `TIME: ${timeLeft} SEC`;
    timeLeft--;
  }
};

  function showHelpModal() {
    $(`<div id="help-modal" class="round-modal">
  <div id="help-modal-content" class="modal-content">
  <ul>
  <li class="modal-text">Each player will alternate guessing the top 3 reponses to a question.</li>

  <li class="modal-text">When a correct guess is made, that player's score will increase by the number of responses.</li>

  <li class="modal-text">The round will end after all three responses have been guessed.</li>

  <li class="modal-text">After 2 rounds you will play a FAST MONEY Round!</li>
  </ul>

  </p><button class="close-modal-start" type="button">Close</button>

  </div>
  </div>`).insertAfter('#main-survey-guess')
  }

  function showEndGameModal() {
    $(`<div id="end-modal" class="round-modal">
  <div id="help-modal-content" class="modal-content">
    <h2 class="end-warning">WAIT!!!</h2>
  <ul>

  <li class="modal-text">Are you sure you want quit??</li>

  <li class="modal-text">Once you click the button below, you will lose all your progress</li>

  <li class="modal-text">Click the button below to end the game</li>
  </ul>

  </p><button class="end-modal">End Game!!</button>

  </div>
  </div>`).insertAfter('#main-survey-guess')
  }

});
