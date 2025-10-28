import ApplicationCard from "./ApplicationCard";
import PaginationComp from "../../components/PaginationComp";

export default function ApplicationList({
  title,
  data,
  updateStatus,
  pageSize,
  currentPage,
  updatePageCallback,
}) {
  const filtered = data.filter(
    (_, i) => i >= pageSize * currentPage && i < pageSize * (currentPage + 1)
  );
  return (
    <div>
      <h2 className="mb-8 font-open-sans text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-8">
        {filtered.length == 0 ? (
          <h1 className="font-inter text-sm">
            There are currently no applications.
          </h1>
        ) : (
          <>
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                data={app}
                updateStatus={updateStatus}
              />
            ))}
          </>
        )}
      </div>
      <div className="flex w-full justify-end">
        <PaginationComp
          items={data}
          pageSize={pageSize}
          currentPage={currentPage}
          updatePageCallback={updatePageCallback}
        />
      </div>
    </div>
  );
}
