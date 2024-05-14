import { SKKeyboardEvent, SKMouseEvent } from "..";
import { insideHitTestRectangle, measureText } from "../utility";
import { SKElement } from "./element";
import * as Style from "./style";
import { KeyboardDispatcher } from "../keyboarddispatch";

export class SKTextfield extends SKElement {
  state: "idle" | "hover" = "idle";
  focus = false;

  font = Style.font;

  constructor(text: string);
  constructor(text: string, x: number, y: number);
  constructor(text: string, x: number, y: number, width: number);
  constructor(public text: string, x = 0, y = 0, width?: number) {
    super(x, y);

    // if no width or height is specified, calculate the size
    const m = measureText(text, this.font);

    if (!m) {
      console.warn(`measureText failed in SKTextfield for ${text}`);
      return;
    }

    this.height =
      m.fontBoundingBoxAscent +
      m.fontBoundingBoxDescent +
      Style.textPadding;
    this.width = width || m.width + Style.textPadding * 2;
  }

  protected applyEdit(text: string, key: string): string {
    if (key == "Backspace") {
      return text.slice(0, -1);
    } else if (key.length == 1) {
      return text + key;
    } else return text;
  }

  handleKeyboardEvent(ke: SKKeyboardEvent) {
    switch (ke.type) {
      case "focusout":
        this.focus = false;
        return true;
        break;
      case "focusin":
        this.focus = true;
        return true;
        break;
      case "keypress":
        if (this.focus && ke.key) {
          this.text = this.applyEdit(this.text, ke.key);
        }
        return this.dispatch({
          source: this,
          timeStamp: ke.timeStamp,
          type: "textchanged",
        });
        break;
    }

    return false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
      case "click":
        KeyboardDispatcher.requestFocus(this);
        return true;
        break;
      case "mousedown":
        return false;
        break;
      case "mouseup":
        return false;
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
    const padding = 10;

    gc.save();

    // thick highlight rect
    if (this.state == "hover") {
      gc.beginPath();
      gc.rect(this.x, this.y, this.width, this.height);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // border
    gc.beginPath();
    gc.rect(this.x, this.y, this.width, this.height);
    gc.fillStyle = "white";
    gc.fill();
    gc.lineWidth = 1;
    gc.strokeStyle = this.focus ? "mediumblue" : "black";
    gc.stroke();

    // highlight
    // gc.fillStyle = SKStyle.highlightColor;
    // gc.fillRect(
    //   this.x + padding,
    //   this.y + padding / 2,
    //   50,
    //   this.height - padding
    // );

    // text
    gc.font = Style.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";
    gc.textAlign = "left";
    gc.fillText(
      this.text,
      this.x + padding,
      this.y + this.height / 2
    );

    gc.restore();
  }

  public toString(): string {
    return `SKTextfield '${this.text}'`;
  }
}
