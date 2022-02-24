export function getCookieExpirationDate(maxAgeInDays: number) {
  const today = new Date()

  const expirationDate = new Date()

  const cookieExpirationDate = new Date(
    expirationDate.setDate(today.getDate() + maxAgeInDays)
  )

  return cookieExpirationDate
}

export function prepareSetCookie(
  name: string,
  value: string,
  options: any = {}
): string {
  const cookieValue = []

  const encodedValue = Buffer.from(value).toString('base64')
  cookieValue.push(`${name}=${encodedValue}`)

  if (options.maxAge) {
    cookieValue.push(`Max-Age=${options.maxAge}`)
  }

  if (options.expires && !options.maxAge) {
    cookieValue.push(`Expires=${options.expires.toUTCString()}`)
  }

  return cookieValue.join('; ')
}

export function setCookies(res: any, cookies: string[]): void {
  res.setHeader('Set-Cookie', cookies)
}
