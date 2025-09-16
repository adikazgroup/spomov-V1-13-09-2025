// "use client";

// import { useState, useEffect, useRef, forwardRef } from "react";
// import { createPortal } from "react-dom";
// import { cn } from "@/lib/utils";
// import {
//   LuCalendar,
//   LuChevronLeft,
//   LuChevronRight,
//   LuChevronsLeft,
//   LuChevronsRight,
//   LuX,
// } from "react-icons/lu";
// import {
//   format,
//   parse,
//   addMonths,
//   subMonths,
//   addYears,
//   subYears,
//   isValid,
//   isToday,
//   isSameDay,
// } from "date-fns";

// const Calendar = forwardRef(
//   (
//     {
//       className,
//       value,
//       onChange,
//       placeholder = "Select date",
//       format: dateFormat = "yyyy-MM-dd",
//       minDate,
//       maxDate,
//       disabled = false,
//       readOnly = false,
//       showClearButton = true,
//       showTodayButton = true,
//       highlightToday = true,
//       allowManualInput = true,
//       label,
//       error,
//       helperText,
//       fullWidth = false,
//       startIcon,
//       inputClass,
//       upper = false, // kept for API compatibility
//       requiredSign = false,
//       required,
//       endIcon,
//       ...props
//     },
//     ref,
//   ) => {
//     const [selectedDate, setSelectedDate] = useState(
//       value ? new Date(value) : null,
//     );
//     const [inputValue, setInputValue] = useState(
//       value ? format(new Date(value), dateFormat) : "",
//     );

//     const [isOpen, setIsOpen] = useState(false);
//     const [isVisible, setIsVisible] = useState(false); // for animation
//     const [hasCoords, setHasCoords] = useState(false); // ✅ ensures no (0,0) flash
//     const [currentMonth, setCurrentMonth] = useState(
//       selectedDate || new Date(),
//     );

//     const portalRef = useRef(null);
//     const triggerRef = useRef(null);
//     const inputRef = useRef(null);

//     // Popup positioning (set to nulls until measured)
//     const [popupStyle, setPopupStyle] = useState({
//       top: null,
//       left: null,
//       width: null,
//       position: "absolute",
//       zIndex: 9999,
//     });

//     // Sync external value
//     useEffect(() => {
//       if (value) {
//         const date = new Date(value);
//         setSelectedDate(date);
//         setInputValue(format(date, dateFormat));
//         setCurrentMonth(date);
//       } else {
//         setSelectedDate(null);
//         setInputValue("");
//       }
//     }, [value, dateFormat]);

//     // Position helpers
//     const getActualScrollY = () => {
//       const bodyStyle = window.getComputedStyle(document.body);
//       if (bodyStyle.position === "fixed") {
//         const topValue = document.body.style.top;
//         return topValue ? Math.abs(parseInt(topValue, 10)) : 0;
//       }
//       return window.scrollY;
//     };

//     const calculatePosition = () => {
//       if (!triggerRef.current) return;

//       const rect = triggerRef.current.getBoundingClientRect();
//       const isInModal = !!triggerRef.current.closest('[role="dialog"]');

//       let top, left, position;
//       if (isInModal) {
//         top = upper ? rect.top - 8 : rect.bottom + 8;
//         left = rect.left;
//         position = "fixed";
//       } else {
//         const scrollY = getActualScrollY();
//         top = upper ? rect.top + scrollY - 8 : rect.bottom + scrollY + 8;
//         left = rect.left + window.scrollX;
//         position = "absolute";
//       }

//       setPopupStyle({
//         top,
//         left,
//         width: rect.width || 280,
//         position,
//         zIndex: isInModal ? 10000 : 9999,
//       });
//       setHasCoords(true);
//     };

//     // Open: measure first, then mount + animate (matches Select)
//     const openPopup = () => {
//       calculatePosition(); // measure synchronously
//       setIsOpen(true); // mount with correct coords on first paint
//       requestAnimationFrame(() => setIsVisible(true)); // animate in
//     };

//     const closePopup = () => {
//       setIsVisible(false);
//       setTimeout(() => {
//         setIsOpen(false);
//         setHasCoords(false); // reset so next open re-measures
//         setPopupStyle((s) => ({ ...s, top: null, left: null, width: null }));
//       }, 150);
//     };

//     // Outside click to close
//     useEffect(() => {
//       const handleOutside = (e) => {
//         if (
//           isOpen &&
//           portalRef.current &&
//           !portalRef.current.contains(e.target) &&
//           !triggerRef.current?.contains(e.target)
//         ) {
//           closePopup();
//         }
//       };
//       document.addEventListener("mousedown", handleOutside);
//       return () => document.removeEventListener("mousedown", handleOutside);
//     }, [isOpen]);

//     // Recalculate on scroll/resize while open
//     useEffect(() => {
//       if (!isOpen) return;
//       const handler = () => calculatePosition();
//       window.addEventListener("scroll", handler, true);
//       window.addEventListener("resize", handler);
//       return () => {
//         window.removeEventListener("scroll", handler, true);
//         window.removeEventListener("resize", handler);
//       };
//     }, [isOpen]);

//     // Date selection
//     const handleDateSelect = (date) => {
//       setSelectedDate(date);
//       setInputValue(format(date, dateFormat));
//       closePopup();
//       onChange?.(date);
//     };

//     // Manual input
//     const handleInputChange = (e) => {
//       const v = e.target.value;
//       setInputValue(v);

//       if (!allowManualInput) return;

//       try {
//         const parsedDate = parse(v, dateFormat, new Date());
//         if (isValid(parsedDate)) {
//           setSelectedDate(parsedDate);
//           onChange?.(parsedDate);
//           setCurrentMonth(parsedDate);
//         }
//       } catch {
//         /* ignore */
//       }
//     };

//     const handleInputBlur = () => {
//       if (inputValue === "") {
//         setSelectedDate(null);
//         onChange?.(null);
//         return;
//       }
//       try {
//         const parsed = parse(inputValue, dateFormat, new Date());
//         if (isValid(parsed)) {
//           setSelectedDate(parsed);
//           setInputValue(format(parsed, dateFormat));
//           onChange?.(parsed);
//         } else {
//           setInputValue(selectedDate ? format(selectedDate, dateFormat) : "");
//         }
//       } catch {
//         setInputValue(selectedDate ? format(selectedDate, dateFormat) : "");
//       }
//     };

//     const handleClear = (e) => {
//       e?.stopPropagation?.();
//       setSelectedDate(null);
//       setInputValue("");
//       onChange?.(null);
//     };

//     // Navigation
//     const prevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
//     const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
//     const prevYear = () => setCurrentMonth((m) => subYears(m, 1));
//     const nextYear = () => setCurrentMonth((m) => addYears(m, 1));

//     // Today
//     const goToToday = () => {
//       const today = new Date();
//       setCurrentMonth(today);
//       if (showTodayButton) handleDateSelect(today);
//     };

//     // Grid
//     const generateCalendarDays = () => {
//       const year = currentMonth.getFullYear();
//       const month = currentMonth.getMonth();
//       const first = new Date(year, month, 1);
//       const last = new Date(year, month + 1, 0);
//       const firstDow = first.getDay();
//       const days = last.getDate();
//       const cells = [];
//       for (let i = 0; i < firstDow; i++) cells.push(null);
//       for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
//       return cells;
//     };

//     const isDateDisabled = (date) => {
//       if (!date) return false;
//       if (minDate && date < new Date(minDate)) return true;
//       if (maxDate && date > new Date(maxDate)) return true;
//       return false;
//     };

//     return (
//       <div className={cn("relative", fullWidth && "w-full", className)}>
//         {label && (
//           <label
//             onClick={() => setIsVisible(false)}
//             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//           >
//             {label}
//             {requiredSign && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         {/* Trigger wrapper for measuring position */}
//         <div ref={triggerRef} className="relative flex items-center">
//           <input
//             ref={(node) => {
//               inputRef.current = node;
//               if (typeof ref === "function") ref(node);
//               else if (ref) ref.current = node;
//             }}
//             type="text"
//             className={cn(
//               "flex h-10 w-full rounded-md border border-input dark:border-[#475569] bg-background dark:bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pl-10",
//               inputClass,
//               (endIcon || (showClearButton && inputValue)) && "pr-10",
//               error && "border-red-500",
//             )}
//             placeholder={placeholder}
//             value={inputValue}
//             onChange={allowManualInput ? handleInputChange : undefined}
//             onBlur={handleInputBlur}
//             onClick={() => !disabled && !readOnly && openPopup()}
//             readOnly={!allowManualInput || readOnly}
//             disabled={disabled}
//             required={required}
//             {...props}
//           />

//           {startIcon ? (
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
//               {startIcon}
//             </div>
//           ) : (
//             <div
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={() => !disabled && !readOnly && openPopup()}
//             >
//               <LuCalendar className="h-4 w-4" />
//             </div>
//           )}

//           {inputValue && showClearButton && !disabled && !readOnly ? (
//             <div
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={handleClear}
//             >
//               <LuX className="h-4 w-4" />
//             </div>
//           ) : (
//             endIcon && (
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
//                 {endIcon}
//               </div>
//             )
//           )}
//         </div>

//         {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//         {helperText && !error && (
//           <p className="mt-1 text-xs text-gray-500">{helperText}</p>
//         )}

//         {typeof document !== "undefined" &&
//           isOpen &&
//           hasCoords &&
//           createPortal(
//             <div
//               ref={portalRef}
//               style={{
//                 top: popupStyle.top,
//                 left: popupStyle.left,
//                 width: popupStyle.width || 280,
//                 position: popupStyle.position,
//                 zIndex: popupStyle.zIndex,
//               }}
//               className={`absolute  z-50  bg-white  border border-gray-200 rounded-md shadow-lg p-3 max-w-[300px] dark:bg-gray-800 dark:border-gray-700  ${upper && "bottom-14"} ${isVisible && !disabled && !readOnly ? "visible opacity-100 -mt-1 ani3" : "invisible opacity-0 mt-5 ani2"}`}
//             >
//               {/* Calendar header */}
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     onClick={prevYear}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Previous Year"
//                   >
//                     <LuChevronsLeft className="h-4 w-4" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={prevMonth}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Previous Month"
//                   >
//                     <LuChevronLeft className="h-4 w-4" />
//                   </button>
//                 </div>

//                 <div className="text-sm font-medium">
//                   {format(currentMonth, "MMMM yyyy")}
//                 </div>

//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     onClick={nextMonth}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Next Month"
//                   >
//                     <LuChevronRight className="h-4 w-4" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={nextYear}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Next Year"
//                   >
//                     <LuChevronsRight className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Days of week */}
//               <div className="grid grid-cols-7 gap-1 mb-1 px-3 pt-3">
//                 {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
//                   <div
//                     key={day}
//                     className="text-center text-xs font-medium text-gray-500 py-1 dark:text-gray-400"
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar days */}
//               <div className="grid grid-cols-7 gap-1 px-3 pb-3">
//                 {generateCalendarDays().map((date, index) => (
//                   <div key={index} className="text-center">
//                     {date ? (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           !isDateDisabled(date) && handleDateSelect(date)
//                         }
//                         className={cn(
//                           "w-8 h-8 rounded-full text-sm flex items-center justify-center",
//                           isDateDisabled(date) &&
//                             "text-gray-300 cursor-not-allowed dark:text-gray-600",
//                           !isDateDisabled(date) &&
//                             "hover:bg-gray-100 dark:hover:bg-gray-700",
//                           selectedDate &&
//                             isSameDay(date, selectedDate) &&
//                             "bg-primary text-white hover:bg-primary/90",
//                           highlightToday &&
//                             isToday(date) &&
//                             !isSameDay(date, selectedDate) &&
//                             "border border-primary text-primary",
//                         )}
//                         disabled={isDateDisabled(date)}
//                       >
//                         {date.getDate()}
//                       </button>
//                     ) : (
//                       <div className="w-8 h-8" />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Today button */}
//               {showTodayButton && (
//                 <div className="pb-3 text-center">
//                   <button
//                     type="button"
//                     onClick={goToToday}
//                     className="text-xs text-primary hover:underline"
//                   >
//                     Today
//                   </button>
//                 </div>
//               )}
//             </div>,
//             document.body,
//           )}
//       </div>
//     );
//   },
// );

// Calendar.displayName = "Calendar";

// export { Calendar };

"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  Ref,
  MouseEvent,
  CSSProperties,
  ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  format,
  parse,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isValid,
  isToday,
  isSameDay,
} from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";

// Type definitions for the Calendar component's props
interface CalendarProps {
  className?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  showClearButton?: boolean;
  showTodayButton?: boolean;
  highlightToday?: boolean;
  allowManualInput?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  inputClass?: string;
  upper?: boolean;
  requiredSign?: boolean;
  required?: boolean;
  endIcon?: React.ReactNode;
}

const Calendar = forwardRef(
  (
    {
      className,
      value,
      onChange,
      placeholder = "Select date",
      format: dateFormat = "yyyy-MM-dd",
      minDate,
      maxDate,
      disabled = false,
      readOnly = false,
      showClearButton = true,
      showTodayButton = true,
      highlightToday = true,
      allowManualInput = true,
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      inputClass,
      upper = false,
      requiredSign = false,
      required,
      endIcon,
      ...props
    }: CalendarProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value ? new Date(value) : null
    );
    const [inputValue, setInputValue] = useState<string>(
      value ? format(new Date(value), dateFormat) : ""
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [hasCoords, setHasCoords] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(
      selectedDate || new Date()
    );

    const portalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [popupStyle, setPopupStyle] = useState<CSSProperties>({
      top: undefined,
      left: undefined,
      width: undefined,
      position: "absolute",
      zIndex: 9999,
    });

    // Sync external value
    useEffect(() => {
      if (value) {
        const date = new Date(value);
        setSelectedDate(date);
        setInputValue(format(date, dateFormat));
        setCurrentMonth(date);
      } else {
        setSelectedDate(null);
        setInputValue("");
      }
    }, [value, dateFormat]);

    // Position helpers
    const getActualScrollY = (): number => {
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.position === "fixed") {
        const topValue = document.body.style.top;
        return topValue ? Math.abs(parseInt(topValue, 10)) : 0;
      }
      return window.scrollY;
    };

    const calculatePosition = (): void => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const isInModal = !!triggerRef.current.closest('[role="dialog"]');

      let top: number | null,
        left: number | null,
        position: CSSProperties["position"];
      if (isInModal) {
        top = upper ? rect.top - 8 : rect.bottom + 8;
        left = rect.left;
        position = "fixed";
      } else {
        const scrollY = getActualScrollY();
        top = upper ? rect.top + scrollY - 8 : rect.bottom + scrollY + 8;
        left = rect.left + window.scrollX;
        position = "absolute";
      }

      setPopupStyle({
        top,
        left,
        width: rect.width || 280,
        position,
        zIndex: isInModal ? 10000 : 9999,
      });
      setHasCoords(true);
    };

    const openPopup = (): void => {
      calculatePosition();
      setIsOpen(true);
      requestAnimationFrame(() => setIsVisible(true));
    };

    const closePopup = (): void => {
      setIsVisible(false);
      setTimeout(() => {
        setIsOpen(false);
        setHasCoords(false);
        setPopupStyle((s) => ({
          ...s,
          top: undefined,
          left: undefined,
          width: undefined,
        }));
      }, 150);
    };

    // Outside click to close
    useEffect(() => {
      const handleOutside = (e: MouseEvent | globalThis.MouseEvent) => {
        if (
          isOpen &&
          portalRef.current &&
          !portalRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          closePopup();
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, [isOpen]);

    // Recalculate on scroll/resize while open
    useEffect(() => {
      if (!isOpen) return;
      const handler = () => calculatePosition();
      window.addEventListener("scroll", handler, true);
      window.addEventListener("resize", handler);
      return () => {
        window.removeEventListener("scroll", handler, true);
        window.removeEventListener("resize", handler);
      };
    }, [isOpen]);

    // Date selection
    const handleDateSelect = (date: Date): void => {
      setSelectedDate(date);
      setInputValue(format(date, dateFormat));
      closePopup();
      onChange?.(date);
    };

    // Manual input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
      const v = e.target.value;
      setInputValue(v);

      if (!allowManualInput) return;

      try {
        const parsedDate = parse(v, dateFormat, new Date());
        if (isValid(parsedDate)) {
          setSelectedDate(parsedDate);
          onChange?.(parsedDate);
          setCurrentMonth(parsedDate);
        }
      } catch (err) {
        // ignore
      }
    };

    const handleInputBlur = (): void => {
      if (inputValue === "") {
        setSelectedDate(null);
        onChange?.(null);
        return;
      }
      try {
        const parsed = parse(inputValue, dateFormat, new Date());
        if (isValid(parsed)) {
          setSelectedDate(parsed);
          setInputValue(format(parsed, dateFormat));
          onChange?.(parsed);
        } else {
          setInputValue(selectedDate ? format(selectedDate, dateFormat) : "");
        }
      } catch (err) {
        setInputValue(selectedDate ? format(selectedDate, dateFormat) : "");
      }
    };

    const handleClear = (
      e: MouseEvent<HTMLDivElement | HTMLButtonElement>
    ): void => {
      e?.stopPropagation?.();
      setSelectedDate(null);
      setInputValue("");
      onChange?.(null);
    };

    // Navigation
    const prevMonth = (): void => setCurrentMonth((m) => subMonths(m, 1));
    const nextMonth = (): void => setCurrentMonth((m) => addMonths(m, 1));
    const prevYear = (): void => setCurrentMonth((m) => subYears(m, 1));
    const nextYear = (): void => setCurrentMonth((m) => addYears(m, 1));

    // Today
    const goToToday = (): void => {
      const today = new Date();
      setCurrentMonth(today);
      if (showTodayButton) handleDateSelect(today);
    };

    // Grid
    const generateCalendarDays = (): (Date | null)[] => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      const firstDow = first.getDay();
      const days = last.getDate();
      const cells: (Date | null)[] = [];
      for (let i = 0; i < firstDow; i++) cells.push(null);
      for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
      return cells;
    };

    const isDateDisabled = (date: Date): boolean => {
      if (!date) return false;
      if (minDate && date < new Date(minDate)) return true;
      if (maxDate && date > new Date(maxDate)) return true;
      return false;
    };

    return (
      <div className={cn("relative", fullWidth && "w-full", className)}>
        {label && (
          <label
            onClick={() => setIsVisible(false)}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {requiredSign && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div ref={triggerRef} className="relative flex items-center">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref && node)
                (ref as React.MutableRefObject<HTMLInputElement>).current =
                  node;
            }}
            type="text"
            className={cn(
              "flex h-10 w-full rounded-md border border-input dark:border-[#675ff89d] bg-background dark:bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pl-10",
              inputClass,
              (endIcon || (showClearButton && inputValue)) && "pr-10",
              error && "border-red-500"
            )}
            placeholder={placeholder}
            value={inputValue}
            onChange={allowManualInput ? handleInputChange : undefined}
            onBlur={handleInputBlur}
            onClick={() => !disabled && !readOnly && openPopup()}
            readOnly={!allowManualInput || readOnly}
            disabled={disabled}
            required={required}
            {...props}
          />

          {startIcon ? (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {startIcon}
            </div>
          ) : (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => !disabled && !readOnly && openPopup()}
            >
              <Icon icon="lucide:calender" className="size-4" />
            </div>
          )}

          {inputValue && showClearButton && !disabled && !readOnly ? (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={handleClear}
            >
              <Icon icon="lucide:x" className="size-4" />
            </div>
          ) : (
            endIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {endIcon}
              </div>
            )
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}

        {typeof document !== "undefined" &&
          isOpen &&
          hasCoords &&
          createPortal(
            <div
              ref={portalRef}
              style={{
                top: popupStyle.top as number,
                left: popupStyle.left as number,
                width: popupStyle.width || 280,
                position: popupStyle.position,
                zIndex: popupStyle.zIndex,
              }}
              className={`absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg p-3 max-w-[300px] dark:bg-[#140D37] dark:border-[#675ff89d] ${
                upper && "bottom-14"
              } ${
                isVisible && !disabled && !readOnly
                  ? "visible opacity-100 -mt-1 ani3"
                  : "invisible opacity-0 mt-5 ani2"
              }`}
            >
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={prevYear}
                    className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-[#1e1548]"
                    aria-label="Previous Year"
                  >
                    <Icon icon="lucide:chevrons-left" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-[#1e1548]"
                    aria-label="Previous Month"
                  >
                    <Icon icon="lucide:chevron-left" className="size-4" />
                  </button>
                </div>

                <div className="text-sm font-medium">
                  {format(currentMonth, "MMMM yyyy")}
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-[#1e1548]"
                    aria-label="Next Month"
                  >
                    <Icon icon="lucide:chevron-right" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextYear}
                    className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-[#1e1548]"
                    aria-label="Next Year"
                  >
                    <Icon icon="lucide:chevrons-right" className="size-4" />
                  </button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-1 px-3 pt-3">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                {generateCalendarDays().map((date, index) => (
                  <div key={index} className="text-center">
                    {date ? (
                      <button
                        type="button"
                        onClick={() =>
                          !isDateDisabled(date) && handleDateSelect(date)
                        }
                        className={cn(
                          "w-8 h-8 rounded-full text-sm flex items-center justify-center",
                          isDateDisabled(date) &&
                            "text-gray-300 cursor-not-allowed dark:text-gray-600",
                          !isDateDisabled(date) &&
                            "hover:bg-gray-100 dark:hover:bg-[#322764]",
                          selectedDate &&
                            isSameDay(date, selectedDate) &&
                            "bg-primary text-white hover:bg-primary/90",
                          highlightToday &&
                            isToday(date) &&
                            (!selectedDate || !isSameDay(date, selectedDate)) &&
                            "border border-primary text-primary"
                        )}
                        disabled={isDateDisabled(date)}
                      >
                        {date.getDate()}
                      </button>
                    ) : (
                      <div className="w-8 h-8" />
                    )}
                  </div>
                ))}
              </div>

              {/* Today button */}
              {showTodayButton && (
                <div className="pb-3 text-center">
                  <button
                    type="button"
                    onClick={goToToday}
                    className="text-xs text-primary hover:underline"
                  >
                    Today
                  </button>
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };
