'use client';

import { BuyerFields, LedgerEntryInterface } from 'bitpay-sdk/models';
import { useEffect, useState } from 'react';

export default function LedgerReportTable({
  ledgerReport,
}: {
  ledgerReport: LedgerEntryInterface[];
}) {
  const [data, setData] = useState(ledgerReport);
  const [page, setPage] = useState(1);
  const limit = 10;
  const showingFrom = ledgerReport.length ? (page - 1) * limit + 1 : 0;
  const showingTo = (page - 1) * limit + data.length;

  const cols = [
    { label: 'ID', field: 'id' },
    { label: 'Type', field: 'type' },
    { label: 'Amount', field: 'amount' },
    { label: 'Code', field: 'code' },
    { label: 'Description', field: 'description' },
    { label: 'Timestamp', field: 'timestamp' },
    { label: 'txType', field: 'txType' },
    { label: 'Scale', field: 'scale' },
    { label: 'Invoice ID', field: 'invoiceId' },
    { label: 'Invoice Ammount', field: 'invoiceAmount' },
    { label: 'Invoice Currency', field: 'invoiceCurrency' },
    { label: 'Merchant Name', field: 'merchantName' },
    { label: 'Transcation Currency', field: 'transactionCurrency' },
    { label: 'Currency', field: 'currency' },
    { label: 'Buyer Name', field: 'buyerName', type: 'buyerFields' },
    { label: 'Buyer Address 1', field: 'buyerAddress1', type: 'buyerFields' },
    { label: 'Buyer Address 2', field: 'buyerAddress2', type: 'buyerFields' },
    { label: 'Buyer City', field: 'buyerCity', type: 'buyerFields' },
    { label: 'Buyer State', field: 'buyerState', type: 'buyerFields' },
    { label: 'Buyer ZIP', field: 'buyerZip', type: 'buyerFields' },
    { label: 'Buyer Country', field: 'buyerCountry', type: 'buyerFields' },
    { label: 'Buyer Email', field: 'buyerEmail', type: 'buyerFields' },
    { label: 'Buyer Phone', field: 'buyerPhone', type: 'buyerFields' },
    { label: 'Buyer Notify', field: 'buyerNotify', type: 'buyerFields' },
  ];

  useEffect(() => {
    setData(ledgerReport.slice((page - 1) * limit, page * limit));
  }, [ledgerReport, page]);

  return (
    <>
      <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {cols.map((col, index) => {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900 first:pl-0"
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data &&
                data.map((report) => {
                  return (
                    <tr key={report.id}>
                      {cols.map((col, i) => (
                        <td
                          key={i}
                          className="whitespace-nowrap py-4 px-3 text-sm  text-gray-500 first:pl-0 first:font-medium first:text-gray-900"
                        >
                          {col.type === 'buyerFields' && (
                            <span>
                              {report.buyerFields?.[
                                col.field as keyof BuyerFields
                              ]?.toString()}
                            </span>
                          )}
                          <span>
                            {
                              report[
                                col.field as keyof Omit<
                                  LedgerEntryInterface,
                                  'buyerFields'
                                >
                              ]
                            }
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}

              {data.length === 0 && (
                <tr>
                  <td
                    className="text-center py-20"
                    colSpan={cols.length / 1.75}
                  >
                    <p className="text-md">
                      {`
                        Could not find ledger report in selected date range.`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <nav
        className="-mx-6 mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium mx-1">{showingFrom}</span>
            to
            <span className="font-medium mx-1">{showingTo}</span>
            of
            <span className="font-medium mx-1">{ledgerReport.length}</span>
            results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <button
            name="prev"
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all select-none ${
              page === 1 ? 'opacity-50 pointer-events-none' : ''
            }
          }`}
            onClick={() => setPage(() => page - 1)}
          >
            Previous
          </button>

          <button
            name="next"
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all select-none ${
              page * limit >= ledgerReport.length
                ? 'opacity-50 pointer-events-none'
                : ''
            }`}
            onClick={() => setPage(() => page + 1)}
          >
            Next
          </button>
        </div>
      </nav>
    </>
  );
}
