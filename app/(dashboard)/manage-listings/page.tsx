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
          <>
            <script dangerouslySetInnerHTML={{__html: `
              if (window.opener && !window.opener.closed) {
                window.opener.location.href = window.location.href;
                window.close();
              }
            `}} />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full">
                <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="text-4xl text-red-500">✕</span>
                </div>
                <h2 className="text-3xl font-extrabold text-red-500 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-8 font-medium">Your payment could not be processed. Please try again later.</p>
                <Link href={"/manage-listings"}>
                  <button className="bg-red-500 text-white w-full py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors shadow-md active:scale-95">
                    Retry Payment
                  </button>
                </Link>
              </div>
            </div>
          </div>
          </>
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
      <>
        <script dangerouslySetInnerHTML={{__html: `
          if (window.opener && !window.opener.closed) {
            window.opener.location.href = window.location.href;
            window.close();
          }
        `}} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full">
            <div className="text-center">
            <div className="w-20 h-20 bg-[#789274]/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-4xl text-[#789274]">✓</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#789274] mb-4">Booking Successful!</h2>
            <p className="text-gray-600 mb-8 font-medium">Your property has been booked successfully! The landlord will be in touch shortly.</p>
            <Link href={"/manage-listings"}>
              <button className="bg-[#789274] w-full text-white py-4 rounded-xl text-lg font-semibold hover:bg-[#5a6d56] transition-colors shadow-lg hover:shadow-[#789274]/30 active:scale-95">
                View My Listings
              </button>
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error("Error in ManageListings:", error);
    return (
      <ManageListingsPage />
    );
  }
}