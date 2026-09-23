/** Result of the advanced search: the written analysis and the ranked list of jobs that fit the entered profile. */
import SectionHeading from "@components/ui/SectionHeading";
import { faNumber } from "@utils/numbers";
import AnswerPanel from "../AnswerPanel";
import MatchCard from "./MatchCard";

export default function ProfileMatches({ result }) {
  if (!result) return null;
  const matches = result.matches ?? [];

  return (
    <div className="mt-6 flex flex-col gap-6">
      <AnswerPanel label="تحلیل هوشمند" text={result.answer} />

      {matches.length > 0 && (
        <div>
          <SectionHeading
            title="مشاغل متناسب با پروفایل شما"
            note={`(${faNumber(matches.length)} شغل)`}
          />
          <div className="flex flex-col gap-4">
            {matches.map((match, rank) => (
              <MatchCard key={match.job_title} match={match} rank={rank} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
