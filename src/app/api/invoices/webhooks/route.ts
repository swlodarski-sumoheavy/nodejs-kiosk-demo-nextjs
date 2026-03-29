import config from "@/config";
import { bitpayClient } from "@/lib/bitpay";
import prisma from "@/lib/prisma";
import { sseService } from "@/services/sse";
import { webhookVerifier } from "@/services/webhooks";
import logger from "@/utils/logger";
import { Prisma } from "@prisma/client";
import { Invoice } from "bitpay-sdk/models";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    data: Partial<Invoice>;
    event: { code: number; name: string };
  };
  try {
    const webhookSignature = (await headers()).get("x-signature");
    logger.info({
      code: "IPN_RECEIVED",
      message: "Received IPN",
      context: {
        ...body,
      },
    });
    const isVerified = webhookVerifier.verify(
      config.bitpay.token,
      JSON.stringify(body),
      webhookSignature as string
    );
    if (!isVerified) {
      throw new Error("Signature invalid");
    }
    const verifedInvoice = await bitpayClient.getInvoice(
      body.data.id as string
    );
    const foundedInvoice = await prisma.invoice.findFirstOrThrow({
      where: {
        bitpay_id: verifedInvoice.id,
      },
    });
    const invoice = await prisma.invoice.update({
      where: {
        id: foundedInvoice.id,
      },
      data: {
        status: verifedInvoice.status,
      },
    });
    logger.info({
      code: "IPN_VALIDATE_SUCCESS",
      message: "Successfully validated IPN",
      context: {
        id: verifedInvoice.id,
      },
    });
    logger.info({
      code: "INVOICE_UPDATE_SUCCESS",
      message: "Successfully update invoice",
      context: {
        id: invoice.bitpay_id,
      },
    });
    const eventMessages: { [key: string]: { [key: string]: string | null } } = {
      invoice_paidInFull: {
        type: "Good",
        content: `Invoice ${invoice.bitpay_id} has been paid in full.`,
      },
      invoice_expired: {
        type: "Bad",
        content: `Invoice ${invoice.bitpay_id} has expired.`,
      },
      invoice_confirmed: {
        type: "Good",
        content: `Invoice ${invoice.bitpay_id} has been confirmed.`,
      },
      invoice_completed: {
        type: "Good",
        content: `Invoice ${invoice.bitpay_id} is complete.`,
      },
      invoice_manuallyNotified: {
        type: null,
        content: null,
      },
      invoice_failedToConfirm: {
        type: "Bad",
        content: `Invoice ${invoice.bitpay_id} has failed to confirm.`,
      },
      invoice_refundComplete: {
        type: null,
        content: null,
      },
      invoice_declined: {
        type: "Bad",
        content: `Invoice ${invoice.bitpay_id} has been declined.`,
      },
    };
    const eventData = {
      eventName: body.event.name,
      eventCode: body.event.code,
      invoice,
      message: eventMessages[body.event.name],
    };
    sseService.addEvent(eventData);
    return new NextResponse(null, {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.prototype && e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error({
        code: "INVOICE_UPDATE_FAIL",
        message: "Failed to update invoice",
        context: {
          id: body.data.id,
        },
      });
    } else {
      logger.error({
        code: "IPN_VALIDATE_FAIL",
        message: "Failed to validate IPN",
        context: {
          errorMessage: e.message,
          stackTrace: e,
        },
      });

      return NextResponse.json(e.message, {
        status: 500,
      });
    }

    return NextResponse.json(e, {
      status: 500,
    });
  }
}
