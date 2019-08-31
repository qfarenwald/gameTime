import data from './data.js';
import Player from './Player.js';
import Round from './Round.js';
import FastMoney from './FastMoney.js';

class Game {
  constructor(surveys, answers) {
    this.surveys = surveys;
    this.answers = answers;
    this.players = []; 
    this.roundCounter = 0;
    this.currentSurvey;
    this.currentAnswers;
    this.usedSurveys = [0];
  }

  addPlayers(p1, p2) {
    let player1 = new Player(1, p1);
    let player2 = new Player(2, p2);
    this.players.push(player1, player2);
  }

  selectSurvey() {
    let randomNum = Math.round(Math.random() * this.surveys.length);
    if (this.usedSurveys.includes(randomNum)) {
      this.selectSurvey();
    } else {
    this.currentSurvey = this.surveys.find(survey => survey.id === randomNum);
    this.usedSurveys.push(randomNum);
    }
  }

  getSurveyAnswers() {
    this.selectSurvey();
    this.currentAnswers = this.answers.filter(answer => answer.surveyId === this.currentSurvey.id);
    this.currentAnswers.sort((a, b) => b.respondents - a.respondents);   
  }

  startRound() {
    this.getSurveyAnswers();
    if (this.roundCounter <= 2) {
      let round = new Round(this.currentSurvey, this.currentAnswers, this.players);
      this.roundCounter++;
      // console.log(round)
    } else {
      let fastMoney = new FastMoney(this.currentSurvey, this.currentAnswers, this.players);
      this.roundCounter++;
    }
  }



}

export default Game;