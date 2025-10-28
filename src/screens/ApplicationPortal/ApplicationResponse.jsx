import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function ApplicationResponse({ data }) {
  return (
    <div>
      <h1 className="mb-6 font-open-sans text-lg font-semibold">
        {data.question} {data.required ? "*" : ""}
      </h1>
      {(() => {
        switch (data.type) {
          case "radio":
            return (
              <div className="flex flex-col gap-6">
                {data.response.map((response, i) => (
                  <label
                    key={i}
                    className="text-open-sans flex items-center gap-2 text-secondary-grey"
                  >
                    <input
                      type="radio"
                      name="example"
                      value="option2"
                      className="focus-ring-0 text-secondary-grey ring-0"
                      checked={response.value}
                    />
                    {response.option}
                  </label>
                ))}
              </div>
            );
          case "dropdown":
            return (
              <div className="flex w-[236px] items-center justify-between rounded-sm border-[1.5px] border-[#E0E0E0] bg-white p-3 text-secondary-grey">
                {data.response}
                <ChevronDownIcon className="h-[1.5em] w-[1.5em]" />
              </div>
            );
          case "short":
            return (
              <div className="max-w-[455px] border-b-[1px] border-secondary-grey py-2 text-secondary-grey">
                {data.response}
              </div>
            );
          case "multi":
            return (
              <div className="flex flex-col gap-6">
                {data.response.map((response, i) => (
                  <label
                    key={i}
                    className="text-open-sans flex items-center gap-2 text-secondary-grey"
                  >
                    <input
                      type="checkbox"
                      name="example"
                      value="option2"
                      className="focus-ring-0 mr-2 rounded-sm text-secondary-grey ring-0"
                      checked={response.value}
                    />
                    {response.option}
                  </label>
                ))}
              </div>
            );
        }
      })()}
    </div>
  );
}
