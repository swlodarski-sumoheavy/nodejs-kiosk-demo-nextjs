import { invoiceService } from '@/services/invoice';
import prisma from '__mocks__/prisma';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockedInvoice } from '../../__mocks__/invoice';

vi.mock('@/lib/prisma');
vi.mock('@/services/invoice');

describe('Invoices', async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create invoice', async () => {
    vi.mocked(invoiceService.createInvoice).mockResolvedValue(
      mockedInvoice as any
    );

    const invoice = await invoiceService.createInvoice({
      currency: 'USD',
      price: '2',
    });

    expect(invoice).toStrictEqual(mockedInvoice);
  });

  it('should save invoice', async () => {
    prisma.invoice.create.mockResolvedValue(mockedInvoice as any);
    vi.mocked(invoiceService.saveInvoice).mockResolvedValue(
      mockedInvoice as any
    );

    const invoice = await invoiceService.saveInvoice(mockedInvoice as any);

    expect(invoice).toStrictEqual(mockedInvoice);
  });

  it('should get invoices', async () => {
    vi.mocked(invoiceService.getInvoices).mockResolvedValue({
      count: 1,
      prev: {},
      next: {},
      invoices: [
        {
          id: 1,
          price: 10,
          currency_code: 'USD',
        },
      ],
    } as any);

    const invoices = await invoiceService.getInvoices(1, 10);

    expect(invoices).toStrictEqual({
      count: 1,
      prev: {},
      next: {},
      invoices: [
        {
          id: 1,
          price: 10,
          currency_code: 'USD',
        },
      ],
    });
  });
});
