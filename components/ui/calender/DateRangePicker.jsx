// "use client";

// import { useState, useEffect, useRef, forwardRef } from "react";
// import { createPortal } from "react-dom";
// import { cn } from "@/lib/utils";
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
//   isBefore,
//   isWithinInterval,
// } from "date-fns";
// import { Icon } from "@iconify/react";

// const DateRangePicker = forwardRef(
//   (
//     {
//       className,
//       value = { start: null, end: null },
//       onChange,
//       placeholder = "Select date range",
//       format: dateFormat = "yyyy-MM-dd",
//       separator = " - ",
//       minDate,
//       maxDate,
//       disabled = false,
//       readOnly = false,
//       showClearButton = true,
//       highlightToday = true,
//       allowManualInput = true,
//       label,
//       error,
//       helperText,
//       fullWidth = false,
//       startIcon,
//       align = "left-0",
//       endIcon,
//       responsiveWidth = 764,
//       ...props
//     },
//     ref
//   ) => {
//     const [dateRange, setDateRange] = useState({
//       start: value.start ? new Date(value.start) : null,
//       end: value.end ? new Date(value.end) : null,
//     });
//     const [inputValue, setInputValue] = useState("");
//     const [isOpen, setIsOpen] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const [hasCoords, setHasCoords] = useState(false);
//     const [currentMonth, setCurrentMonth] = useState(
//       dateRange.start || new Date()
//     );
//     const [nextMonth, setNextMonth] = useState(addMonths(currentMonth, 1));
//     const [selectingStart, setSelectingStart] = useState(true);
//     const [hoverDate, setHoverDate] = useState(null);
//     const [isMobile, setIsMobile] = useState(false);

//     // Refs
//     const calendarRef = useRef(null);
//     const inputRef = useRef(null);
//     const triggerRef = useRef(null);

//     // Dropdown style state (portal)
//     const [dropdownStyle, setDropdownStyle] = useState({
//       top: 0,
//       left: 0,
//       width: 0,
//       position: "absolute",
//       zIndex: 9999,
//     });

//     const getActualScrollY = () => {
//       const bodyStyle = window.getComputedStyle(document.body);
//       if (bodyStyle.position === "fixed") {
//         const topValue = document.body.style.top;
//         return topValue ? Math.abs(parseInt(topValue, 10)) : 0;
//       }
//       return window.scrollY;
//     };

//     const calculateDropdownPosition = () => {
//       if (!triggerRef.current) return;
//       const rect = triggerRef.current.getBoundingClientRect();
//       const calendarWidth = isMobile ? 300 : 580; // Get the calendar width based on screen size
//       const isInModal = !!triggerRef.current.closest('[role="dialog"]');

//       let top, left, position;

//       if (isInModal) {
//         top = rect.bottom + 3;
//         left = rect.left;
//         position = "fixed";
//       } else {
//         top = rect.bottom + getActualScrollY() + 3;
//         position = "absolute";

//         // ✅ NEW LOGIC: Check if there's enough space to the right
//         // If not, position it to the right of the trigger
//         if (rect.right + calendarWidth > window.innerWidth) {
//           left = rect.left + window.scrollX;
//         } else {
//           left = rect.right + window.scrollX - calendarWidth;
//         }

//         // Check for overflow on the left and adjust if necessary
//         if (left < 0) {
//           left = rect.left + window.scrollX;
//         }
//       }

//       setDropdownStyle({
//         top,
//         left,
//         width: calendarWidth,
//         position,
//         zIndex: isInModal ? 10000 : 9999,
//       });
//       setHasCoords(true);
//     };

//     const openCalendar = () => {
//       calculateDropdownPosition(); // measure first
//       setIsOpen(true); // mount with correct coords
//       requestAnimationFrame(() => setIsVisible(true)); // animate in
//     };

//     const closeCalendar = () => {
//       setIsVisible(false);
//       setTimeout(() => {
//         setIsOpen(false);
//         setHasCoords(false); // reset so next open remeasures
//         setDropdownStyle((s) => ({
//           ...s,
//           top: 0,
//           left: 0,
//           width: 0,
//           right: 0,
//         }));
//       }, 150);
//     };

//     // --- Responsive check ---
//     useEffect(() => {
//       const checkIsMobile = () =>
//         setIsMobile(window.innerWidth < responsiveWidth);
//       checkIsMobile();
//       window.addEventListener("resize", checkIsMobile);
//       return () => window.removeEventListener("resize", checkIsMobile);
//     }, [responsiveWidth]);

//     // --- Input formatting ---
//     const formatInputValue = (range) => {
//       if (range.start && range.end) {
//         return `${format(range.start, dateFormat)}${separator}${format(
//           range.end,
//           dateFormat
//         )}`;
//       } else if (range.start) {
//         return `${format(range.start, dateFormat)}${separator}...`;
//       }
//       return "";
//     };

//     // --- Sync with external value ---
//     useEffect(() => {
//       const newRange = {
//         start: value.start ? new Date(value.start) : null,
//         end: value.end ? new Date(value.end) : null,
//       };
//       setDateRange(newRange);
//       setInputValue(formatInputValue(newRange));
//       if (newRange.start) {
//         setCurrentMonth(newRange.start);
//         setNextMonth(addMonths(newRange.start, 1));
//       }
//     }, [value, dateFormat, separator]);

//     // --- Outside click to close ---
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         const target = event.target;
//         if (
//           isOpen &&
//           calendarRef.current &&
//           !calendarRef.current.contains(target) &&
//           !triggerRef.current?.contains(target)
//         ) {
//           closeCalendar();
//         }
//       };
//       document.addEventListener("mousedown", handleClickOutside);
//       return () =>
//         document.removeEventListener("mousedown", handleClickOutside);
//     }, [isOpen]);

//     // --- Reposition on scroll/resize while open ---
//     useEffect(() => {
//       if (!isOpen) return;
//       const handleReposition = () => calculateDropdownPosition();
//       window.addEventListener("scroll", handleReposition, true);
//       window.addEventListener("resize", handleReposition);
//       return () => {
//         window.removeEventListener("scroll", handleReposition, true);
//         window.removeEventListener("resize", handleReposition);
//       };
//     }, [isOpen]);

//     // --- Date selection ---
//     const handleDateSelect = (date) => {
//       let newRange = { ...dateRange };

//       if (
//         selectingStart ||
//         !dateRange.start ||
//         (dateRange.start && dateRange.end)
//       ) {
//         // Start new selection
//         newRange = { start: date, end: null };
//         setSelectingStart(false);
//       } else {
//         // Complete selection
//         if (isBefore(date, dateRange.start)) {
//           newRange = { start: date, end: dateRange.start };
//         } else {
//           newRange = { start: dateRange.start, end: date };
//         }
//         setSelectingStart(true);
//         closeCalendar();
//       }

//       setDateRange(newRange);
//       setInputValue(formatInputValue(newRange));
//       onChange?.(newRange);
//     };

//     // --- Manual input ---
//     const handleInputChange = (e) => {
//       const v = e.target.value;
//       setInputValue(v);
//       if (!allowManualInput) return;

//       if (v.includes(separator)) {
//         try {
//           const [startStr, endStr] = v.split(separator);
//           if (startStr && endStr) {
//             const parsedStart = parse(startStr.trim(), dateFormat, new Date());
//             const parsedEnd = parse(endStr.trim(), dateFormat, new Date());
//             if (isValid(parsedStart) && isValid(parsedEnd)) {
//               const newRange = { start: parsedStart, end: parsedEnd };
//               setDateRange(newRange);
//               onChange?.(newRange);
//             }
//           }
//         } catch {
//           // ignore parse errors
//         }
//       }
//     };

//     const handleInputBlur = () => {
//       if (inputValue === "") {
//         const cleared = { start: null, end: null };
//         setDateRange(cleared);
//         onChange?.(cleared);
//         return;
//       }
//       setInputValue(formatInputValue(dateRange));
//     };

//     const handleClear = (e) => {
//       e?.stopPropagation?.();
//       const cleared = { start: null, end: null };
//       setDateRange(cleared);
//       setInputValue("");
//       setSelectingStart(true);
//       onChange?.(cleared);
//     };

//     // --- Navigation ---
//     const prevMonth = () => {
//       setCurrentMonth((m) => subMonths(m, 1));
//       setNextMonth((m) => subMonths(m, 1));
//     };
//     const nextMonthHandler = () => {
//       setCurrentMonth((m) => addMonths(m, 1));
//       setNextMonth((m) => addMonths(m, 1));
//     };
//     const prevYear = () => {
//       setCurrentMonth((m) => subYears(m, 1));
//       setNextMonth((m) => subYears(m, 1));
//     };
//     const nextYear = () => {
//       setCurrentMonth((m) => addYears(m, 1));
//       setNextMonth((m) => addYears(m, 1));
//     };

//     // --- Hover preview ---
//     const handleDateHover = (date) => {
//       if (!selectingStart && dateRange.start && !dateRange.end)
//         setHoverDate(date);
//     };
//     const handleMouseLeave = () => setHoverDate(null);

//     // --- Calendar days generation ---
//     const generateCalendarDays = (month) => {
//       const year = month.getFullYear();
//       const monthIndex = month.getMonth();
//       const firstDayOfMonth = new Date(year, monthIndex, 1);
//       const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
//       const firstDayOfWeek = firstDayOfMonth.getDay();
//       const daysInMonth = lastDayOfMonth.getDate();
//       const calendarDays = [];
//       for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
//       for (let day = 1; day <= daysInMonth; day++) {
//         calendarDays.push(new Date(year, monthIndex, day));
//       }
//       return calendarDays;
//     };

//     // --- Constraints ---
//     const isDateDisabled = (date) => {
//       if (!date) return false;
//       if (minDate && date < new Date(minDate)) return true;
//       if (maxDate && date > new Date(maxDate)) return true;
//       return false;
//     };

//     // --- Range state checks ---
//     const isInRange = (date) => {
//       if (!date || !dateRange.start || !dateRange.end) return false;
//       return isWithinInterval(date, {
//         start: dateRange.start,
//         end: dateRange.end,
//       });
//     };
//     const isRangeStart = (date) =>
//       !!date && !!dateRange.start && isSameDay(date, dateRange.start);
//     const isRangeEnd = (date) =>
//       !!date && !!dateRange.end && isSameDay(date, dateRange.end);
//     const isInHoverRange = (date) => {
//       if (!date || !dateRange.start || !hoverDate || selectingStart)
//         return false;
//       if (isBefore(hoverDate, dateRange.start)) {
//         return isWithinInterval(date, {
//           start: hoverDate,
//           end: dateRange.start,
//         });
//       }
//       return isWithinInterval(date, { start: dateRange.start, end: hoverDate });
//     };

//     const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

//     // --- Month renderer ---
//     const renderCalendarMonth = (month, monthTitle) => (
//       <div>
//         <div className="text-sm font-medium mb-2 text-center">{monthTitle}</div>
//         <div className="grid grid-cols-7 gap-1 mb-1">
//           {daysOfWeek.map((day) => (
//             <div
//               key={`${monthTitle}-${day}`}
//               className="text-center text-xs font-medium text-gray-500 py-1 dark:text-gray-400"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-1" onMouseLeave={handleMouseLeave}>
//           {generateCalendarDays(month).map((date, index) => (
//             <div key={`${monthTitle}-${index}`} className="text-center">
//               {date ? (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     !isDateDisabled(date) && handleDateSelect(date)
//                   }
//                   onMouseEnter={() =>
//                     !isDateDisabled(date) && handleDateHover(date)
//                   }
//                   onMouseLeave={handleMouseLeave}
//                   className={cn(
//                     "w-8 h-8 rounded-full text-sm flex items-center justify-center",
//                     isDateDisabled(date) &&
//                       "text-gray-300 cursor-not-allowed dark:text-gray-600",
//                     !isDateDisabled(date) &&
//                       !isRangeStart(date) &&
//                       "hover:bg-gray-100 dark:hover:bg-gray-700",
//                     isRangeStart(date) &&
//                       "bg-primary text-white hover:bg-primary rounded-l-full",
//                     isRangeEnd(date) &&
//                       "bg-primary text-white hover:bg-primary/90 rounded-r-full",
//                     isInRange(date) &&
//                       !isRangeStart(date) &&
//                       !isRangeEnd(date) &&
//                       "bg-primary/20 text-primary",
//                     !isInRange(date) &&
//                       !isRangeStart(date) &&
//                       isInHoverRange(date) &&
//                       "bg-primary/10 text-primary",
//                     highlightToday &&
//                       isToday(date) &&
//                       !isInRange(date) &&
//                       !isRangeStart(date) &&
//                       !isRangeEnd(date) &&
//                       !isInHoverRange(date) &&
//                       "border border-primary text-primary"
//                   )}
//                   disabled={isDateDisabled(date)}
//                 >
//                   {date.getDate()}
//                 </button>
//               ) : (
//                 <div className="w-8 h-8" />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );

//     return (
//       <div className={cn("relative", fullWidth && "w-full", className)}>
//         {label && (
//           <label
//             onClick={() => setIsVisible(false)}
//             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//           >
//             {label}
//           </label>
//         )}

//         {/* Trigger wrapper used for measuring position */}
//         <div ref={triggerRef} className="relative">
//           {startIcon && (
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//               {startIcon}
//             </div>
//           )}

//           <div className="relative flex items-center">
//             <input
//               ref={(node) => {
//                 inputRef.current = node;
//                 if (typeof ref === "function") ref(node);
//                 else if (ref) ref.current = node;
//               }}
//               type="text"
//               className={cn(
//                 "flex h-[38px] w-full rounded-md border border-input bg-white dark:bg-transparent dark:border-[#4b6385] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pl-10",
//                 (endIcon || (showClearButton && inputValue)) && "pr-10",
//                 error && "border-red-500"
//               )}
//               placeholder={placeholder}
//               value={inputValue}
//               onChange={allowManualInput ? handleInputChange : undefined}
//               onBlur={handleInputBlur}
//               onClick={() => !disabled && !readOnly && openCalendar()}
//               readOnly={!allowManualInput || readOnly}
//               disabled={disabled}
//               {...props}
//             />

//             {!startIcon && (
//               <div
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//                 onClick={() => !disabled && !readOnly && openCalendar()}
//               >
//                 <Icon icon="lucide:calender" className="h-4 w-4" />
//               </div>
//             )}

//             {inputValue && showClearButton && !disabled && !readOnly ? (
//               <div
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
//                 onClick={handleClear}
//               >
//                 <Icon icon="lucide:x" className="h-4 w-4" />
//               </div>
//             ) : (
//               endIcon && (
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
//                   {endIcon}
//                 </div>
//               )
//             )}
//           </div>
//         </div>

//         {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//         {helperText && !error && (
//           <p className="mt-1 text-xs text-gray-500">{helperText}</p>
//         )}

//         {/* ---- PORTAL: Calendar Popup ---- */}
//         {typeof document !== "undefined" &&
//           isOpen &&
//           hasCoords &&
//           createPortal(
//             <div
//               ref={calendarRef}
//               style={{
//                 top: dropdownStyle.top,
//                 align: dropdownStyle.align,

//                 left: dropdownStyle.left,
//                 width: isMobile ? 300 : 580,
//                 position: dropdownStyle.position,
//                 zIndex: dropdownStyle.zIndex,
//               }}
//               className={cn(
//                 "bg-white border border-gray-200 rounded-md shadow-lg p-3 dark:bg-gray-800 dark:border-gray-700 transition-all duration-200",
//                 align,
//                 isVisible && !disabled && !readOnly
//                   ? "opacity-100 visible translate-y-0"
//                   : "opacity-0 invisible translate-y-5"
//               )}
//             >
//               {/* Calendar header */}
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     onClick={prevYear}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Previous Year"
//                   >
//                     <Icon icon="lucide:chevrons-left" className="h-4 w-4" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={prevMonth}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Previous Month"
//                   >
//                     <Icon icon="lucide:chevron-left" className="h-4 w-4" />
//                   </button>
//                 </div>

//                 <div className="text-sm font-medium">
//                   {selectingStart ? "Select Start Date" : "Select End Date"}
//                 </div>

//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     onClick={nextMonthHandler}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Next Month"
//                   >
//                     <Icon icon="lucide:chevron-right" className="h-4 w-4" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={nextYear}
//                     className="p-1 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
//                     aria-label="Next Year"
//                   >
//                     <Icon icon="lucide:chevrons-right" className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Calendars */}
//               <div
//                 className={
//                   isMobile ? "grid grid-cols-1" : "grid grid-cols-2 gap-4"
//                 }
//               >
//                 {renderCalendarMonth(
//                   currentMonth,
//                   format(currentMonth, "MMMM yyyy")
//                 )}
//                 {!isMobile &&
//                   renderCalendarMonth(
//                     nextMonth,
//                     format(nextMonth, "MMMM yyyy")
//                   )}
//               </div>

//               {/* Footer */}
//               <div className="mt-4 flex justify-between">
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                 >
//                   Clear
//                 </button>

//                 <div className="text-xs text-gray-500 dark:text-gray-400">
//                   {dateRange.start && (
//                     <span>
//                       {format(dateRange.start, dateFormat)}
//                       {dateRange.end &&
//                         ` - ${format(dateRange.end, dateFormat)}`}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>,
//             document.body
//           )}
//       </div>
//     );
//   }
// );

// DateRangePicker.displayName = "DateRangePicker";

// export { DateRangePicker };

"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
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
  isBefore,
  isWithinInterval,
} from "date-fns";
import { Icon } from "@iconify/react";

const DateRangePicker = forwardRef(
  (
    {
      className,
      value = { start: null, end: null },
      onChange,
      placeholder = "Select date range",
      format: dateFormat = "yyyy-MM-dd",
      separator = " - ",
      minDate,
      maxDate,
      disabled = false,
      readOnly = false,
      showClearButton = true,
      highlightToday = true,
      allowManualInput = true,
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      align = "left-0",
      endIcon,
      responsiveWidth = 764,
      ...props
    },
    ref
  ) => {
    const [dateRange, setDateRange] = useState({
      start: value.start ? new Date(value.start) : null,
      end: value.end ? new Date(value.end) : null,
    });
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasCoords, setHasCoords] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
      dateRange.start || new Date()
    );
    const [nextMonth, setNextMonth] = useState(addMonths(currentMonth, 1));
    const [selectingStart, setSelectingStart] = useState(true);
    const [hoverDate, setHoverDate] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const calendarRef = useRef(null);
    const inputRef = useRef(null);
    const triggerRef = useRef(null);

    // Dropdown style state (portal)
    const [dropdownStyle, setDropdownStyle] = useState({
      top: 0,
      left: 0,
      width: 0,
      position: "absolute",
      zIndex: 9999,
    });

    const getActualScrollY = () => {
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.position === "fixed") {
        const topValue = document.body.style.top;
        return topValue ? Math.abs(parseInt(topValue, 10)) : 0;
      }
      return window.scrollY;
    };

    const calculateDropdownPosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const calendarWidth = isMobile ? 300 : 580;
      const isInModal = !!triggerRef.current.closest('[role="dialog"]');

      let top, left, position;

      if (isInModal) {
        top = rect.bottom + 3;
        left = rect.left;
        position = "fixed";
      } else {
        top = rect.bottom + getActualScrollY() + 3;
        position = "absolute";

        // Logic to position dropdown based on screen space
        if (rect.right + calendarWidth > window.innerWidth) {
          // Not enough space to the right, align to right edge
          left = rect.right + window.scrollX - calendarWidth;
        } else {
          // Enough space to the right, align to left edge
          left = rect.left + window.scrollX;
        }

        // Adjust if it still overflows off the left side of the screen
        if (left < 0) {
          left = 0;
        }
      }

      setDropdownStyle({
        top,
        left,
        width: calendarWidth,
        position,
        zIndex: isInModal ? 10000 : 9999,
      });
      setHasCoords(true); // ✅ coordinates ready
    };

    const openCalendar = () => {
      calculateDropdownPosition(); // measure first
      setIsOpen(true); // mount with correct coords
      requestAnimationFrame(() => setIsVisible(true)); // animate in
    };

    const closeCalendar = () => {
      setIsVisible(false);
      setTimeout(() => {
        setIsOpen(false);
        setHasCoords(false); // reset so next open remeasures
        setDropdownStyle((s) => ({
          ...s,
          top: 0,
          left: 0,
          width: 0,
          right: 0,
        }));
      }, 150);
    };

    // --- Responsive check ---
    useEffect(() => {
      const checkIsMobile = () =>
        setIsMobile(window.innerWidth < responsiveWidth);
      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);
      return () => window.removeEventListener("resize", checkIsMobile);
    }, [responsiveWidth]);

    // --- Input formatting ---
    const formatInputValue = (range) => {
      if (range.start && range.end) {
        return `${format(range.start, dateFormat)}${separator}${format(
          range.end,
          dateFormat
        )}`;
      } else if (range.start) {
        return `${format(range.start, dateFormat)}${separator}...`;
      }
      return "";
    };

    // --- Sync with external value ---
    useEffect(() => {
      const newRange = {
        start: value.start ? new Date(value.start) : null,
        end: value.end ? new Date(value.end) : null,
      };
      setDateRange(newRange);
      setInputValue(formatInputValue(newRange));
      if (newRange.start) {
        setCurrentMonth(newRange.start);
        setNextMonth(addMonths(newRange.start, 1));
      }
    }, [value, dateFormat, separator]);

    // --- Outside click to close ---
    useEffect(() => {
      const handleClickOutside = (event) => {
        const target = event.target;
        if (
          isOpen &&
          calendarRef.current &&
          !calendarRef.current.contains(target) &&
          !triggerRef.current?.contains(target)
        ) {
          closeCalendar();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // --- Reposition on scroll/resize while open ---
    useEffect(() => {
      if (!isOpen) return;
      const handleReposition = () => calculateDropdownPosition();
      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);
      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
      };
    }, [isOpen]);

    // --- Date selection ---
    const handleDateSelect = (date) => {
      let newRange = { ...dateRange };

      if (
        selectingStart ||
        !dateRange.start ||
        (dateRange.start && dateRange.end)
      ) {
        // Start new selection
        newRange = { start: date, end: null };
        setSelectingStart(false);
      } else {
        // Complete selection
        if (isBefore(date, dateRange.start)) {
          newRange = { start: date, end: dateRange.start };
        } else {
          newRange = { start: dateRange.start, end: date };
        }
        setSelectingStart(true);
        closeCalendar();
      }

      setDateRange(newRange);
      setInputValue(formatInputValue(newRange));
      onChange?.(newRange);
    };

    // --- Manual input ---
    const handleInputChange = (e) => {
      const v = e.target.value;
      setInputValue(v);
      if (!allowManualInput) return;

      if (v.includes(separator)) {
        try {
          const [startStr, endStr] = v.split(separator);
          if (startStr && endStr) {
            const parsedStart = parse(startStr.trim(), dateFormat, new Date());
            const parsedEnd = parse(endStr.trim(), dateFormat, new Date());
            if (isValid(parsedStart) && isValid(parsedEnd)) {
              const newRange = { start: parsedStart, end: parsedEnd };
              setDateRange(newRange);
              onChange?.(newRange);
            }
          }
        } catch {
          // ignore parse errors
        }
      }
    };

    const handleInputBlur = () => {
      if (inputValue === "") {
        const cleared = { start: null, end: null };
        setDateRange(cleared);
        onChange?.(cleared);
        return;
      }
      setInputValue(formatInputValue(dateRange));
    };

    const handleClear = (e) => {
      e?.stopPropagation?.();
      const cleared = { start: null, end: null };
      setDateRange(cleared);
      setInputValue("");
      setSelectingStart(true);
      onChange?.(cleared);
    };

    // --- Navigation ---
    const prevMonth = () => {
      setCurrentMonth((m) => subMonths(m, 1));
      setNextMonth((m) => subMonths(m, 1));
    };
    const nextMonthHandler = () => {
      setCurrentMonth((m) => addMonths(m, 1));
      setNextMonth((m) => addMonths(m, 1));
    };
    const prevYear = () => {
      setCurrentMonth((m) => subYears(m, 1));
      setNextMonth((m) => subYears(m, 1));
    };
    const nextYear = () => {
      setCurrentMonth((m) => addYears(m, 1));
      setNextMonth((m) => addYears(m, 1));
    };

    // --- Hover preview ---
    const handleDateHover = (date) => {
      if (!selectingStart && dateRange.start && !dateRange.end)
        setHoverDate(date);
    };
    const handleMouseLeave = () => setHoverDate(null);

    // --- Calendar days generation ---
    const generateCalendarDays = (month) => {
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      const firstDayOfMonth = new Date(year, monthIndex, 1);
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
      const firstDayOfWeek = firstDayOfMonth.getDay();
      const daysInMonth = lastDayOfMonth.getDate();
      const calendarDays = [];
      for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
      for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, monthIndex, day));
      }
      return calendarDays;
    };

    // --- Constraints ---
    const isDateDisabled = (date) => {
      if (!date) return false;
      if (minDate && date < new Date(minDate)) return true;
      if (maxDate && date > new Date(maxDate)) return true;
      return false;
    };

    // --- Range state checks ---
    const isInRange = (date) => {
      if (!date || !dateRange.start || !dateRange.end) return false;
      return isWithinInterval(date, {
        start: dateRange.start,
        end: dateRange.end,
      });
    };
    const isRangeStart = (date) =>
      !!date && !!dateRange.start && isSameDay(date, dateRange.start);
    const isRangeEnd = (date) =>
      !!date && !!dateRange.end && isSameDay(date, dateRange.end);
    const isInHoverRange = (date) => {
      if (!date || !dateRange.start || !hoverDate || selectingStart)
        return false;
      if (isBefore(hoverDate, dateRange.start)) {
        return isWithinInterval(date, {
          start: hoverDate,
          end: dateRange.start,
        });
      }
      return isWithinInterval(date, { start: dateRange.start, end: hoverDate });
    };

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // --- Month renderer ---
    const renderCalendarMonth = (month, monthTitle) => (
      <div>
        <div className="text-sm font-medium mb-2 text-center">{monthTitle}</div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map((day) => (
            <div
              key={`${monthTitle}-${day}`}
              className="text-center text-xs font-medium text-gray-500 py-1 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1" onMouseLeave={handleMouseLeave}>
          {generateCalendarDays(month).map((date, index) => (
            <div key={`${monthTitle}-${index}`} className="text-center">
              {date ? (
                <button
                  type="button"
                  onClick={() =>
                    !isDateDisabled(date) && handleDateSelect(date)
                  }
                  onMouseEnter={() =>
                    !isDateDisabled(date) && handleDateHover(date)
                  }
                  onMouseLeave={handleMouseLeave}
                  className={cn(
                    "w-8 h-8 rounded-full text-sm flex items-center justify-center",
                    isDateDisabled(date) &&
                      "text-gray-300 cursor-not-allowed dark:text-gray-600",
                    !isDateDisabled(date) &&
                      !isRangeStart(date) &&
                      "hover:bg-[#1A1149]",
                    isRangeStart(date) &&
                      "bg-[#665DF6] text-white hover:bg-[#665DF6] rounded-l-full",
                    isRangeEnd(date) &&
                      "bg-[#665DF6] text-white hover:bg-[#665DF6]/90 rounded-r-full",
                    isInRange(date) &&
                      !isRangeStart(date) &&
                      !isRangeEnd(date) &&
                      "bg-[#665DF6]/20 text-[#665DF6]",
                    !isInRange(date) &&
                      !isRangeStart(date) &&
                      isInHoverRange(date) &&
                      "bg-[#665DF6]/10 text-[#665DF6]",
                    highlightToday &&
                      isToday(date) &&
                      !isInRange(date) &&
                      !isRangeStart(date) &&
                      !isRangeEnd(date) &&
                      !isInHoverRange(date) &&
                      "border border-[#665DF6] text-[#665DF6]"
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
      </div>
    );

    return (
      <div className={cn("relative", fullWidth && "w-full", className)}>
        {label && (
          <label
            onClick={() => setIsVisible(false)}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        {/* Trigger wrapper used for measuring position */}
        <div ref={triggerRef} className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {startIcon}
            </div>
          )}

          <div className="relative flex items-center">
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              type="text"
              className={cn(
                "flex h-[38px] w-full rounded-md border border-[#675ff89d] bg-transparent  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 pl-10",
                (endIcon || (showClearButton && inputValue)) && "pr-10",
                error && "border-red-500"
              )}
              placeholder={placeholder}
              value={inputValue}
              onChange={allowManualInput ? handleInputChange : undefined}
              onBlur={handleInputBlur}
              onClick={() => !disabled && !readOnly && openCalendar()}
              readOnly={!allowManualInput || readOnly}
              disabled={disabled}
              {...props}
            />

            {!startIcon && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => !disabled && !readOnly && openCalendar()}
              >
                <Icon icon="lucide:calendar" className="h-4 w-4" />
              </div>
            )}

            {inputValue && showClearButton && !disabled && !readOnly ? (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleClear}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </div>
            ) : (
              endIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {endIcon}
                </div>
              )
            )}
          </div>
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}

        {/* ---- PORTAL: Calendar Popup ---- */}
        {typeof document !== "undefined" &&
          isOpen &&
          hasCoords &&
          createPortal(
            <div
              ref={calendarRef}
              style={{
                top: dropdownStyle.top,
                align: dropdownStyle.align,
                left: dropdownStyle.left,
                width: isMobile ? 300 : 580,
                position: dropdownStyle.position,
                zIndex: dropdownStyle.zIndex,
              }}
              className={cn(
                "bg-[#100A2C] border border-[#2d2453] rounded-md shadow-lg p-3  transition-all duration-200",
                align,
                isVisible && !disabled && !readOnly
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-5"
              )}
            >
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={prevYear}
                    className="p-1 hover:bg-[#1A1149] rounded-md "
                    aria-label="Previous Year"
                  >
                    <Icon icon="lucide:chevrons-left" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1  rounded-md hover:bg-[#1A1149]"
                    aria-label="Previous Month"
                  >
                    <Icon icon="lucide:chevron-left" className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm font-medium">
                  {selectingStart ? "Select Start Date" : "Select End Date"}
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={nextMonthHandler}
                    className="p-1 hover:bg-[#1A1149] rounded-md "
                    aria-label="Next Month"
                  >
                    <Icon icon="lucide:chevron-right" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextYear}
                    className="p-1 hover:bg-[#1A1149] rounded-md "
                    aria-label="Next Year"
                  >
                    <Icon icon="lucide:chevrons-right" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Calendars */}
              <div
                className={
                  isMobile ? "grid grid-cols-1" : "grid grid-cols-2 gap-4"
                }
              >
                {renderCalendarMonth(
                  currentMonth,
                  format(currentMonth, "MMMM yyyy")
                )}
                {!isMobile &&
                  renderCalendarMonth(
                    nextMonth,
                    format(nextMonth, "MMMM yyyy")
                  )}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {dateRange.start && (
                    <span>
                      {format(dateRange.start, dateFormat)}
                      {dateRange.end &&
                        ` - ${format(dateRange.end, dateFormat)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
