/** Shows a stored job record (review queue, job list) with the same boxes as a search result. */
import { recordDetail } from "@utils/jobRecord";
import JobDetails from "./JobDetails/JobDetails";

export default function JobRecordFields({ record, className = "" }) {
  return <JobDetails details={[recordDetail(record)]} className={className} />;
}
