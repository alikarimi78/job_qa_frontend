import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Loader, { Spinner } from "@components/ui/Loader";
import DataTable, { RowActions } from "@components/ui/DataTable";
import PageToolbar from "@components/ui/PageToolbar";
import Pager from "@components/ui/Pager";
import Modal from "@components/ui/Modal";
import Select from "@components/ui/Select";
import IconButton, { EyeGlyph, PencilGlyph, TrashGlyph } from "@components/ui/IconButton";
import { CloseButton, ConfirmDialog, DialogFooter } from "@components/manage/Forms";
import { splitItems } from "@components/ui/ItemsInput";
import JobForm from "@components/JobForm";
import JobRecordFields from "@components/JobRecordFields";
import { useOrganizationsQuery } from "@services/accountsApi";
import {
  useDeleteJobMutation,
  useJobsQuery,
  useRebuildStatusQuery,
  useUpdateJobMutation,
} from "@services/adminApi";
import { runAction } from "@utils/action";
import { faDate, faNumber } from "@utils/jalali";


const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const EDIT_FORM_ID = "corpus-edit-form";
const EMPTY_PAGE = { items: [], total: 0, page: 1, page_size: PAGE_SIZE };

const ALIAS_CHIPS = 2;

// The records that belong to no organization — the corpus every organization searches.
const PUBLIC = "public";

// An org_admin lists what their organization's searches reach — the public corpus beside their
// own records — and changes their own alone, as the server's `assert_can_admit_job` does; a row
// they may not change gets «مشاهده» in place of the edit and delete buttons.
function canEdit(me, job) {
  if (me.role === "super_admin") return true;
  return job.organization_id != null && job.organization_id === me.organization_id;
}

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
  const me = useOutletContext();
  const isSuper = me.role === "super_admin";

  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [scope, setScope] = useState("");

  const { data: orgs = [] } = useOrganizationsQuery();
  const orgsById = Object.fromEntries(orgs.map((org) => [org.id, org]));

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(term.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  const { data, isFetching, isLoading } = useJobsQuery({
    q: query,
    page,
    pageSize: PAGE_SIZE,
    organizationId: scope && scope !== PUBLIC ? Number(scope) : undefined,
    publicOnly: scope === PUBLIC,
  });

  const previous = useRef(EMPTY_PAGE);
  if (data) previous.current = data;
  const shown = data ?? previous.current;

  const [updateJob, { isLoading: saving }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: removing }] = useDeleteJobMutation();

  const { data: rebuild } = useRebuildStatusQuery(undefined, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });
  const rebuilding = rebuild?.running ?? false;

  const row = editing === null ? null : shown.items.find((it) => it.id === editing);
  const viewed = viewing === null ? null : shown.items.find((it) => it.id === viewing);

  async function save(body) {
    const done = await runAction(
      () => updateJob({ id: editing, ...body }),
      `«${body.job_title}» ذخیره شد؛ بازسازی امبدینگ‌ها آغاز شد.`
    );
    if (done) setEditing(null);
  }

  async function remove() {
    const job = deleting;
    const done = await runAction(
      () => deleteJob(job.id),
      `«${job.job_title}» حذف شد؛ بازسازی امبدینگ‌ها آغاز شد.`
    );
    if (!done) return;
    setDeleting(null);
    // The last row of a page past the first leaves that page empty, so step back a page.
    if (shown.items.length === 1 && page > 1) setPage(page - 1);
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
      key: "organization",
      header: "دامنه",
      cell: (job) =>
        job.organization_id == null ? (
          <Badge tone="neutral">عمومی</Badge>
        ) : (
          <Badge tone="accent">
            {orgsById[job.organization_id]?.name ?? `سازمان ${job.organization_id}`}
          </Badge>
        ),
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
      cell: (job) =>
        canEdit(me, job) ? (
          <RowActions>
            <IconButton
              tone="edit"
              title={`ویرایش «${job.job_title}»`}
              onClick={() => setEditing(job.id)}
            >
              {PencilGlyph}
            </IconButton>
            <IconButton
              tone="danger"
              title={`حذف «${job.job_title}»`}
              onClick={() => setDeleting(job)}
            >
              {TrashGlyph}
            </IconButton>
          </RowActions>
        ) : (
          <RowActions>
            <IconButton
              tone="view"
              title={`مشاهده «${job.job_title}»`}
              onClick={() => setViewing(job.id)}
            >
              {EyeGlyph}
            </IconButton>
          </RowActions>
        ),
    },
  ];

  return (
    <>
      <PageToolbar
        title="مدیریت مشاغل"
        status={
          rebuilding ? (
            <Badge tone="warning">
              <Spinner />
              بازسازی امبدینگ‌ها
            </Badge>
          ) : (
            <Badge tone="neutral">{faNumber(shown.total)} شغل</Badge>
          )
        }
        hint={
          isSuper
            ? "مشاغل ثبت‌شده در پایگاه داده. با ذخیره هر ویرایش یا حذف هر شغل، بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود و تحلیل در این مدت با نسخه پیشین پاسخ می‌دهد."
            : "مشاغلی که در نتایج تحلیل سازمان شما دیده می‌شوند. مشاغل اختصاصی سازمان شما قابل ویرایش و حذف است و مشاغل عمومی تنها قابل مشاهده است؛ با ذخیره هر ویرایش یا حذف هر شغل، بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود."
        }
      >
        {!isSuper && (
          <Select
            value={scope}
            onChange={(event) => {
              setScope(event.target.value);
              setPage(1);
            }}
            className="h-11 min-w-44"
          >
            <option value="">همه مشاغل</option>
            <option value={me.organization_id}>مشاغل اختصاصی سازمان شما</option>
          </Select>
        )}
        {isSuper && (
          <Select
            value={scope}
            onChange={(event) => {
              setScope(event.target.value);
              setPage(1);
            }}
            className="h-11 min-w-44"
          >
            <option value="">همه دامنه‌ها</option>
            <option value={PUBLIC}>عمومی</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        )}
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="فیلتر بر اساس عنوان شغل"
          maxLength={120}
          className="h-11 w-56 md:w-72 px-4 rounded-xl bg-white text-sm text-slate-800
                     border border-slate-200 outline-none transition-all duration-200
                     placeholder:text-slate-400
                     hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
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
                  ? `شغلی با عنوان «${query}» در این دامنه یافت نشد.`
                  : "هنوز شغلی در این دامنه ثبت نشده است."
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

      {row && (
        <Modal
          open
          title={`ویرایش «${row.job_title}»`}
          hint={
            row.organization_id == null
              ? "این رکورد هم‌اکنون در پایگاه دادهٔ مشترک تمامی سازمان‌ها موجود است. با ذخیره، تغییرات بلافاصله اعمال و بازسازی امبدینگ‌ها آغاز می‌شود."
              : `این رکورد تنها در نتایج تحلیل سازمان «${orgsById[row.organization_id]?.name ?? row.organization_id}» دیده می‌شود. با ذخیره، تغییرات بلافاصله اعمال و بازسازی امبدینگ‌ها آغاز می‌شود.`
          }
          size="lg"
          onClose={saving ? undefined : () => setEditing(null)}
          footer={
            <>
              <DialogFooter formId={EDIT_FORM_ID} label="ذخیره تغییرات" busy={saving} />
              <CloseButton onClose={() => setEditing(null)} busy={saving} label="انصراف" />
            </>
          }
        >
          <JobForm
            key={row.id}
            formId={EDIT_FORM_ID}
            initial={row}
            owners={orgs}
            allowPublic={isSuper}
            onSubmit={save}
          />
        </Modal>
      )}

      {viewed && (
        <Modal
          open
          title={`مشاهده «${viewed.job_title}»`}
          hint="این شغل در پایگاه داده مشترک تمامی سازمان‌ها ثبت شده است و ویرایش یا حذف آن تنها از سوی مدیر سامانه امکان‌پذیر است."
          size="lg"
          onClose={() => setViewing(null)}
          footer={<CloseButton onClose={() => setViewing(null)} />}
        >
          <JobRecordFields record={viewed} />
        </Modal>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="حذف شغل"
        message={`آیا از حذف «${deleting?.job_title ?? ""}» اطمینان دارید؟ این عملیات قابل بازگشت نیست. شغل از پایگاه داده حذف و بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود؛ تا پایان بازسازی، تحلیل با نسخه پیشین پاسخ می‌دهد.`}
        busy={removing}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}
