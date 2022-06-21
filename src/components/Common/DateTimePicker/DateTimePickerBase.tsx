// @ts-nocheck

import { forwardRef, useRef, useState } from "react";
import {
  CloseButton,
  createStyles,
  // extractMargins,
  Input,
  INPUT_SIZES,
  InputWrapper,
  Paper,
  Popper,
} from "@mantine/core";
import {
  useClickOutside,
  useFocusTrap,
  useMergedRef,
  useWindowEvent,
} from "@mantine/hooks";

const useStyles = createStyles((t, { size, invalid }) => ({
  wrapper: {
    ...t.fn.fontStyles(),
    position: "relative",
    cursor: "pointer",
  },
  placeholder: {
    lineHeight: `${t.fn.size({ size, sizes: INPUT_SIZES }) - 2}px`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: invalid ? t.colors.red[7] : t.colors.gray[5],
  },
  value: { overflow: "hidden", textOverflow: "ellipsis" },
  dropdownWrapper: { position: "relative", pointerEvents: "all" },
  input: { cursor: "pointer", whiteSpace: "nowrap" },
  dropdown: {
    backgroundColor: t.white,
    border: `1px solid ${t.colors.gray[2]}`,
    padding: `${t.spacing.md}px ${t.spacing.xs}px`,
  },
  arrow: { borderColor: t.colors.gray[2], background: t.white },
}));

const RIGHT_SECTION_WIDTH = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44,
};

const DateTimePickerBase = forwardRef(
  (
    {
      classNames,
      className,
      style,
      styles,
      wrapperProps,
      required,
      label,
      error,
      id,
      description,
      placeholder,
      shadow = "sm",
      transition = "pop-top-left",
      transitionDuration = 200,
      transitionTimingFunction,
      closeDropdownOnScroll = false,
      size = "sm",
      children,
      inputLabel,
      __staticSelector = "DateTimePickerBase",
      dropdownOpened,
      setDropdownOpened,
      dropdownType = "popover",
      clearable = true,
      clearButtonLabel,
      onClear,
      positionDependencies = [],
      zIndex = 300,
      withinPortal = true,
      onBlur,
      onFocus,
      onChange,
      onKeyDown,
      name = "date",
      sx,
      ...others
    },
    ref
  ) => {
    const { classes, cx, theme } = useStyles(
      { size, invalid: !!error },
      { classNames, styles, name: __staticSelector }
    );
    // const { margins, rest } = extractMargins(others);
    const [dropdownElement, setDropdownElement] = useState(null);
    const [rootElement, setRootElement] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);

    const focusTrapRef = useFocusTrap(dropdownOpened);
    const inputRef = useRef();

    const closeDropdown = () => setDropdownOpened(false);

    const closeOnEscape = (e) => {
      if (e.nativeEvent.code === "Escape") {
        closeDropdown();
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    useClickOutside(() => dropdownType === "popover" && closeDropdown(), null, [
      dropdownElement,
      rootElement,
    ]);

    useWindowEvent("scroll", () => closeDropdownOnScroll && closeDropdown());

    const rightSection = clearable ? (
      <CloseButton
        variant="transparent"
        aria-label={clearButtonLabel}
        onClick={onClear}
        size={size}
      />
    ) : null;

    const handleClick = () => setDropdownOpened(!dropdownOpened);

    const handleInputBlur = (e) => typeof onBlur === "function" && onBlur(e);

    const handleInputFocus = (e) => typeof onFocus === "function" && onFocus(e);

    const handleKeyDown = (e) => {
      typeof onKeyDown === "function" && onKeyDown(e);
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        setDropdownOpened(true);
      }
    };

    return (
      <InputWrapper
        required
        label={label}
        error={error}
        description={description}
        className={className}
        style={style}
        classNames={classNames}
        styles={styles}
        size={size}
        __staticSelector={__staticSelector}
        sx={sx}
        ref={setReferenceElement}
      >
        <div ref={setRootElement}>
          <div className={classes.wrapper}>
            <Input
              classNames={{
                ...classNames,
                input: cx(classes.input, classNames?.input),
              }}
              styles={styles}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              ref={useMergedRef(ref, inputRef)}
              __staticSelector={__staticSelector}
              size="md"
              name={name}
              placeholder={placeholder}
              value={inputLabel}
              required={true}
              invalid={!!error}
              readOnly={true}
              rightSection={rightSection}
              rightSectionWidth={theme.fn.size({
                size,
                sizes: RIGHT_SECTION_WIDTH,
              })}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChange={onChange}
              autoComplete="off"
              // {...rest}
            />
          </div>

          <Popper
            referenceElement={referenceElement}
            transitionDuration={transitionDuration}
            transitionTimingFunction={transitionTimingFunction}
            forceUpdateDependencies={positionDependencies}
            transition={transition}
            mounted={dropdownOpened}
            position="bottom"
            placement="start"
            gutter={10}
            withinPortal={withinPortal}
            withArrow
            arrowSize={3}
            zIndex={zIndex}
            arrowClassName={classes.arrow}
          >
            <div
              className={classes.dropdownWrapper}
              ref={setDropdownElement}
              data-mantine-stop-propagation={dropdownOpened}
              onKeyDownCapture={closeOnEscape}
              aria-hidden={undefined}
            >
              <Paper
                className={classes.dropdown}
                shadow={shadow}
                ref={focusTrapRef}
              >
                {children}
              </Paper>
            </div>
          </Popper>
        </div>
      </InputWrapper>
    );
  }
);

export default DateTimePickerBase;
