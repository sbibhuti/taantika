import React, { useEffect, useState } from "react";
import { IndianRupee, Loader, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "@/api/axiosInstance";
import { timeFormatter } from "@/lib/utils";

// function PaymentSuccessPage() {
//   const navigate = useNavigate();

//   return (
//     <Card className="p-10">
//       <CardHeader className="p-0">
//         <CardTitle className="text-4xl">Payment is successfull!</CardTitle>
//       </CardHeader>
//       <Button className="mt-5" onClick={() => navigate("/shop/account")}>
//         View Orders
//       </Button>
//     </Card>
//   );
// }

// export default PaymentSuccessPage;

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.paymentId;

  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/shop/order/payment/${paymentId}`);

        const { data: paymentData } = data;

        if (data.success) {
          setPayment([
            { title: "Amount Paid", value: paymentData?.amount },
            {
              title: "Order ID",
              value: paymentData?.order_id?.substring(
                paymentData?.order_id?.indexOf("_") + 1,
              ),
            },
            {
              title: "Date & Time",
              value: timeFormatter(paymentData?.created_at),
            },
            {
              title: "Payment Method",
              value: `${paymentData?.card?.network} ending in ${paymentData?.card?.last4}`,
            },
          ]);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch payment info.");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) fetchDetails();
    else setLoading(false);
  }, [paymentId]);

  if (loading)
    return (
      <div className="min-h-[calc(100vh-68px)] w-full bg-background flex flex-col gap-4 justify-center items-center">
        <div className="bg-card flex flex-col gap-4 justify-center items-center p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-border transform transition-all">
          <Loader className="animate-spin animation-duration-[3s] h-16 w-16 text-primary" />
          <p className="text-muted-foreground text-xl">
            Loading order details...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <p className="min-h-[calc(100vh-68px)] bg-background text-destructive flex flex-col justify-center items-center p-4">
        Error: {error}
      </p>
    );

  return (
    <div className="min-h-[calc(100vh-68px)] bg-background flex flex-col justify-center items-center p-4">
      {/* Main Card */}
      <div className="bg-card flex flex-col gap-4 justify-center items-center min-h-100 p-8 rounded-2xl shadow-xl max-w-md w-full border border-border transform transition-all hover:scale-[1.01]">
        {/* Animated Checkmark Wrapper */}
        {Array.isArray(payment) && payment.length > 0 ? (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-6 animate-bounce">
              <svg
                className="h-10 w-10 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://w3.org"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            {/* Title and Confirmation text */}
            <h1 className="text-3xl font-extrabold mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Thank you for your purchase. Your transaction was processed
              successfully.
            </p>

            {/* Transaction Details Box */}
            <div className="bg-muted rounded-xl p-5 mb-8 text-left border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Payment Details
              </h3>
              <div className="space-y-3">
                {payment.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground">{item.title}</span>
                    <span
                      className={`flex items-center gap-1 ${
                        item.title === "Transaction ID"
                          ? "text-xs text-on-accent font-medium bg-accent px-2 py-1 rounded"
                          : "font-semibold text-foreground"
                      }`}
                    >
                      {item.title === "Amount Paid" && (
                        <IndianRupee size={12} />
                      )}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary and Secondary Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                className="mt-5"
                onClick={() => navigate("/shop/account")}
              >
                View Orders
              </Button>

              <Button variant="secondary" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <ShoppingBag className="h-16 w-16 text-primary" />
            <p className="text-muted-foreground text-xl">
              No payment details available.
            </p>
          </div>
        )}
      </div>

      {/* Support Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        Having trouble?{" "}
        <a href="/support" className="text-primary hover:underline font-medium">
          Contact support
        </a>
      </p>
    </div>
  );
}
