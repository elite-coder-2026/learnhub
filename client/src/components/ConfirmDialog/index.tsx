import Modal from '../Modal'
import Button from '../Button'
import InlineError from '../InlineError'
import * as S from './ConfirmDialog.styles'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  isPending: boolean
  errorMessage: string | null
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isPending,
  errorMessage,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title}>
    <S.Container>
      <S.Message>{message}</S.Message>
      {errorMessage && <InlineError message={errorMessage} />}
      <S.Actions>
        <Button variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isPending}>
          {confirmLabel}
        </Button>
      </S.Actions>
    </S.Container>
  </Modal>
)

export default ConfirmDialog
