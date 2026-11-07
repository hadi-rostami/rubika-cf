import { RubikaConfigError } from "./errors";
import { ButtonTypeEnum } from "./types/enums";
import type { Button, Keypad, KeypadRow } from "./types";

export function button(id: string, text: string): Button {
  if (!id) throw new RubikaConfigError("Button id is required");
  if (!text) throw new RubikaConfigError("Button text is required");
  return { id, type: ButtonTypeEnum.Simple, button_text: text };
}

export class KeypadBuilder {
  private rows: KeypadRow[] = [];
  private current: Button[] = [];
  private resize?: boolean;
  private oneTime?: boolean;

  row(...buttons: Button[]): this {
    this.flush();
    if (buttons.length > 0) this.rows.push({ buttons });
    return this;
  }

  button(id: string, text: string): this {
    this.current.push(button(id, text));
    return this;
  }

  newRow(): this {
    this.flush();
    return this;
  }

  resized(value = true): this {
    this.resize = value;
    return this;
  }

  oneTimeUse(value = true): this {
    this.oneTime = value;
    return this;
  }

  build(): Keypad {
    this.flush();
    if (this.rows.length === 0) {
      throw new RubikaConfigError("Keypad must have at least one button");
    }
    const keypad: Keypad = {
      rows: this.rows.map((r) => ({ buttons: [...r.buttons] })),
    };
    if (this.resize !== undefined) keypad.resize_keyboard = this.resize;
    if (this.oneTime !== undefined) keypad.one_time_keyboard = this.oneTime;
    return keypad;
  }

  private flush() {
    if (this.current.length > 0) {
      this.rows.push({ buttons: this.current });
      this.current = [];
    }
  }
}

export function keypad(
  rows: (string | [id: string, text: string])[][],
  options: { resize?: boolean; oneTime?: boolean } = {},
): Keypad {
  const b = new KeypadBuilder();
  for (const r of rows) {
    b.row(
      ...r.map((x) =>
        typeof x === "string" ? button(x, x) : button(x[0], x[1]),
      ),
    );
  }
  if (options.resize !== undefined) b.resized(options.resize);
  if (options.oneTime !== undefined) b.oneTimeUse(options.oneTime);
  return b.build();
}