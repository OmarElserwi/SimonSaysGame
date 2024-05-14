import { Drawable } from "../../simplekit/drawable";
import { hitTestCircle } from "./hittest";
import { CallbackTimer } from "./timer";

export abstract class Shape implements Drawable {
  fill: string = "grey";
  stroke: string = "";
  strokeWidth = 0;

  get isFilled() {
    return this.fill != "";
  }

  get isStroked() {
    return this.stroke != "" && this.strokeWidth > 0;
  }

  abstract draw(gc: CanvasRenderingContext2D): void;

  abstract hitTest(mx: number, my: number): boolean;
}

export const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

export class Circle extends Shape {
  x: number;
  y: number;
  r: number;
  index: number;
  hoverFill: string = "red";
  normalFill: string = "grey";
  beingPlayed: boolean = false;
  startTime: number = 0;

  constructor(
    x: number,
    y: number,
    r: number,
    index: number,
    fill: string = "grey"
  ) {
    super();
    this.x = x;
    this.y = y;
    this.r = r;
    this.index = index;
    this.fill = fill;
    this.normalFill = fill;
    this.stroke = "";
  }

  growTimer = new CallbackTimer(500, () => {
    this.r = 60;
  });

  update(time: number) {
    this.growTimer.update(time);
    if (this.beingPlayed) {
      const timePassed = performance.now() - this.startTime;
      this.r = lerp(60, 75, timePassed / 500);
      if (timePassed > 500) {
        this.r = 60;
      }
      if (timePassed > 1000) {
        this.beingPlayed = false;

        // log time passed in a neat way
        console.log(`Time passed: ${timePassed}`);
      }
    }
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.beginPath();
    gc.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    gc.fillStyle = this.fill;
    gc.strokeStyle = this.stroke;
    gc.lineWidth = this.strokeWidth;
    if (this.isFilled) gc.fill();
    if (this.isStroked) gc.stroke();
    gc.fill();
    gc.closePath();

    gc.font = "32pt sans-serif";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillStyle = "white";
    gc.fillText(`${this.index + 1}`, this.x, this.y);
    gc.restore();
  }

  hitTest(mx: number, my: number) {
    return hitTestCircle(
      mx,
      my,
      this.x,
      this.y,
      this.r,
      this.isFilled,
      this.isStroked
    );
  }

  click(): number {
    console.log(`clicked on circle at ${this.index}`);
    this.playButton();
    return this.index;
  }

  playButton() {
    this.startTime = performance.now();
    this.beingPlayed = true;
  }
}
