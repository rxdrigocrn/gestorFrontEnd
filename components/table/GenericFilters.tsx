import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FilterOption {
    label: string
    name: string
    options: { value: string; label: string }[]
}

interface GenericFiltersProps {
    searchPlaceholder?: string
    filters?: FilterOption[]
    onSearchChange?: (value: string) => void
    onFilterChange?: (name: string, value: string) => void
    onReset?: () => void
    onFiltersOpen?: (open: boolean) => void
    dynamicSearch?: boolean // nova prop para habilitar busca dinâmica
}

export function GenericFilters({
    searchPlaceholder = 'Pesquisar...',
    filters = [],
    onSearchChange,
    onFilterChange,
    onReset,
    onFiltersOpen,
    dynamicSearch = false,
}: GenericFiltersProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [localSearch, setLocalSearch] = useState('')
    const [localFilters, setLocalFilters] = useState<{ [key: string]: string }>({})
    const hasFilters = filters.length > 0

    useEffect(() => {
        onFiltersOpen?.(showFilters)
    }, [showFilters, onFiltersOpen])

    // dispara onSearchChange enquanto digita, se dynamicSearch estiver ativo
    useEffect(() => {
        if (dynamicSearch) {
            const handler = setTimeout(() => {
                onSearchChange?.(localSearch)
            }, 300) // debounce 300ms
            return () => clearTimeout(handler)
        }
    }, [localSearch, dynamicSearch, onSearchChange])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-8"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>

                {hasFilters && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                    </Button>
                )}
            </div>

            {hasFilters && showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {filters.map((filter) => (
                        <Select
                            key={filter.name}
                            value={localFilters[filter.name] ?? ''}
                            onValueChange={(val) =>
                                setLocalFilters((prev) => ({ ...prev, [filter.name]: val }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{`Selecione ${filter.label}`}</SelectItem>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}


                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            onClick={() => {
                                Object.entries(localFilters).forEach(([name, value]) => {
                                    onFilterChange?.(name, value)
                                })
                            }}
                        >
                            Aplicar Filtros
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setLocalSearch('')
                                setLocalFilters({})
                                onReset?.()
                            }}
                        >
                            Resetar
                        </Button>

                    </div>
                </div>
            )}
        </div>
    )
}
