import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { useAppMutate } from '../hooks/useAppMutate'
import { setEditedTask } from '../slices/uiSlice'
import { Task } from '../types/types'

interface TaskItemProps {
  task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch()
  const { deleteTaskMutation } = useAppMutate()
  // もしタスク削除ボタンをクリックし、タスクを削除中であるならロード中とクライアントに表示する
  if (deleteTaskMutation.isLoading) {
    return <div>Deleting...</div>
  }

  return (
    <li className="my-3">
      <span className="font-bold">{task.title}</span>
      <div className="flex float-right ml-20">
        {/* タスク更新アイコン */}
        <PencilAltIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            dispatch(setEditedTask({ id: task.id, title: task.title }))
          }}
        />
        {/* タスク削除アイコン */}
        <TrashIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteTaskMutation.mutate(task.id)
          }}
        />
      </div>
    </li>
  )
}

export const TaskItemMemo = memo(TaskItem)
