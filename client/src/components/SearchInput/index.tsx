import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import * as S from './SearchInput.styles'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, label, placeholder }) => (
  <S.Container>
    <S.IconSlot aria-hidden="true">
      <SearchIcon fontSize="inherit" />
    </S.IconSlot>
    <S.Input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <S.ClearButton type="button" aria-label="Clear search" onClick={() => onChange('')}>
        <CloseIcon fontSize="inherit" />
      </S.ClearButton>
    )}
  </S.Container>
)

export default SearchInput
