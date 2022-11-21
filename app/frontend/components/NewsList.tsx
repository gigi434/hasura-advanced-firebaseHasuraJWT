import { memo } from 'react'
import { useQueryNews } from '../hooks/useQueryNews'
import { NewsItemMemo } from './NewsItem'

const NewsList = () => {
  const { status, data } = useQueryNews()
  if (status === 'loading') return <div>{'Loding...'}</div>
  if (status === 'error') return <div>{'Error'}</div>
  return (
    <div>
      {data?.map((news) => (
        <div>
          <ul>
            <NewsItemMemo news={news} />
          </ul>
        </div>
      ))}
    </div>
  )
}

export const NewsListMemo = memo(NewsList)
