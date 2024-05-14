import { FundamentalEvent } from "../../simplekit/create-loop";
import { SKMouseEvent } from "../../simplekit/events";
import { distance } from "../../simplekit/utility";

export const longPressTranslator = {
  state: "IDLE",
  // parameters for transitions
  timeThreshold: 1000, // milliseconds
  // for tracking thresholds
  startTime: 0,
  movementThreshold: 50,
  // for tracking thresholds
  startX: 0,
  startY: 0,

  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    switch (this.state) {
      case "IDLE":
        if (fe && fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x || 0;
          this.startY = fe.y || 0;
          this.startTime = fe.timeStamp;
        }
        break;

      case "DOWN":
        if (
          fe.x &&
          fe.y &&
          distance(fe.x, fe.y, this.startX, this.startY) >
            this.movementThreshold
        ) {
          this.state = "IDLE";
        } else if (fe.timeStamp - this.startTime > this.timeThreshold) {
          this.state = "IDLE";
          return new SKMouseEvent(
            "longpress",
            fe.timeStamp,
            this.startX || 0,
            this.startY || 0
          );
        } else if (fe.type == "mouseup") {
          this.state = "IDLE";
        }
        break;
    }
    return;
  },
};
