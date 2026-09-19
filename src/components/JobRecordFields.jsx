import JobDetails from "@components/JobDetails";
import { recordDetail } from "@constant/jobFields";

// A stored record read in the admin panels — the reviewer's «جزئیات» and a corpus row the reader may
// look at but not edit — in the same boxes a search result and the job form draw.
export default function JobRecordFields({ record, className = "" }) {
  return <JobDetails details={[recordDetail(record)]} className={className} />;
}
