import { getToroEntries } from '@/app/actions/toro'
import PastClient from './past-client'

export default async function PastPage() {
  const entries = await getToroEntries()

  return <PastClient entries={entries} />
}
