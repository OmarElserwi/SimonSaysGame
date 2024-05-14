import { insideHitTestRectangle } from "../utility/hittest";
import { SKElement } from "./element";
import { LayoutMethod } from "../layout";
import { SKMouseEvent } from "..";

export class SKContainer extends SKElement {
  constructor(x: number, y: number);
  constructor(x: number, y: number, width: number, height: number);
  constructor(
    x: number,
    y: number,
    public width = 32,
    public height = 32
  ) {
    super(x, y);
    this.x = x;
    this.y = y;
  }

  //#region managing children

  children: SKElement[] = [];

  addChild(element: SKElement) {
    this.children.push(element);
  }

  removeChild(element: SKElement) {
    this.children = this.children.filter((el) => el != element);
  }

  //#endregion

  handleMouseEventCapture(me: SKMouseEvent) {
    // console.log(`${this.toString()} capture ${me.type}`);

    switch (me.type) {
      case "click":
        return this.dispatch(
          {
            source: this,
            timeStamp: me.timeStamp,
            type: "action",
          },
          true
        );
        break;
    }
    return false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    // console.log(`${this.toString()} bubble ${me.type}`);

    switch (me.type) {
      case "click":
        return this.dispatch({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        });
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

  fill = "";

  draw(gc: CanvasRenderingContext2D) {
    if (this.fill) {
      gc.save();
      gc.fillStyle = this.fill;
      gc.fillRect(this.x, this.y, this.width, this.height);
      gc.restore();
    }

    gc.save();
    gc.translate(this.x, this.y);
    this.children.forEach((el) => el.draw(gc));
    gc.restore();
  }

  //#region layout children

  protected _layoutMethod: LayoutMethod | undefined;
  set layoutMethod(lm: LayoutMethod) {
    this._layoutMethod = lm;
  }

  doLayout() {
    if (this._layoutMethod) {
      this._layoutMethod(
        { width: this.width, height: this.height },
        this.children
      );
      // console.log(width, height);
      // this.width = width;
      // this.height = height;
    }
  }

  //#endregion

  public toString(): string {
    return `SKContainer '${this.fill}'`;
  }
}
