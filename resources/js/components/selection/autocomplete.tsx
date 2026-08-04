"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
   useFloating,
   offset,
   flip,
   size,
   autoUpdate,
} from "@floating-ui/react";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

type Option<T> = {
  value: T;
  label: string;
};

type AutocompleteProps<T> = {
  options: Option<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
};

const Autocomplete = <T extends string | number>({
   options,
   value,
   onChange,
   placeholder = "Select an option",
   searchPlaceholder = "Search...",
   notFoundText = "No results found",
}: AutocompleteProps<T>) => {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState("");
   const [activeIndex, setActiveIndex] = useState<number | null>(null);
   const searchInputRef = useRef<HTMLInputElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const listRef = useRef<HTMLUListElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   const filteredOptions = useMemo(
      () =>
         query
            ? options.filter((opt) =>
               opt.label.toLowerCase().includes(query.toLowerCase()),
            )
            : options,
      [options, query],
   );

   const selectedOption = options.find((opt) => opt.value === value);

   const { refs, floatingStyles } = useFloating({
      open,
      onOpenChange: setOpen,
      placement: "bottom-start",
      whileElementsMounted: autoUpdate,
      middleware: [
         offset(4),
         flip(),
         size({
            apply({ rects, elements }) {
               Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
               });
            },
         }),
      ],
   });

   useEffect(() => {
      if (open && searchInputRef.current) {
         searchInputRef.current.focus();
      }
   }, [open]);

   useEffect(() => {
      if (activeIndex === null || !listRef.current) return;
      const option = listRef.current.children[activeIndex] as HTMLElement | undefined;
      option?.scrollIntoView({ block: "nearest" });
   }, [activeIndex]);

   useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
         if (
            containerRef.current &&
        !containerRef.current.contains(e.target as Node)
         ) {
            setOpen(false);
            setQuery("");
            setActiveIndex(null);
         }
      };

      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
            setActiveIndex(null);
            triggerRef.current?.focus();
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscape);
      };
   }, [open]);

   const handleSelect = useCallback(
      (optionValue: T) => {
         onChange?.(optionValue);
         setOpen(false);
         setQuery("");
         setActiveIndex(null);
         triggerRef.current?.focus();
      },
      [onChange],
   );

   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
         e.preventDefault();
         setActiveIndex((prev) =>
            prev === null || prev >= filteredOptions.length - 1 ? 0 : prev + 1,
         );
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         setActiveIndex((prev) =>
            prev === null || prev <= 0 ? filteredOptions.length - 1 : prev - 1,
         );
      } else if (e.key === "Enter" && activeIndex !== null && filteredOptions[activeIndex]) {
         e.preventDefault();
         handleSelect(filteredOptions[activeIndex].value);
      }
   };

   return (
      <div ref={containerRef} className="relative">
         <button
            ref={(node) => {
               refs.setReference(node);
               triggerRef.current = node;
            }}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
               "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition duration-150 ease-in-out",
               "flex items-center justify-between gap-2",
               "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
               "border-gray-300",
               value ? "text-gray-900" : "text-gray-400",
            )}
         >
            <span className="truncate">
               {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
               className={cn(
                  "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                  open && "rotate-180",
               )}
            />
         </button>

         {open && (
            <div
               ref={refs.setFloating}
               style={floatingStyles}
               className={cn(
                  "z-50 rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
               )}
            >
               <div className="px-2 pb-1">
                  <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                     <input
                        ref={searchInputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                     />
                  </div>
               </div>

               <ul ref={listRef} className="max-h-60 overflow-auto" role="listbox">
                  {filteredOptions.length === 0 ? (
                     <li className="px-3 py-2 text-sm text-gray-400">
                        {notFoundText}
                     </li>
                  ) : (
                     filteredOptions.map((option, i) => (
                        <li
                           key={option.value}
                           role="option"
                           aria-selected={option.value === value}
                           onClick={() => handleSelect(option.value)}
                           onMouseEnter={() => setActiveIndex(i)}
                           className={cn(
                              "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors duration-100",
                              "hover:bg-primary-50 hover:text-primary-700",
                              activeIndex === i && "bg-primary-50 text-primary-700",
                              option.value === value
                                 ? "bg-primary-50 font-medium text-primary-700"
                                 : "text-gray-700",
                           )}
                        >
                           {option.label}
                           {option.value === value && (
                              <Check className="h-4 w-4 shrink-0 text-primary-500" />
                           )}
                        </li>
                     ))
                  )}
               </ul>
            </div>
         )}
      </div>
   );
};

export default Autocomplete;
