/** Read-only presentation of one or more jobs as coloured field boxes, with the competencies grouped together; numbered job titles appear when there is more than one job. */
import SectionHeading from "@components/ui/SectionHeading";
import { faNumber } from "@utils/numbers";
import CompetencyCard from "./CompetencyCard";
import CompetencyShell from "./CompetencyShell";
import FieldCard from "./FieldCard";
import { groupCompetencies } from "./groupCompetencies";

function NumberedJobTitle({ number, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {faNumber(number)}
      </span>
      <h4 className="text-[15px] font-bold text-slate-800 m-0 leading-7">{title}</h4>
    </div>
  );
}

function JobFieldBlocks({ job, onPickAlias }) {
  return (
    <div className="flex flex-col gap-4">
      {groupCompetencies(job.fields).map((block) =>
        block.group ? (
          <CompetencyShell key="competencies" size={block.group.length}>
            {block.group.map((field) => (
              <CompetencyCard key={field.key} field={field} />
            ))}
          </CompetencyShell>
        ) : (
          <FieldCard
            key={block.field.key}
            field={block.field}
            jobTitle={job.job_title}
            onPickAlias={onPickAlias}
          />
        )
      )}
    </div>
  );
}

export default function JobDetails({ details, title, onPickAlias, className = "mt-6" }) {
  if (!details?.length) return null;
  const showJobTitles = details.length > 1;

  return (
    <div className={className}>
      {title && <SectionHeading title={title} />}
      {details.map((job, index) => (
        <div key={job.job_title} className={index > 0 ? "mt-8" : ""}>
          {showJobTitles && <NumberedJobTitle number={index + 1} title={job.job_title} />}
          <JobFieldBlocks job={job} onPickAlias={onPickAlias} />
        </div>
      ))}
    </div>
  );
}
