import { SKEvent, SKKeyboardEvent, SKMouseEvent } from "..";
import { Drawable } from "../drawable/drawable";
import { BoundingBox } from "../utility";

type EventHandler = (me: SKEvent) => boolean | void;

type DispatchRoute = {
  type: string; // event type
  handler: EventHandler;
  capture: boolean;
};

export abstract class SKElement implements Drawable {
  abstract draw(gc: CanvasRenderingContext2D): void;

  id = ""; // for debugging

  constructor(x: number, y: number);
  constructor();
  constructor(public x = 0, public y = 0) {}

  minWidth = 32;
  width = 32;
  maxWidth = 256;

  minHeight = 32;
  height = 32;
  maxHeight = 256;

  //#region event dispatching

  private dispatchTable: DispatchRoute[] = [];

  protected dispatch(e: SKEvent, capture = false): boolean {
    let handled = false;
    this.dispatchTable.forEach((d) => {
      if (d.type == e.type && d.capture == capture) {
        handled ||= d.handler(e) as boolean;
      }
    });
    return handled;
  }

  addEventListener(
    type: string,
    handler: EventHandler,
    capture = false
  ) {
    this.dispatchTable.push({ type, handler, capture });
  }

  removeEventListener(
    type: string,
    handler: EventHandler,
    capture = false
  ) {
    this.dispatchTable = this.dispatchTable.filter(
      (d) =>
        d.type != type && d.handler != handler && d.capture != capture
    );
  }

  //#endregion

  //#region event handling

  handleKeyboardEvent(ke: SKKeyboardEvent): boolean {
    return false;
  }

  handleMouseEvent(ms: SKMouseEvent): boolean {
    return false;
  }

  handleMouseEventCapture(ms: SKMouseEvent): boolean {
    return false;
  }

  //#endregion

  hittest(x: number, y: number) {
    return false;
  }

  // for layout
  bounds: BoundingBox = new BoundingBox(0, 0, 0, 0);

  public toString(): string {
    return `SKElement id:${this.id}`;
  }
}
