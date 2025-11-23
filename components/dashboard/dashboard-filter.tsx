'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DateRange } from 'react-day-picker'

interface DashboardFilterProps {
  period: string
  date?: DateRange
  onPeriodChange?: (period: string, customDate?: DateRange) => void
}

export function DashboardFilter({ period, date, onPeriodChange }: DashboardFilterProps) {
  const [open, setOpen] = useState(false)
  const [tempRange, setTempRange] = useState<DateRange | undefined>(date)

  const handleApplyRange = () => {
    onPeriodChange?.('custom', tempRange)
    setOpen(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">

      <Select
        value={period}
        onValueChange={(val) => {
          onPeriodChange?.(val, date)
          setTempRange(date)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="90d">Último trimestre</SelectItem>
          <SelectItem value="12m">Último ano</SelectItem>
          <SelectItem value="custom">Intervalo personalizado</SelectItem>
        </SelectContent>
      </Select>

      {period === 'custom' && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                'w-[260px] justify-start text-left font-normal',
                !date?.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from
                ? date.to
                  ? `${format(date.from, 'dd/MM/yyyy')} — ${format(
                    date.to,
                    'dd/MM/yyyy'
                  )}`
                  : format(date.from, 'dd/MM/yyyy')
                : 'Escolher intervalo'}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col gap-2 w-auto p-2" align="start">
            <Calendar
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={2}
            />

            <Button onClick={handleApplyRange}>
              Aplicar
            </Button>
          </PopoverContent>

          
        </Popover>
      )}

    </div>
  )
}
