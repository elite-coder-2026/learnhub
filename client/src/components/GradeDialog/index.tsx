import { useState } from 'react'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import InlineError from '../InlineError'
import { parseGrade } from '../../hooks/useSubmissions'
import type { GradeSubmissionInput, SubmissionWithStudent } from '../../types/assignment'
import * as S from './GradeDialog.styles'

interface GradeDialogProps {
  submission: SubmissionWithStudent
  isPending: boolean
  errorMessage: string | null
  onSubmit: (input: GradeSubmissionInput) => void
  onCancel: () => void
}

const GradeDialog: React.FC<GradeDialogProps> = ({ submission, isPending, errorMessage, onSubmit, onCancel }) => {
  const [grade, setGrade] = useState(submission.grade === null ? '' : String(submission.grade))
  const [feedback, setFeedback] = useState(submission.feedback ?? '')
  const [showErrors, setShowErrors] = useState(false)
  const parsedGrade = parseGrade(grade)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setShowErrors(true)
    if (parsedGrade === null) return
    onSubmit({ grade: parsedGrade, feedback: feedback.trim() || null })
  }

  return (
    <Modal isOpen onClose={onCancel} title="Grade submission">
      <S.Form onSubmit={handleSubmit} noValidate>
        <S.Answer>
          <S.AnswerLabel>Answer</S.AnswerLabel>
          {submission.submission_text && <S.AnswerText>{submission.submission_text}</S.AnswerText>}
          {submission.file_url && (
            <a href={submission.file_url} target="_blank" rel="noreferrer">
              Open attached file
            </a>
          )}
        </S.Answer>
        <Input
          label="Grade (0–100)"
          inputMode="numeric"
          value={grade}
          error={showErrors && parsedGrade === null ? 'Enter a whole number from 0 to 100' : undefined}
          onChange={(e) => setGrade(e.target.value)}
        />
        <S.Field>
          <S.Label htmlFor="grade-feedback">Feedback</S.Label>
          <S.TextArea
            id="grade-feedback"
            value={feedback}
            placeholder="Optional feedback for the student"
            onChange={(e) => setFeedback(e.target.value)}
          />
        </S.Field>
        {errorMessage && <InlineError message={errorMessage} />}
        <S.Actions>
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Save grade
          </Button>
        </S.Actions>
      </S.Form>
    </Modal>
  )
}

export default GradeDialog
