import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import * as S from './CreateCourse.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import Input from '../../components/Input'
import InlineError from '../../components/InlineError'
import ModuleEditor from '../../components/ModuleEditor'
import { INSTRUCTOR_NAV } from '../../config/nav'
import { useCreateCourse } from '../../hooks/useCreateCourse'
import { useCourseForm } from '../../hooks/useCourseForm'

const pluralize = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`

const CreateCourse: React.FC = () => {
  const form = useCourseForm()
  const createCourse = useCreateCourse()
  const navigate = useNavigate()

  useEffect(() => {
    if (createCourse.isSuccess) {
      navigate(`/courses/${createCourse.data.id}`, { replace: true })
    }
  }, [createCourse.isSuccess, createCourse.data, navigate])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    form.markSubmitted()
    if (form.hasErrors) return
    createCourse.mutate(form.toInput())
  }

  return (
    <AppShell navItems={INSTRUCTOR_NAV}>
      <Container>
        <S.Body>
          <PageHeader
            title="Create a course"
            description="Add the course details, then build its modules and lessons."
          />

          <S.Form onSubmit={handleSubmit} noValidate>
            <S.Card>
              <S.CardTitle>Course details</S.CardTitle>
              <Input
                label="Title"
                placeholder="e.g. Introduction to TypeScript"
                value={form.title}
                error={form.errors.title}
                onChange={(e) => form.setTitle(e.target.value)}
              />
              <Input
                label="Price (USD)"
                inputMode="decimal"
                placeholder="0.00"
                hint="Leave empty or 0 for a free course."
                value={form.price}
                error={form.errors.price}
                onChange={(e) => form.setPrice(e.target.value)}
              />
              <S.Field>
                <S.Label htmlFor="course-description">Description</S.Label>
                <S.TextArea
                  id="course-description"
                  placeholder="What will students learn?"
                  value={form.description}
                  $hasError={false}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    form.setDescription(e.target.value)
                  }
                />
              </S.Field>
            </S.Card>

            <S.SectionHeader>
              <S.SectionTitle>Curriculum</S.SectionTitle>
              <S.SectionMeta>
                {pluralize(form.modules.length, 'module')} · {pluralize(form.lessonCount, 'lesson')}
              </S.SectionMeta>
            </S.SectionHeader>

            {form.modules.map((courseModule, index) => (
              <ModuleEditor
                key={courseModule.key}
                module={courseModule}
                position={index + 1}
                moduleError={form.errors.modules[courseModule.key]}
                lessonErrors={form.errors.lessons}
                canRemove={form.modules.length > 1}
                onTitleChange={(title) => form.updateModuleTitle(courseModule.key, title)}
                onRemove={() => form.removeModule(courseModule.key)}
                onAddLesson={() => form.addLesson(courseModule.key)}
                onRemoveLesson={(lessonKey) => form.removeLesson(courseModule.key, lessonKey)}
                onLessonChange={(lessonKey, patch) => form.updateLesson(courseModule.key, lessonKey, patch)}
              />
            ))}

            <S.AddModuleButton type="button" onClick={form.addModule}>
              <AddIcon fontSize="inherit" />
              Add module
            </S.AddModuleButton>

            {createCourse.isError && <InlineError message={createCourse.error.message} />}

            <S.Actions>
              <Button type="submit" isLoading={createCourse.isPending}>
                Create course
              </Button>
            </S.Actions>
          </S.Form>
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default CreateCourse
