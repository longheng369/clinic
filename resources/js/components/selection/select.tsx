"use client";

import { useState, useEffect, useRef } from "react";
import { useFloating, offset, flip, size, autoUpdate } from "@floating-ui/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

type Option<T> = {
  value: T;
  label: string;
};

type SelectProps<T> = {
  options: Option<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
};

const Select = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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

  useEffect(() => {
    if (activeIndex === null || !listRef.current) return;
    const option = listRef.current.children[activeIndex] as HTMLElement | undefined;
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = (optionValue: T) => {
    onChange?.(optionValue);
    setOpen(false);
    setActiveIndex(null);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(e.key === "ArrowDown" ? 0 : options.length - 1);
      } else {
        setActiveIndex((prev) => {
          if (prev === null) return e.key === "ArrowDown" ? 0 : options.length - 1;
          if (e.key === "ArrowDown") return (prev + 1) % options.length;
          return (prev - 1 + options.length) % options.length;
        });
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  const handleFloatingKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null || prev >= options.length - 1 ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null || prev <= 0 ? options.length - 1 : prev - 1,
      );
    } else if (
      (e.key === "Enter" || e.key === " ") &&
      activeIndex !== null &&
      options[activeIndex]
    ) {
      e.preventDefault();
      handleSelect(options[activeIndex].value);
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
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition duration-150 ease-in-out",
          "flex items-center justify-between gap-2",
          "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
          "border-gray-300",
          value ? "text-gray-900" : "text-gray-400",
        )}
      >
        <span>{selectedOption?.label || placeholder}</span>
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
          onKeyDown={handleFloatingKeyDown}
          className={cn(
            "z-50 rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
          )}
        >
          <ul ref={listRef} className="max-h-60 overflow-auto">
            {options.map((option, i) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors duration-100",
                  "hover:bg-primary-50 hover:text-primary-700",
                  activeIndex === i && "bg-primary-50 text-primary-700",
                  option.value === value
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-700",
                )}
              >
                {option.label}
                {option.value === value && (
                  <Check className="h-4 w-4 text-primary-500 shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
