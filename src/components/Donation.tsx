"use client";

import config from "@/config";
import { Invoice } from "@prisma/client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Error from "./Error";

export default function Donation() {
  const denominations = config.bitpay.donation.denominations;
  const maximumDonation = 2800;
  const buttonSelectedBgColor = config.bitpay.donation.buttonSelectedBgColor;
  const buttonSelectedTextColor =
    config.bitpay.donation.buttonSelectedTextColor;
  const buyerFields = config.bitpay.donation.buyer.fields;
  const posDataFields = config.bitpay.donation.posData.fields;
  const enableOther = config.bitpay.donation.enableOther;
  const selectedDenominationStyles = {
    backgroundColor: buttonSelectedBgColor,
    color: buttonSelectedTextColor,
  };

  const [formData, setFormData] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    buyer?: {};
    price?: string | number;
    currency?: string;
  }>({});
  const [selectedDenomination, setSelectedDenomination] = useState<null | {
    type: string;
    index: number | null;
    value: number | string;
  }>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.price) {
      return setError("Please choose donation amount");
    }

    if (
      formData.price &&
      parseFloat(formData.price as string) > maximumDonation
    ) {
      return setError(
        `Your donation was larger than the allowed maximum of
          ${Number(maximumDonation).toFixed(2)}`
      );
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-invoice`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data));
        setLoading(false);
        return;
      }

      const data: Invoice = await res.json();
      const { bitpay_url } = data;

      if (bitpay_url) {
        window.location.href = bitpay_url;
      }

      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(JSON.stringify(e));
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="my-6">Your contribution will benefit RECIPIENT.</p>
      {error && (
        <div className="my-4">
          <Error>{error}</Error>
        </div>
      )}
      <div className="flex flex-wrap -mx-1">
        {denominations.map((denomination, i) => (
          <div key={i} className="w-1/3 p-2">
            <button
              className="w-full p-4 text-left transition-all bg-[#E6E9ED]"
              style={
                selectedDenomination?.index === i
                  ? selectedDenominationStyles
                  : {}
              }
              onClick={() => {
                setSelectedDenomination({
                  type: "button",
                  index: i,
                  value: denomination,
                });
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  price: denomination,
                  currency: "USD",
                }));
              }}
            >
              ${denomination}
            </button>
          </div>
        ))}
        {enableOther && (
          <div className="w-1/3 p-2">
            <input
              type="text"
              placeholder="Other (Maximum $2,800)"
              style={
                selectedDenomination?.type === "input"
                  ? selectedDenominationStyles
                  : {}
              }
              className="w-full shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onFocus={(e) =>
                setSelectedDenomination({
                  type: "input",
                  index: null,
                  value: e.target.value,
                })
              }
              onChange={(e) => {
                setSelectedDenomination({
                  type: "input",
                  index: null,
                  value: e.target.value,
                });
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  price: e.target.value,
                  currency: "USD",
                }));
              }}
            />
          </div>
        )}
      </div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="space-y-3">
          {buyerFields.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <input
                      required={field.required}
                      className="w-full md:w-1/3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type={field.type}
                      name={field.name}
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyer: {
                            ...formData.buyer,
                            [e.target.name]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                );

              case "email":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <input
                      required={field.required}
                      className="w-full md:w-1/3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type={field.type}
                      name={field.name}
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyer: {
                            ...formData.buyer,
                            [e.target.name]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                );

              case "select":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <select
                      name={field.name}
                      required={field.required}
                      className="w-full md:w-1/3 block bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray"
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyer: {
                            ...formData.buyer,
                            [e.target.name]: e.target.value,
                          },
                        })
                      }
                    >
                      {field.options.map((option) => {
                        return (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
            }
          })}
          {posDataFields.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <input
                      required={field.required}
                      className="w-full md:w-1/3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type={field.type}
                      name={field.name}
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                );

              case "email":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <input
                      required={field.required}
                      className="w-full md:w-1/3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type={field.type}
                      name={field.name}
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                );

              case "select":
                return (
                  <div key={field.id} className="flex items-center">
                    <label className="w-1/3" htmlFor={field.id}>
                      {field.label}:
                    </label>
                    <select
                      name={field.name}
                      required={field.required}
                      className="w-full md:w-1/3 block bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray"
                      id={field.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      {field.options.map((option) => {
                        return (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
            }
          })}
        </div>

        <p className="mt-10 text-sm mb-4">
          {config.bitpay.donation.footerText}
        </p>
        <div className="flex justify-center">
          <button
            disabled={loading}
            className={loading ? "opacity-70" : ""}
            type="submit"
          >
            <Image
              width={300}
              height={80}
              src="https://bitpay.com/cdn/merchant-resources/pay-with-bitpay-card-group.svg"
              alt="Pay with bitpay"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
