import { measureText } from "../utility";
import { SKElement } from "./element";
import * as Style from "./style";

export class SKLabel extends SKElement {
  align: "centre" | "left" | "right" = "centre";
  font = Style.font;

  constructor(text: string);
  constructor(text: string, x: number, y: number);
  constructor(text: string, x: number, y: number, width: number);
  constructor(public text: string, x = 0, y = 0, width?: number) {
    super(x, y);

    this.text = text;

    // if no width or height is specified, calculate the size
    const m = measureText(text, this.font);

    if (!m) {
      console.warn(`measureText failed in SKLabel for ${text}`);
      return;
    }

    this.height =
      m.fontBoundingBoxAscent +
      m.fontBoundingBoxDescent +
      Style.textPadding;
    this.width = width || m.width + Style.textPadding * 2;
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    // border (for debug)
    if (Style.debug) {
      gc.strokeStyle = "grey";
      gc.setLineDash([3, 3]);
      gc.strokeRect(this.x, this.y, this.width, this.height);
    }

    // button label
    gc.font = Style.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";
    const padding = 10;
    switch (this.align) {
      case "left":
        gc.textAlign = "left";
        gc.fillText(
          this.text,
          this.x + padding,
          this.y + this.height / 2
        );

        break;
      case "centre":
        gc.textAlign = "center";
        gc.fillText(
          this.text,
          this.x + this.width / 2,
          this.y + this.height / 2
        );

        break;
      case "right":
        gc.textAlign = "right";
        gc.fillText(
          this.text,
          this.x + this.width - padding,
          this.y + this.height / 2
        );

        break;
    }

    gc.restore();
  }

  public toString(): string {
    return `SKLabel '${this.text}'`;
  }
}
