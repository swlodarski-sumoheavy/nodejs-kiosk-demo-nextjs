/**
 * @jest-environment node
 */

import { POST as handler } from "@/app/api/create-invoice/route";
import { invoiceService } from "@/services/invoice";
import logger from "@/utils/logger";
import { NextRequest } from "next/server";
import { Logger } from "winston";

describe("/api/create-invoice", () => {
  it("Sould return successful response", async () => {
    jest.spyOn(logger, "info").mockReturnValue({} as unknown as Logger);
    const req: NextRequest = {
      method: "POST",
      body: {},
      headers: {},
      json: async () => ({ name: "Item 3" }),
    } as NextRequest;

    const createInvoiceSpy = jest
      .spyOn(invoiceService, "createInvoice")
      .mockReturnValue({ bitpay_id: "test" } as any);

    await handler(req);
    expect(createInvoiceSpy).toHaveBeenCalled();
  });
});
