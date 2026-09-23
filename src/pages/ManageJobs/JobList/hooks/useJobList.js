/** Logic of the job list: the title filter (debounced, going back to page 1 when it changes) and scope filter, paging (keeping the last page on screen while the next loads), the rebuild status, and editing, viewing and deleting a job. */
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ROLES } from "@constants/roles";
import useDebouncedValue from "@hooks/useDebouncedValue";
import useRebuildStatus from "@hooks/useRebuildStatus";
import { useOrganizationsQuery } from "@services/accountsApi";
import { useDeleteJobMutation, useJobsQuery, useUpdateJobMutation } from "@services/adminApi";
import { indexById, scopeFilterParams } from "@utils/organizations";
import { runAction } from "@utils/runAction";
import { EMPTY_JOBS_PAGE, JOBS_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constants";

function usePageNumberFor(titleQuery) {
  const [paging, setPaging] = useState({ titleQuery, pageNumber: 1 });
  const pageNumber = paging.titleQuery === titleQuery ? paging.pageNumber : 1;
  const goToPage = (page) => setPaging({ titleQuery, pageNumber: page });
  return [pageNumber, goToPage];
}

function useLastLoadedPage(data) {
  const lastLoaded = useRef(EMPTY_JOBS_PAGE);
  if (data) lastLoaded.current = data;
  return data ?? lastLoaded.current;
}

export default function useJobList() {
  const currentUser = useOutletContext();
  const isSuperAdmin = currentUser.role === ROLES.superAdmin;

  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const titleQuery = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const [pageNumber, goToPage] = usePageNumberFor(titleQuery);

  const { data: organizations = [] } = useOrganizationsQuery();
  const organizationsById = indexById(organizations);

  const { data, isFetching, isLoading } = useJobsQuery({
    q: titleQuery,
    page: pageNumber,
    pageSize: JOBS_PAGE_SIZE,
    ...scopeFilterParams(scopeFilter),
  });
  const jobsPage = useLastLoadedPage(data);

  const [updateJob, { isLoading: isSaving }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  const { isRebuilding } = useRebuildStatus();

  const findJob = (id) => (id === null ? null : jobsPage.items.find((job) => job.id === id));

  const changeScope = (scope) => {
    setScopeFilter(scope);
    goToPage(1);
  };

  const saveJob = async (body) => {
    const isSaved = await runAction(
      () => updateJob({ id: editingId, ...body }),
      `«${body.job_title}» ذخیره شد؛ بازسازی امبدینگ‌ها آغاز شد.`
    );
    if (isSaved) setEditingId(null);
  };

  const confirmDelete = async () => {
    const job = jobToDelete;
    const isDeleted = await runAction(
      () => deleteJob(job.id),
      `«${job.job_title}» حذف شد؛ بازسازی امبدینگ‌ها آغاز شد.`
    );
    if (!isDeleted) return;
    setJobToDelete(null);
    if (jobsPage.items.length === 1 && pageNumber > 1) goToPage(pageNumber - 1);
  };

  return {
    currentUser,
    isSuperAdmin,
    organizations,
    organizationsById,
    searchTerm,
    changeSearchTerm: (event) => setSearchTerm(event.target.value),
    titleQuery,
    scopeFilter,
    changeScope,
    jobsPage,
    isLoading,
    isFetching,
    goToPage,
    isRebuilding,
    editingJob: findJob(editingId),
    startEditing: (job) => setEditingId(job.id),
    stopEditing: () => setEditingId(null),
    saveJob,
    isSaving,
    viewingJob: findJob(viewingId),
    startViewing: (job) => setViewingId(job.id),
    stopViewing: () => setViewingId(null),
    jobToDelete,
    askToDelete: setJobToDelete,
    cancelDelete: () => setJobToDelete(null),
    confirmDelete,
    isDeleting,
  };
}
