import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './CreateCourse.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import { INSTRUCTOR_NAV } from '../../config/nav'
import { useCreateCourse } from '../../hooks/useCreateCourse'

interface FormState {
  title: string
  description: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  if (!form.title.trim()) {
    errors.title = 'Course title is required'
  }

  return errors
}

const CreateCourse: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<boolean>(false)

  const createCourse = useCreateCourse()
  const navigate = useNavigate()

  useEffect(() => {
    if (createCourse.isSuccess) {
      navigate(`/courses/${createCourse.data.id}`, { replace: true })
    }
  }, [createCourse.isSuccess, createCourse.data, navigate])

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    createCourse.mutate({
      title: form.title.trim(),
      description: form.description.trim() || null,
      modules: [],
    })
  }

  const liveErrors = submitted ? validate(form) : errors

  return (
    <AppShell navItems={INSTRUCTOR_NAV}>
      <Container>
        <S.Body>
          <PageHeader
            title="Create a course"
            description="Give your course a title and description. You can add modules and lessons afterward."
          />

          <S.Card>
            {createCourse.isError && (
              <S.Message $variant="error" role="alert">
                {createCourse.error.message}
              </S.Message>
            )}

            <S.Form onSubmit={handleSubmit} noValidate>
              <S.Field>
                <S.Label htmlFor="course-title">Title</S.Label>
                <S.Input
                  id="course-title"
                  type="text"
                  value={form.title}
                  $hasError={Boolean(liveErrors.title)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('title', e.target.value)
                  }
                />
                {liveErrors.title && (
                  <S.FieldError>{liveErrors.title}</S.FieldError>
                )}
              </S.Field>

              <S.Field>
                <S.Label htmlFor="course-description">Description</S.Label>
                <S.TextArea
                  id="course-description"
                  value={form.description}
                  $hasError={Boolean(liveErrors.description)}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    updateField('description', e.target.value)
                  }
                />
              </S.Field>

              <S.Actions>
                <Button type="submit" isLoading={createCourse.isPending}>
                  Create course
                </Button>
              </S.Actions>
            </S.Form>
          </S.Card>
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default CreateCourse
