/** Card with the paged list of starred analyses (or a loader / empty state) and their count. */
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import Pager from "@components/ui/Pager";
import { faNumber } from "@utils/numbers";
import SavedSearchItem from "./SavedSearchItem";
import SavedSearchesEmpty from "./SavedSearchesEmpty";

function ListBody({ saved }) {
  if (saved.isLoading) return <Loader />;
  if (saved.items.length === 0) return <SavedSearchesEmpty />;

  return (
    <div className={saved.isFetching ? "opacity-60 transition-opacity duration-150" : undefined}>
      <ul className="list-none m-0 p-0 flex flex-col">
        {saved.items.map((savedSearch) => (
          <SavedSearchItem
            key={savedSearch.id}
            savedSearch={savedSearch}
            onOpen={() => saved.open(savedSearch.id)}
            onRemove={() => saved.askToRemove(savedSearch)}
          />
        ))}
      </ul>

      <Pager {...saved.pagination} busy={saved.isFetching} />
    </div>
  );
}

export default function SavedSearchList({ saved }) {
  return (
    <Card
      title="تحلیل‌های ستاره‌دار"
      hint="تحلیل‌هایی که نگه داشته‌اید، همان‌گونه که هنگام ستاره‌دار کردن دیده‌اید. این فهرست تنها برای شماست."
      actions={<Badge tone={saved.total ? "accent" : "neutral"}>{faNumber(saved.total)} تحلیل</Badge>}
    >
      <ListBody saved={saved} />
    </Card>
  );
}
