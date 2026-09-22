import JobDetails from "@components/JobDetails";
import { recordDetail } from "@constant/jobFields";

export default function JobRecordFields({ record, className = "" }) {
  return <JobDetails details={[recordDetail(record)]} className={className} />;
}
