import type { ReactNode } from "react"
import React, { createContext, useContext, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

interface AccordionContextType {
  activeItems: string[]
  toggleItem: (id: string) => void
  isItemActive: (id: string) => boolean
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
)

const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion")
  }
  return context
}

interface AccordionProps {
  children: ReactNode
  defaultOpen?: string
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  )

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
      }

      return prev.includes(id) ? [] : [id]
    })
  }

  const isItemActive = (id: string) => activeItems.includes(id)

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  id: string
  children: ReactNode
  className?: string
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[30px] border border-slate-200 bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  )
}

interface AccordionHeaderProps {
  itemId: string
  children: ReactNode
  className?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion()
  const isActive = isItemActive(itemId)

  const defaultIcon = (
    <ChevronDown
      className={cn(
        "size-5 text-slate-400 transition-transform duration-200",
        isActive && "rotate-180"
      )}
    />
  )

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50/80 focus:outline-none",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  )
}

interface AccordionContentProps {
  itemId: string
  children: ReactNode
  className?: string
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion()
  const isActive = isItemActive(itemId)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isActive ? "max-h-[2400px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="px-6 pb-6 pt-0">{children}</div>
    </div>
  )
}
