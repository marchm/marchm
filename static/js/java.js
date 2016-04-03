var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		// Public methods
		// Start or resume
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
	};

var x = new clsStopwatch();
var $time;
var clocktimer;
var timearray;
var timecopy;
var timecopycopy;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var m = s = ms = 0;
	var newTime = '';

	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	update();
}

function update() {
	$time.innerHTML = formatTime(x.time());
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	/*timecopy = ('lapTime').val(),
	timecopycopy = timecopy.substr(0);
	timearray.push(timecopycopy)*/
	x.reset();
	update();
}








var cube = {
    // Define the six faces of the cube
    faces: "DLBURF",
    // This will contain a history of all the states to make sure we don't repeat a state
    states: [],
    // Which stickers are part of the same layer and should move along with the face
    edges: {
        D: [46, 45, 44, 38, 37, 36, 22, 21, 20, 14, 13, 12],
        L: [24, 31, 30, 40, 47, 46, 0, 7, 6, 20, 19, 18],
        B: [26, 25, 24, 8, 15, 14, 6, 5, 4, 36, 35, 34],
        U: [18, 17, 16, 34, 33, 32, 42, 41, 40, 10, 9, 8],
        R: [28, 27, 26, 16, 23, 22, 4, 3, 2, 44, 43, 42],
        F: [30, 29, 28, 32, 39, 38, 2, 1, 0, 12, 11, 10]
    },
    // Sets the cube to the solved state
    reset: function () {
        cube.states = ["yyyyyyyyoooooooobbbbbbbbwwwwwwwwrrrrrrrrgggggggg"];
    },
    // Twist the cube according to a move in WCA notation
    twist: function (state, move) {
        var i, k, prevState, face = move.charAt(0), faceIndex = cube.faces.indexOf(move.charAt(0)),
            turns = move.length > 1 ? (move.charAt(1) === "2" ? 2 : 3) : 1;
        state = state.split("");
        for (i = 0; i < turns; i++) {
            prevState = state.slice(0);
            // Rotate the stickers on the face itself
            for (k = 0; k < 8; k++) { state[(faceIndex * 8) + k] = prevState[(faceIndex * 8) + ((k + 6) % 8)]; }
            // Rotate the adjacent stickers that are part of the same layer
            for (k = 0; k < 12; k++) { state[cube.edges[face][k]] = prevState[cube.edges[face][(k + 9) % 12]]; }
        }
        return state.join("");
    },
    // Scramble the cube
    scramble: function () {
        var count = 0, total = 25, state, prevState = cube.states[cube.states.length - 1],
            move, moves = [], modifiers = ["", "'", "2"];
        while (count < total) {
            // Generate a random move
            move = cube.faces[Math.floor(Math.random() * 6)] + modifiers[Math.floor(Math.random() * 3)];
            // Don't move the same face twice in a row
            if (count > 0 && move.charAt(0) === moves[count - 1].charAt(0)) { continue; }
            // Avoid move sequences like "R L R", which is the same as "R2 L"
            if (count > 1 && move.charAt(0) === moves[count - 2].charAt(0) &&
                    moves[count - 1].charAt(0) === cube.faces.charAt((cube.faces.indexOf(move.charAt(0)) + 3) % 6)) {
                continue;
            }
            state = cube.twist(prevState, move);
            if (cube.states.indexOf(state) === -1) {
                // If this state hasn't yet been encountered, save it and move on
                moves[count] = move;
                cube.states[count] = state;
                count++;
                prevState = state;
            }
        }
        return moves;
    }
};
window.addEventListener("load", function () {
    function displayScramble() {
        cube.reset();
        var i, scramble = cube.scramble(), len = scramble.length, result = "";
        for (i = 0; i < len; i += 5) {
            // Only allow a line break every 5 moves
            result += scramble.slice(i, i + 5).join("&nbsp;") + " ";
        }
        document.getElementById("scramble").innerHTML = result;
    }
    displayScramble();
    document.getElementById("btn-refresh").addEventListener("click", displayScramble);
});