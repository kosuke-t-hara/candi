import { getToroEntries } from '@/app/actions/toro'
import PastClient from './past-client'

export default async function PastPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const isArchivedView = params.view === 'archived'
  const entries = await getToroEntries(isArchivedView)

  return <PastClient entries={entries} isArchivedView={isArchivedView} />
}
