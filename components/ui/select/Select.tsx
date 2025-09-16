// "use client";
// import { cn } from "@/lib/utils";
// import { Icon } from "@iconify/react";
// import { createPortal } from "react-dom";
// import { useState, useEffect, useRef, forwardRef } from "react";

// const Select = forwardRef(
//   (
//     {
//       className,
//       label,
//       helperText,
//       error,
//       fullWidth = false,
//       startIcon,
//       endIcon,
//       options = [],
//       placeholder = "Select an option",
//       onValueChange,
//       onChange,
//       value,
//       defaultValue,
//       requiredSign = false,
//       required = false,
//       optionRenderer,
//       ...props
//     },
//     ref
//   ) => {
//     const buttonRef = useRef(null);
//     const optionsRef = useRef(null);
//     const containerRef = useRef(null);
//     const [isOpen, setIsOpen] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const [highlightedIndex, setHighlightedIndex] = useState(-1);
//     const [dropdownStyle, setDropdownStyle] = useState({
//       top: 0,
//       left: 0,
//       width: 0,
//       position: "absolute",
//     });
//     const [selectedValue, setSelectedValue] = useState(
//       value || defaultValue || ""
//     );

//     const selectedOption = options.find(
//       (option) => option.value === selectedValue
//     );
//     const displayValue = selectedOption ? selectedOption.label : "";

//     useEffect(() => {
//       if (value !== undefined && value !== selectedValue) {
//         setSelectedValue(value);
//       }
//     }, [value]);

//     // Close on outside click
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (
//           containerRef.current &&
//           !containerRef.current.contains(event.target) &&
//           !optionsRef.current?.contains(event.target)
//         ) {
//           setIsVisible(false);
//           setTimeout(() => setIsOpen(false), 200);
//         }
//       };
//       document.addEventListener("mousedown", handleClickOutside);
//       return () =>
//         document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Helper function to get the actual scroll position
//     const getActualScrollPosition = () => {
//       const bodyStyle = window.getComputedStyle(document.body);
//       if (bodyStyle.position === "fixed") {
//         const topValue = document.body.style.top;
//         return topValue ? Math.abs(Number.parseInt(topValue)) : 0;
//       }
//       return window.scrollY;
//     };

//     // Calculate dropdown position with modal awareness
//     const calculateDropdownPosition = () => {
//       if (!buttonRef.current) return;

//       const rect = buttonRef.current.getBoundingClientRect();
//       const actualScrollY = getActualScrollPosition();
//       const viewportHeight = window.innerHeight;
//       const dropdownHeight = optionsRef.current?.offsetHeight || 250;
//       const spaceBelow = viewportHeight - rect.bottom;
//       const spaceAbove = rect.top;
//       let top, left, position;

//       // Check if there is enough space below the button
//       if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
//         // Open downwards
//         top = rect.bottom + actualScrollY + 3;
//         left = rect.left + window.scrollX;
//         position = "absolute";

//         // If inside a modal, use fixed position
//         const isInModal = buttonRef.current.closest('[role="dialog"]') !== null;
//         if (isInModal) {
//           top = rect.bottom + 3;
//           left = rect.left;
//           position = "fixed";
//         }
//       } else {
//         // Not enough space below, open upwards
//         top = rect.top + actualScrollY - dropdownHeight - 3;
//         left = rect.left + window.scrollX;
//         position = "absolute";

//         // If inside a modal, use fixed position
//         const isInModal = buttonRef.current.closest('[role="dialog"]') !== null;
//         if (isInModal) {
//           top = rect.top - dropdownHeight - 3;
//           left = rect.left;
//           position = "fixed";
//         }
//       }

//       setDropdownStyle({
//         top,
//         left,
//         width: rect.width,
//         position,
//       });
//     };

//     // Toggle with positioning logic
//     const toggleDropdown = () => {
//       if (!isOpen) {
//         calculateDropdownPosition();
//         setIsOpen(true);
//         requestAnimationFrame(() => {
//           setIsVisible(true);
//         });
//       } else {
//         setIsVisible(false);
//         setTimeout(() => setIsOpen(false), 200);
//       }
//     };

//     // Recalculate position when modal state might change
//     useEffect(() => {
//       if (isOpen) {
//         calculateDropdownPosition();

//         // Recalculate on scroll or resize
//         const handleRecalculate = () => {
//           if (isOpen) {
//             calculateDropdownPosition();
//           }
//         };

//         window.addEventListener("scroll", handleRecalculate);
//         window.addEventListener("resize", handleRecalculate);

//         return () => {
//           window.removeEventListener("scroll", handleRecalculate);
//           window.removeEventListener("resize", handleRecalculate);
//         };
//       }
//     }, [isOpen]);

//     const handleOptionClick = (optionValue) => {
//       setSelectedValue(optionValue);
//       setIsVisible(false);
//       setTimeout(() => setIsOpen(false), 200);
//       const syntheticEvent = {
//         target: { value: optionValue },
//       };
//       onChange?.(syntheticEvent);
//       onValueChange?.(optionValue);
//     };

//     const handleKeyDown = (e) => {
//       if (
//         !isOpen &&
//         (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
//       ) {
//         toggleDropdown();
//         e.preventDefault();
//         return;
//       }

//       if (!isOpen) return;

//       switch (e.key) {
//         case "Escape":
//           setIsVisible(false);
//           setTimeout(() => setIsOpen(false), 200);
//           break;
//         case "ArrowDown":
//           e.preventDefault();
//           setHighlightedIndex((prevIndex) => {
//             const newIndex = prevIndex < options.length - 1 ? prevIndex + 1 : 0;
//             scrollOptionIntoView(newIndex);
//             return newIndex;
//           });
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           setHighlightedIndex((prevIndex) => {
//             const newIndex = prevIndex > 0 ? prevIndex - 1 : options.length - 1;
//             scrollOptionIntoView(newIndex);
//             return newIndex;
//           });
//           break;
//         case "Enter":
//         case " ":
//           e.preventDefault();
//           if (highlightedIndex >= 0) {
//             handleOptionClick(options[highlightedIndex].value);
//           }
//           break;
//         default:
//           break;
//       }
//     };

//     const scrollOptionIntoView = (index) => {
//       if (optionsRef.current && optionsRef.current.children[index]) {
//         optionsRef.current.children[index].scrollIntoView({
//           block: "nearest",
//           inline: "start",
//         });
//       }
//     };

//     const defaultOptionRenderer = (option, isSelected, isHighlighted) => (
//       <div
//         className={cn(
//           "flex items-center text-sm px-3 py-2 cursor-pointer rounded ",
//           isSelected
//             ? "bg-gradient-to-r from-[#2B2499] to-[#6C63FF] justify-between text-white"
//             : "hover:bg-[#1a133d]",
//           isHighlighted && "bg-gray-100 dark:bg-[#1a133d]"
//         )}
//       >
//         <div className="flex items-center">
//           <span>{option.label}</span>
//           {option.description && (
//             <span className="ml-2 text-xs text-muted-foreground">
//               {option.description}
//             </span>
//           )}
//         </div>
//         {isSelected && (
//           <Icon
//             icon="lucide:check"
//             className="h-4 w-4 mr-2 text-primary dark:text-white"
//           />
//         )}
//       </div>
//     );

//     const renderOption = optionRenderer || defaultOptionRenderer;

//     return (
//       <div
//         ref={containerRef}
//         className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}
//       >
//         {label && (
//           <label
//             onClick={() => setIsVisible(false)}
//             className="text-sm font-medium dark:font-[350] text-gray-700 dark:text-gray-100 "
//           >
//             {label}
//             {requiredSign && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}
//         <div className="relative">
//           <button
//             type="button"
//             className={cn(
//               "flex h-10 w-full items-center justify-between rounded-md border dark:border-[#675ff89d]  px-3 py-2 text-sm ring-offset-background focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:bg-transparent  dark:font-[350]",
//               startIcon && "pl-10",
//               error && "border-red-500",
//               className
//             )}
//             onClick={toggleDropdown}
//             onKeyDown={handleKeyDown}
//             aria-haspopup="listbox"
//             aria-expanded={isOpen}
//             ref={buttonRef}
//             {...props}
//           >
//             <div className="flex items-center">
//               {startIcon && (
//                 <span className="absolute left-3 flex items-center pointer-events-none text-gray-500">
//                   {startIcon}
//                 </span>
//               )}
//               <span className={cn(!selectedValue && "text-gray-500")}>
//                 {displayValue || placeholder}
//               </span>
//             </div>
//             {endIcon ? (
//               <span
//                 className={`flex items-center text-gray-500 ani3 text-lg ${
//                   isOpen ? "rotate-0" : "rotate-180"
//                 }`}
//               >
//                 {endIcon}
//               </span>
//             ) : (
//               <span className={`flex items-center text-gray-500`}>
//                 <Icon
//                   icon="lucide:chevron-up"
//                   className={`ani3 text-lg size-[18px] ${
//                     isOpen ? "rotate-0" : "rotate-180"
//                   }`}
//                 />
//               </span>
//             )}
//           </button>
//         </div>
//         {helperText && !error && (
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             {helperText}
//           </p>
//         )}
//         {error && <p className="text-xs text-red-500">{error}</p>}
//         {isOpen &&
//           dropdownStyle.top > 0 &&
//           dropdownStyle.left >= 0 &&
//           createPortal(
//             <div
//               style={{
//                 top: dropdownStyle.top,
//                 left: dropdownStyle.left,
//                 width: dropdownStyle.width,
//                 position: dropdownStyle.position,
//                 zIndex: dropdownStyle.position === "fixed" ? 10000 : 9999,
//               }}
//               className={`rounded-md border border-[#6C63FF80]  shadow-lg transition-all duration-200 ${
//                 isVisible
//                   ? "opacity-100 visible mt-0.5"
//                   : "opacity-0 invisible mt-5"
//               }`}
//               role="listbox"
//               ref={optionsRef}
//             >
//               <div className="max-h-60 overflow-auto sideBar rounded-md p-1.5 space-y-1 bg-[#150e3b8c] backdrop-blur-lg">
//                 {options.length === 0 ? (
//                   <div className="px-3 py-2 text-sm text-muted-foreground">
//                     No options available
//                   </div>
//                 ) : (
//                   options.map((option, index) => (
//                     <div
//                       key={option.value}
//                       role="option"
//                       aria-selected={selectedValue === option.value}
//                       tabIndex={-1}
//                       onClick={() => handleOptionClick(option.value)}
//                       onMouseEnter={() => setHighlightedIndex(index)}
//                       onMouseLeave={() => setHighlightedIndex(-1)}
//                     >
//                       {renderOption(
//                         option,
//                         selectedValue === option.value,
//                         highlightedIndex === index
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>,
//             document.body
//           )}
//       </div>
//     );
//   }
// );

// Select.displayName = "Select";
// export { Select };

"use client";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  Ref,
  MouseEvent,
  KeyboardEvent,
  CSSProperties,
} from "react";

// Define the types for your component props
interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  options?: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: { target: { value: string } }) => void;
  value?: string;
  defaultValue?: string;
  requiredSign?: boolean;
  required?: boolean;
  optionRenderer?: (
    option: SelectOption,
    isSelected: boolean,
    isHighlighted: boolean
  ) => React.ReactNode;
}

const Select = forwardRef(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      options = [],
      placeholder = "Select an option",
      onValueChange,
      onChange,
      value,
      defaultValue,
      requiredSign = false,
      required = false,
      optionRenderer,
      ...props
    }: SelectProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({
      top: 0,
      left: 0,
      width: 0,
      position: "absolute",
    });
    const [selectedValue, setSelectedValue] = useState<string>(
      value || defaultValue || ""
    );

    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    const displayValue = selectedOption ? selectedOption.label : "";

    useEffect(() => {
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value);
      }
    }, [value, selectedValue]);

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (
        event: MouseEvent | globalThis.MouseEvent
      ) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node)
        ) {
          setIsVisible(false);
          setTimeout(() => setIsOpen(false), 200);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper function to get the actual scroll position
    const getActualScrollPosition = (): number => {
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.position === "fixed") {
        const topValue = document.body.style.top;
        return topValue ? Math.abs(Number.parseInt(topValue)) : 0;
      }
      return window.scrollY;
    };

    // Calculate dropdown position with modal awareness
    const calculateDropdownPosition = (): void => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const actualScrollY = getActualScrollPosition();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = optionsRef.current?.offsetHeight || 250;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      let top: number, left: number, position: "absolute" | "fixed";

      // Check if there is enough space below the button
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        // Open downwards
        top = rect.bottom + actualScrollY + 3;
        left = rect.left + window.scrollX;
        position = "absolute";

        // If inside a modal, use fixed position
        const isInModal = buttonRef.current.closest('[role="dialog"]') !== null;
        if (isInModal) {
          top = rect.bottom + 3;
          left = rect.left;
          position = "fixed";
        }
      } else {
        // Not enough space below, open upwards
        top = rect.top + actualScrollY - dropdownHeight - 3;
        left = rect.left + window.scrollX;
        position = "absolute";

        // If inside a modal, use fixed position
        const isInModal = buttonRef.current.closest('[role="dialog"]') !== null;
        if (isInModal) {
          top = rect.top - dropdownHeight - 3;
          left = rect.left;
          position = "fixed";
        }
      }

      setDropdownStyle({
        top,
        left,
        width: rect.width,
        position,
      });
    };

    // Toggle with positioning logic
    const toggleDropdown = (): void => {
      if (!isOpen) {
        calculateDropdownPosition();
        setIsOpen(true);
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 200);
      }
    };

    // Recalculate position when modal state might change
    useEffect(() => {
      if (isOpen) {
        calculateDropdownPosition();

        // Recalculate on scroll or resize
        const handleRecalculate = () => {
          if (isOpen) {
            calculateDropdownPosition();
          }
        };

        window.addEventListener("scroll", handleRecalculate);
        window.addEventListener("resize", handleRecalculate);

        return () => {
          window.removeEventListener("scroll", handleRecalculate);
          window.removeEventListener("resize", handleRecalculate);
        };
      }
    }, [isOpen]);

    const handleOptionClick = (optionValue: string): void => {
      setSelectedValue(optionValue);
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 200);
      const syntheticEvent = {
        target: { value: optionValue },
      };
      onChange?.(syntheticEvent);
      onValueChange?.(optionValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
      if (
        !isOpen &&
        (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
      ) {
        toggleDropdown();
        e.preventDefault();
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          setIsVisible(false);
          setTimeout(() => setIsOpen(false), 200);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex = prevIndex < options.length - 1 ? prevIndex + 1 : 0;
            scrollOptionIntoView(newIndex);
            return newIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex = prevIndex > 0 ? prevIndex - 1 : options.length - 1;
            scrollOptionIntoView(newIndex);
            return newIndex;
          });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleOptionClick(options[highlightedIndex].value);
          }
          break;
        default:
          break;
      }
    };

    const scrollOptionIntoView = (index: number): void => {
      if (optionsRef.current && optionsRef.current.children[index]) {
        (optionsRef.current.children[index] as HTMLElement).scrollIntoView({
          block: "nearest",
          inline: "start",
        });
      }
    };

    const defaultOptionRenderer = (
      option: SelectOption,
      isSelected: boolean,
      isHighlighted: boolean
    ): React.ReactNode => (
      <div
        className={cn(
          "flex items-center text-sm px-3 py-2 cursor-pointer rounded group ",
          isSelected
            ? "dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] bg-[#6C63FF] justify-between text-white"
            : "dark:hover:bg-[#1a133d] hover:bg-gray-200",
          isHighlighted &&
            "dark:bg-gradient-to-r dark:from-[#2B2499] dark:to-[#6C63FF] bg-[#6C63FF] "
        )}
      >
        <div className="flex items-center">
          <span>{option.label}</span>
          {option.description && (
            <span className="ml-2 text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </div>
        {isSelected && (
          <Icon icon="lucide:check" className="h-4 w-4 mr-2 text-white" />
        )}
      </div>
    );

    const renderOption = optionRenderer || defaultOptionRenderer;

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}
      >
        {label && (
          <label
            onClick={() => setIsVisible(false)}
            className="text-sm font-medium dark:font-[350] text-gray-700 dark:text-gray-100 "
          >
            {label}
            {requiredSign && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border dark:border-[#675ff89d] border-gray-200/80  px-3 py-2 text-sm ring-offset-background focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:bg-transparent  dark:font-[350]",
              startIcon && "pl-10",
              error && "border-red-500",
              className
            )}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            ref={buttonRef}
            {...props}
          >
            <div className="flex items-center">
              {startIcon && (
                <span className="absolute left-3 flex items-center pointer-events-none text-gray-500">
                  {startIcon}
                </span>
              )}
              <span className={cn(!selectedValue && "text-gray-500")}>
                {displayValue || placeholder}
              </span>
            </div>
            {endIcon ? (
              <span
                className={`flex items-center text-gray-500 ani3 text-lg ${
                  isOpen ? "rotate-0" : "rotate-180"
                }`}
              >
                {endIcon}
              </span>
            ) : (
              <span className={`flex items-center text-gray-500`}>
                <Icon
                  icon="lucide:chevron-up"
                  className={`ani3 text-lg size-[18px] ${
                    isOpen ? "rotate-0" : "rotate-180"
                  }`}
                />
              </span>
            )}
          </button>
        </div>
        {helperText && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {isOpen &&
          typeof dropdownStyle.top === "number" &&
          dropdownStyle.top > 0 &&
          typeof dropdownStyle.left === "number" &&
          dropdownStyle.left >= 0 &&
          createPortal(
            <div
              style={{
                top: dropdownStyle.top,
                left: dropdownStyle.left,
                width: dropdownStyle.width,
                position: dropdownStyle.position,
                zIndex: dropdownStyle.position === "fixed" ? 10000 : 9999,
              }}
              className={`rounded-md border dark:border-[#6C63FF80] border-gray-200/80  shadow-md transition-all duration-200 ${
                isVisible
                  ? "opacity-100 visible mt-0.5"
                  : "opacity-0 invisible mt-5"
              }`}
              role="listbox"
              ref={optionsRef}
            >
              <div className="max-h-60 overflow-auto sideBar rounded-md p-1.5 space-y-1 dark:bg-[#150e3b] bg-white ">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No options available
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={selectedValue === option.value}
                      tabIndex={-1}
                      onClick={() => handleOptionClick(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                    >
                      {renderOption(
                        option,
                        selectedValue === option.value,
                        highlightedIndex === index
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
