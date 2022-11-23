import { memo, FormEvent } from 'react'
import { useAppMutate } from '../hooks/useAppMutate'
import { useSelector, useDispatch } from 'react-redux'
import { setEditedNews, selectNews } from '../slices/uiSlice'

const NewsEdit = () => {
  // dispatch関数オブジェクトを使用するために初期化する
  const dispatch = useDispatch()
  // グローバルステートに登録されている更新中のニュースを参照する
  const editedNews = useSelector(selectNews)
  // ニュースを作成、更新する関数オブジェクトを定義する
  const { createNewsMutation, updateNewsMutation } = useAppMutate()

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    // デフォルトで設定されている、ページを更新する動作を停止する
    e.preventDefault()
    // もしニュースのidがなければ、ニュースの新規作成を行う
    if (editedNews.id === '') {
      createNewsMutation.mutate(editedNews.content)
      // もしニュースのidがあれば、ニュースの更新を行う
    } else {
      updateNewsMutation.mutate(editedNews)
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="new news ?"
          type="text"
          value={editedNews.content}
          onChange={(e) =>
            // idとcontentをスプレッド構文で展開した後、更新するcontentで上書きする
            dispatch(setEditedNews({ ...editedNews, content: e.target.value }))
          }
        />
        <button
          className="disabled:opacity-40 my-3 mx-3 py-2 px-3 text-white bg-indigo-600 hover: bg-indigo-700 rounded"
          disabled={!editedNews.content}
        >
          {editedNews.id === '' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export const NewsEditMemo = memo(NewsEdit)
