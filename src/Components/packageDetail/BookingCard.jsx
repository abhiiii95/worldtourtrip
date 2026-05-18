"use client";

// BookingCard is replaced by LeadForm on the package detail sidebar.
// This file is kept as a re-export for backward compatibility.
import LeadForm from "@/Common/Components/LeadForm/LeadForm";

export default function BookingCard({ packageTitle = "" }) {
  return (
    <LeadForm
      title="Enquire About This Package"
      subtitle="Get a free customised quote — our expert calls you back in 2 hours"
      source="package-detail"
      prefillDest={packageTitle}
      compact
    />
  );
}
