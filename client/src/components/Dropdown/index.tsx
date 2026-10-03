import { useEffect, useId, useRef, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import * as S from './Dropdown.styles'

export interface DropdownOption<T extends string = string> {
  value: T
  label: string
}

interface DropdownProps<T extends string = string> {
  label?: string
  options: DropdownOption<T>[]
  value: T | null
  onChange: (value: T) => void
  placeholder?: string
  error?: string
}

function Dropdown<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  error,
}: DropdownProps<T>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((option) => option.value === value)
  const hasError = Boolean(error)

  return (
    <S.Field>
      {label && <S.Label id={labelId}>{label}</S.Label>}
      <S.Wrapper ref={wrapperRef}>
        <S.Trigger
          type="button"
          $isOpen={isOpen}
          $hasError={hasError}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : undefined}
          onClick={() => setIsOpen((open) => !open)}
        >
          <S.TriggerText>{selected ? selected.label : placeholder}</S.TriggerText>
          <S.Chevron $isOpen={isOpen} aria-hidden="true">
            <ExpandMoreIcon fontSize="inherit" />
          </S.Chevron>
        </S.Trigger>
        {isOpen && (
          <S.Menu role="listbox">
            {options.map((option) => (
              <S.Item
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                $isSelected={option.value === value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </S.Item>
            ))}
          </S.Menu>
        )}
      </S.Wrapper>
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
    </S.Field>
  )
}

export default Dropdown
