"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  enquirySchema,
  tripTypeOptions,
  vehicleOptions,
  type EnquiryInput,
} from "@/lib/validation";
import { trackEnquirySubmit } from "@/lib/marketing";
import { cn } from "@/lib/utils";

type QuickEnquiryFormProps = {
  defaultDestination?: string;
  defaultVehicle?: (typeof vehicleOptions)[number];
  sourcePage?: string;
  className?: string;
};

export function QuickEnquiryForm({
  defaultDestination = "",
  defaultVehicle = "Not Sure",
  sourcePage = "home-hero",
  className,
}: QuickEnquiryFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      travelDate: "",
      returnDate: "",
      pickupLocation: "",
      destination: defaultDestination,
      passengers: "",
      preferredVehicle: defaultVehicle,
      tripType: "Family Trip",
      message: "",
      consent: undefined,
      website: "",
      sourcePage,
    },
  });

  async function onSubmit(data: EnquiryInput) {
    setSubmitError(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        reference?: string;
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Unable to submit enquiry",
        );
      }

      if (result.reference) {
        setReference(result.reference);
        trackEnquirySubmit({
          reference: result.reference,
          destination: data.destination,
          tripType: data.tripType,
          preferredVehicle: data.preferredVehicle,
          sourcePage: data.sourcePage || sourcePage,
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (reference) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-white p-5 shadow-soft md:p-6",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          Enquiry received
        </p>
        <h3 className="mt-2 text-xl font-bold text-navy">
          Thank you. We have your trip details.
        </h3>
        <p className="mt-2 text-sm text-text-muted">
          Your reference number is{" "}
          <span className="font-semibold text-navy">{reference}</span>. We will
          reply with a vehicle and a price for this trip.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 shadow-soft md:p-6",
        className,
      )}
    >
      <div className="mb-4 border-b border-slate-100 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">
          Plan your trip
        </p>
        <h3 className="text-lg font-bold text-navy">Get a quote</h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2.5 text-sm"
        noValidate
      >
        {submitError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </div>
        ) : null}

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              className="h-9"
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              className="h-9"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.phone.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            className="h-9"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="travelDate">Travel Date *</Label>
            <Input
              id="travelDate"
              type="date"
              className="h-9"
              aria-invalid={!!errors.travelDate}
              {...register("travelDate")}
            />
            {errors.travelDate ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.travelDate.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="returnDate">Return Date (optional)</Label>
            <Input
              id="returnDate"
              type="date"
              className="h-9"
              aria-invalid={!!errors.returnDate}
              {...register("returnDate")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pickupLocation">Pickup Location *</Label>
          <Input
            id="pickupLocation"
            className="h-9"
            placeholder="e.g. Ghaziabad, Noida Sector 18, Delhi"
            aria-invalid={!!errors.pickupLocation}
            {...register("pickupLocation")}
          />
          {errors.pickupLocation ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.pickupLocation.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Input
            id="destination"
            className="h-9"
            placeholder="Where would you like to travel?"
            aria-invalid={!!errors.destination}
            {...register("destination")}
          />
          {errors.destination ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.destination.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="passengers">Passengers *</Label>
            <Input
              id="passengers"
              type="number"
              min={1}
              max={60}
              className="h-9"
              aria-invalid={!!errors.passengers}
              {...register("passengers")}
            />
            {errors.passengers ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.passengers.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="preferredVehicle">Preferred Vehicle *</Label>
            <Select
              id="preferredVehicle"
              className="h-9"
              aria-invalid={!!errors.preferredVehicle}
              {...register("preferredVehicle")}
            >
              {vehicleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors.preferredVehicle ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.preferredVehicle.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="tripType">Trip Type *</Label>
          <Select
            id="tripType"
            className="h-9"
            aria-invalid={!!errors.tripType}
            {...register("tripType")}
          >
            {tripTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          {errors.tripType ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.tripType.message}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            className="min-h-[72px]"
            placeholder="Pickup points, stops, or anything the driver should know"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <label htmlFor="consent" className="text-xs leading-relaxed text-text-muted">
            I agree that Smart Squad Travels may call or WhatsApp me about this trip. *
          </label>
        </div>
        {errors.consent ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.consent.message}
          </p>
        ) : null}

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
          {...register("website")}
        />

        <input type="hidden" {...register("sourcePage")} />

        <Button
          type="submit"
          variant="teal"
          size="md"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Send my trip details"
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          These details are used only to reply about this vehicle request.
        </p>
      </form>
    </div>
  );
}
