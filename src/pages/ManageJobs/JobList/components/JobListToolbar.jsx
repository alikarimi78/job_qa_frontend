/** Top of the job list: title, job count (or a "rebuilding" badge while embeddings are rebuilt), an explanation for the viewer's role, and the scope and title filters. */
import Badge from "@components/ui/Badge";
import PageToolbar from "@components/ui/PageToolbar";
import SearchInput from "@components/ui/SearchInput";
import Spinner from "@components/ui/Spinner";
import { faNumber } from "@utils/numbers";
import JobScopeSelect from "./JobScopeSelect";

const SUPER_ADMIN_HINT =
  "مشاغل ثبت‌شده در پایگاه داده. با ذخیره هر ویرایش یا حذف هر شغل، بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود و تحلیل در این مدت با نسخه پیشین پاسخ می‌دهد.";
const ORGANIZATION_ADMIN_HINT =
  "مشاغلی که در نتایج تحلیل سازمان شما دیده می‌شوند. مشاغل اختصاصی سازمان شما قابل ویرایش و حذف است و مشاغل عمومی تنها قابل مشاهده است؛ با ذخیره هر ویرایش یا حذف هر شغل، بازسازی امبدینگ‌ها بی‌درنگ آغاز می‌شود.";

function ListStatus({ isRebuilding, total }) {
  if (isRebuilding) {
    return (
      <Badge tone="warning">
        <Spinner />
        بازسازی امبدینگ‌ها
      </Badge>
    );
  }
  return <Badge tone="neutral">{faNumber(total)} شغل</Badge>;
}

export default function JobListToolbar({ jobList }) {
  return (
    <PageToolbar
      title="مدیریت مشاغل"
      status={<ListStatus isRebuilding={jobList.isRebuilding} total={jobList.jobsPage.total} />}
      hint={jobList.isSuperAdmin ? SUPER_ADMIN_HINT : ORGANIZATION_ADMIN_HINT}
    >
      <JobScopeSelect jobList={jobList} />
      <SearchInput
        value={jobList.searchTerm}
        onChange={jobList.changeSearchTerm}
        placeholder="فیلتر بر اساس عنوان شغل"
        maxLength={120}
      />
    </PageToolbar>
  );
}
