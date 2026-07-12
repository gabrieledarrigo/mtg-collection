import { Popover as BasePopover } from "@base-ui/react/popover";
import styles from "./Popover.module.css";

export enum PopoverSide {
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
}

export type PopoverProps = {
  renderTrigger: React.ReactElement;
  title?: string;
  side?: PopoverSide;
  sideOffset?: number;
  children: React.ReactNode;
};

export const DEFAULT_SIDE_OFFSET = 8;

export function Popover({
  renderTrigger,
  title,
  side,
  sideOffset = DEFAULT_SIDE_OFFSET,
  children,
}: PopoverProps) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger render={renderTrigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={sideOffset} side={side}>
          <BasePopover.Popup className={styles.popup}>
            <BasePopover.Arrow className={styles.arrow} />
            {title && (
              <BasePopover.Title className={styles.title}>
                {title}
              </BasePopover.Title>
            )}
            <BasePopover.Description className={styles.description}>
              {children}
            </BasePopover.Description>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
