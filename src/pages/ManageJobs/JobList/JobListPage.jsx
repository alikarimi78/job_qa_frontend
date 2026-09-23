/** Job management list: filter the stored jobs by scope and title, page through them, and edit, view or delete each one. */
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import Pager from "@components/ui/Pager";
import JobListDialogs from "./components/JobListDialogs";
import JobListToolbar from "./components/JobListToolbar";
import JobsTable from "./components/JobsTable";
import useJobList from "./hooks/useJobList";

const emptyMessageFor = (titleQuery) =>
  titleQuery
    ? `شغلی با عنوان «${titleQuery}» در این دامنه یافت نشد.`
    : "هنوز شغلی در این دامنه ثبت نشده است.";

export default function JobListPage() {
  const jobList = useJobList();
  const { jobsPage } = jobList;

  return (
    <>
      <JobListToolbar jobList={jobList} />

      <Card>
        {jobList.isLoading ? (
          <Loader />
        ) : (
          <div className={jobList.isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
            <JobsTable jobList={jobList} emptyMessage={emptyMessageFor(jobList.titleQuery)} />
            <Pager
              page={jobsPage.page}
              pageSize={jobsPage.page_size}
              total={jobsPage.total}
              busy={jobList.isFetching}
              onPage={jobList.goToPage}
            />
          </div>
        )}
      </Card>

      <JobListDialogs jobList={jobList} />
    </>
  );
}
