import { Suspense } from 'react'
import { getToroEntries } from '@/app/actions/toro'
import PastClient from './past-client'

export default async function PastPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const isArchivedView = params.view === 'archived'
  const type = typeof params.type === 'string' ? params.type : undefined
  const entries = await getToroEntries(isArchivedView, type)

  return (
    <Suspense>
      <PastClient entries={entries} isArchivedView={isArchivedView} />
    </Suspense>
  )
}
