import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import Input from '../Input'
import Button from '../Button'
import type { LessonDraft, ModuleDraft } from '../../hooks/useCourseForm'
import * as S from './ModuleEditor.styles'

interface ModuleEditorProps {
  module: ModuleDraft
  position: number
  moduleError?: string
  lessonErrors: Record<string, string>
  canRemove: boolean
  onTitleChange: (title: string) => void
  onRemove: () => void
  onAddLesson: () => void
  onRemoveLesson: (lessonKey: string) => void
  onLessonChange: (lessonKey: string, patch: Partial<Omit<LessonDraft, 'key'>>) => void
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({
  module,
  position,
  moduleError,
  lessonErrors,
  canRemove,
  onTitleChange,
  onRemove,
  onAddLesson,
  onRemoveLesson,
  onLessonChange,
}) => (
  <S.Container aria-label={`Module ${position}`}>
    <S.Header>
      <S.ModuleNumber>Module {position}</S.ModuleNumber>
      {canRemove && (
        <S.IconButton type="button" onClick={onRemove} aria-label={`Remove module ${position}`}>
          <DeleteOutlineIcon fontSize="inherit" />
        </S.IconButton>
      )}
    </S.Header>

    <Input
      label="Module title"
      placeholder="e.g. Getting started"
      value={module.title}
      error={moduleError}
      onChange={(e) => onTitleChange(e.target.value)}
    />

    <S.LessonsHeading>Lessons</S.LessonsHeading>
    {module.lessons.length === 0 ? (
      <S.EmptyLessons>No lessons yet.</S.EmptyLessons>
    ) : (
      <S.LessonList>
        {module.lessons.map((lesson, index) => (
          <S.LessonRow key={lesson.key}>
            <S.LessonNumber aria-hidden="true">{index + 1}</S.LessonNumber>
            <S.LessonFields>
              <Input
                label="Lesson title"
                placeholder="e.g. Welcome"
                value={lesson.title}
                error={lessonErrors[lesson.key]}
                onChange={(e) => onLessonChange(lesson.key, { title: e.target.value })}
              />
              <Input
                label="Content URL"
                type="url"
                placeholder="https://…"
                hint="Optional. Video or document link."
                value={lesson.contentUrl}
                onChange={(e) => onLessonChange(lesson.key, { contentUrl: e.target.value })}
              />
            </S.LessonFields>
            <S.IconButton
              type="button"
              onClick={() => onRemoveLesson(lesson.key)}
              aria-label={`Remove lesson ${index + 1} from module ${position}`}
            >
              <DeleteOutlineIcon fontSize="inherit" />
            </S.IconButton>
          </S.LessonRow>
        ))}
      </S.LessonList>
    )}

    <S.Footer>
      <Button variant="secondary" size="sm" onClick={onAddLesson}>
        <AddIcon fontSize="inherit" />
        Add lesson
      </Button>
    </S.Footer>
  </S.Container>
)

export default ModuleEditor
