import { Combobox } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function SearchableSelect({
  label,
  name,
  value,
  options = [],
  onChange,
  required = false,
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value) || null;

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <Combobox
        value={selected}
        onChange={(opt) =>
          onChange({
            target: { name, value: opt.value },
          })
        }
      >
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-800 focus:outline-none"
            displayValue={(opt) => opt?.label || ""}
            onChange={(e) => setQuery(e.target.value)}
            required={required}
          />

          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No hay resultados
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <Combobox.Option
                  key={opt.value}
                  value={opt}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    }`
                  }
                >
                  {opt.label}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
