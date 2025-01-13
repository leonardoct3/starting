const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(fieldCfg) {
        this.field = this.generateField(fieldCfg);
        this.currentPosition = [0, 0];
    }

    generateField(fieldCfg) {
        const field = [];
        for (let i = 0; i < fieldCfg.height; i++) {
            field.push([]);
            for (let j = 0; j < fieldCfg.width; j++) {
                field[i].push(fieldCharacter);
            }
        }
        field[0][0] = pathCharacter;

        // Ensure the hat is not placed at the starting position
        let hatPosition;
        do {
            hatPosition = [
                Math.floor(Math.random() * fieldCfg.height),
                Math.floor(Math.random() * fieldCfg.width)
            ];
        } while (hatPosition[0] === 0 && hatPosition[1] === 0);
        field[hatPosition[0]][hatPosition[1]] = hat;

        // Place holes, ensuring they don't overlap with the hat or starting position
        let holeCount = Math.floor(fieldCfg.width * fieldCfg.height * fieldCfg.percentage);
        while (holeCount > 0) {
            let holePosition = [
                Math.floor(Math.random() * fieldCfg.height),
                Math.floor(Math.random() * fieldCfg.width)
            ];
            // Avoid placing a hole at the starting position or where the hat is
            if (
                field[holePosition[0]][holePosition[1]] === fieldCharacter &&
                !(holePosition[0] === 0 && holePosition[1] === 0)
            ) {
                field[holePosition[0]][holePosition[1]] = hole;
                holeCount--;
            }
        }
        return field;
    }

    print() {
        this.field.forEach(row => {
            console.log(row.join(''));
        });
    }

    move(direction) {
        const [x, y] = this.currentPosition;
        let newX = x;
        let newY = y;

        switch (direction.toLowerCase()) {
            case 'w':
                newX = x - 1;
                break;
            case 's':
                newX = x + 1;
                break;
            case 'a':
                newY = y - 1;
                break;
            case 'd':
                newY = y + 1;
                break;
            default:
                console.log("Invalid input! Use W (up), A (left), S (down), D (right).");
                return;
        }

        // Boundary checking
        if (newX < 0 || newX >= this.field.length || newY < 0 || newY >= this.field[0].length) {
            console.log('You went out of bounds! Game over!');
            process.exit();
        }

        const destination = this.field[newX][newY];

        if (destination === hat) {
            console.log('You found your hat! You win!');
            process.exit();
        } else if (destination === hole) {
            console.log('You fell into a hole! Game over!');
            process.exit();
        } else {
            // Update the field
            this.field[x][y] = fieldCharacter;
            this.currentPosition = [newX, newY];
            this.field[newX][newY] = pathCharacter;
            this.print();
        }
    }

    play() {
        this.print();
        while (true) {
            const direction = prompt('Use W (up), A (left), S (down), D (right) to move: ');
            this.move(direction);
        }
    }
}

const myField = new Field({
    width: 10,
    height: 10,
    percentage: 0.2 // 20% of the field will have holes
});

myField.play();