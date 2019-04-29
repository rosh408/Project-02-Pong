import { SVG_NS } from '../settings';

export default class Ball {
    constructor(radius, boardWidth, boardHeight, direction) {
        this.radius = radius;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.direction = direction;
        this.ping = new Audio('public/sounds/pong-03.wav');
        this.reset();
    }// end of constructor

    reset() {
        this.x = this.boardWidth / 2;
        this.y = this.boardHeight / 2;

        this.vy = 0;
        while(this.vy === 0) {
            this.vy = Math.floor(Math.random() * 10 - 5);
        }
        this.vx = this.direction * (6 - Math.abs(this.vy));
    } // end of reset

    wallCollision() {
        const hitLeft = this.x - this.radius <= 0;
        const hitRight = this.x + this.radius >= this.boardWidth;
        const hitTop = this.y - this.radius <= 0;
        const hitBottom = this.y + this.radius >= this.boardHeight;

        if (hitLeft || hitRight) {
            this.vx = -this.vx;
        } else if (hitTop || hitBottom ) {
            this.vy = -this.vy;
        }
    }

    paddleCollision(player1, player2) {
        if (this.vx > 0) {
            // ball is moving the right and only check for player 2
            let paddle = player2.coordinates(player2.x, player2.y, player2.width, player2.height);
            let [leftX, rightX, topY, bottomY] = paddle;
            if(
                (this.x + this.radius >= leftX) && 
                (this.x + this.radius <= rightX) && 
                (this.y >= topY && this.y <= bottomY)
            ){
                this.vx = -this.vx;
                this.ping.play();
            }// end of if
        } else {
            // check the player1 collision
            let paddle = player1.coordinates(player1.x, player1.y, player1.width, player1.height);
            let [leftX, rightX, topY, bottomY] = paddle;
            if (
                (this.x - this.radius <= rightX) &&
                (this.x - this.radius <= leftX) && 
                (this.y >= topY && this.y <= bottomY)
            ){
                this.vx = -this.vx;
                this.ping.play();
            }
        }
    }// paddleCollision
    

    // add Goal method
    goal(player){
        player.score++;
        this.reset();
    }

    render(svg, player1, player2, three) {

        // update x position with vector direction 60 times a second
        this.x += this.vx;
        this.y += this.vy;

        this.wallCollision();
        this.paddleCollision(player1, player2);

        let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'cx', this.x); // x position
        circle.setAttributeNS(null, 'cy', this.y); // y position
        circle.setAttributeNS(null, 'fill', '#ea6a54');
        svg.appendChild(circle);

        // Third Ball 
        // let ballThree = document.createElementNS(SVG_NS, 'circle');
        // ballThree.setAttributeNS(null, 'r', this.radius);
        // ballThree.setAttributeNS(null, 'cx', this.x); // x position
        // ballThree.setAttributeNS(null, 'cy', this.y); // y position
        // ballThree.setAttributeNS(null, 'fill', '#009b2b');
        // ballThree.textcontent = three;
        // svg.appendChild(ballThree);

        // goal
        const rightGoal = this.x + this.radius >= this.boardWidth;
        const leftGoal = this.x - this.radius <= 0;
    
        if(rightGoal) {
            this.goal(player1);
            this.direction = 1;
        } else if(leftGoal) {
            this.goal(player2);
            this.direction = -1;
        }
    }// end of render

}// end of Ball class

