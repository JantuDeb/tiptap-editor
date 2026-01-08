export interface GeneralOptions {
  /** Enabled divider */
  divider: boolean;
  /** Enabled spacer */
  spacer: boolean;
  /** Button view function */
  //   button: ButtonView<T>;
  /** Show on Toolbar */
  toolbar?: boolean;
  /** Shortcut keys override */
  shortcutKeys?: string[] | string[][];
}
