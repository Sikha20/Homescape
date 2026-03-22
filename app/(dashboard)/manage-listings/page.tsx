import { checkPaymentStatus } from '@/actions/CheckPaymentStatus';
import { db } from '@/lib/db';
import { TManageListingsPageProp } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import ManageListingsPage from './(_component)/ManageListingsPage';
import { redirect } from 'next/navigation';
export default async function ManageListings({ searchParams }: TManageListingsPageProp) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const amount = (await searchParams)?.amount;
  const total_amount = (await searchParams)?.total_amount;
  const bank_reference = (await searchParams)?.bank_reference;
  const idx = (await searchParams)?.idx;
  const mobile = (await searchParams)?.mobile;
  const pidx = (await searchParams)?.pidx;
  const purchase_order_id = (await searchParams)?.purchase_order_id;
  const purchase_order_name = (await searchParams)?.purchase_order_name;
  const status = (await searchParams)?.status;
  const t = (await searchParams)?.t;
  const tidx = (await searchParams)?.tidx;
  const token = (await searchParams)?.token;
  const transaction_id = (await searchParams)?.transaction_id;

  try {
    if (pidx) {
      const paymentStatus = await checkPaymentStatus(pidx);
      if (paymentStatus.response.status !== 'Completed') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-6">Your payment failed. Please try again later.</p>
                <Link href={"/manage-listings"}>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Retry
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      }
    }

    // Verify purchase_order_id exists before proceeding
    if (!purchase_order_id) {
      throw new Error("Property ID is required");
    }

    // Use a transaction to ensure all database operations succeed or fail together
    await db.$transaction(async (tx) => {
      // Create payment record
      await tx.payment.create({
        data: {
          amount: amount ? parseInt(amount) : null,
          total_amount: total_amount ? parseInt(total_amount) : null,
          bank_reference: bank_reference !== 'None' ? bank_reference : null,
          idx,
          mobile,
          pidx,
          propertyId: purchase_order_id,
          purchase_order_name,
          status,
          t,
          tidx,
          token,
          transaction_id,
          userUserId: userId,
        },
      });

      // Update property status
      await tx.property.update({
        where: { id: purchase_order_id },
        data: { isBooked: true },
      });

      // Create rental record
      await tx.rental.create({
        data: {
          propertyId: purchase_order_id,
          userId: userId,
        },
      });
    });

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Booking Successful!</h2>
            <p className="text-gray-600 mb-6">Your property has been booked successfully.</p>
            <Link href={"/manage-listings"}>
              <button className="bg-[#FA3A59] text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors">
                View My Listings
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ManageListings:", error);
    return (
      <ManageListingsPage />
    );
  }
}