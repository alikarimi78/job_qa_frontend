import { useEffect, useRef, useState } from "react";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import DataTable, { RowActions } from "@components/ui/DataTable";
import PageToolbar from "@components/ui/PageToolbar";
import Pager from "@components/ui/Pager";
import Modal from "@components/ui/Modal";
import IconButton, { PencilGlyph } from "@components/ui/IconButton";
import { CloseButton, DialogFooter } from "@components/manage/Forms";
import { splitItems } from "@components/ui/ItemsInput";
import JobForm from "@components/JobForm";
import {
  useJobsQuery,
  useRebuildStatusQuery,
  useUpdateJobMutation,
} from "@services/adminApi";
import { runAction } from "@utils/action";
import { faDate, faNumber } from "@utils/jalali";

// The corpus, and the one place it can be corrected after the fact.
//
// «بررسی پیشنهادها» next door decides what *enters* the dataset; this page is about the
// 1118 records already in it, and the difference is why they are two sections rather
// than two tabs: a queue is worked through and emptied, a corpus is looked something up
// in. Hence the pager and the search box, which no other management table has — the
// others hold tens of rows and print whole.
//
// Built on the same pattern as the other management sections (`admin_panel.mp4`): a
// toolbar, a table under it, and a «عملیات‌ها» column of round buttons that open a
// dialog. There is one button, and it opens the same ten-column `JobForm` the suggester
// and the reviewer both fill in — a record has no summary worth reading that the form
// does not already show, so «مشاهده» would be the same dialog with the inputs disabled.
//
// **Saving starts a rebuild on the server**, the third path that does (with approving a
// suggestion and adding a record directly). It costs what an approval costs rather than
// what a re-encode costs — the embedding store is keyed on each record's text, so only
// this record's own texts are encoded — but it is not instant, and the badge in the
// toolbar is what says so while it runs.

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const EDIT_FORM_ID = "corpus-edit-form";
const EMPTY_PAGE = { items: [], total: 0, page: 1, page_size: PAGE_SIZE };

// How many of a record's other names the row shows before it stops being a table cell.
const ALIAS_CHIPS = 2;

function AliasCell({ value }) {
  const items = splitItems(value);
  if (!items.length) return <span className="text-sm text-slate-400">—</span>;

  const shown = items.slice(0, ALIAS_CHIPS);
  const rest = items.length - shown.length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {shown.map((item) => (
        <span
          key={item}
          className="bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5 text-xs text-slate-600"
        >
          {item}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-xs text-slate-400 fa-nums">+{faNumber(rest)}</span>
      )}
    </div>
  );
}

export default function Jobs() {
  // Two pieces of state for one box: what is being typed, and what has been asked for.
  // The request is the second, so a title is not searched once per keystroke.
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // The id being edited, never the row itself: the listing refetches under the dialog
  // after every save, and a copied row would leave it editing what the record used to
  // say. Same reason the moderation queue keeps only an id.
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(term.trim());
      // A narrower result has fewer pages, and page 7 of 3 is an empty table.
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  const { data, isFetching, isLoading } = useJobsQuery({ q: query, page, pageSize: PAGE_SIZE });

  // A new page is a new cache entry, so `data` is undefined until it arrives and the
  // table would blank between pages — taking the pager under the pointer with it. The
  // last answer is kept and shown until the next one lands; `isFetching` is what says
  // it is stale, and the buttons are disabled meanwhile.
  const previous = useRef(EMPTY_PAGE);
  if (data) previous.current = data;
  const shown = data ?? previous.current;

  const [updateJob, { isLoading: saving }] = useUpdateJobMutation();

  // Only while one is running: the rebuild happens on a daemon thread with the old
  // engine still serving, so there is nothing to report except that it has not finished.
  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const rebuilding = rebuild?.running ?? false;

  // Looked up rather than stored — see `editing` above. A record that has moved off the
  // page (its title was edited and it sorted elsewhere) simply takes its dialog with it.
  const row = editing === null ? null : shown.items.find((it) => it.id === editing);

  async function save(body) {
    const done = await runAction(
      () => updateJob({ id: editing, ...body }),
      `«${body.job_title}» ذخیره شد؛ بازسازی امبدینگ‌ها آغاز شد.`
    );
    // Closed only on success: a 409 («این رکورد در پایگاه داده نیست») leaves the dialog
    // open with the corrections still in it.
    if (done) setEditing(null);
  }

  const columns = [
    {
      key: "job_title",
      header: "عنوان شغل",
      cell: (job) => <strong className="text-sm text-slate-800">{job.job_title}</strong>,
    },
    {
      key: "aliases",
      header: "نام‌های دیگر",
      cell: (job) => <AliasCell value={job.aliases} />,
    },
    {
      key: "updated_at",
      header: "آخرین ویرایش",
      cell: (job) => (
        <span className="text-sm text-slate-600 fa-nums">{faDate(job.updated_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "عملیات‌ها",
      align: "end",
      cell: (job) => (
        <RowActions>
          <IconButton
            tone="edit"
            title={`ویرایش «${job.job_title}»`}
            onClick={() => setEditing(job.id)}
          >
            {PencilGlyph}
          </IconButton>
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageToolbar
        title="مدیریت مشاغل"
        hint="مشاغل ثبت‌شده در پایگاه داده. با ذخیره هر ویرایش، بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود و جستجو در این مدت با نسخه پیشین پاسخ می‌دهد."
      >
        {/* The search is the server's: what is being looked for is almost always on some
            other page, so filtering the twenty rows in hand would find nothing. */}
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="جست‌وجوی عنوان شغل"
          maxLength={120}
          className="h-11 w-56 md:w-72 px-4 rounded-xl bg-white text-sm text-slate-800
                     border border-slate-200 outline-none transition-all duration-200
                     placeholder:text-slate-400
                     hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
        {rebuilding ? (
          <Badge tone="warning">
            <Spinner />
            بازسازی امبدینگ‌ها
          </Badge>
        ) : (
          <Badge tone="neutral">{faNumber(shown.total)} شغل</Badge>
        )}
      </PageToolbar>

      <Card>
        {isLoading ? (
          <Loader />
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
            <DataTable
              columns={columns}
              rows={shown.items}
              empty={
                query
                  ? `شغلی با عنوان «${query}» در پایگاه داده یافت نشد.`
                  : "هنوز شغلی در پایگاه داده ثبت نشده است."
              }
            />
            <Pager
              page={shown.page}
              pageSize={shown.page_size}
              total={shown.total}
              busy={isFetching}
              onPage={setPage}
            />
          </div>
        )}
      </Card>

      {/* Mounted only while a row is being edited, so `JobForm` seeds its boxes from that
          record on every open; the `key` says the same thing for the case where one
          editor is opened straight from another. */}
      {row && (
        <Modal
          open
          title={`ویرایش «${row.job_title}»`}
          hint="این رکورد هم‌اکنون در پایگاه دادهٔ مشترک تمامی سازمان‌ها موجود است. با ذخیره، تغییرات بلافاصله اعمال و بازسازی امبدینگ‌ها آغاز می‌شود."
          size="lg"
          onClose={saving ? undefined : () => setEditing(null)}
          footer={
            <>
              <DialogFooter formId={EDIT_FORM_ID} label="ذخیره تغییرات" busy={saving} />
              <CloseButton onClose={() => setEditing(null)} busy={saving} label="انصراف" />
            </>
          }
        >
          <JobForm key={row.id} formId={EDIT_FORM_ID} initial={row} onSubmit={save} />
        </Modal>
      )}
    </>
  );
}
