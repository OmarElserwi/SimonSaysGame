import {
  startSimpleKit,
  setSKDrawCallback,
  setSKEventListener,
  SKEvent,
  SKResizeEvent,
  SKMouseEvent,
  SKKeyboardEvent,
  setSKAnimationCallback,
  addSKEventTranslator,
} from "../../simplekit";

import { Shape, Circle } from "./shapes";
import { SimonLogic } from "./simonlogic";
import { CallbackTimer } from "./timer";
import { longPressTranslator } from "./translators";

let simonLogic = new SimonLogic();
let bottomMessage = "Press SPACE to play";
let numButtons = 4;
let width = 0;
let height = 0;
const circles: Circle[] = [];
let cheating: boolean = false;
let numButtonsShown: number = 0;
let sequenceLength: number = 0;
let attractAnimation: boolean = true;
let loseAnimation: boolean = false;
let correct: boolean = true;
let buttonPlayedLast: number = 0;
let temp: number = 0;

const buttonRadius = 60;
let buttonY = height / 2;
let totalButtonWidth = buttonRadius * 2 * numButtons;
let totalSpacingWidth = width - totalButtonWidth;
let horizontalSpacing = totalSpacingWidth / (numButtons + 1);

// Initialize circles array
for (let i = 0; i < numButtons; i++) {
  let buttonX =
    horizontalSpacing +
    buttonRadius +
    (buttonRadius * 2 + horizontalSpacing) * i;
  circles.push(
    new Circle(
      buttonX,
      buttonY,
      buttonRadius,
      i,
      `hsl(${i * (360 / numButtons)}, 100%, 50%)`
    )
  );
}
+console.log(simonLogic.state);
console.log(simonLogic.score);

startSimpleKit("100%");

// draw shapes
setSKDrawCallback((gc) => {
  // clear background
  gc.clearRect(0, 0, width, height);

  circles.forEach((circle) => {
    circle.draw(gc);
  });

  gc.font = "32pt sans-serif";
  gc.textAlign = "center";
  gc.textBaseline = "middle";

  gc.fillStyle = "black";
  // Fill that text in centre of screen at top, based on current screen size
  gc.fillText(
    `Score ${simonLogic.score}`,
    gc.canvas.width / 2,
    gc.canvas.height / 10
  );

  // if cheating, the word “CHEATING” is shown in grey at the bottom right of the canvas
  // also make sure timer isnt running
  if (cheating && simonLogic.state === "HUMAN" && !timer500.isRunning) {
    let remainingSequence = simonLogic.remainingSequence();
    let remainingSequenceString = `${remainingSequence[0] + 1}`;
    for (let i = 1; i < remainingSequence.length; i++) {
      remainingSequenceString += `,${remainingSequence[i] + 1}`;
    }
    bottomMessage = remainingSequenceString;
  }

  gc.fillText(bottomMessage, gc.canvas.width / 2, gc.canvas.height / 1.1);

  // line at middle of screen for debugging
  // gc.beginPath();
  // gc.moveTo(0, height / 2);
  // gc.lineTo(width, height / 2);
  // gc.stroke();

  // If temp == 0, loop through circles and log their coordinates in a neat way
  if (temp == 0) {
    circles.forEach((circle) => {
      console.log(
        `Circle ${circle.index + 1} x: ${circle.x} y: ${circle.y} r: ${
          circle.r
        } fill: ${circle.fill} normalFill: ${circle.normalFill}`
      );
    });
    temp++;
  }

  // Draw a line from the mouse to the centre of each circle for debugging
  // circles.forEach((circle) => {
  //   gc.beginPath();
  //   gc.moveTo(m.x, m.y);
  //   gc.lineTo(circle.x, circle.y);
  //   gc.stroke();
  // });

  if (cheating) {
    gc.font = "24px sans-serif";
    gc.textAlign = "right";
    gc.textBaseline = "bottom";
    gc.fillStyle = "grey";
    gc.fillText("CHEATING", width - 10, height - 10);
  }

  if (loseAnimation) {
    // go through circles and increase their y value
    circles.forEach((circle) => {
      circle.y += 10;
    });
  }

  if (!circles[buttonPlayedLast].beingPlayed) {
    if (correct) {
      if (simonLogic.state === "WIN") {
        bottomMessage = "You won! Press SPACE to continue";
        attractAnimation = true;
      }
    } else {
      bottomMessage = "You lose. Press SPACE to play again";
      loseAnimation = true;
    }
  }
});

function updateCircles() {
  // Update circles array
  buttonY = height / 2;
  totalButtonWidth = buttonRadius * 2 * numButtons;
  totalSpacingWidth = width - totalButtonWidth;
  horizontalSpacing = totalSpacingWidth / (numButtons + 1);

  for (let i = 0; i < numButtons; i++) {
    let buttonX =
      horizontalSpacing +
      buttonRadius +
      (buttonRadius * 2 + horizontalSpacing) * i;
    circles[i].r = buttonRadius;
    circles[i].x = buttonX;
    circles[i].y = buttonY;
    circles[i].stroke = "";
    circles[i].strokeWidth = 0;
    circles[i].fill = `hsl(${i * (360 / numButtons)}, 100%, 50%)`;
    circles[i].normalFill = circles[i].fill;
    circles[i].index = i;
    console.log(circles[i].index);
  }
}

const m = { x: 0, y: 0 };

function handleEvent(e: SKEvent) {
  switch (e.type) {
    case "mousedown":
    case "mouseup":
    case "mousemove":
      const me = e as SKMouseEvent;
      m.x = me.x;
      m.y = me.y;
      circles.forEach((s) => {
        if (s instanceof Shape) {
          s.stroke = "";
          s.strokeWidth = 0;
          // Check if in human state
          if (simonLogic.state === "HUMAN") {
            // Check if mouse is over a circle
            if (s.hitTest(me.x, me.y) && !timer500.isRunning) {
              s.stroke = "yellow";
              s.strokeWidth = 10;
            }
          }
        }
      });
      break;
    case "click":
      const mc = e as SKMouseEvent;
      m.x = mc.x;
      m.y = mc.y;
      // Check if in human state
      if (simonLogic.state === "HUMAN" && !timer500.isRunning) {
        circles.forEach((s) => {
          if (s instanceof Circle) {
            if (s.hitTest(mc.x, mc.y)) {
              let button = s.click();
              correct = simonLogic.verifyButton(button);
              buttonPlayedLast = button;
            }
          }
        });
      }
      break;
    case "longpress":
      const { x: lx, y: ly } = e as SKMouseEvent;
      console.log(`${e.type} (${lx}, ${ly}) at ${e.timeStamp} `);
      if (simonLogic.state === "HUMAN") {
        let button = simonLogic.remainingSequence()[0];
        circles[button].playButton();
      }
      break;
    case "drag":
    case "dblclick":
      const { x, y } = e as SKMouseEvent;
      console.log(`${e.type} (${x}, ${y}) at ${e.timeStamp} `);
      break;
    case "keydown":
      const keyDownEvent = e as SKKeyboardEvent;
      console.log(`${e.type} '${keyDownEvent.key}' at ${e.timeStamp} `);
      break;
    case "keyup":
      break;
    case "keypress":
      const { key } = e as SKKeyboardEvent;
      // Pressing ‘q’ cancels the current game, restarts a new one, and returns to the “Press SPACE to play” mode
      if (key == "q") {
        console.log("Q PRESSED");
        correct = true;
        attractAnimation = true;
        loseAnimation = false;
        updateCircles();
        bottomMessage = "Press SPACE to play";
        simonLogic = new SimonLogic(numButtons);
        numButtonsShown = 0;
        sequenceLength = simonLogic.length;
      }

      // Check if user pressed space
      if (key == " ") {
        // Check state of game. If it is in "Press SPACE to play" mode, start a new round
        if (
          simonLogic.state == "START" ||
          simonLogic.state == "WIN" ||
          simonLogic.state == "LOSE"
        ) {
          correct = true;
          attractAnimation = false;
          loseAnimation = false;
          updateCircles();
          console.log("SPACE PRESSED");
          bottomMessage = "Watch what I do …";
          simonLogic.newRound();
          numButtonsShown = 0;
          sequenceLength = simonLogic.length;

          let button = simonLogic.nextButton();
          circles[button].playButton();

          numButtonsShown++;

          // log the button number
          console.log(`Button ${button + 1} played`);

          // Wait 500ms before playing the next button
          timer500.start(performance.now());
        }
      }

      // Pressing the ‘?’ key toggles a “cheat” mode.
      if (key == "?") {
        console.log("QUESTION MARK PRESSED");
        cheating = !cheating;

        // If the bottom message is "Now it's your turn", change it to be cheating
        if (bottomMessage == "Now it's your turn" && cheating) {
          let remainingSequence = simonLogic.remainingSequence();
          let remainingSequenceString = `${remainingSequence[0] + 1}`;
          for (let i = 1; i < remainingSequence.length; i++) {
            remainingSequenceString += `,${remainingSequence[i] + 1}`;
          }
          bottomMessage = remainingSequenceString;
        }
        // Otherwise if not cheating and in human state
        else if (!cheating && simonLogic.state == "HUMAN") {
          bottomMessage = "Now it's your turn";
        }
      }
      if (
        (simonLogic.state === "START" ||
          simonLogic.state === "WIN" ||
          simonLogic.state === "LOSE") &&
        (key === "+" || key === "-")
      ) {
        if (key === "+") {
          if (numButtons < 10) {
            numButtons++;
            bottomMessage = "Press SPACE to play";
            simonLogic.buttons = numButtons;
            circles.push(
              new Circle(
                0,
                0,
                buttonRadius,
                0,
                `hsl(${(numButtons - 1) * (360 / numButtons)}, 100%, 50%)`
              )
            );
            updateCircles();
          }
        } else if (key === "-") {
          if (numButtons > 1) {
            numButtons--;
            bottomMessage = "Press SPACE to play";
            simonLogic.buttons = numButtons;

            // Update circles array
            updateCircles();

            // Remove last circle
            circles.pop();
          }
        }
      }
      break;
    case "resize":
      const { width: w, height: h } = e as SKResizeEvent;
      console.log(`${e.type} (${w}, ${h}) at ${e.timeStamp} `);
      width = w;
      height = h;

      // log the width and height of the canvas
      console.log(`width: ${width}, height: ${height}`);

      temp = 0;
      updateCircles();
      break;
  }
}

setSKAnimationCallback((time) => {
  defaultCallback(time);
});

function defaultCallback(time: number) {
  circles.forEach((circle) => {
    circle.update(time);
  });
  timer500.update(time);

  if (attractAnimation && !timer500.isRunning) {
    updateCircles();
    sin();
  }
}

// add event translators
addSKEventTranslator(longPressTranslator);
setSKEventListener(handleEvent);

const timer500 = new CallbackTimer(1000, (t) => {
  // log length and numButtonsShown
  console.log(
    `Length: ${simonLogic.length}, numButtonsShown: ${numButtonsShown}, sequenceLength: ${sequenceLength}`
  );
  if (sequenceLength > numButtonsShown && simonLogic.state === "COMPUTER") {
    console.log("CALLING A NEW BUTTON");
    let button = simonLogic.nextButton();
    circles[button].playButton();
    numButtonsShown++;
    // log the button number
    console.log(`Button ${button + 1} played`);
    timer500.start(t);
  } else {
    // log state
    console.log(`State: ${simonLogic.state}`);
    if (cheating && simonLogic.state === "HUMAN") {
      let remainingSequence = simonLogic.remainingSequence();
      console.log("its here");
      let remainingSequenceString = `${remainingSequence[0] + 1}`;
      for (let i = 1; i < remainingSequence.length; i++) {
        remainingSequenceString += `,${remainingSequence[i] + 1}`;
      }
      bottomMessage = remainingSequenceString;
    } else if (simonLogic.state === "HUMAN") {
      bottomMessage = "Now it's your turn";
    }
  }
});

function sin() {
  setSKAnimationCallback((time) => {
    if (!attractAnimation) {
      updateCircles();
      setSKAnimationCallback((time) => {
        defaultCallback(time);
      });
    } else {
      let stagger = 0;
      circles.forEach((circle) => {
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(cx, cy) - 60;
        // uses time to control the animation
        const theta = time / 1000;
        // circle.y should be between 0 and height, and relative to its current y position
        circle.y = Math.max(
          0,
          Math.min(height, cy + r * Math.sin(theta + stagger))
        );
        stagger += 0.5;
      });
    }
  });
}
