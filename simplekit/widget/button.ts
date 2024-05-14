import { SKElement } from "./element";
import * as Style from "./style";
import { insideHitTestRectangle } from "../utility/hittest";
import { SKEvent, SKMouseEvent } from "..";

export class SKButton extends SKElement {
  state: "idle" | "hover" | "down" = "idle";

  constructor(text: string);
  constructor(text: string, x: number, y: number);
  constructor(
    text: string,
    x: number,
    y: number,
    width: number,
    height?: number
  );
  constructor(
    public text: string,
    x = 0,
    y = 0,
    public width = 200, // default button width
    public height = Style.widgetHeight
  ) {
    super(x, y);
  }

  handleMouseEvent(me: SKMouseEvent) {
    // console.log(`${this.text} ${me.type}`);

    switch (me.type) {
      case "mousedown":
        this.state = "down";
        return true;
        break;
      case "mouseup":
        this.state = "hover";
        // return true if a bubble listener was registered
        return this.dispatch({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        } as SKEvent);
        break;
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
    }
    return false;
  }

  hittest(mx: number, my: number): boolean {
    return insideHitTestRectangle(
      mx,
      my,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    // thick highlight rect
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.roundRect(this.x, this.y, this.width, this.height, 4);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // normal background
    gc.beginPath();
    gc.roundRect(this.x, this.y, this.width, this.height, 4);
    gc.fillStyle =
      this.state == "down" ? Style.highlightColour : "lightgrey";
    gc.strokeStyle = "black";
    // change fill to show down state
    gc.lineWidth = this.state == "down" ? 4 : 2;
    gc.fill();
    gc.stroke();

    // button label
    gc.font = "12pt sans-serif";
    gc.fillStyle = "black";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    gc.restore();
  }

  public toString(): string {
    return `SKButton '${this.text}'`;
  }
}
