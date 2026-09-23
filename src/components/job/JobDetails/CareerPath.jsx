/** Draws the career path as the job title on one side and the next roles stacked on a connecting line; `renderStep` lets the editor draw editable steps. */
import LineBullet from "./LineBullet";

function DefaultStep({ step, theme }) {
  return (
    <span className="flex items-start gap-2.5 leading-7">
      <LineBullet theme={theme} />
      <span>{step}</span>
    </span>
  );
}

export default function CareerPath({ root, steps, theme, renderStep }) {
  const lastIndex = steps.length - 1;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
      <div className="flex items-center shrink-0">
        <span
          className={`max-w-56 rounded-xl px-3.5 py-2 text-[13px] font-bold leading-6 text-white
                      bg-gradient-to-br shadow-md ${theme.gradient}`}
        >
          {root}
        </span>
        <span className={`hidden sm:block w-6 h-0.5 ${theme.connector}`} />
      </div>
      <ol className="list-none m-0 p-0 flex flex-col flex-1 min-w-0">
        {steps.map((step, index) => (
          <li key={index} className="relative flex items-center gap-1 ps-5 py-1">
            <span
              className={`absolute start-0 top-0 w-0.5 h-1/2 ${theme.connector} ${index === 0 ? "invisible" : ""}`}
            />
            <span
              className={`absolute start-0 bottom-0 w-0.5 h-1/2 ${theme.connector} ${
                index === lastIndex ? "invisible" : ""
              }`}
            />
            <span className={`absolute start-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${theme.connector}`} />
            {renderStep ? renderStep(step, index) : <DefaultStep step={step} theme={theme} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
