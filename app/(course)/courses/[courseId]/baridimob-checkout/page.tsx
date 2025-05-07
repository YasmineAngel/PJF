"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

export default function BaridiMobCheckout() {
  const [transactionId, setTransactionId] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const router = useRouter();
  const params = useParams();

  // ✅ Safely extract courseId from URL params
  const courseId = Array.isArray(params?.courseId)
    ? params.courseId[0]
    : params?.courseId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptUrl) return toast.error("Please upload your payment proof.");

    try {
      await axios.post(`/api/courses/${courseId}/baridimob-checkout`, {
        transactionId,
        courseId,
        receiptUrl,
      });

      toast.success("Payment proof uploaded. Await admin validation.");
      router.push("/"); // or to another success page
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">BaridiMob Payment</h2>

      <Input
        type="text"
        placeholder="Transaction ID"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        required
      />

      <FileUpload
        endpoint="baridimobProof"
        onChange={(url) => {
          if (url) setReceiptUrl(url);
        }}
      />

      <Button type="submit" className="w-full bg-sky-700">
        Submit Payment Proof
      </Button>
    </form>
  );
}
