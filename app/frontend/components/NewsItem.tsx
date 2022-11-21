import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { setEditedNews } from '../slices/uiSlice'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { useAppMutate } from '../hooks/useAppMutate'
import { News } from '../types/types'

interface NewsItemProps {
  news: News
}

const NewsItems = ({ news }: NewsItemProps) => {
  // グローバルステートの更新関数を定義する
  const dispatch = useDispatch()

  // ニュースを削除するための更新関数を定義する
  const { deleteNewsMutation } = useAppMutate()
  if (deleteNewsMutation.isLoading) {
    return <p>Deleting...</p>
  }

  return (
    <li className="my-3">
      <span className="font-bold">{news.content}</span>
      {/* アイコン二つを右端に寄せるためにdiv要素を作成する */}
      <div className="flex float-right ml-20">
        {/* タスク名変更アイコン */}
        <PencilAltIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            dispatch(setEditedNews({ id: news.id, content: news.content }))
          }}
        />
        {/* タスク削除アイコン */}
        <TrashIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteNewsMutation.mutate(news.id)
          }}
        />
      </div>
    </li>
  )
}

export const NewsItemMemo = memo(NewsItems)
