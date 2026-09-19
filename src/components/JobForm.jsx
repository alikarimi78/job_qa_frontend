import { useEffect, useRef, useState } from "react";
import { FormProvider, useController, useForm, useWatch } from "react-hook-form";
import {
  CrossGlyph,
  PencilGlyph,
  SwapGlyph,
  cellFromItems,
  itemsFromCell,
  splitLines,
  useInlineEdit,
  useItemList,
} from "@components/ui/ItemsInput";
import SubmitBar from "@components/ui/SubmitBar";
import {
  CareerPath,
  CompetencyItemShell,
  CompetencyShell,
  FieldShell,
  LINES_CLASS,
  LIST_AS_LINES,
  LineBullet,
  arrange,
} from "@components/JobDetails";
import { FIELD_ICONS, themeOf } from "@components/fieldVisuals";
import { COLUMN_LABELS, DETAIL_ORDER, PROSE_KEYS } from "@constant/jobFields";

// The job form is the job's details, editable. At rest every box is what JobDetails draws — the
// title as the heading over the boxes, the description as text, duties as check-lines, the career
// path as branches, the rest as chips — in the same order and colours. A click on anything turns it
// into its input in place; a dashed «افزودن» at the end of each box adds to it. The one other
// difference is that nothing folds, every item being there to edit.

const LIST_KEYS = DETAIL_ORDER.filter((key) => !PROSE_KEYS.has(key));

const PUBLIC = "";
// The same "no organization" value, for a caller that files a record without opening the form.
export const PUBLIC_OWNER = PUBLIC;

// `owners` is the organizations this caller may hand the record to, and `allowPublic`
// whether the shared corpus is one of the choices. With neither — a user who sits in no
// organization — the field is not drawn and the body never mentions the owner, which is
// what leaves an existing record where it already was. `defaultOwner` is where a new record
// goes until the reader picks; a record being edited keeps its own owner instead.
function toFormValues(initial, owners, allowPublic, defaultOwner = null) {
  const values = { job_title: "", description: "" };
  for (const key of ["job_title", "description"]) {
    values[key] = initial?.[key] ?? "";
  }
  for (const key of LIST_KEYS) {
    values[key] = itemsFromCell(initial?.[key] ?? "");
  }
  values.organization_id =
    initial?.organization_id != null
      ? String(initial.organization_id)
      : defaultOwner != null
        ? String(defaultOwner)
        : allowPublic
        ? PUBLIC
        : String(owners[0]?.id ?? PUBLIC);
  return values;
}

// The boxes in the order `render.job_detail` sends them: the description first, then the columns the
// answer used (`primary`), then the rest in `DETAIL_ORDER`.
function formFields(primary) {
  const used = new Set(primary);
  return DETAIL_ORDER.map((key) => ({ key, primary: used.has(key) })).sort(
    (a, b) => (a.key !== "description") - (b.key !== "description") || b.primary - a.primary,
  );
}

const faCount = (n) => n.toLocaleString("fa-IR");
const countOf = (list) =>
  list.value.length ? `${faCount(list.value.length)} مورد` : "هنوز موردی افزوده نشده است";

const PlusGlyph = (
  <svg aria-hidden="true" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}
       strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ChevronGlyph = (
  <svg aria-hidden="true" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// A box's input takes the width of what is typed in it, as the chip it replaces did.
const fitWidth = (text) => ({ width: `${Math.min(Math.max(text.length * 1.3 + 5, 12), 60)}ch` });

const EDIT_INPUT =
  "max-w-full h-8 px-3 bg-white text-[13px] text-slate-800 border border-blue-400 outline-none " +
  "focus:ring-2 focus:ring-blue-500/30";

// Shown beside an item only while it is being edited. `onMouseDown` keeps the focus in the input, so
// the click is not preceded by a blur that would commit the edit first.
function ItemButton({ title, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center cursor-pointer
                  border bg-white transition-colors duration-200 ${
                    danger
                      ? "border-red-200 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
                      : "border-slate-200 text-slate-500 hover:bg-slate-700 hover:border-slate-700 hover:text-white"
                  }`}
    >
      {children}
    </button>
  );
}

// An item emptied and committed is removed, which is how the keyboard deletes one.
const commitItem = (list, index) => (text) =>
  text.trim() ? list.replace(index, text, splitLines) : list.remove(index);

// One item, drawn as the details draw it until it is clicked.
function ItemChip({ item, index, list, theme, onPromote }) {
  const edit = useInlineEdit(commitItem(list, index));

  if (edit.editing) {
    return (
      <span className="inline-flex items-center gap-1 max-w-full">
        <input
          type="text"
          {...edit.inputProps}
          aria-label={`ویرایش ${item}`}
          style={fitWidth(edit.draft)}
          className={`${EDIT_INPUT} rounded-full`}
        />
        {onPromote && (
          <ItemButton
            title={`جایگزینی عنوان شغل با «${item}»`}
            onClick={() => {
              edit.cancel();
              onPromote(item);
            }}
          >
            {SwapGlyph}
          </ItemButton>
        )}
        <ItemButton
          danger
          title={`حذف «${item}»`}
          onClick={() => {
            edit.cancel();
            list.remove(index);
          }}
        >
          {CrossGlyph}
        </ItemButton>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => edit.start(item)}
      title={`ویرایش «${item}»`}
      className={`rounded-full px-3 py-1 text-[13px] leading-6 border text-start cursor-text ${theme.chip}
                  transition-shadow duration-200 hover:ring-2 ${theme.ring}
                  focus:outline-none focus-visible:ring-2`}
    >
      {item}
    </button>
  );
}

// The dashed chip the details use for «نمایش … مورد دیگر», here opening a box for a new item. Enter
// adds and leaves the box open for the next one; leaving it adds what was typed and closes it.
function AddChip({ list, theme, wide = false }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (list.full) return null;

  const add = () => {
    const items = splitLines(draft);
    if (items.length) list.append(items);
    setDraft("");
  };

  if (open) {
    return (
      <input
        ref={ref}
        type="text"
        value={draft}
        placeholder="مورد جدید"
        aria-label="مورد جدید"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            add();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setDraft("");
            setOpen(false);
          }
        }}
        onBlur={() => {
          add();
          setOpen(false);
        }}
        style={wide ? undefined : fitWidth(draft)}
        className={`${EDIT_INPUT} placeholder:text-slate-400 ${wide ? "w-full rounded-lg" : "rounded-full"}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] leading-6 border
                  border-dashed bg-white/70 cursor-pointer transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${theme.more}`}
    >
      {PlusGlyph}
      افزودن
    </button>
  );
}

function ItemLine({ item, index, list, theme }) {
  const edit = useInlineEdit(commitItem(list, index));

  return (
    <li className="flex items-start gap-2.5 leading-7">
      <LineBullet theme={theme} />
      {edit.editing ? (
        <span className="flex flex-1 min-w-0 items-center gap-1">
          <input
            type="text"
            {...edit.inputProps}
            aria-label={`ویرایش ${item}`}
            className={`${EDIT_INPUT} flex-1 min-w-0 rounded-lg`}
          />
          <ItemButton
            danger
            title={`حذف «${item}»`}
            onClick={() => {
              edit.cancel();
              list.remove(index);
            }}
          >
            {CrossGlyph}
          </ItemButton>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => edit.start(item)}
          title={`ویرایش «${item}»`}
          className="flex-1 min-w-0 text-start cursor-text rounded-md -mx-1 px-1 transition-colors
                     duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500/40"
        >
          {item}
        </button>
      )}
    </li>
  );
}

// A list column's items as JobDetails lays them out, each editable, with «افزودن» after the last.
function ListBody({ fieldKey, list, onPromote }) {
  const theme = themeOf(fieldKey);
  const jobTitle = useWatch({ name: "job_title" });
  const items = list.value;
  const promote = fieldKey === "aliases" ? onPromote : undefined;

  const chip = (item, index) => (
    <ItemChip key={index} item={item} index={index} list={list} theme={theme} onPromote={promote} />
  );

  let body;
  if (LIST_AS_LINES.has(fieldKey)) {
    body = (
      <ul className={LINES_CLASS}>
        {items.map((item, index) => (
          <ItemLine key={index} item={item} index={index} list={list} theme={theme} />
        ))}
        <li className="flex items-start leading-7">
          <AddChip list={list} theme={theme} wide />
        </li>
      </ul>
    );
  } else if (fieldKey === "career_path_next") {
    // «افزودن» is one more branch from the job, where the next step would go.
    const ADD = {};
    body = (
      <CareerPath
        root={jobTitle?.trim() || COLUMN_LABELS.job_title}
        steps={[...items, ADD]}
        theme={theme}
        renderStep={(step, index) =>
          step === ADD ? <AddChip list={list} theme={theme} /> : chip(step, index)
        }
      />
    );
  } else {
    body = (
      <div className="flex flex-wrap gap-2">
        {items.map(chip)}
        <AddChip list={list} theme={theme} />
      </div>
    );
  }

  return (
    <>
      {body}
      {promote && items.length > 0 && (
        <p className="text-[11px] text-slate-500 mt-2.5 mb-0 leading-5">
          برای جایگزینی عنوان شغل با یکی از نام‌های دیگر، روی آن نام کلیک و دکمه جابه‌جایی را انتخاب
          نمایید.
        </p>
      )}
      {list.error && <p className="text-xs text-red-600 mt-2 mb-0">{list.error.message}</p>}
    </>
  );
}

function ListCard({ fieldKey, primary, onPromote }) {
  const list = useItemList(fieldKey, { required: true });
  return (
    <FieldShell
      fieldKey={fieldKey}
      label={COLUMN_LABELS[fieldKey]}
      primary={primary}
      count={countOf(list)}
      invalid={Boolean(list.error)}
    >
      <ListBody fieldKey={fieldKey} list={list} onPromote={onPromote} />
    </FieldShell>
  );
}

function CompetencyCardEditor({ fieldKey, primary }) {
  const list = useItemList(fieldKey, { required: true });
  return (
    <CompetencyItemShell
      fieldKey={fieldKey}
      label={COLUMN_LABELS[fieldKey]}
      primary={primary}
      count={countOf(list)}
      invalid={Boolean(list.error)}
    >
      <ListBody fieldKey={fieldKey} list={list} />
    </CompetencyItemShell>
  );
}

// The description as the details print it, a textarea in its place while it is being written.
function DescriptionCard({ primary }) {
  const { field, fieldState } = useController({
    name: "description",
    rules: { validate: (text) => Boolean(text?.trim()) || "شرح شغل را وارد نمایید" },
  });
  const [editing, setEditing] = useState(false);

  return (
    <FieldShell
      fieldKey="description"
      label={COLUMN_LABELS.description}
      primary={primary}
      invalid={Boolean(fieldState.error)}
    >
      {editing ? (
        <textarea
          autoFocus
          value={field.value}
          onChange={field.onChange}
          onBlur={() => {
            field.onBlur();
            setEditing(false);
          }}
          onKeyDown={(event) => event.key === "Escape" && event.currentTarget.blur()}
          aria-label={COLUMN_LABELS.description}
          className="block w-full field-sizing-content min-h-24 -mx-1 px-1 leading-8 text-sm text-slate-700
                     bg-white rounded-lg border border-blue-400 outline-none resize-none
                     focus:ring-2 focus:ring-blue-500/30"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="ویرایش شرح شغل"
          className="block w-full text-start leading-8 text-slate-700 cursor-text rounded-lg -mx-1 px-1
                     transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {field.value?.trim() || <span className="text-slate-400">شرح شغل را وارد نمایید</span>}
        </button>
      )}
      {fieldState.error && <p className="text-xs text-red-600 mt-2 mb-0">{fieldState.error.message}</p>}
    </FieldShell>
  );
}

const OWNER_TONES = {
  public: "bg-slate-100 text-slate-600 border-slate-200",
  own: "bg-blue-50 text-blue-700 border-blue-200",
};

// Whose the job is, as the small badge the tables draw it with — a select dressed as one.
function OwnerBadge({ owners, allowPublic }) {
  const { field } = useController({ name: "organization_id" });
  const tone = field.value === PUBLIC ? OWNER_TONES.public : OWNER_TONES.own;

  return (
    <span className="relative inline-flex shrink-0">
      <select
        value={field.value}
        onChange={field.onChange}
        aria-label="دامنه شغل"
        title="شغل عمومی در نتایج تحلیل تمامی سازمان‌ها دیده می‌شود؛ شغل اختصاصی تنها برای کاربران همان سازمان"
        className={`appearance-none rounded-full border ps-3 pe-7 py-0.5 text-xs font-medium leading-6
                    cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${tone}`}
      >
        {allowPublic && <option value={PUBLIC}>عمومی — همه سازمان‌ها</option>}
        {owners.map((organization) => (
          <option key={organization.id} value={String(organization.id)}>
            اختصاصی — {organization.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center opacity-70">
        {ChevronGlyph}
      </span>
    </span>
  );
}

// The heading over the boxes, as the details have one: the job's title, which a click edits, and
// the owner beside it.
function TitleHeading({ owners, allowPublic }) {
  const { field, fieldState } = useController({
    name: "job_title",
    rules: { validate: (text) => Boolean(text?.trim()) || "عنوان شغل را وارد نمایید" },
  });
  const edit = useInlineEdit((text) => {
    if (text.trim()) field.onChange(text.trim());
  });

  return (
    <div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                     shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0"
        >
          {FIELD_ICONS.job_title}
        </span>
        {edit.editing ? (
          <input
            type="text"
            {...edit.inputProps}
            aria-label="عنوان شغل"
            style={fitWidth(edit.draft)}
            className="max-w-full h-9 px-3 rounded-lg bg-white text-base font-bold text-slate-800
                       border border-blue-400 outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        ) : (
          <button
            type="button"
            onClick={() => edit.start(field.value ?? "")}
            title="ویرایش عنوان شغل"
            className="group inline-flex items-center gap-1.5 min-w-0 text-start cursor-text rounded-lg -mx-1.5
                       px-1.5 transition-colors duration-200 hover:bg-slate-100 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <span className="text-base font-bold text-slate-800 leading-7">
              {field.value?.trim() || <span className="text-slate-400">عنوان شغل را وارد نمایید</span>}
            </span>
            <span className="text-slate-300 group-hover:text-slate-500">{PencilGlyph}</span>
          </button>
        )}
        {owners.length > 0 && <OwnerBadge owners={owners} allowPublic={allowPublic} />}
        <span className="flex-1 min-w-8 h-px bg-gradient-to-l from-slate-200 to-transparent" />
      </div>
      {fieldState.error && <p className="text-xs text-red-600 mt-1.5 mb-0">{fieldState.error.message}</p>}
    </div>
  );
}

export default function JobForm({
  onSubmit,
  submitLabel,
  busy,
  initial,
  actions,
  formId,
  owners = [],
  allowPublic = true,
  defaultOwner = null,
  primary = [],
}) {
  const methods = useForm({
    defaultValues: toFormValues(initial, owners, allowPublic, defaultOwner),
  });

  // An other name becomes the title and the title takes its place among the other names, so the
  // swap loses neither.
  const promoteAlias = (alias) => {
    const title = methods.getValues("job_title").trim();
    const aliases = methods.getValues("aliases") ?? [];
    const next = title
      ? aliases.map((name) => (name === alias ? title : name))
      : aliases.filter((name) => name !== alias);
    methods.setValue("job_title", alias, { shouldDirty: true, shouldValidate: true });
    methods.setValue("aliases", next, { shouldDirty: true, shouldValidate: true });
  };

  const submit = (values) => {
    const body = { job_title: values.job_title.trim(), description: values.description.trim() };
    for (const key of LIST_KEYS) body[key] = cellFromItems(values[key]);
    if (owners.length) {
      body.organization_id =
        values.organization_id === PUBLIC ? null : Number(values.organization_id);
    }
    onSubmit(body, () => methods.reset(toFormValues(null, owners, allowPublic, defaultOwner)));
  };

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col gap-4"
      >
        <TitleHeading owners={owners} allowPublic={allowPublic} />

        <p className="text-xs text-slate-500 leading-6 -mt-2 mb-0">
          برای ویرایش، روی هر مورد کلیک نمایید؛ مورد جدید را با «افزودن» در هر بخش اضافه نمایید.
        </p>

        {arrange(formFields(primary)).map((block) =>
          block.group ? (
            <CompetencyShell key="competencies" size={block.group.length}>
              {block.group.map((field) => (
                <CompetencyCardEditor key={field.key} fieldKey={field.key} primary={field.primary} />
              ))}
            </CompetencyShell>
          ) : block.field.key === "description" ? (
            <DescriptionCard key="description" primary={block.field.primary} />
          ) : (
            <ListCard
              key={block.field.key}
              fieldKey={block.field.key}
              primary={block.field.primary}
              onPromote={promoteAlias}
            />
          ),
        )}

        {!formId && <SubmitBar label={submitLabel} busy={busy} actions={actions} />}
      </form>
    </FormProvider>
  );
}
