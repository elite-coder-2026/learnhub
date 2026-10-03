import type { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import Button from '../Button'
import InlineError from '../InlineError'
import Skeleton from '../Skeleton'
import * as S from './DataTable.styles'

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  label: string
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  isLoading: boolean
  errorMessage: string | null
  emptyMessage: string
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

const SKELETON_ROWS = ['row-a', 'row-b', 'row-c', 'row-d', 'row-e']

function DataTable<T>({
  label,
  columns,
  rows,
  getRowId,
  isLoading,
  errorMessage,
  emptyMessage,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: DataTableProps<T>): React.ReactElement {
  const theme = useTheme()

  return (
    <S.Container>
      {errorMessage && <InlineError message={errorMessage} />}
      <S.Scroll>
        <S.Table aria-label={label} aria-busy={isLoading}>
          <thead>
            <tr>
              {columns.map((column) => (
                <S.HeaderCell key={column.key} scope="col">
                  {column.label}
                </S.HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              SKELETON_ROWS.map((key) => (
                <tr key={key}>
                  {columns.map((column) => (
                    <S.Cell key={column.key}>
                      <Skeleton height={theme.fontSizes.md} />
                    </S.Cell>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              rows.map((row) => (
                <tr key={getRowId(row)}>
                  {columns.map((column) => (
                    <S.Cell key={column.key}>{column.render(row)}</S.Cell>
                  ))}
                </tr>
              ))}
          </tbody>
        </S.Table>
      </S.Scroll>
      {!isLoading && !errorMessage && rows.length === 0 && <S.Empty>{emptyMessage}</S.Empty>}
      {hasMore && (
        <S.Footer>
          <Button variant="secondary" size="sm" isLoading={isLoadingMore} onClick={onLoadMore}>
            Load more
          </Button>
        </S.Footer>
      )}
    </S.Container>
  )
}

export default DataTable
