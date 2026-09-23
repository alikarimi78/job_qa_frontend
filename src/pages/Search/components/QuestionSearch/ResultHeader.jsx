/** Header of an answer: coloured icon for the kind of answer, the eyebrow and title, the job's public/organization scope when it is a stored job, and the star/PDF buttons when the answer can be reported. */
import ResultActions from "./ResultActions";
import StoredJobScope from "./StoredJobScope";

export default function ResultHeader({ view, ownerName, star, report }) {
  const { heading } = view;
  const HeadingIcon = heading.icon;

  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <span
          aria-hidden="true"
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${heading.gradient} text-white shadow-lg
                      flex items-center justify-center shrink-0`}
        >
          <HeadingIcon className="w-6 h-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 m-0 leading-5">{heading.eyebrow}</p>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 m-0 leading-8 break-words">
            {heading.title}
          </h2>
          {view.isStoredJob && (
            <StoredJobScope organizationId={view.ownerOrganizationId} organizationName={ownerName} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
        {view.canReport && <ResultActions star={star} report={report} />}
      </div>
    </header>
  );
}
