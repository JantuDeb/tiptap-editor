import React from 'react';

import { Slot } from '@radix-ui/react-slot';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

import type { ButtonViewReturnComponentProps } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/tiptap-ui-primitive/tooltip';
import { cn, getShortcutKeys } from '@/lib/tiptap-utils';
import { Toggle } from '@/components/tiptap-ui-primitive/toggle';
import { icons } from '@/components/tiptap-icons/icons';

export interface ActionButtonProps {
  icon?: string;
  title?: string;
  tooltip?: string;
  disabled?: boolean;
  shortcutKeys?: string[];
  customClass?: string;
  loading?: boolean;
  tooltipOptions?: TooltipContentProps;
  color?: string;
  action?: ButtonViewReturnComponentProps['action'];
  isActive?: ButtonViewReturnComponentProps['isActive'];
  children?: React.ReactNode;
  asChild?: boolean;
  upload?: boolean;
  initialDisplayedColor?: string;
  dataState?: boolean;
}

const ActionButton = React.forwardRef<
  HTMLButtonElement,
  Partial<ActionButtonProps>
>((props, ref) => {
  const {
    icon = undefined,
    tooltip = undefined,
    disabled = false,
    customClass = '',
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    children,
    asChild = false,
    dataState = false,
    ...rest
  } = props;

  const Icon = icons[icon as string];
  const Comp = asChild ? Slot : Toggle;

  const onClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    action?.(e);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp
          className={cn('action-button', customClass)}
          data-state={dataState ? 'on' : 'off'}
          disabled={disabled}
          onClick={onClickHandler}
          ref={ref}
          size="sm"
          {...(rest as Omit<typeof rest, 'loading'>)}
        >
          {Icon && <Icon className="action-button__icon" />}
          {children}
        </Comp>
      </TooltipTrigger>

      {tooltip && (
        <TooltipContent
          {...tooltipOptions}
          className="tooltip"
        >
          <div className="tooltip__content">
            <div>{tooltip}</div>

            {!!shortcutKeys?.length && (
              <span className="tooltip__shortcut">
                {getShortcutKeys(shortcutKeys)}
              </span>
            )}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
});

export { ActionButton };
