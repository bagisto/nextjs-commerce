import { Fetcher } from '@vercel/commerce/utils/types'
import { API_URL } from './const'

export const fetcher: Fetcher = async ({
  url = API_URL,
  query,
  method = 'POST',
}) => {
  const res = await fetch(url!, {
    method,
    body: JSON.stringify({ query }),
    headers: {
      // 'Authorization': `JWT 123`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  console.log(res)

  if (res.ok) {
    const { data } = await res.json()

    return data
  }

  throw res
}
