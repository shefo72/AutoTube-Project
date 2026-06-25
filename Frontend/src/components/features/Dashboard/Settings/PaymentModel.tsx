"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  UpdatePaymentMethodFormValues,
  updatePaymentMethodSchema,
} from "@/schemas/billingSchema";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface UpdatePaymentModalProps {
  open: boolean;
  onClose: () => void;
  onUpdatePayment: (payload: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
  }) => Promise<boolean>;
  isUpdating: boolean;
}

export function UpdatePaymentModal({
  open,
  onClose,
  onUpdatePayment,
  isUpdating,
}: UpdatePaymentModalProps) {
  const [paymentSaved, setPaymentSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePaymentMethodFormValues>({
    resolver: zodResolver(updatePaymentMethodSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UpdatePaymentMethodFormValues) => {
    const payload = {
      cardholderName: data.cardholderName,
      cardNumber: data.cardNumber.replace(/\s/g, ""),
      expiryDate: data.expiryDate,
    };

    const result = await onUpdatePayment(payload);
    if (result) {
      setPaymentSaved(true);
      setTimeout(() => {
        handleClose();
      }, 500);
      toast.success("Payment method updated successfully");
    }
  };

  const handleClose = () => {
    if (isUpdating) return;
    onClose();
    setPaymentSaved(false);
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="space-y-1">
          <Controller
            name="cardholderName"
            control={control}
            render={({ field }) => (
              <InputField
                label="Cardholder Name"
                placeholder="Alex Turner"
                value={field.value || ""}
                onChange={field.onChange}
                maxLength={100}
              />
            )}
          />
          {errors.cardholderName && (
            <p className="text-xs text-red-600">
              {errors.cardholderName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <InputField
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={field.value || ""}
                onChange={field.onChange}
                maxLength={16}
              />
            )}
          />
          {errors.cardNumber && (
            <p className="text-xs text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={field.value || ""}
                  onChange={field.onChange}
                  maxLength={5}
                />
              )}
            />
            {errors.expiryDate && (
              <p className="text-xs text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Controller
              name="cvc"
              control={control}
              render={({ field }) => (
                <InputField
                  label="CVC"
                  placeholder="•••"
                  type="password"
                  value={field.value || ""}
                  onChange={field.onChange}
                  maxLength={3}
                />
              )}
            />
            {errors.cvc && (
              <p className="text-xs text-red-600">{errors.cvc.message}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={handleClose}
            className="border-border hover:text-foreground hover:bg-surface-2 h-10 flex-1 cursor-pointer rounded-xl border bg-transparent text-sm font-medium text-(--text-dim) transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
            disabled={isUpdating || paymentSaved}
            iconLeft={
              isUpdating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : paymentSaved ? (
                <Check size={16} />
              ) : undefined
            }
          >
            {isUpdating
              ? "Saving..."
              : paymentSaved
                ? "Saved Successfully!"
                : "Save Card"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
