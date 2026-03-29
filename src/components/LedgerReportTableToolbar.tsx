"use client";

import { supportedCurrencies } from "@/utils/currencies";
const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), { ssr: false });

import { LedgerEntryInterface } from 'bitpay-sdk/models';
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback } from "react";

export default function LedgerReportTableToolbar({
  startDate,
  endDate,
  currency,
  data,
}: {
  startDate: string;
  endDate: string;
  currency: string;
  data: LedgerEntryInterface[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleToolbarChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    router.push(
      pathname + "?" + createQueryString(e.target.name, e.target.value)
    );
  };
  const csvData = data.map((report) => {
    const csvReport = {
      ...report,
      buyerName: report.buyerFields?.buyerName,
      buyerAddress1: report.buyerFields?.buyerAddress1,
      buyerAddress2: report.buyerFields?.buyerAddress2,
      buyerCity: report.buyerFields?.buyerCity,
      buyerState: report.buyerFields?.buyerState,
      buyerZip: report.buyerFields?.buyerZip,
      buyerCountry: report.buyerFields?.buyerCountry,
      buyerEmail: report.buyerFields?.buyerEmail,
      buyerPhone: report.buyerFields?.buyerPhone,
      buyerNotify: report.buyerFields?.buyerNotify,
    };

    delete csvReport.buyerFields;

    return csvReport;
  });

  return (
    <div className="mb-10 flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-x-6 md:space-y-0">
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-gray-700 mr-2"
          >
            Start Date
          </label>
          <input
            className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={startDate}
            onChange={handleToolbarChange}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-gray-700 mr-2"
          >
            End Date
          </label>
          <input
            className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={endDate}
            onChange={handleToolbarChange}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-gray-700 mr-2"
          >
            Currency
          </label>
          <select
            className="block w-full bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray"
            id="currency"
            name="currency"
            defaultValue={currency}
            onChange={handleToolbarChange}
          >
            {supportedCurrencies.map((supportedCurrency) => (
              <option key={supportedCurrency} defaultValue={supportedCurrency}>
                {supportedCurrency}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CSVLink
        className={`relative mt-6 md:mt-0 inline-flex md:self-end md:ml-6 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all select-none ${
          data.length === 0 ? "opacity-50 pointer-events-none" : ""
        }`}
        data={csvData}
        filename={`Ledger ${startDate} to ${endDate}`}
      >
        Download CSV
      </CSVLink>
    </div>
  );
}
