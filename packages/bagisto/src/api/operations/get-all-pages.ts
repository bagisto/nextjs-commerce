export type Page = { url: string }
export type GetAllPagesResult = { pages: Page[] }
import type { BagistoConfig } from '../index'

export default function getAllPagesOperation() {
  function getAllPages({
    config,
    preview,
  }: {
    url?: string
    config?: Partial<BagistoConfig>
    preview?: boolean
  }): Promise<GetAllPagesResult> {
    return Promise.resolve({
      pages: [],
    })
  }
  return getAllPages
}
