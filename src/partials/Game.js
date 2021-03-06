import Board from "./Board";
import Paddle from "./Paddle";
import Ball from "./Ball";
import Score from "./Score";
import { SVG_NS, KEYS } from "../settings";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.gameElement = document.getElementById(this.element);
    this.board = new Board(this.width, this.height);

    this.pause = false;

    this.paddleWidth = 10;
    this.paddleHeight = 156;
    this.boardGap = 10;

    this.player1 = new Paddle(
      this.height,
      this.paddleWidth,
      this.paddleHeight,
      this.boardGap,
      (this.height - this.paddleHeight) / 2,
      KEYS.a,
      KEYS.z
    );

    this.player2 = new Paddle(
      this.height,
      this.paddleWidth,
      this.paddleHeight,
      this.width - this.boardGap - this.paddleWidth,
      (this.height - this.paddleHeight) / 2,
      KEYS.up,
      KEYS.down
    );

    this.score1 = new Score(this.width / 2 - 50, 30, 30);
    this.score2 = new Score(this.width / 2 + 25, 30, 30);

    this.ball = new Ball(20, this.width, this.height, 2);
    this.ballTwo = new Ball(30, this.width, this.height, 2);
    this.ballThree = new Ball(10, this.width, this.height, 2);

    document.addEventListener("keydown", event => {
      switch (event.key) {
        case KEYS.spaceBar:
          this.pause = !this.pause;
          break;
      }
    });
  } // End of constructor

  render() {
    if (this.pause) {
      this.player1.paddlePause = 0;
      this.player2.paddlePause = 0;
      return;
    }
    this.player1.paddlePause = 1;
    this.player2.paddlePause = 1;

    this.gameElement.innerHTML = "";

    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", `0 0 ${this.width} ${this.height}`);
    this.gameElement.appendChild(svg);

    this.board.render(svg);
    this.player1.render(svg);
    this.player2.render(svg);

    this.ball.render(svg, this.player1, this.player2, this);
    this.ballTwo.render(svg, this.player1, this.player2, this);
    this.ballThree.render(svg, this.player1, this.player2, this);

    this.score1.render(svg, this.player1.score);
    this.score2.render(svg, this.player2.score);
  }
}
